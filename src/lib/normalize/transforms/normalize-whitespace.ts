import { countMatches } from "@/lib/normalize/transforms/helpers";
import type { TransformResult } from "@/lib/normalize/types";

export function normalizeWhitespace(text: string): TransformResult {
  const zeroWidthPattern = /[\u200B-\u200D\uFEFF]/g;
  const nbspPattern = /\u00A0/g;
  const tabPattern = /\t/g;
  const trailingSpacePattern = /[ \t]+\n/g;
  const multiBlankPattern = /\n{3,}/g;

  const whitespaceChanges =
    countMatches(text, zeroWidthPattern) +
    countMatches(text, nbspPattern) +
    countMatches(text, tabPattern) +
    countMatches(text, trailingSpacePattern) +
    countMatches(text, multiBlankPattern);

  const normalized = text
    .replace(/\r\n?/g, "\n")
    .replace(nbspPattern, " ")
    .replace(zeroWidthPattern, "")
    .replace(tabPattern, "  ")
    .replace(trailingSpacePattern, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    text: normalized,
    stats: {
      collapsedLines: whitespaceChanges,
    },
  };
}
