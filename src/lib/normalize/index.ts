import { normalizationFixtures } from "@/lib/normalize/fixtures";
import { joinWrappedParagraphs } from "@/lib/normalize/transforms/join-wrapped-paragraphs";
import { normalizeLists } from "@/lib/normalize/transforms/normalize-lists";
import { normalizeWhitespace } from "@/lib/normalize/transforms/normalize-whitespace";
import { pruneTrailingLinks } from "@/lib/normalize/transforms/prune-trailing-links";
import { removeUiNoise } from "@/lib/normalize/transforms/remove-ui-noise";
import { stripCitations } from "@/lib/normalize/transforms/strip-citations";
import { stripMarkdownArtifacts } from "@/lib/normalize/transforms/strip-markdown-artifacts";
import type { NormalizeResult, NormalizeStats, TransformResult } from "@/lib/normalize/types";

export { normalizationFixtures };
export type { NormalizeResult, NormalizeStats } from "@/lib/normalize/types";

export const EMPTY_NORMALIZE_RESULT: NormalizeResult = {
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
};

const pipeline = [
  normalizeWhitespace,
  stripCitations,
  removeUiNoise,
  pruneTrailingLinks,
  stripMarkdownArtifacts,
  joinWrappedParagraphs,
  normalizeLists,
  normalizeWhitespace,
];

export function normalizeText(input: string): NormalizeResult {
  if (!input.trim()) {
    return EMPTY_NORMALIZE_RESULT;
  }

  try {
    let text = input;
    const stats = { ...EMPTY_NORMALIZE_RESULT.stats };
    const warnings = new Set<NormalizeResult["warnings"][number]>();

    for (const transform of pipeline) {
      const result = transform(text);
      text = result.text;
      mergeTransformResult(stats, warnings, result);
    }

    return {
      output: text.trim(),
      stats,
      warnings: Array.from(warnings),
    };
  } catch {
    return {
      output: input.trim(),
      stats: { ...EMPTY_NORMALIZE_RESULT.stats },
      warnings: ["fallback_to_input"],
    };
  }
}

function mergeTransformResult(
  stats: NormalizeStats,
  warnings: Set<NormalizeResult["warnings"][number]>,
  result: TransformResult,
) {
  if (result.stats) {
    for (const [key, value] of Object.entries(result.stats) as [
      keyof NormalizeStats,
      number,
    ][]) {
      stats[key] += value;
    }
  }

  result.warnings?.forEach((warning) => warnings.add(warning));
}
