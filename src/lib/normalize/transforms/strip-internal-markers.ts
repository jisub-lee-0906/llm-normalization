import type { TransformResult } from "@/lib/normalize/types";

export function stripInternalMarkers(text: string): TransformResult {
  return {
    text: text
      .replace(/^§§CODE§§\n?/gm, "")
      .replace(/^§§ENDCODE§§\n?/gm, "")
      .replace(/§§H§§\s*/g, ""),
  };
}
