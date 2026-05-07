import {
  isTableLine,
  isTableSeparator,
} from "@/lib/normalize/transforms/helpers";
import type { NormalizeWarning, TransformResult } from "@/lib/normalize/types";

export function stripMarkdownArtifacts(text: string): TransformResult {
  let nextText = text;
  let removedMarkdown = 0;
  const warnings: NormalizeWarning[] = [];
  const replaceAndCount = (
    pattern: RegExp,
    replacer: string | ((substring: string, ...args: string[]) => string),
  ) => {
    const matches = nextText.match(pattern);
    removedMarkdown += matches?.length ?? 0;
    nextText = nextText.replace(pattern, replacer as never);
  };

  replaceAndCount(/^#{1,6}\s+/gm, "§§H§§ ");
  replaceAndCount(/^>\s?/gm, "§§H§§ ");
  replaceAndCount(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, (_match, altText) => altText || "");
  replaceAndCount(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label) => label);
  replaceAndCount(/(\*\*|__)(.*?)\1/g, (_match, _marker, innerText) => innerText);
  replaceAndCount(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, (_match, innerText) => innerText);
  replaceAndCount(/(?<!_)_([^_\n]+)_(?!_)/g, (_match, innerText) => innerText);
  replaceAndCount(/`{1,3}([^`]+)`{1,3}/g, (_match, innerText) => innerText);
  replaceAndCount(/^[-_*]{3,}$/gm, "");

  const lines = nextText.split("\n");
  let sawTable = false;

  const transformedLines = lines.flatMap((line) => {
    if (isTableSeparator(line)) {
      sawTable = true;
      removedMarkdown += 1;
      return [];
    }

    if (isTableLine(line)) {
      sawTable = true;
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);

      return [cells.join(" | ")];
    }

    return [line];
  });

  if (sawTable) {
    warnings.push("possible_table_loss");
  }

  return {
    text: transformedLines.join("\n"),
    stats: {
      removedMarkdown,
    },
    warnings,
  };
}
