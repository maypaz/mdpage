import { beforeEach, describe, expect, it } from "vitest";
import { clearKV, env, exports } from "../test/worker-test-utils";

describe("static and fallback routes", () => {
  beforeEach(clearKV);

  describe("GET /", () => {
    it("returns the landing page", async () => {
      const response = await exports.default.fetch(new Request("https://md.page/"));
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("text/html");

      const html = await response.text();
      expect(html).toContain("md.page");
      expect(html).toContain("copyAgentPrompt");
    });
  });

  describe("GET /favicon.svg", () => {
    it("returns SVG with caching headers", async () => {
      const response = await exports.default.fetch(new Request("https://md.page/favicon.svg"));
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
      expect(response.headers.get("Cache-Control")).toContain("max-age=86400");
      expect(await response.text()).toContain("<svg");
    });
  });

  describe("404 fallback", () => {
    it("returns 404 for unknown paths", async () => {
      const response = await exports.default.fetch(new Request("https://md.page/some/unknown/path"));
      expect(response.status).toBe(404);
    });

    it("returns 404 for non-GET methods on page routes", async () => {
      await env.PAGES.put("aB3xZ9", "# Hello");
      const response = await exports.default.fetch(
        new Request("https://md.page/aB3xZ9", { method: "DELETE" }),
      );
      expect(response.status).toBe(404);
    });
  });
});
