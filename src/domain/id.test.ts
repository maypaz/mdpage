import { describe, expect, it } from "vitest";
import { generateId } from "./id";

describe("generateId", () => {
  it("returns a 6-character string", () => {
    expect(generateId()).toHaveLength(6);
  });

  it("only contains alphanumeric characters", () => {
    for (let index = 0; index < 50; index += 1) {
      expect(generateId()).toMatch(/^[a-zA-Z0-9]{6}$/);
    }
  });

  it("produces unique values across consecutive calls", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBeGreaterThanOrEqual(95);
  });
});
