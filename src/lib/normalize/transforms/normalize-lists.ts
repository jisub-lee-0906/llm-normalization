import {
  escapeRegExp,
  isOrderedListLine,
} from "@/lib/normalize/transforms/helpers";
import type { TransformResult } from "@/lib/normalize/types";

const BULLET_MARKERS = ["•", "*", "▪", "◦"];

export function normalizeLists(text: string): TransformResult {
  const bulletPattern = new RegExp(
    `^(\\s*)(?:${BULLET_MARKERS.map(escapeRegExp).join("|")})\\s+`,
    "gm",
  );

  let normalizedLists = 0;

  const nextText = text
    .replace(bulletPattern, (_, indent: string) => {
      normalizedLists += 1;
      return `${indent}- `;
    })
    .split("\n")
    .map((line) => {
      if (isOrderedListLine(line)) {
        return line.replace(/^(\s*)(\d+)[.)]\s+/, "$1$2. ");
      }

      return line;
    })
    .join("\n");

  return {
    text: nextText,
    stats: {
      normalizedLists,
    },
  };
}
