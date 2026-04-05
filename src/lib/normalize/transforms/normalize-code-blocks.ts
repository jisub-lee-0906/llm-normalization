import type { TransformResult } from "@/lib/normalize/types";

export function normalizeCodeBlocks(text: string): TransformResult {
  let removedMarkdown = 0;

  const nextText = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (_match, code: string) => {
    removedMarkdown += 2;
    return `§§CODE§§\n${code.trimEnd()}\n§§ENDCODE§§`;
  });

  return {
    text: nextText,
    stats: {
      removedMarkdown,
    },
  };
}
