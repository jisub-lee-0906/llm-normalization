import type { TransformResult } from "@/lib/normalize/types";

const LEADING_LINE_PATTERNS = [
  /^(물론입니다|좋습니다|좋아요|알겠습니다|네|가능합니다)[.!?]?\s*$/i,
  /^(정리하면\s*)?(다음과 같습니다|아래와 같습니다|아래처럼 정리하면 됩니다|핵심만 정리하면 됩니다)[:.]?\s*$/i,
  /^(아래는|다음은)\s+.+(버전|내용|본문|결과)입니다[.:]?\s*$/i,
  /^.+(정리|요약|정돈)(한|해둔)?\s+(버전|내용|본문|결과)입니다[.:]?\s*$/i,
  /^(sure|of course|certainly|absolutely)[.!?]?\s*$/i,
  /^(here(?:'s| is) (?:a )?(?:clean|cleaned(?:-up)?|refined|plain(?:-|\s)?text) version)[:.]?\s*$/i,
  /^(below|here)(?: is|'s)? .+(version|result|answer|summary)[.:]?\s*$/i,
];

const TRAILING_LINE_PATTERNS = [
  /^원하시면 .+$/i,
  /^필요하시면 .+$/i,
  /^더 필요하시면 .+$/i,
  /^도움이 (?:되셨길|되었길) 바랍니다[.!?]?$/i,
  /^바로 복사해서 .+$/i,
  /^이대로 (?:붙여넣거나|사용하시면) .+$/i,
  /^이대로 복사해서 .+$/i,
  /^필요하면 .+$/i,
  /^let me know if you'd like .+$/i,
  /^if you(?:'d| would) like,? .+$/i,
  /^(?:i )?hope this helps[.!?]?$/i,
  /^you can now .+$/i,
  /^feel free to .+$/i,
];

const LEADING_PREFIX_PATTERNS = [
  /^(?:물론입니다|좋습니다|좋아요|알겠습니다|네|가능합니다)[.!?]\s+/i,
  /^(?:sure|of course|certainly|absolutely)[.!?]\s+/i,
  /^(?:핵심만\s*)?(?:정리하면\s*)?(?:다음과 같습니다|아래와 같습니다)[:.]?\s+/i,
  /^(?:아래는|다음은)\s+.+(?:버전|내용|본문|결과)입니다[.:]?\s+/i,
  /^.+(?:정리|요약|정돈)(?:한|해둔)?\s+(?:버전|내용|본문|결과)입니다[.:]?\s+/i,
  /^(?:here(?:'s| is) (?:a )?(?:clean|cleaned(?:-up)?|refined|plain(?:-|\s)?text) version)[:.]?\s+/i,
  /^(?:here(?:'s| is) the refined version ready for your document)[:.]?\s+/i,
  /^(?:below|here)(?: is|'s)? (?:the )?(?:clean|cleaned(?:-up)?|refined|plain(?:-|\s)?text)?\s*(?:version|result|answer|summary)[.:]?\s+/i,
];

const LEADING_PARAGRAPH_PATTERNS = [
  /(?:핵심만|본문만|불필요한 표현을 제거하고|복사해서 쓰기 좋게|붙여넣기 좋게).+(정리|요약).+(했습니다|해두었습니다|했습니다\.)$/i,
  /^(?:아래는|다음은).+(정리|요약).+(버전|내용|본문|결과)입니다[.!?]?$/i,
  /^(?:here(?:'s| is)|below is).+(clean|cleaned|refined|plain(?:-|\s)?text|main answer|summary).*[.!?]?$/i,
];

const TRAILING_PARAGRAPH_PATTERNS = [
  /^(?:원하시면|필요하시면|더 필요하시면|필요하면).+$/i,
  /^(?:바로 복사해서|이대로 붙여넣어서).+$/i,
  /^(?:이대로 복사해서).+$/i,
  /^이제 바로 문서에 붙여넣어 사용하실 수 있습니다[.!?]?$/i,
  /^(?:let me know|if you(?:'d| would) like|you can now|feel free to).+$/i,
  /^(?:hope this helps|this should now be ready).*[.!?]?$/i,
  /^this is now ready to paste into your document[.!?]?$/i,
];

const META_KEYWORDS = [
  "정리",
  "요약",
  "버전",
  "본문",
  "결과",
  "복사",
  "붙여넣",
  "문서",
  "plain text",
  "cleaned",
  "clean",
  "refined",
  "summary",
  "version",
  "result",
  "copy",
  "paste",
  "document",
];

const LEADING_META_HINTS = [
  "아래는",
  "다음은",
  "정리하면",
  "핵심만",
  "본문만",
  "요청하신",
  "here is",
  "here's",
  "below is",
];

const TRAILING_META_HINTS = [
  "원하시면",
  "필요하시면",
  "더 필요하시면",
  "필요하면",
  "바로 복사",
  "이대로 복사",
  "이대로 붙여넣",
  "you can now",
  "ready to paste",
  "ready for your document",
  "let me know",
  "feel free to",
  "if you'd like",
  "if you would like",
  "hope this helps",
  "문서에 붙여넣어 사용",
];

export function stripAiFiller(text: string): TransformResult {
  let nextText = text;
  let removedUiNoise = 0;

  const lines = nextText.split("\n");

  while (lines.length > 0 && isEmpty(lines[0])) {
    lines.shift();
  }

  while (lines.length > 0 && matchesAny(lines[0], LEADING_LINE_PATTERNS)) {
    lines.shift();
    removedUiNoise += 1;

    while (lines.length > 0 && isEmpty(lines[0])) {
      lines.shift();
    }
  }

  while (lines.length > 0 && isEmpty(lines[lines.length - 1])) {
    lines.pop();
  }

  while (lines.length > 0 && matchesAny(lines[lines.length - 1], TRAILING_LINE_PATTERNS)) {
    lines.pop();
    removedUiNoise += 1;

    while (lines.length > 0 && isEmpty(lines[lines.length - 1])) {
      lines.pop();
    }
  }

  nextText = lines.join("\n");

  for (const pattern of LEADING_PREFIX_PATTERNS) {
    const replaced = nextText.replace(pattern, "");
    if (replaced !== nextText) {
      nextText = replaced;
      removedUiNoise += 1;
      break;
    }
  }

  const paragraphs = nextText.split(/\n{2,}/).filter((paragraph) => paragraph.trim().length > 0);

  while (
    paragraphs.length > 1 &&
    (matchesAny(paragraphs[0] ?? "", LEADING_PARAGRAPH_PATTERNS) || isLikelyLeadingMetaParagraph(paragraphs[0] ?? ""))
  ) {
    paragraphs.shift();
    removedUiNoise += 1;
  }

  while (
    paragraphs.length > 1 &&
    (matchesAny(paragraphs[paragraphs.length - 1] ?? "", TRAILING_PARAGRAPH_PATTERNS) ||
      isLikelyTrailingMetaParagraph(paragraphs[paragraphs.length - 1] ?? ""))
  ) {
    paragraphs.pop();
    removedUiNoise += 1;
  }

  nextText = paragraphs.join("\n\n");

  return {
    text: nextText,
    stats: {
      removedUiNoise,
    },
  };
}

function isEmpty(line: string) {
  return line.trim().length === 0;
}

function matchesAny(line: string, patterns: RegExp[]) {
  const value = line.trim();

  return patterns.some((pattern) => pattern.test(value));
}

function isLikelyLeadingMetaParagraph(paragraph: string) {
  const value = paragraph.trim().toLowerCase();

  if (value.length === 0 || value.length > 140 || value.includes("\n")) {
    return false;
  }

  return hasKeywordHint(value, LEADING_META_HINTS) && countMetaKeywords(value) >= 2;
}

function isLikelyTrailingMetaParagraph(paragraph: string) {
  const value = paragraph.trim().toLowerCase();

  if (value.length === 0 || value.length > 140 || value.includes("\n")) {
    return false;
  }

  return hasKeywordHint(value, TRAILING_META_HINTS) && countMetaKeywords(value) >= 1;
}

function hasKeywordHint(value: string, hints: string[]) {
  return hints.some((hint) => value.includes(hint));
}

function countMetaKeywords(value: string) {
  return META_KEYWORDS.reduce((count, keyword) => count + (value.includes(keyword) ? 1 : 0), 0);
}
