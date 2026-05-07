"use client";

import { Copy, Download, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type ActionBarProps = {
  canCopy: boolean;
  canDownload: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onReset: () => void;
};

export function ActionBar({
  canCopy,
  canDownload,
  onCopy,
  onDownload,
  onReset,
}: ActionBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        className="h-10 rounded-xl bg-foreground px-4 text-background hover:opacity-90"
        disabled={!canCopy}
        onClick={onCopy}
        type="button"
      >
        <Copy className="size-4" />
        복사
      </Button>
      <Button
        className="h-10 rounded-xl border-border bg-background px-4 text-foreground hover:bg-muted"
        disabled={!canDownload}
        onClick={onDownload}
        type="button"
        variant="outline"
      >
        <Download className="size-4" />
        TXT 다운로드
      </Button>
      <Button
        className="h-10 rounded-xl px-4 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onReset}
        type="button"
        variant="ghost"
      >
        <RotateCcw className="size-4" />
        초기화
      </Button>
    </div>
  );
}
