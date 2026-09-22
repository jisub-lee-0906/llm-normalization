import { describe, expect, it } from "vitest";

import { normalizationFixtures, normalizeText } from "@/lib/normalize";

describe("normalizeText fixtures", () => {
  it.each(normalizationFixtures)("$id", ({ expected, input }) => {
    expect(normalizeText(input).output).toBe(expected);
  });
});

describe("normalizeText empty input", () => {
  it("returns an isolated result for each call", () => {
    const first = normalizeText("   ");
    first.stats.removedLinks = 1;
    first.warnings.push("possible_table_loss");

    expect(normalizeText("\n\t")).toEqual(EMPTY_RESULT);
  });
});

const EMPTY_RESULT = {
  output: "",
  stats: {
    removedCitations: 0,
    removedMarkdown: 0,
    removedUiNoise: 0,
    removedLinks: 0,
    collapsedLines: 0,
    normalizedLists: 0,
  },
  warnings: [],
  detectedSource: "generic",
};
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

describe("normalizeText source detection", () => {
  it("detects gemini markers", () => {
    expect(normalizeText("[cite_start] Gemini text [cite_end]").detectedSource).toBe("gemini");
  });

  it("detects perplexity style brackets", () => {
    expect(normalizeText("Perplexity answer [1][2]").detectedSource).toBe("perplexity");
  });
});
