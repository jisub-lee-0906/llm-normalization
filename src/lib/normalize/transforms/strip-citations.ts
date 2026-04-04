import { countMatches } from "@/lib/normalize/transforms/helpers";
import type { TransformResult } from "@/lib/normalize/types";

const citationPatterns = [
  /\[cite_start\]/g,
  /\[cite_end\]/g,
  /\[cite:\s*[\d,\s]+\]/g,
  /\[\^\d+\]/g,
  /(?<=\S)\s*\[(?:\d{1,3}|source|sources)\](?=[\s,.;:!?)]|$)/gi,
];

export function stripCitations(text: string): TransformResult {
  let nextText = text;
  let removedCitations = 0;

  for (const pattern of citationPatterns) {
    removedCitations += countMatches(nextText, pattern);
    nextText = nextText.replace(pattern, "");
  }

  nextText = nextText
    .replace(/\(\s*Source:\s*https?:\/\/[^\s)]+\s*\)/gi, "")
    .replace(/[ ]{2,}/g, " ");

  return {
    text: nextText,
    stats: {
      removedCitations,
    },
  };
}
