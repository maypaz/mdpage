import { describe, expect, it } from "vitest";
import { generateOgSvg, parseMarkdownBlocks, wrapText } from "./og";

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
    expect(wrapText("supercalifragilistic", 10)).toEqual(["superca..."]);
  });

  it("defaults maxLines to 3", () => {
    expect(wrapText("a b c d e f g h i j k l m n o p", 5)).toHaveLength(3);
  });
});

describe("parseMarkdownBlocks", () => {
  it("skips h1 headings (used as title)", () => {
    const blocks = parseMarkdownBlocks("# Title\nSome text");
    expect(blocks.every((block) => !(block.type === "heading" && block.text === "Title"))).toBe(true);
  });

  it("parses h2-h6 as heading blocks", () => {
    expect(parseMarkdownBlocks("## Section\n### Subsection")).toEqual([
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
    const blocks = parseMarkdownBlocks("```js\nconst x = 1;\nconsole.log(x);\n```");
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("code");
    expect(blocks[0]).toHaveProperty("lines", ["const x = 1;", "console.log(x);"]);
  });

  it("limits code blocks to 4 lines", () => {
    const blocks = parseMarkdownBlocks("```\nline1\nline2\nline3\nline4\nline5\nline6\n```");
    expect((blocks[0] as { type: "code"; lines: string[] }).lines).toHaveLength(4);
  });

  it("parses unordered lists", () => {
    const blocks = parseMarkdownBlocks("- item one\n- item two\n- item three");
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("list");
    expect(blocks[0]).toHaveProperty("items", ["item one", "item two", "item three"]);
  });

  it("parses mixed content in order", () => {
    const blocks = parseMarkdownBlocks("## Intro\nSome text\n```\ncode\n```\n- a\n- b");
    expect(blocks.map((block) => block.type)).toEqual(["heading", "paragraph", "code", "list"]);
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
    expect(generateOgSvg("My Document", "Body")).toContain("My Document");
  });

  it("includes the md.page branding", () => {
    expect(generateOgSvg("Title", "Body")).toContain("md.page");
  });

  it("escapes HTML entities in title", () => {
    const svg = generateOgSvg('A "tricky" <title>', "Body");
    expect(svg).toContain("&quot;tricky&quot;");
    expect(svg).toContain("&lt;title&gt;");
    expect(svg).not.toContain("<title>");
  });

  it("renders code blocks as dark rectangles", () => {
    const svg = generateOgSvg("Title", "## Heading\n```\nconst x = 1;\n```");
    expect(svg).toContain('fill="#1e1e1e"');
    expect(svg).toContain("const x = 1;");
  });

  it("renders list items with bullet points", () => {
    const svg = generateOgSvg("Title", "- first\n- second");
    expect(svg).toContain("•");
    expect(svg).toContain("first");
    expect(svg).toContain("second");
  });

  it("handles plain text (non-markdown) as a paragraph", () => {
    expect(generateOgSvg("Title", "Just plain text without newlines")).toContain(
      "Just plain text without newlines",
    );
  });
});
