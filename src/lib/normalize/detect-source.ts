import type { DetectedSource } from "@/lib/normalize/types";

type CandidateScore = Record<DetectedSource, number>;

export function detectSource(input: string): DetectedSource {
  const text = input.toLowerCase();
  const score: CandidateScore = {
    chatgpt: 0,
    gemini: 0,
    perplexity: 0,
    claude: 0,
    generic: 0,
  };

  if (/\[cite_start\]|\[cite_end\]|\[cite:\s*[\d,\s]+\]/i.test(text) || /view all sources/i.test(text)) {
    score.gemini += 4;
  }

  if (/perplexity/i.test(text) || /\[[0-9]+\]\[[0-9]+\]/.test(input) || /references?\s*$/im.test(text)) {
    score.perplexity += 3;
  }

  if (/chatgpt/i.test(text) || /regenerate|edit prompt|copy code/i.test(text)) {
    score.chatgpt += 2;
  }

  if (/claude/i.test(text) || /artifacts?/i.test(text) || /show thinking|hide thinking/i.test(text)) {
    score.claude += 2;
  }

  if (/【\d+[:†][^】]*】/.test(input)) {
    score.perplexity += 2;
    score.gemini += 1;
  }

  const ranked = Object.entries(score).sort((left, right) => right[1] - left[1]);
  const [source, sourceScore] = ranked[0] as [DetectedSource, number];

  return sourceScore > 0 ? source : "generic";
}
