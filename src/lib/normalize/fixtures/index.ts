export type NormalizationFixture = {
  id: string;
  input: string;
  expected: string;
};

export const normalizationFixtures: NormalizationFixture[] = [
  {
    id: "chatgpt-ko-markdown",
    input: `## 핵심 요약

**LLM 정규화 앱**을 만들 때 가장 중요한 건 \`자동 정리\` 경험입니다.[1]

• 불필요한 citation 제거
• 어색한 줄바꿈 복원

Copy`,
    expected: `핵심 요약

LLM 정규화 앱을 만들 때 가장 중요한 건 자동 정리 경험입니다.

- 불필요한 citation 제거
- 어색한 줄바꿈 복원`,
  },
  {
    id: "chatgpt-en-links",
    input: `### Why this matters
The output looks polished in the chat UI,
but it breaks when you paste it into Docs.[2]

Sources
https://example.com/a
https://example.com/b`,
    expected: `Why this matters

The output looks polished in the chat UI, but it breaks when you paste it into Docs.`,
  },
  {
    id: "gemini-ko-citations",
    input: `Gemini는 종종 이런 식으로 답을 줍니다[cite_start][cite: 1, 2][cite_end].
문서에 붙여넣으면 citation이 그대로 남습니다.

View all sources`,
    expected: `Gemini는 종종 이런 식으로 답을 줍니다. 문서에 붙여넣으면 citation이 그대로 남습니다.`,
  },
  {
    id: "gemini-en-structure",
    input: `# Cleanup strategy
1. Remove citation markers [1]
2. Normalize spacing [2]
3. Preserve lists`,
    expected: `Cleanup strategy

1. Remove citation markers
2. Normalize spacing
3. Preserve lists`,
  },
  {
    id: "perplexity-ko-sources",
    input: `Perplexity는 본문 아래에 링크 묶음을 길게 붙이는 경우가 많습니다.[3]
이 부분만 자동으로 지워도 체감이 큽니다.

References
- https://perplexity.ai/source1
- https://perplexity.ai/source2`,
    expected: `Perplexity는 본문 아래에 링크 묶음을 길게 붙이는 경우가 많습니다. 이 부분만 자동으로 지워도 체감이 큽니다.`,
  },
  {
    id: "perplexity-en-markdown",
    input: `> Key point
The answer often includes **inline emphasis** and trailing links.[4]

[Source A](https://example.com/a)
[Source B](https://example.com/b)`,
    expected: `Key point

The answer often includes inline emphasis and trailing links.`,
  },
  {
    id: "claude-ko-lists",
    input: `### Claude 스타일 응답

* 마크다운 기호가 남고
* 문단이 쓸데없이 잘리기도 합니다

이 줄은
문장 중간에서 끊겼습니다.`,
    expected: `Claude 스타일 응답

- 마크다운 기호가 남고
- 문단이 쓸데없이 잘리기도 합니다

이 줄은 문장 중간에서 끊겼습니다.`,
  },
  {
    id: "claude-en-table",
    input: `| Tool | Issue |
| --- | --- |
| ChatGPT | Markdown artifacts |
| Gemini | Citation markers |`,
    expected: `Tool | Issue
ChatGPT | Markdown artifacts
Gemini | Citation markers`,
  },
];
