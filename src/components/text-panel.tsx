"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type TextPanelProps = {
  title: string;
  description: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
};

export function TextPanel({
  title,
  description,
  value,
  onChange,
  readOnly = false,
}: TextPanelProps) {
  return (
    <Card className="overflow-hidden rounded-[1.5rem] border-border bg-card shadow-none">
      <CardHeader className="gap-2">
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <Textarea
          className="min-h-[380px] resize-none rounded-[1.25rem] border-border bg-background px-4 py-4 font-mono text-[15px] leading-6 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-ring/20"
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          placeholder={
            readOnly
              ? "정리 결과가 여기에 표시됩니다."
              : "여기에 AI 응답을 붙여넣으세요. 예: ChatGPT, Gemini, Perplexity, Claude"
          }
          readOnly={readOnly}
          value={value}
        />
      </CardContent>
    </Card>
  );
}
