import { detectSource } from "@/lib/normalize/detect-source";
import { normalizationFixtures } from "@/lib/normalize/fixtures";
import { extractMainContent } from "@/lib/normalize/transforms/extract-main-content";
import { joinWrappedParagraphs } from "@/lib/normalize/transforms/join-wrapped-paragraphs";
import { languageAwareSpacing } from "@/lib/normalize/transforms/language-aware-spacing";
import { normalizeCodeBlocks } from "@/lib/normalize/transforms/normalize-code-blocks";
import { normalizeLists } from "@/lib/normalize/transforms/normalize-lists";
import { normalizeWhitespace } from "@/lib/normalize/transforms/normalize-whitespace";
import { pruneTrailingLinks } from "@/lib/normalize/transforms/prune-trailing-links";
import { stripAiFiller } from "@/lib/normalize/transforms/strip-ai-filler";
import { stripConversationalTone } from "@/lib/normalize/transforms/strip-conversational-tone";
import { removeUiNoise } from "@/lib/normalize/transforms/remove-ui-noise";
import { stripCitations } from "@/lib/normalize/transforms/strip-citations";
import { stripEmojis } from "@/lib/normalize/transforms/strip-emojis";
import { stripInternalMarkers } from "@/lib/normalize/transforms/strip-internal-markers";
import { stripMarkdownArtifacts } from "@/lib/normalize/transforms/strip-markdown-artifacts";
import { stripMetaSentences } from "@/lib/normalize/transforms/strip-meta-sentences";
import { vendorCleanup } from "@/lib/normalize/transforms/vendor-cleanup";
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
  detectedSource: "generic",
};

const pipeline = [
  normalizeWhitespace,
  stripCitations,
  removeUiNoise,
  stripAiFiller,
  stripConversationalTone,
  stripEmojis,
  pruneTrailingLinks,
  normalizeCodeBlocks,
  stripMarkdownArtifacts,
  joinWrappedParagraphs,
  stripMetaSentences,
  normalizeLists,
  extractMainContent,
  languageAwareSpacing,
  stripInternalMarkers,
  normalizeWhitespace,
];

export function normalizeText(input: string): NormalizeResult {
  if (!input.trim()) {
    return EMPTY_NORMALIZE_RESULT;
  }

  try {
    let text = input;
    const detectedSource = detectSource(input);
    const stats = { ...EMPTY_NORMALIZE_RESULT.stats };
    const warnings = new Set<NormalizeResult["warnings"][number]>();

    const vendorResult = vendorCleanup(text, { source: detectedSource });
    text = vendorResult.text;
    mergeTransformResult(stats, warnings, vendorResult);

    for (const transform of pipeline) {
      const result = transform(text);
      text = result.text;
      mergeTransformResult(stats, warnings, result);
    }

    return {
      output: text.trim(),
      stats,
      warnings: Array.from(warnings),
      detectedSource,
    };
  } catch {
    return {
      output: input.trim(),
      stats: { ...EMPTY_NORMALIZE_RESULT.stats },
      warnings: ["fallback_to_input"],
      detectedSource: "generic",
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
