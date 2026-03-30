import { describe, expect, it } from "vitest";
import { escapeHtml } from "./html";

describe("escapeHtml", () => {
  it("escapes &, <, >, and double quotes", () => {
    expect(escapeHtml('a & b < c > d "e"')).toBe(
      "a &amp; b &lt; c &gt; d &quot;e&quot;",
    );
  });

  it("returns the same string when no special characters are present", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});
