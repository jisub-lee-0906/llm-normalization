import type { TransformResult } from "@/lib/normalize/types";

const EMOJI_PATTERN = /(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F|\p{Regional_Indicator})/gu;
const EMOJI_FORMATTING_PATTERN = /[\u200D\uFE0F]/g;

export function stripEmojis(text: string): TransformResult {
  const emojiMatches = text.match(EMOJI_PATTERN) ?? [];
  const formattingMatches = text.match(EMOJI_FORMATTING_PATTERN) ?? [];

  if (emojiMatches.length === 0 && formattingMatches.length === 0) {
    return { text };
  }

  const nextText = text
    .replace(EMOJI_PATTERN, "")
    .replace(EMOJI_FORMATTING_PATTERN, "")
    .replace(/([^\s]) {2,}([^\s])/g, "$1 $2");

  return {
    text: nextText,
    stats: {
      removedUiNoise: emojiMatches.length + formattingMatches.length,
    },
  };
}
