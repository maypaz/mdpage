import { beforeEach, describe, expect, it } from "vitest";
import { clearKV, env, exports, publish } from "../test/worker-test-utils";

describe("API routes", () => {
  beforeEach(clearKV);

  describe("OPTIONS", () => {
    it("returns CORS headers with 200", async () => {
      const response = await exports.default.fetch(
        new Request("https://md.page/api/publish", { method: "OPTIONS" }),
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
      expect(response.headers.get("Access-Control-Allow-Headers")).toContain("Content-Type");
    });
  });

  describe("POST /api/publish", () => {
    it("returns 201 with url and expires_at", async () => {
      const response = await publish("# Hello\nWorld");
      expect(response.status).toBe(201);

      const data = await response.json<{ url: string; expires_at: string }>();
      expect(data.url).toMatch(/\/[a-zA-Z0-9]{6}$/);
      expect(new Date(data.expires_at).getTime()).toBeGreaterThan(Date.now());
    });

    it("includes CORS headers on success", async () => {
      const response = await publish("# Test");
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });

    it("stores rendered HTML in KV", async () => {
      const response = await publish("# Stored\nVerify it persists");
      const { url } = await response.json<{ url: string }>();
      const id = url.split("/").pop()!;

      const stored = JSON.parse((await env.PAGES.get(id))!);
      expect(stored.html).toContain("<h1>Stored</h1>");
      expect(stored.html).toContain("Verify it persists");
      expect(stored.title).toBe("Stored");
      expect(stored.description).toContain("Verify it persists");
    });

    it("returns 400 when markdown field is missing", async () => {
      const response = await exports.default.fetch(
        new Request("https://md.page/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }),
      );
      expect(response.status).toBe(400);
      const data = await response.json<{ error: string }>();
      expect(data.error).toContain("markdown");
    });

    it("returns 400 when markdown is not a string", async () => {
      const response = await exports.default.fetch(
        new Request("https://md.page/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markdown: 42 }),
        }),
      );
      expect(response.status).toBe(400);
      const data = await response.json<{ error: string }>();
      expect(data.error).toContain("markdown");
    });

    it("returns 400 for invalid JSON body", async () => {
      const response = await exports.default.fetch(
        new Request("https://md.page/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{not valid json",
        }),
      );
      expect(response.status).toBe(400);
      const data = await response.json<{ error: string }>();
      expect(data.error).toContain("Invalid JSON");
    });

    it("returns 413 when content exceeds 500 KB", async () => {
      const response = await publish("x".repeat(500_001));
      expect(response.status).toBe(413);
    });

    it("ignores any pre-existing app-side rate counter keys", async () => {
      await env.PAGES.put("rate:unknown", "60", { expirationTtl: 3600 });

      const response = await publish("# Should still publish");
      expect(response.status).toBe(201);
    });
  });
});
