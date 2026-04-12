import { describe, it, expect, beforeEach } from "vitest";
import { env, exports } from "cloudflare:workers";
import { generateId, extractMeta, escapeHtml, stripMarkdownInline, wrapText, parseMarkdownBlocks, generateOgSvg } from "./index";

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

  it("produces unique values across consecutive calls", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBeGreaterThanOrEqual(95);
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

  it("strips bold from title", () => {
    expect(extractMeta("# Hello **World**").title).toBe("Hello World");
  });

  it("strips links from title", () => {
    expect(extractMeta("# Check [this](https://x.com) out").title).toBe(
      "Check this out"
    );
  });

  it("strips inline code from title", () => {
    expect(extractMeta("# Using `npm install`").title).toBe(
      "Using npm install"
    );
  });

  it("strips images from title", () => {
    expect(extractMeta("# Logo ![icon](icon.png) App").title).toBe(
      "Logo icon App"
    );
  });
});

describe("escapeHtml", () => {
  it("escapes &, <, >, and double quotes", () => {
    expect(escapeHtml('a & b < c > d "e"')).toBe(
      "a &amp; b &lt; c &gt; d &quot;e&quot;"
    );
  });

  it("returns the same string when no special characters are present", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});

describe("stripMarkdownInline", () => {
  it("strips bold markers", () => {
    expect(stripMarkdownInline("Hello **World**")).toBe("Hello World");
    expect(stripMarkdownInline("Hello __World__")).toBe("Hello World");
  });

  it("strips italic markers", () => {
    expect(stripMarkdownInline("Hello *World*")).toBe("Hello World");
    expect(stripMarkdownInline("Hello _World_")).toBe("Hello World");
  });

  it("strips inline code", () => {
    expect(stripMarkdownInline("Use `npm install`")).toBe("Use npm install");
  });

  it("strips strikethrough", () => {
    expect(stripMarkdownInline("~~removed~~ kept")).toBe("removed kept");
  });

  it("extracts link text and drops URLs", () => {
    expect(stripMarkdownInline("Check [this link](https://x.com)")).toBe(
      "Check this link"
    );
  });

  it("extracts image alt text and drops URLs", () => {
    expect(stripMarkdownInline("![logo](https://x.com/img.png)")).toBe("logo");
  });

  it("handles combined formatting", () => {
    expect(
      stripMarkdownInline("**Bold** and [link](url) and `code`")
    ).toBe("Bold and link and code");
  });

  it("returns plain text unchanged", () => {
    expect(stripMarkdownInline("Just plain text")).toBe("Just plain text");
  });
});

describe("wrapText", () => {
  it("wraps long text at word boundaries", () => {
    const lines = wrapText("The quick brown fox jumps over the lazy dog", 20);
    expect(lines[0]).toBe("The quick brown fox");
    expect(lines[1]).toBe("jumps over the lazy");
    expect(lines[2]).toBe("dog");
  });

  it("respects maxLines parameter", () => {
    const lines = wrapText("one two three four five six seven eight", 10, 2);
    expect(lines).toHaveLength(2);
  });

  it("returns empty array for empty string", () => {
    expect(wrapText("", 50)).toEqual([]);
  });

  it("keeps short text on a single line", () => {
    expect(wrapText("hello", 50)).toEqual(["hello"]);
  });

  it("truncates a single long word that exceeds maxCharsPerLine", () => {
    const lines = wrapText("supercalifragilistic", 10);
    expect(lines).toEqual(["superca..."]);
  });

  it("defaults maxLines to 3", () => {
    const lines = wrapText("a b c d e f g h i j k l m n o p", 5);
    expect(lines).toHaveLength(3);
  });
});

describe("parseMarkdownBlocks", () => {
  it("skips h1 headings (used as title)", () => {
    const blocks = parseMarkdownBlocks("# Title\nSome text");
    expect(blocks.every(b => !(b.type === "heading" && b.text === "Title"))).toBe(true);
  });

  it("parses h2-h6 as heading blocks", () => {
    const blocks = parseMarkdownBlocks("## Section\n### Subsection");
    expect(blocks).toEqual([
      { type: "heading", text: "Section" },
      { type: "heading", text: "Subsection" },
    ]);
  });

  it("parses paragraphs", () => {
    const blocks = parseMarkdownBlocks("Hello world.\nStill the same paragraph.");
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("paragraph");
    expect(blocks[0]).toHaveProperty("text", "Hello world. Still the same paragraph.");
  });

  it("parses fenced code blocks", () => {
    const md = "```js\nconst x = 1;\nconsole.log(x);\n```";
    const blocks = parseMarkdownBlocks(md);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("code");
    expect(blocks[0]).toHaveProperty("lines", ["const x = 1;", "console.log(x);"]);
  });

  it("limits code blocks to 4 lines", () => {
    const md = "```\nline1\nline2\nline3\nline4\nline5\nline6\n```";
    const blocks = parseMarkdownBlocks(md);
    expect(blocks[0]).toHaveProperty("lines");
    expect((blocks[0] as { type: "code"; lines: string[] }).lines).toHaveLength(4);
  });

  it("parses unordered lists", () => {
    const md = "- item one\n- item two\n- item three";
    const blocks = parseMarkdownBlocks(md);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("list");
    expect(blocks[0]).toHaveProperty("items", ["item one", "item two", "item three"]);
  });

  it("parses mixed content in order", () => {
    const md = "## Intro\nSome text\n```\ncode\n```\n- a\n- b";
    const blocks = parseMarkdownBlocks(md);
    expect(blocks.map(b => b.type)).toEqual(["heading", "paragraph", "code", "list"]);
  });

  it("returns empty array for empty input", () => {
    expect(parseMarkdownBlocks("")).toEqual([]);
  });

  it("strips inline markdown from headings and paragraphs", () => {
    const blocks = parseMarkdownBlocks("## **Bold** heading\nA [link](url) here.");
    expect(blocks[0]).toHaveProperty("text", "Bold heading");
    expect(blocks[1]).toHaveProperty("text", "A link here.");
  });
});

describe("generateOgSvg", () => {
  it("returns a valid SVG string", () => {
    const svg = generateOgSvg("Test Title", "Some body text");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
  });

  it("includes the title in the SVG", () => {
    const svg = generateOgSvg("My Document", "Body");
    expect(svg).toContain("My Document");
  });

  it("includes the md.page branding", () => {
    const svg = generateOgSvg("Title", "Body");
    expect(svg).toContain("md.page");
  });

  it("escapes HTML entities in title", () => {
    const svg = generateOgSvg('A "tricky" <title>', "Body");
    expect(svg).toContain("&quot;tricky&quot;");
    expect(svg).toContain("&lt;title&gt;");
    expect(svg).not.toContain('<title>');
  });

  it("renders code blocks as dark rectangles", () => {
    const md = "## Heading\n```\nconst x = 1;\n```";
    const svg = generateOgSvg("Title", md);
    expect(svg).toContain('fill="#1e1e1e"');
    expect(svg).toContain("const x = 1;");
  });

  it("renders list items with bullet points", () => {
    const md = "- first\n- second";
    const svg = generateOgSvg("Title", md);
    expect(svg).toContain("\u2022");
    expect(svg).toContain("first");
    expect(svg).toContain("second");
  });

  it("handles plain text (non-markdown) as a paragraph", () => {
    const svg = generateOgSvg("Title", "Just plain text without newlines");
    expect(svg).toContain("Just plain text without newlines");
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

    it("stores rendered HTML in KV", async () => {
      const markdown = "# Stored\nVerify it persists";
      const res = await publish(markdown);
      const { url } = await res.json<{ url: string }>();
      const id = url.split("/").pop()!;

      const stored = JSON.parse((await env.PAGES.get(id))!);
      expect(stored.html).toContain("<h1>Stored</h1>");
      expect(stored.html).toContain("Verify it persists");
      expect(stored.title).toBe("Stored");
      expect(stored.description).toContain("Verify it persists");
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
      const data = await res.json<{ error: string }>();
      expect(data.error).toContain("markdown");
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

    // Rate limiting is now handled by Cloudflare WAF rules
  });

  // -- GET /:id ------------------------------------------------------------

  describe("GET /:id", () => {
    it("renders stored HTML", async () => {
      await env.PAGES.put("aB3xZ9", JSON.stringify({ html: "<h1>Hello</h1>\n<p>Paragraph text</p>\n", title: "Hello", description: "Paragraph text" }));

      const res = await exports.default.fetch(
        new Request("https://md.page/aB3xZ9")
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/html");

      const html = await res.text();
      expect(html).toContain("<h1>Hello</h1>");
      expect(html).toContain("Paragraph text");
    });

    it("populates meta tags from stored metadata", async () => {
      await env.PAGES.put("mEtA01", JSON.stringify({ html: "<p>Description text here</p>\n", title: "My Title", description: "Description text here" }));

      const res = await exports.default.fetch(
        new Request("https://md.page/mEtA01")
      );
      const html = await res.text();
      expect(html).toContain("<title>My Title</title>");
      expect(html).toContain('content="Description text here"');
    });

    it("sets X-Robots-Tag: noindex", async () => {
      await env.PAGES.put("rObOts", JSON.stringify({ html: "<h1>Test</h1>\n", title: "Test", description: "" }));
      const res = await exports.default.fetch(
        new Request("https://md.page/rObOts")
      );
      expect(res.headers.get("X-Robots-Tag")).toBe("noindex");
    });

    it("sets Cache-Control: no-store", async () => {
      await env.PAGES.put("noCach", JSON.stringify({ html: "<h1>Test</h1>\n", title: "Test", description: "" }));
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

    it("escapes HTML tags in markdown body to prevent XSS", async () => {
      const res = await publish('<script>alert("xss")</script>');
      const { url } = await res.json<{ url: string }>();
      const page = await exports.default.fetch(new Request(url));
      const html = await page.text();
      expect(html).not.toContain("<script>");
    });

    it("escapes HTML in meta tags to prevent injection", async () => {
      await env.PAGES.put("xSs0Ok", JSON.stringify({ html: "<p>Body</p>\n", title: 'A "tricky" <title>', description: "Body" }));

      const res = await exports.default.fetch(
        new Request("https://md.page/xSs0Ok")
      );
      const html = await res.text();
      expect(html).toContain(
        "<title>A &quot;tricky&quot; &lt;title&gt;</title>"
      );
      expect(html).toContain(
        'og:title" content="A &quot;tricky&quot; &lt;title&gt;"'
      );
    });

    it("uses dynamic per-page OG image URL", async () => {
      await env.PAGES.put("oPnG01", JSON.stringify({ html: "<p>Test</p>\n", title: "Test", description: "Test" }));
      const res = await exports.default.fetch(
        new Request("https://md.page/oPnG01")
      );
      const html = await res.text();
      expect(html).toContain('og:image" content="https://md.page/og/oPnG01.png"');
      expect(html).not.toContain('og:image" content="https://md.page/og-image.svg"');
      expect(html).toContain('twitter:image" content="https://md.page/og/oPnG01.png"');
    });

    it("sets og:url to the actual page URL, not the homepage", async () => {
      await env.PAGES.put("oGrL01", JSON.stringify({ html: "<p>Test</p>\n", title: "Test", description: "Test" }));
      const res = await exports.default.fetch(
        new Request("https://md.page/oGrL01")
      );
      const html = await res.text();
      expect(html).toContain('og:url" content="https://md.page/oGrL01"');
    });

    it("sets og:type to article for published pages", async () => {
      await env.PAGES.put("tYpE01", JSON.stringify({ html: "<p>Test</p>\n", title: "Test", description: "Test" }));
      const res = await exports.default.fetch(
        new Request("https://md.page/tYpE01")
      );
      const html = await res.text();
      expect(html).toContain('og:type" content="article"');
    });

    it("derives og:image and og:url from request origin for self-hosted instances", async () => {
      await env.PAGES.put("sElF01", JSON.stringify({ html: "<p>Test</p>\n", title: "Test", description: "Test" }));
      const res = await exports.default.fetch(
        new Request("https://docs.mycompany.com/sElF01")
      );
      const html = await res.text();
      expect(html).toContain('og:image" content="https://docs.mycompany.com/og/sElF01.png"');
      expect(html).toContain('og:url" content="https://docs.mycompany.com/sElF01"');
    });
  });

  // -- Dynamic OG images ---------------------------------------------------

  describe("GET /og/:id.png", () => {
    it("returns 404 with fallback PNG for non-existent page", async () => {
      const res = await exports.default.fetch(
        new Request("https://md.page/og/nopeXX.png")
      );
      expect(res.status).toBe(404);
      expect(res.headers.get("Content-Type")).toBe("image/png");
      const body = await res.arrayBuffer();
      expect(body.byteLength).toBeGreaterThan(0);
    });

    it("returns PNG for existing page (falls back to static in test env where WASM is unavailable)", async () => {
      await env.PAGES.put("oGiMg1", JSON.stringify({
        html: "<h1>Hello</h1>\n",
        title: "Hello",
        description: "A test page",
        markdownPreview: "# Hello\nA test page",
      }));
      const res = await exports.default.fetch(
        new Request("https://md.page/og/oGiMg1.png")
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("image/png");
      const body = await res.arrayBuffer();
      expect(body.byteLength).toBeGreaterThan(0);
    });

    it("ignores non-GET methods", async () => {
      await env.PAGES.put("oGiMg2", JSON.stringify({ html: "<p>Test</p>", title: "Test", description: "Test" }));
      const res = await exports.default.fetch(
        new Request("https://md.page/og/oGiMg2.png", { method: "POST" })
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

  // -- Syntax highlighting -------------------------------------------------

  describe("Syntax highlighting", () => {
    it("applies hljs markup when publishing code with a language hint", async () => {
      const markdown = "# Code\n\n```js\nconst x = 42;\nconsole.log(x);\n```";
      const res = await publish(markdown);
      const { url } = await res.json<{ url: string }>();
      const id = url.split("/").pop()!;

      const stored = JSON.parse((await env.PAGES.get(id))!);
      expect(stored.html).toContain('class="hljs"');
      expect(stored.html).toContain("hljs-");
    });

    it("applies hljs auto-detection when no language hint is provided", async () => {
      const markdown = "# Code\n\n```\nfunction hello() { return 1; }\n```";
      const res = await publish(markdown);
      const { url } = await res.json<{ url: string }>();
      const id = url.split("/").pop()!;

      const stored = JSON.parse((await env.PAGES.get(id))!);
      expect(stored.html).toContain('class="hljs"');
    });

    it("highlights TypeScript code blocks", async () => {
      const markdown = "```typescript\ninterface User { name: string; }\n```";
      const res = await publish(markdown);
      const { url } = await res.json<{ url: string }>();
      const id = url.split("/").pop()!;

      const stored = JSON.parse((await env.PAGES.get(id))!);
      expect(stored.html).toContain('class="hljs"');
      expect(stored.html).toContain("hljs-");
    });

    it("highlights Python code blocks", async () => {
      const markdown = "```python\ndef greet(name):\n    print(f\"Hello {name}\")\n```";
      const res = await publish(markdown);
      const { url } = await res.json<{ url: string }>();
      const id = url.split("/").pop()!;

      const stored = JSON.parse((await env.PAGES.get(id))!);
      expect(stored.html).toContain('class="hljs"');
      expect(stored.html).toContain("hljs-keyword");
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
