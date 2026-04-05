import { isHeadingLike, isListLine } from "@/lib/normalize/transforms/helpers";
import type { TransformResult } from "@/lib/normalize/types";

const INTRO_TO_STRUCTURE_PATTERN =
  /(?:다음과 같습니다|아래와 같습니다|as follows|the following)(?:[.!?])?$/i;

const META_PARAGRAPH_PATTERN =
  /(?:붙여넣|복사해서|참고하시면|도움이 될|도움이 됩니다|영상|유튜브|video|youtube|document|plain text)/i;

const LEADING_DOCUMENT_META_PATTERN =
  /(?:지금까지 나눈|최종 문서 형태|깔끔하게 정리해 드립니다|체크리스트처럼 활용|작업 공간 옆에 띄워두고|본 문서는)/i;

const TRAILING_WRAPUP_PATTERN =
  /(?:이제 .*바탕으로|멋진 .*완성해 보세요|좋은 결과물이 나오기를 응원합니다|활용해 보세요)/i;

export function extractMainContent(text: string): TransformResult {
  const paragraphs = text.split(/\n{2,}/).filter((paragraph) => paragraph.trim().length > 0);

  if (paragraphs.length < 2) {
    return { text };
  }

  let removedUiNoise = 0;
  const dropIndexes = new Set<number>();

  for (let index = 0; index < paragraphs.length; index += 1) {
    const paragraph = paragraphs[index] ?? "";
    const nextParagraph = paragraphs[index + 1] ?? "";
    const nextNextParagraph = paragraphs[index + 2] ?? "";
    const previousParagraph = paragraphs[index - 1] ?? "";
    const trimmed = paragraph.trim();

    const shouldDrop =
      isIntroToStructuredBlock(trimmed, nextParagraph, nextNextParagraph) ||
      isLowValueTail(trimmed, previousParagraph, index, paragraphs.length) ||
      isLeadingDocumentMeta(trimmed, nextParagraph, nextNextParagraph, index) ||
      isPostTitleMeta(trimmed, previousParagraph, nextParagraph) ||
      isTrailingWrapup(trimmed, index, paragraphs.length);

    if (shouldDrop) {
      dropIndexes.add(index);
      removedUiNoise += 1;
    }
  }

  const kept = paragraphs.filter((_, index) => !dropIndexes.has(index));

  return {
    text: kept.join("\n\n"),
    stats: {
      removedUiNoise,
    },
  };
}

function isLeadingDocumentMeta(
  paragraph: string,
  nextParagraph: string,
  nextNextParagraph: string,
  index: number,
) {
  if (index > 2) {
    return false;
  }

  if (!LEADING_DOCUMENT_META_PATTERN.test(paragraph)) {
    return false;
  }

  return (
    isDocumentTitleParagraph(nextParagraph) ||
    isHeadingOnlyParagraph(nextParagraph) ||
    isStructuredParagraph(nextParagraph) ||
    isDocumentTitleParagraph(nextNextParagraph) ||
    isHeadingOnlyParagraph(nextNextParagraph)
  );
}

function isPostTitleMeta(paragraph: string, previousParagraph: string, nextParagraph: string) {
  if (!LEADING_DOCUMENT_META_PATTERN.test(paragraph)) {
    return false;
  }

  return isDocumentTitleParagraph(previousParagraph) && (isHeadingOnlyParagraph(nextParagraph) || isStructuredParagraph(nextParagraph));
}

function isIntroToStructuredBlock(paragraph: string, nextParagraph: string, nextNextParagraph: string) {
  if (!INTRO_TO_STRUCTURE_PATTERN.test(paragraph)) {
    return false;
  }

  return (
    isStructuredParagraph(nextParagraph) ||
    (isHeadingOnlyParagraph(nextParagraph) && isStructuredParagraph(nextNextParagraph))
  );
}

function isLowValueTail(
  paragraph: string,
  previousParagraph: string,
  index: number,
  totalParagraphs: number,
) {
  if (index !== totalParagraphs - 1) {
    return false;
  }

  if (!META_PARAGRAPH_PATTERN.test(paragraph)) {
    return false;
  }

  return isInformationalParagraph(previousParagraph);
}

function isTrailingWrapup(paragraph: string, index: number, totalParagraphs: number) {
  if (index < totalParagraphs - 2) {
    return false;
  }

  return TRAILING_WRAPUP_PATTERN.test(paragraph);
}

function isStructuredParagraph(paragraph: string) {
  const lines = paragraph
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return false;
  }

  return (
    lines.every((line) => isListLine(line) || isHeadingLike(line)) ||
    lines.some((line) => isListLine(line)) ||
    (lines.length === 1 && isHeadingLike(lines[0] ?? ""))
  );
}

function isHeadingOnlyParagraph(paragraph: string) {
  const lines = paragraph
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length !== 1) {
    return false;
  }

  const line = lines[0] ?? "";
  const tokenCount = line.split(/\s+/).length;

  return isHeadingLike(line) || (line.length <= 40 && tokenCount <= 6 && !/[.!?]$/.test(line));
}

function isDocumentTitleParagraph(paragraph: string) {
  const lines = paragraph
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length !== 1) {
    return false;
  }

  const line = lines[0] ?? "";
  const tokenCount = line.split(/\s+/).length;

  return line.length <= 90 && tokenCount <= 14 && /[:：]/.test(line);
}

function isInformationalParagraph(paragraph: string) {
  const trimmed = paragraph.trim();

  if (!trimmed) {
    return false;
  }

  const lines = trimmed.split("\n").filter(Boolean);
  const signalCount =
    (/\d/.test(trimmed) ? 1 : 0) +
    (/[()]/.test(trimmed) ? 1 : 0) +
    (/:/.test(trimmed) ? 1 : 0) +
    (lines.some((line) => isListLine(line)) ? 2 : 0) +
    (trimmed.length >= 80 ? 1 : 0);

  return signalCount >= 1;
}
