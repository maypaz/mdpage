import { describe, expect, it } from "vitest";
import { extractMeta, stripMarkdownInline } from "./markdown";

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
      "A page created with md.page",
    );
  });

  it("strips bold from title", () => {
    expect(extractMeta("# Hello **World**").title).toBe("Hello World");
  });

  it("strips links from title", () => {
    expect(extractMeta("# Check [this](https://x.com) out").title).toBe(
      "Check this out",
    );
  });

  it("strips inline code from title", () => {
    expect(extractMeta("# Using `npm install`").title).toBe(
      "Using npm install",
    );
  });

  it("strips images from title", () => {
    expect(extractMeta("# Logo ![icon](icon.png) App").title).toBe(
      "Logo icon App",
    );
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
      "Check this link",
    );
  });

  it("extracts image alt text and drops URLs", () => {
    expect(stripMarkdownInline("![logo](https://x.com/img.png)")).toBe("logo");
  });

  it("handles combined formatting", () => {
    expect(
      stripMarkdownInline("**Bold** and [link](url) and `code`"),
    ).toBe("Bold and link and code");
  });

  it("returns plain text unchanged", () => {
    expect(stripMarkdownInline("Just plain text")).toBe("Just plain text");
  });
});
