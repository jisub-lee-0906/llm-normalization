import { describe, expect, it } from "vitest";

import { normalizationFixtures, normalizeText } from "@/lib/normalize";

describe("normalizeText fixtures", () => {
  it.each(normalizationFixtures)("$id", ({ expected, input }) => {
    expect(normalizeText(input).output).toBe(expected);
  });
});

describe("normalizeText stats", () => {
  it("tracks removals for citations, links, and line joins", () => {
    const result = normalizeText(`Line one[1]
line two

Sources
https://example.com
https://example.org`);

    expect(result.stats.removedCitations).toBeGreaterThan(0);
    expect(result.stats.removedLinks).toBeGreaterThan(0);
    expect(result.stats.collapsedLines).toBeGreaterThan(0);
  });
});
