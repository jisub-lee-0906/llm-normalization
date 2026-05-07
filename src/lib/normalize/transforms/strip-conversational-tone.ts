import type { TransformResult } from "@/lib/normalize/types";

const SENTENCE_PREFIX_PATTERNS = [
  /(^|\n\n)(네,\s*완전히 있습니다!?[\s\n]*)/g,
  /(^|\n\n)(네,\s*그렇습니다!?[\s\n]*)/g,
  /(^|\n\n)(맞습니다!?[\s\n]*)/g,
];

const DISCOURSE_MARKERS = [
  /(^|[.!?]\s+)(사실\s+)/g,
  /(^|[.!?]\s+)(결론적으로,\s*)/g,
  /(^|[.!?]\s+)(단,\s*)/g,
];

const TRAILING_MEDIA_PARAGRAPH_PATTERN =
  /(?:영상|video|youtube|유튜브).+(?:도움이 될 것입니다|도움이 됩니다|참고하시면 됩니다|상세히 다루고 있습니다).*https?:\/\/\S+/i;

export function stripConversationalTone(text: string): TransformResult {
  let nextText = text;
  let removedUiNoise = 0;

  for (const pattern of SENTENCE_PREFIX_PATTERNS) {
    const matches = nextText.match(pattern);
    removedUiNoise += matches?.length ?? 0;
    nextText = nextText.replace(pattern, "$1");
  }

  for (const pattern of DISCOURSE_MARKERS) {
    const matches = nextText.match(pattern);
    removedUiNoise += matches?.length ?? 0;
    nextText = nextText.replace(pattern, "$1");
  }

  const paragraphs = nextText.split(/\n{2,}/);
  const filteredParagraphs = paragraphs.filter((paragraph) => {
    const trimmed = paragraph.trim();

    if (!trimmed) {
      return false;
    }

    const isMediaTail = TRAILING_MEDIA_PARAGRAPH_PATTERN.test(trimmed);
    if (isMediaTail) {
      removedUiNoise += 1;
    }

    return !isMediaTail;
  });

  nextText = filteredParagraphs.join("\n\n");

  return {
    text: nextText,
    stats: {
      removedUiNoise,
    },
  };
}
