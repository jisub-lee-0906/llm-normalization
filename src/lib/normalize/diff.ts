export type DiffSegment = {
  value: string;
  type: "unchanged" | "removed";
};

export function buildDiffSegments(input: string, output: string): DiffSegment[] {
  if (!input.trim() || !output.trim()) {
    return [];
  }

  const sourceTokens = tokenize(input);
  const outputTokens = tokenize(output);
  const lcs = buildLcsMatrix(sourceTokens, outputTokens);

  const segments: DiffSegment[] = [];
  let sourceIndex = 0;
  let outputIndex = 0;

  while (sourceIndex < sourceTokens.length && outputIndex < outputTokens.length) {
    if (sourceTokens[sourceIndex] === outputTokens[outputIndex]) {
      pushSegment(segments, sourceTokens[sourceIndex], "unchanged");
      sourceIndex += 1;
      outputIndex += 1;
      continue;
    }

    if (lcs[sourceIndex + 1][outputIndex] >= lcs[sourceIndex][outputIndex + 1]) {
      pushSegment(segments, sourceTokens[sourceIndex], "removed");
      sourceIndex += 1;
      continue;
    }

    outputIndex += 1;
  }

  while (sourceIndex < sourceTokens.length) {
    pushSegment(segments, sourceTokens[sourceIndex], "removed");
    sourceIndex += 1;
  }

  return segments.filter((segment) => segment.value.trim().length > 0);
}

function tokenize(value: string) {
  return value.match(/\S+\s*/g) ?? [];
}

function buildLcsMatrix(source: string[], target: string[]) {
  const matrix = Array.from({ length: source.length + 1 }, () =>
    Array.from({ length: target.length + 1 }, () => 0),
  );

  for (let sourceIndex = source.length - 1; sourceIndex >= 0; sourceIndex -= 1) {
    for (let targetIndex = target.length - 1; targetIndex >= 0; targetIndex -= 1) {
      if (source[sourceIndex] === target[targetIndex]) {
        matrix[sourceIndex][targetIndex] = matrix[sourceIndex + 1][targetIndex + 1] + 1;
      } else {
        matrix[sourceIndex][targetIndex] = Math.max(
          matrix[sourceIndex + 1][targetIndex],
          matrix[sourceIndex][targetIndex + 1],
        );
      }
    }
  }

  return matrix;
}

function pushSegment(segments: DiffSegment[], value: string, type: DiffSegment["type"]) {
  const previous = segments.at(-1);

  if (previous?.type === type) {
    previous.value += value;
    return;
  }

  segments.push({ value, type });
}
