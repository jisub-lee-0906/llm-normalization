import {
  isSourceHeading,
  isUrlOnlyLine,
} from "@/lib/normalize/transforms/helpers";
import type { TransformResult } from "@/lib/normalize/types";

function isCitationLikeLine(line: string) {
  const trimmed = line.trim();

  return (
    isUrlOnlyLine(trimmed) ||
    /^(?:[-*]\s*)?\[[^\]]+\]\(https?:\/\/[^\s)]+\)$/i.test(trimmed) ||
    /^(?:[-*]\s*)?[A-Za-z0-9 _-]+:\s*https?:\/\/\S+$/i.test(trimmed)
  );
}

export function pruneTrailingLinks(text: string): TransformResult {
  const lines = text.split("\n");
  let endIndex = lines.length;
  let removedLinks = 0;

  while (endIndex > 0 && !lines[endIndex - 1]?.trim()) {
    endIndex -= 1;
  }

  let scanIndex = endIndex - 1;
  while (scanIndex >= 0 && isCitationLikeLine(lines[scanIndex] ?? "")) {
    removedLinks += 1;
    scanIndex -= 1;
  }

  if (scanIndex >= 0 && isSourceHeading(lines[scanIndex] ?? "") && removedLinks > 0) {
    removedLinks += 1;
    scanIndex -= 1;
  }

  if (removedLinks > 1) {
    return {
      text: lines.slice(0, scanIndex + 1).join("\n").trimEnd(),
      stats: {
        removedLinks,
      },
    };
  }

  const nextText = lines.filter((line) => !isSourceHeading(line)).join("\n");

  return {
    text: nextText,
    stats: {
      removedLinks: 0,
    },
  };
}
