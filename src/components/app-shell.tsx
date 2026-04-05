"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { ActionBar } from "@/components/action-bar";
import { TextPanel } from "@/components/text-panel";
import { Separator } from "@/components/ui/separator";
import {
  EMPTY_NORMALIZE_RESULT,
  type NormalizeResult,
  type NormalizeStats,
  normalizeText,
} from "@/lib/normalize";
import { buildDiffSegments } from "@/lib/normalize/diff";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { downloadTextFile } from "@/lib/utils/download";

const COPY_SUCCESS = "정리된 텍스트를 클립보드에 복사했습니다.";
const DOWNLOAD_SUCCESS = "정리된 결과를 TXT 파일로 저장했습니다.";
const DEFAULT_STATUS = "붙여넣는 즉시 우측에서 정리 결과가 갱신됩니다.";
const ERROR_STATUS =
  "정규화 중 문제가 생겨 원문을 그대로 보여주고 있습니다. 입력 텍스트를 확인해 주세요.";

export function AppShell() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<NormalizeResult>(EMPTY_NORMALIZE_RESULT);
  const [statusMessage, setStatusMessage] = useState(DEFAULT_STATUS);

  const deferredInput = useDeferredValue(input);
  const diffSegments = buildDiffSegments(input, result.output);

  useEffect(() => {
    startTransition(() => {
      const nextResult = normalizeText(deferredInput);
      setResult(nextResult);
      setStatusMessage(nextResult.warnings.includes("fallback_to_input") ? ERROR_STATUS : DEFAULT_STATUS);
    });
  }, [deferredInput]);

  async function handleCopy() {
    if (!result.output) {
      return;
    }

    const ok = await copyToClipboard(result.output);
    setStatusMessage(ok ? COPY_SUCCESS : "복사에 실패했습니다. 브라우저 권한을 확인해 주세요.");
  }

  function handleDownload() {
    if (!result.output) {
      return;
    }

    downloadTextFile(result.output, "normalized-output.txt");
    setStatusMessage(DOWNLOAD_SUCCESS);
  }

  function handleReset() {
    setInput("");
    setResult(EMPTY_NORMALIZE_RESULT);
    setStatusMessage(DEFAULT_STATUS);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-1 flex-col rounded-[2rem] border border-border bg-background">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
            <header className="space-y-3">
              <div className="max-w-3xl space-y-3">
                  <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    Markdown To TXT
                  </p>
                  <h1 className="font-heading text-4xl leading-tight font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
                    텍스트 정리
                  </h1>
              </div>
            </header>

            <Separator className="bg-border" />

            <div className="grid gap-5 lg:grid-cols-2">
              <TextPanel
                onChange={setInput}
                title="원문"
                value={input}
              />
              <TextPanel
                diffSegments={diffSegments}
                metaLabel={`Source · ${result.detectedSource}`}
                readOnly
                title="정리된 텍스트"
                value={result.output}
              />
            </div>

            <div className="flex flex-col gap-5 rounded-[1.5rem] border border-border bg-card p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <ActionBar
                canCopy={Boolean(result.output)}
                canDownload={Boolean(result.output)}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onReset={handleReset}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <StatTile label="Citations" value={result.stats.removedCitations} />
                <StatTile label="Links" value={result.stats.removedLinks} />
                <StatTile label="Lines" value={result.stats.collapsedLines} />
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-[1.5rem] border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{statusMessage}</p>
              {result.warnings.length > 0 ? (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-foreground" />
                  경고: {result.warnings.join(", ")}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatTile({ label, value }: { label: string; value: NormalizeStats[keyof NormalizeStats] }) {
  return (
    <div className="min-w-24 rounded-[1.1rem] border border-border bg-background px-4 py-3">
      <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
