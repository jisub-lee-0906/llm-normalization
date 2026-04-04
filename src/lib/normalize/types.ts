export type NormalizeStats = {
  removedCitations: number;
  removedMarkdown: number;
  removedUiNoise: number;
  removedLinks: number;
  collapsedLines: number;
  normalizedLists: number;
};

export type NormalizeWarning = "fallback_to_input" | "possible_table_loss";

export type NormalizeResult = {
  output: string;
  stats: NormalizeStats;
  warnings: NormalizeWarning[];
};

export type TransformResult = {
  text: string;
  stats?: Partial<NormalizeStats>;
  warnings?: NormalizeWarning[];
};
