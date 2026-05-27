import type { DetectedSource, TransformResult } from "@/lib/normalize/types";

type VendorCleanupOptions = {
  source: DetectedSource;
};

export function vendorCleanup(text: string, options: VendorCleanupOptions): TransformResult {
  let nextText = text;
  let removedUiNoise = 0;
  let removedCitations = 0;

  const stripLine = (pattern: RegExp) => {
    const lines = nextText.split("\n");
    const keptLines = lines.filter((line) => {
      const isMatch = pattern.test(line.trim());
      if (isMatch) {
        removedUiNoise += 1;
      }
      return !isMatch;
    });
    nextText = keptLines.join("\n");
  };

  switch (options.source) {
    case "gemini":
      stripLine(/^(double-check response|view all sources)$/i);
      break;
    case "perplexity":
      nextText = nextText.replace(/【\d+[:†][^】]*】/g, () => {
        removedCitations += 1;
        return "";
      });
      stripLine(/^(sources?|references?|citations?)$/i);
      break;
    case "chatgpt":
      stripLine(/^(chatgpt said:|regenerate response|continue generating)$/i);
      break;
    case "claude":
      stripLine(/^(claude said:|artifacts?)$/i);
      break;
    default:
      break;
  }

  return {
    text: nextText,
    stats: {
      removedUiNoise,
      removedCitations,
    },
  };
}
