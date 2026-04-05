"use client";

import type { DiffSegment } from "@/lib/normalize/diff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type TextPanelProps = {
  title: string;
  description: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  diffSegments?: DiffSegment[];
  metaLabel?: string;
};

export function TextPanel({
  title,
  description,
  value,
  onChange,
  readOnly = false,
  diffSegments = [],
  metaLabel,
}: TextPanelProps) {
  return (
    <Card className="overflow-hidden rounded-[1.5rem] border-border bg-card shadow-none">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
          {metaLabel ? (
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              {metaLabel}
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <Textarea
          className="min-h-[380px] resize-none rounded-[1.25rem] border-border bg-background px-4 py-4 font-mono text-[15px] leading-7 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-ring/20"
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          placeholder={
            readOnly
              ? "정리 결과가 여기에 표시됩니다."
              : "여기에 AI 응답을 붙여넣으세요. 예: ChatGPT, Gemini, Perplexity, Claude"
          }
          readOnly={readOnly}
          value={value}
        />
        {readOnly ? <DiffPreview segments={diffSegments} /> : null}
      </CardContent>
    </Card>
  );
}

function DiffPreview({ segments }: { segments: DiffSegment[] }) {
  const removedSegments = segments.filter((segment) => segment.type === "removed");

  if (removedSegments.length === 0) {
    return null;
  }

  const removedTokenCount = removedSegments.reduce(
    (total, segment) => total + segment.value.trim().split(/\s+/).filter(Boolean).length,
    0,
  );

  return (
    <div className="mt-4 rounded-[1.25rem] border border-border bg-muted/30 px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Removed from source
        </p>
        <p className="rounded-full border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
          {removedTokenCount} tokens
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {removedSegments.map((segment, index) => (
          <span
            className="rounded-md border border-border bg-background px-2 py-1 text-sm leading-6 text-foreground"
            key={`removed-${index}`}
          >
            {segment.value.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}
