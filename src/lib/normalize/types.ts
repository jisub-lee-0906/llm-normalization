export type NormalizeStats = {
  removedCitations: number;
  removedMarkdown: number;
  removedUiNoise: number;
  removedLinks: number;
  collapsedLines: number;
  normalizedLists: number;
};

export type NormalizeWarning = "fallback_to_input" | "possible_table_loss";
export type DetectedSource = "chatgpt" | "gemini" | "perplexity" | "claude" | "generic";

export type NormalizeResult = {
  output: string;
  stats: NormalizeStats;
  warnings: NormalizeWarning[];
  detectedSource: DetectedSource;
};

export type TransformResult = {
  text: string;
  stats?: Partial<NormalizeStats>;
  warnings?: NormalizeWarning[];
};
