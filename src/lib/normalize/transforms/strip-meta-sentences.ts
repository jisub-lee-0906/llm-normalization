import { isHeadingLike, isListLine } from "@/lib/normalize/transforms/helpers";
import type { TransformResult } from "@/lib/normalize/types";

const META_SENTENCE_PATTERNS = [
  /^아하!?$/i,
  /^제가 .+(?:설명했네요|착각했네요|오해했네요)[.!?]?$/i,
  /^말씀하신 것처럼 .+거군요[.!?]?$/i,
  /^어떻게 쓰는지 .*알려드릴게요[.!?]?$/i,
  /^사실 .+$/i,
];

export function stripMetaSentences(text: string): TransformResult {
  const paragraphs = text.split(/\n{2,}/);
  let removedUiNoise = 0;

  const nextText = paragraphs
    .map((paragraph) => {
      const trimmed = paragraph.trim();

      if (!trimmed || isStructuredParagraph(trimmed)) {
        return trimmed;
      }

      const sentences = splitIntoSentences(trimmed);
      const kept = sentences.filter((sentence) => {
        const shouldDrop = META_SENTENCE_PATTERNS.some((pattern) => pattern.test(sentence.trim()));
        if (shouldDrop) {
          removedUiNoise += 1;
        }
        return !shouldDrop;
      });

      return kept.join(" ").trim();
    })
    .filter(Boolean)
    .join("\n\n");

  return {
    text: nextText,
    stats: {
      removedUiNoise,
    },
  };
}

function splitIntoSentences(paragraph: string) {
  return paragraph
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function isStructuredParagraph(paragraph: string) {
  const lines = paragraph
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return false;
  }

  return lines.some((line) => isListLine(line) || isHeadingLike(line));
}
