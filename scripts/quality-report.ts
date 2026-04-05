import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { normalizationFixtures, normalizeText } from "../src/lib/normalize/index";

type GroupStats = {
  total: number;
  passed: number;
  failed: number;
};

type Failure = {
  id: string;
  expected: string;
  actual: string;
};

const failures: Failure[] = [];
const bySource = new Map<string, GroupStats>();
const byPattern = new Map<string, GroupStats>();

for (const fixture of normalizationFixtures) {
  const actual = normalizeText(fixture.input).output;
  const passed = actual === fixture.expected;

  updateGroup(bySource, getSourceKey(fixture.id), passed);
  for (const pattern of getPatternKeys(fixture.id)) {
    updateGroup(byPattern, pattern, passed);
  }

  if (!passed) {
    failures.push({
      id: fixture.id,
      expected: fixture.expected,
      actual,
    });
  }
}

const report = buildReport();
const reportDir = join(process.cwd(), "output", "quality");
const reportPath = join(reportDir, "quality-report.md");

mkdirSync(reportDir, { recursive: true });
writeFileSync(reportPath, report, "utf8");
process.stdout.write(`${report}\n\nSaved report to ${reportPath}\n`);

function updateGroup(target: Map<string, GroupStats>, key: string, passed: boolean) {
  const current = target.get(key) ?? { total: 0, passed: 0, failed: 0 };
  current.total += 1;
  current.passed += passed ? 1 : 0;
  current.failed += passed ? 0 : 1;
  target.set(key, current);
}

function getSourceKey(id: string) {
  return id.split("-")[0] ?? "unknown";
}

function getPatternKeys(id: string) {
  return id
    .split("-")
    .slice(1)
    .filter(Boolean);
}

function buildReport() {
  const lines: string[] = [];
  const total = normalizationFixtures.length;
  const passed = total - failures.length;
  const failed = failures.length;

  lines.push("# Quality Report");
  lines.push("");
  lines.push(`- Total fixtures: ${total}`);
  lines.push(`- Passed: ${passed}`);
  lines.push(`- Failed: ${failed}`);
  lines.push(`- Pass rate: ${formatPercent(passed, total)}`);
  lines.push("");
  lines.push("## By Source");
  lines.push("");
  for (const [key, stats] of sortGroups(bySource)) {
    lines.push(`- ${key}: ${stats.passed}/${stats.total} (${formatPercent(stats.passed, stats.total)})`);
  }
  lines.push("");
  lines.push("## By Pattern");
  lines.push("");
  for (const [key, stats] of sortGroups(byPattern)) {
    if (stats.total < 2) {
      continue;
    }

    lines.push(`- ${key}: ${stats.passed}/${stats.total} (${formatPercent(stats.passed, stats.total)})`);
  }

  if (failures.length > 0) {
    lines.push("");
    lines.push("## Failures");
    lines.push("");
    for (const failure of failures) {
      lines.push(`### ${failure.id}`);
      lines.push("");
      lines.push("Expected:");
      lines.push("```txt");
      lines.push(failure.expected);
      lines.push("```");
      lines.push("");
      lines.push("Actual:");
      lines.push("```txt");
      lines.push(failure.actual);
      lines.push("```");
      lines.push("");
    }
  }

  return lines.join("\n");
}

function sortGroups(groups: Map<string, GroupStats>) {
  return [...groups.entries()].sort((left, right) => left[0].localeCompare(right[0]));
}

function formatPercent(part: number, total: number) {
  if (total === 0) {
    return "0.0%";
  }

  return `${((part / total) * 100).toFixed(1)}%`;
}
