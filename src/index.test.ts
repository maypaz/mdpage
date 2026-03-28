import { describe, it, expect, beforeEach } from "vitest";
import { env, exports } from "cloudflare:workers";
import { generateId, extractMeta } from "./index";

declare module "cloudflare:workers" {
  namespace Cloudflare {
    interface Env {
      PAGES: KVNamespace;
    }
  }
  interface ProvidedEnv extends Cloudflare.Env {}
}

async function clearKV() {
  const keys = await env.PAGES.list();
  for (const key of keys.keys) {
    await env.PAGES.delete(key.name);
  }
}

function publish(markdown: string) {
  return exports.default.fetch(
    new Request("https://md.page/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown }),
    })
  );
}

// ---------------------------------------------------------------------------
// Unit tests — pure functions
// ---------------------------------------------------------------------------

describe("generateId", () => {
  it("returns a 6-character string", () => {
    expect(generateId()).toHaveLength(6);
  });

  it("only contains alphanumeric characters", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateId()).toMatch(/^[a-zA-Z0-9]{6}$/);
    }
  });

  it("produces unique values", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("extractMeta", () => {
  it("extracts title from the first heading", () => {
    expect(extractMeta("# Hello World\nBody").title).toBe("Hello World");
  });

  it("falls back to 'md.page' when there is no heading", () => {
    expect(extractMeta("Just plain text").title).toBe("md.page");
  });

  it("uses the first h1 even when multiple headings exist", () => {
    expect(extractMeta("# First\n## Second\n# Third").title).toBe("First");
  });

  it("builds a plain-text description from body text", () => {
    const { description } = extractMeta("# Title\nSome body text here.");
    expect(description).toContain("Some body text here");
  });

  it("strips markdown syntax from description", () => {
    const { description } = extractMeta("**bold** and _italic_ and `code`");
    expect(description).not.toMatch(/[*_`]/);
  });

  it("truncates description to 155 characters", () => {
    const { description } = extractMeta("a".repeat(300));
    expect(description).toHaveLength(155);
  });

  it("returns default description when body is empty after stripping", () => {
    expect(extractMeta("# Title Only").description).toBe(
      "A page created with md.page"
    );
  });
});

// ---------------------------------------------------------------------------
// Integration tests — full Worker request/response cycle
// ---------------------------------------------------------------------------

describe("Worker", () => {
  beforeEach(clearKV);

  // -- CORS ----------------------------------------------------------------

  describe("OPTIONS (CORS preflight)", () => {
    it("returns CORS headers with 200", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/api/publish", { method: "OPTIONS" })
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
      expect(res.headers.get("Access-Control-Allow-Headers")).toContain(
        "Content-Type"
      );
    });
  });

  // -- POST /api/publish ---------------------------------------------------

  describe("POST /api/publish", () => {
    it("returns 201 with url and expires_at", async () => {
      const res = await publish("# Hello\nWorld");
      expect(res.status).toBe(201);

      const data = await res.json<{ url: string; expires_at: string }>();
      expect(data.url).toMatch(/\/[a-zA-Z0-9]{6}$/);
      expect(new Date(data.expires_at).getTime()).toBeGreaterThan(Date.now());
    });

    it("includes CORS headers on success", async () => {
      const res = await publish("# Test");
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });

    it("stores the markdown in KV", async () => {
      const md = "# Stored\nVerify it persists";
      const res = await publish(md);
      const { url } = await res.json<{ url: string }>();
      const id = url.split("/").pop()!;

      expect(await env.PAGES.get(id)).toBe(md);
    });

    it("returns 400 when markdown field is missing", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
      );
      expect(res.status).toBe(400);
      const data = await res.json<{ error: string }>();
      expect(data.error).toContain("markdown");
    });

    it("returns 400 when markdown is not a string", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markdown: 42 }),
        })
      );
      expect(res.status).toBe(400);
    });

    it("returns 400 for invalid JSON body", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{not valid json",
        })
      );
      expect(res.status).toBe(400);
      const data = await res.json<{ error: string }>();
      expect(data.error).toContain("Invalid JSON");
    });

    it("returns 413 when content exceeds 500 KB", async () => {
      const res = await publish("x".repeat(500_001));
      expect(res.status).toBe(413);
    });

    it("returns 429 when rate limit is exceeded", async () => {
      await env.PAGES.put("rate:unknown", "60", { expirationTtl: 3600 });

      const res = await publish("# Should be rejected");
      expect(res.status).toBe(429);
      const data = await res.json<{ error: string }>();
      expect(data.error).toContain("Rate limit");
    });

    it("increments rate counter on each publish", async () => {
      await publish("# First");
      expect(await env.PAGES.get("rate:unknown")).toBe("1");

      await publish("# Second");
      expect(await env.PAGES.get("rate:unknown")).toBe("2");
    });
  });

  // -- GET /:id ------------------------------------------------------------

  describe("GET /:id", () => {
    it("renders stored markdown as HTML", async () => {
      await env.PAGES.put("aB3xZ9", "# Hello\nParagraph text");

      const res = await exports.default.fetch(
        new Request("https://md.page/aB3xZ9")
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/html");

      const html = await res.text();
      expect(html).toContain("<h1>Hello</h1>");
      expect(html).toContain("Paragraph text");
    });

    it("populates meta tags from markdown content", async () => {
      await env.PAGES.put("mEtA01", "# My Title\nDescription text here");

      const res = await exports.default.fetch(
        new Request("https://md.page/mEtA01")
      );
      const html = await res.text();
      expect(html).toContain("<title>My Title</title>");
      expect(html).toContain('content="Description text here"');
    });

    it("sets X-Robots-Tag: noindex", async () => {
      await env.PAGES.put("rObOts", "# Test");
      const res = await exports.default.fetch(
        new Request("https://md.page/rObOts")
      );
      expect(res.headers.get("X-Robots-Tag")).toBe("noindex");
    });

    it("sets Cache-Control: no-store", async () => {
      await env.PAGES.put("noCach", "# Test");
      const res = await exports.default.fetch(
        new Request("https://md.page/noCach")
      );
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    it("returns 404 for a non-existent page", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/nopeXX")
      );
      expect(res.status).toBe(404);
    });

    it("rejects IDs shorter than 6 characters", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/short")
      );
      expect(res.status).toBe(404);
    });

    it("rejects IDs longer than 6 characters", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/waytoolong")
      );
      expect(res.status).toBe(404);
    });

    it("rejects IDs with non-alphanumeric characters", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/ab-c_d")
      );
      expect(res.status).toBe(404);
    });
  });

  // -- Static routes -------------------------------------------------------

  describe("GET /", () => {
    it("returns the landing page", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/")
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/html");

      const html = await res.text();
      expect(html).toContain("md.page");
      expect(html).toContain("copyAgentPrompt");
    });
  });

  describe("GET /favicon.svg", () => {
    it("returns SVG with caching headers", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/favicon.svg")
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("image/svg+xml");
      expect(res.headers.get("Cache-Control")).toContain("max-age=86400");
      expect(await res.text()).toContain("<svg");
    });
  });

  describe("GET /og-image.svg", () => {
    it("returns SVG with caching headers", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/og-image.svg")
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("image/svg+xml");
      expect(res.headers.get("Cache-Control")).toContain("max-age=86400");
      expect(await res.text()).toContain("<svg");
    });
  });

  // -- 404 fallback --------------------------------------------------------

  describe("404 fallback", () => {
    it("returns 404 for unknown paths", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/some/unknown/path")
      );
      expect(res.status).toBe(404);
    });

    it("returns 404 for non-GET methods on page routes", async () => {
      await env.PAGES.put("aB3xZ9", "# Hello");
      const res = await exports.default.fetch(
        new Request("https://md.page/aB3xZ9", { method: "DELETE" })
      );
      expect(res.status).toBe(404);
    });
  });
});
