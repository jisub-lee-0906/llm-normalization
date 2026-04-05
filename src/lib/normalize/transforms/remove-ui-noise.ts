import type { TransformResult } from "@/lib/normalize/types";

const UI_NOISE_LINES = new Set([
  "copy",
  "copied",
  "copy code",
  "copy text",
  "share",
  "regenerate",
  "regenerate response",
  "retry",
  "edit prompt",
  "ask follow-up",
  "show thinking",
  "hide thinking",
  "read more",
  "view more",
  "view all sources",
  "good response",
  "bad response",
]);

export function removeUiNoise(text: string): TransformResult {
  let removedUiNoise = 0;

  const nextText = text
    .split("\n")
    .filter((line) => {
      const normalizedLine = line.trim().toLowerCase();
      const isNoise =
        UI_NOISE_LINES.has(normalizedLine) ||
        /^model:\s*\w+/i.test(normalizedLine) ||
        /^chatgpt said:$/i.test(normalizedLine) ||
        /^gemini said:$/i.test(normalizedLine);

      if (isNoise) {
        removedUiNoise += 1;
      }

      return !isNoise;
    })
    .join("\n");

  return {
    text: nextText,
    stats: {
      removedUiNoise,
    },
  };
}
