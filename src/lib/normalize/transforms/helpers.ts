export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function countMatches(text: string, pattern: RegExp) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matches = text.match(new RegExp(pattern.source, flags));
  return matches?.length ?? 0;
}

export function isListLine(line: string) {
  return /^(\s*)([-*•▪◦]|\d+\.)\s+/.test(line);
}

export function isOrderedListLine(line: string) {
  return /^(\s*)\d+\.\s+/.test(line);
}

export function isCodeFence(line: string) {
  return /^```/.test(line.trim());
}

export function isCodeishLine(line: string) {
  const trimmed = line.trim();

  return (
    /^\s{2,}\S/.test(line) ||
    /^(const|let|var|function|class|if|for|while|return|import|export|SELECT|FROM|WHERE|curl)\b/.test(trimmed) ||
    /(=>|[{}`;<>]|<\/?\w+)/.test(trimmed)
  );
}

export function isTableLine(line: string) {
  const trimmed = line.trim();
  return trimmed.includes("|") && trimmed.split("|").filter(Boolean).length >= 2;
}

export function isTableSeparator(line: string) {
  return /^[\s|:-]+$/.test(line.trim()) && line.includes("|");
}

export function isHeadingLike(line: string) {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }

  if (isListLine(trimmed)) {
    return false;
  }

  const tokenCount = trimmed.split(/\s+/).length;
  return trimmed.startsWith("§§H§§ ") || (trimmed.length <= 60 && tokenCount <= 8 && /[:：]$/.test(trimmed));
}

export function isUrlOnlyLine(line: string) {
  return /^(?:[-*]\s*)?(?:https?:\/\/|www\.)\S+$/i.test(line.trim());
}

export function isSourceHeading(line: string) {
  return /^(sources?|references?|further reading|related links?)\s*:?\s*$/i.test(line.trim());
}

export function joinWithSpace(left: string, right: string) {
  if (!left) {
    return right;
  }
  if (!right) {
    return left;
  }

  if (/[([{'"“‘]$/.test(left) || /^[,.;:!?%)\]}'"”’]/.test(right)) {
    return `${left}${right}`;
  }

  return `${left} ${right}`;
}
