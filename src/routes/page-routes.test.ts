import { beforeEach, describe, expect, it } from "vitest";
import { clearKV, env, exports, publish } from "../test/worker-test-utils";

describe("page routes", () => {
  beforeEach(clearKV);

  describe("GET /:id", () => {
    it("renders stored HTML", async () => {
      await env.PAGES.put("aB3xZ9", JSON.stringify({
        html: "<h1>Hello</h1>\n<p>Paragraph text</p>\n",
        title: "Hello",
        description: "Paragraph text",
      }));

      const response = await exports.default.fetch(new Request("https://md.page/aB3xZ9"));
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("text/html");

      const html = await response.text();
      expect(html).toContain("<h1>Hello</h1>");
      expect(html).toContain("Paragraph text");
    });

    it("populates meta tags from stored metadata", async () => {
      await env.PAGES.put("mEtA01", JSON.stringify({
        html: "<p>Description text here</p>\n",
        title: "My Title",
        description: "Description text here",
      }));

      const response = await exports.default.fetch(new Request("https://md.page/mEtA01"));
      const html = await response.text();
      expect(html).toContain("<title>My Title</title>");
      expect(html).toContain('content="Description text here"');
    });

    it("sets X-Robots-Tag: noindex", async () => {
      await env.PAGES.put("rObOts", JSON.stringify({ html: "<h1>Test</h1>\n", title: "Test", description: "" }));
      const response = await exports.default.fetch(new Request("https://md.page/rObOts"));
      expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    });

    it("sets Cache-Control: no-store", async () => {
      await env.PAGES.put("noCach", JSON.stringify({ html: "<h1>Test</h1>\n", title: "Test", description: "" }));
      const response = await exports.default.fetch(new Request("https://md.page/noCach"));
      expect(response.headers.get("Cache-Control")).toBe("no-store");
    });

    it("returns 404 for a non-existent page", async () => {
      const response = await exports.default.fetch(new Request("https://md.page/nopeXX"));
      expect(response.status).toBe(404);
    });

    it("rejects IDs shorter than 6 characters", async () => {
      const response = await exports.default.fetch(new Request("https://md.page/short"));
      expect(response.status).toBe(404);
    });

    it("rejects IDs longer than 6 characters", async () => {
      const response = await exports.default.fetch(new Request("https://md.page/waytoolong"));
      expect(response.status).toBe(404);
    });

    it("rejects IDs with non-alphanumeric characters", async () => {
      const response = await exports.default.fetch(new Request("https://md.page/ab-c_d"));
      expect(response.status).toBe(404);
    });

    it("escapes HTML tags in markdown body to prevent XSS", async () => {
      const response = await publish('<script>alert("xss")</script>');
      const { url } = await response.json<{ url: string }>();
      const pageResponse = await exports.default.fetch(new Request(url));
      const html = await pageResponse.text();
      expect(html).not.toContain("<script>");
    });

    it("escapes HTML in meta tags to prevent injection", async () => {
      await env.PAGES.put("xSs0Ok", JSON.stringify({
        html: "<p>Body</p>\n",
        title: 'A "tricky" <title>',
        description: "Body",
      }));

      const response = await exports.default.fetch(new Request("https://md.page/xSs0Ok"));
      const html = await response.text();
      expect(html).toContain("<title>A &quot;tricky&quot; &lt;title&gt;</title>");
      expect(html).toContain('og:title" content="A &quot;tricky&quot; &lt;title&gt;"');
    });

    it("uses dynamic per-page OG image URL", async () => {
      await env.PAGES.put("oPnG01", JSON.stringify({ html: "<p>Test</p>\n", title: "Test", description: "Test" }));
      const response = await exports.default.fetch(new Request("https://md.page/oPnG01"));
      const html = await response.text();
      expect(html).toContain('og:image" content="https://md.page/og/oPnG01.png"');
      expect(html).not.toContain('og:image" content="https://md.page/og-image.svg"');
      expect(html).toContain('twitter:image" content="https://md.page/og/oPnG01.png"');
    });

    it("sets og:url to the actual page URL, not the homepage", async () => {
      await env.PAGES.put("oGrL01", JSON.stringify({ html: "<p>Test</p>\n", title: "Test", description: "Test" }));
      const response = await exports.default.fetch(new Request("https://md.page/oGrL01"));
      const html = await response.text();
      expect(html).toContain('og:url" content="https://md.page/oGrL01"');
    });

    it("sets og:type to article for published pages", async () => {
      await env.PAGES.put("tYpE01", JSON.stringify({ html: "<p>Test</p>\n", title: "Test", description: "Test" }));
      const response = await exports.default.fetch(new Request("https://md.page/tYpE01"));
      const html = await response.text();
      expect(html).toContain('og:type" content="article"');
    });

    it("derives og:image and og:url from request origin for self-hosted instances", async () => {
      await env.PAGES.put("sElF01", JSON.stringify({ html: "<p>Test</p>\n", title: "Test", description: "Test" }));
      const response = await exports.default.fetch(new Request("https://docs.mycompany.com/sElF01"));
      const html = await response.text();
      expect(html).toContain('og:image" content="https://docs.mycompany.com/og/sElF01.png"');
      expect(html).toContain('og:url" content="https://docs.mycompany.com/sElF01"');
    });
  });

  describe("GET /og/:id.png", () => {
    it("returns 404 with fallback PNG for non-existent page", async () => {
      const response = await exports.default.fetch(new Request("https://md.page/og/nopeXX.png"));
      expect(response.status).toBe(404);
      expect(response.headers.get("Content-Type")).toBe("image/png");
      expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(0);
    });

    it("returns PNG for existing page (falls back to static in test env where WASM is unavailable)", async () => {
      await env.PAGES.put("oGiMg1", JSON.stringify({
        html: "<h1>Hello</h1>\n",
        title: "Hello",
        description: "A test page",
        markdownPreview: "# Hello\nA test page",
      }));

      const response = await exports.default.fetch(new Request("https://md.page/og/oGiMg1.png"));
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("image/png");
      expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(0);
    });

    it("ignores non-GET methods", async () => {
      await env.PAGES.put("oGiMg2", JSON.stringify({ html: "<p>Test</p>", title: "Test", description: "Test" }));
      const response = await exports.default.fetch(
        new Request("https://md.page/og/oGiMg2.png", { method: "POST" }),
      );
      expect(response.status).toBe(404);
    });
  });
});
