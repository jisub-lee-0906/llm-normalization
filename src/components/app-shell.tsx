"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";

import { ActionBar } from "@/components/action-bar";
import { TextPanel } from "@/components/text-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  EMPTY_NORMALIZE_RESULT,
  type NormalizeResult,
  normalizeText,
} from "@/lib/normalize";
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
          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:p-10">
            <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="space-y-3">
                  <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    AI 답변 정리기
                  </p>
                  <h1 className="font-heading text-4xl leading-tight font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
                    AI 출력물을 붙여넣으면
                    <br />
                    바로 깔끔한 텍스트로 정리합니다.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    ChatGPT, Gemini, Perplexity, Claude에서 복사한 citation, 링크 꼬리,
                    마크다운 잔재, 어색한 줄바꿈을 자동 정리해 메모장과 문서에 바로 붙여넣기
                    좋은 plain text로 바꿉니다.
                  </p>
                </div>
              </div>
              <Card className="w-full max-w-sm rounded-[1.5rem] border-border bg-card shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium tracking-[0.18em] uppercase text-muted-foreground">
                    <ShieldCheck className="size-4 text-foreground" />
                    Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <p>입력 텍스트는 브라우저 안에서만 처리됩니다.</p>
                  <p>서버 저장, 계정, 히스토리 없이 바로 사용합니다.</p>
                </CardContent>
              </Card>
            </header>

            <Separator className="bg-border" />

            <div className="grid gap-5 lg:grid-cols-2">
              <TextPanel
                description="AI에서 복사한 원문을 그대로 붙여넣으세요."
                onChange={setInput}
                title="원문"
                value={input}
              />
              <TextPanel
                description="정규화 결과는 실시간으로 갱신됩니다."
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
                <StatTile label="Citations 제거" value={result.stats.removedCitations} />
                <StatTile label="링크 정리" value={result.stats.removedLinks} />
                <StatTile label="줄바꿈 복원" value={result.stats.collapsedLines} />
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[1.5rem] border border-border bg-card p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {statusMessage}
              </p>
              {result.warnings.length > 0 ? (
                <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
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

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-28 rounded-[1.1rem] border border-border bg-background px-4 py-3">
      <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
