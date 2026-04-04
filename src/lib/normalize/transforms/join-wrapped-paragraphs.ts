import {
  isCodeFence,
  isCodeishLine,
  isHeadingLike,
  isListLine,
  isTableLine,
  joinWithSpace,
} from "@/lib/normalize/transforms/helpers";
import type { TransformResult } from "@/lib/normalize/types";

export function joinWrappedParagraphs(text: string): TransformResult {
  const blocks = text.split(/\n{2,}/);
  let collapsedLines = 0;

  const nextText = blocks
    .map((block) => {
      const rawLines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (rawLines.length <= 1) {
        return rawLines.join("").replace(/^§§H§§\s*/, "");
      }

      if (rawLines.some(isCodeFence) || rawLines.filter(isCodeishLine).length >= 2) {
        return rawLines.join("\n");
      }

      if (rawLines.length > 1 && rawLines.every(isTableLine)) {
        return rawLines.join("\n");
      }

      if (isHeadingLike(rawLines[0] ?? "") && rawLines.length > 1) {
        const heading = (rawLines[0] ?? "").replace(/^§§H§§\s*/, "");
        const body = joinPlainLines(rawLines.slice(1));
        collapsedLines += Math.max(rawLines.length - 2, 0);
        return `${heading}\n\n${body}`;
      }

      let paragraph = (rawLines[0] ?? "").replace(/^§§H§§\s*/, "");

      for (const line of rawLines.slice(1)) {
        if (isListLine(line) || isHeadingLike(paragraph) || /[:：]$/.test(paragraph)) {
          paragraph = `${paragraph}\n${line}`;
          continue;
        }

        paragraph = joinWithSpace(paragraph, line);
        collapsedLines += 1;
      }

      return paragraph;
    })
    .join("\n\n");

  return {
    text: nextText,
    stats: {
      collapsedLines,
    },
  };
}

function joinPlainLines(lines: string[]) {
  return lines.reduce((paragraph, line) => {
    if (!paragraph) {
      return line;
    }

    if (isListLine(line) || /[:：]$/.test(paragraph)) {
      return `${paragraph}\n${line}`;
    }

    return joinWithSpace(paragraph, line);
  }, "");
}
