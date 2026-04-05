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
    id: "chatgpt-ko-wrapped-paragraph",
    input: `이 앱의 핵심은
복사한 AI 답변을
사람이 다시 손보지 않아도 되게 만드는 것입니다.

Sources
https://example.com`,
    expected: `이 앱의 핵심은 복사한 AI 답변을 사람이 다시 손보지 않아도 되게 만드는 것입니다.`,
  },
  {
    id: "chatgpt-ui-line",
    input: `ChatGPT said:
정답만 복사하고 싶을 때 UI 문구는 제거되어야 합니다.

Regenerate response`,
    expected: `정답만 복사하고 싶을 때 UI 문구는 제거되어야 합니다.`,
  },
  {
    id: "chatgpt-en-inline-markdown-link",
    input: `You can paste the response into [Google Docs](https://docs.google.com) or [Notion](https://notion.so) without cleaning every line.`,
    expected: `You can paste the response into Google Docs or Notion without cleaning every line.`,
  },
  {
    id: "chatgpt-en-fenced-code",
    input: `Use this snippet:

\`\`\`ts
const answer = normalizeText(raw);
console.log(answer.output);
\`\`\``,
    expected: `Use this snippet:

const answer = normalizeText(raw);
console.log(answer.output);`,
  },
  {
    id: "chatgpt-ko-mixed-spacing",
    input: `AI output 은 문장 끝 에 공백 이 이상하게 들어갑니다 .`,
    expected: `AI output은 문장 끝에 공백이 이상하게 들어갑니다.`,
  },
  {
    id: "chatgpt-ko-korean-particles",
    input: `이 기능 은 사용자가 복사한 답변 을 바로 정리하는 데 목적 이 있습니다 .`,
    expected: `이 기능은 사용자가 복사한 답변을 바로 정리하는 데 목적이 있습니다.`,
  },
  {
    id: "chatgpt-source-list-numbered",
    input: `본문은 유지되어야 합니다.

Sources
1. https://example.com/a
2. https://example.com/b`,
    expected: `본문은 유지되어야 합니다.`,
  },
  {
    id: "chatgpt-ui-copy-text",
    input: `복사 전에는 이런 UI 라인이 남을 수 있습니다.

Copy text`,
    expected: `복사 전에는 이런 UI 라인이 남을 수 있습니다.`,
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
    id: "gemini-ko-source-heading",
    input: `Gemini 답변 끝에는 출처가 길게 붙을 수 있습니다.

출처
- https://example.com/source-a
- https://example.com/source-b`,
    expected: `Gemini 답변 끝에는 출처가 길게 붙을 수 있습니다.`,
  },
  {
    id: "gemini-en-cite-marker-chain",
    input: `This answer may include raw markers[cite_start][cite: 3][cite_end] and a footer.

View all sources`,
    expected: `This answer may include raw markers and a footer.`,
  },
  {
    id: "gemini-ui-line",
    input: `Double-check response
Gemini 결과는 본문만 남겨야 합니다.

View all sources`,
    expected: `Gemini 결과는 본문만 남겨야 합니다.`,
  },
  {
    id: "gemini-ko-punctuation-spacing",
    input: `Gemini 결과 는 문장 부호 앞 공백 도 정리되어야 합니다 !`,
    expected: `Gemini 결과는 문장 부호 앞 공백도 정리되어야 합니다!`,
  },
  {
    id: "gemini-ko-numbered-sources",
    input: `핵심 답변은 위에 있고 아래는 출처입니다.

출처
1. https://google.com/a
2. https://google.com/b`,
    expected: `핵심 답변은 위에 있고 아래는 출처입니다.`,
  },
  {
    id: "gemini-ui-feedback-line",
    input: `Gemini 답변 본문만 남겨야 합니다.

Good response`,
    expected: `Gemini 답변 본문만 남겨야 합니다.`,
  },
  {
    id: "gemini-en-numbered-paren",
    input: `1) Remove markers
2) Clean spacing
3) Keep structure`,
    expected: `1. Remove markers
2. Clean spacing
3. Keep structure`,
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
    id: "perplexity-ko-bracket-citations",
    input: `Perplexity 답변은 본문 안에도 [1][2] 같은 citation이 연달아 붙습니다.
이것도 같이 제거해야 합니다.`,
    expected: `Perplexity 답변은 본문 안에도 같은 citation이 연달아 붙습니다. 이것도 같이 제거해야 합니다.`,
  },
  {
    id: "perplexity-en-web-citations",
    input: `The report frequently includes web-style references that are useless after paste.`,
    expected: `The report frequently includes web-style references that are useless after paste.`,
  },
  {
    id: "perplexity-source-heading-only",
    input: `Perplexity often adds a source heading after the main answer.

Sources`,
    expected: `Perplexity often adds a source heading after the main answer.`,
  },
  {
    id: "perplexity-ko-source-korean",
    input: `본문은 남기고 아래 관련 링크는 제거해야 합니다.

관련 링크
https://a.example
https://b.example`,
    expected: `본문은 남기고 아래 관련 링크는 제거해야 합니다.`,
  },
  {
    id: "perplexity-en-bracket-web-citation",
    input: `The answer may end with web citations that should disappear.`,
    expected: `The answer may end with web citations that should disappear.`,
  },
  {
    id: "perplexity-related-links-numbered",
    input: `Keep the summary only.

Related links
1. https://perplexity.ai/a
2. https://perplexity.ai/b`,
    expected: `Keep the summary only.`,
  },
  {
    id: "perplexity-label-url-lines",
    input: `The answer should stay.

Source A: https://example.com/a
Source B: https://example.com/b`,
    expected: `The answer should stay.`,
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
  {
    id: "claude-ko-inline-link",
    input: `문서 편집은 [Google Docs](https://docs.google.com) 같은 목적지에서 이루어지기 때문에 링크 문법도 제거되어야 합니다.`,
    expected: `문서 편집은 Google Docs 같은 목적지에서 이루어지기 때문에 링크 문법도 제거되어야 합니다.`,
  },
  {
    id: "claude-en-list-normalization",
    input: `### Export checklist

▪ remove sources
◦ preserve bullets
* flatten markdown`,
    expected: `Export checklist

- remove sources
- preserve bullets
- flatten markdown`,
  },
  {
    id: "claude-artifact-line",
    input: `Artifacts
Claude sometimes leaves artifact labels around the answer.`,
    expected: `Claude sometimes leaves artifact labels around the answer.`,
  },
  {
    id: "claude-en-fenced-bash",
    input: `Run this:

\`\`\`bash
npm run lint
npm run test
\`\`\``,
    expected: `Run this:

npm run lint
npm run test`,
  },
  {
    id: "claude-ko-mixed-link-and-particle",
    input: `문서 는 [Notion](https://notion.so) 같은 곳 에 붙여넣게 됩니다 .`,
    expected: `문서는 Notion 같은 곳에 붙여넣게 됩니다.`,
  },
  {
    id: "claude-source-heading-korean",
    input: `중요한 설명은 남겨야 합니다.

참고 링크
https://example.com/one
https://example.com/two`,
    expected: `중요한 설명은 남겨야 합니다.`,
  },
  {
    id: "claude-ui-copy-code",
    input: `코드 설명만 남기고 싶습니다.

Copy code`,
    expected: `코드 설명만 남기고 싶습니다.`,
  },
  {
    id: "generic-en-parenthesized-list",
    input: `1) remove source links
2) normalize whitespace
3) preserve lists`,
    expected: `1. remove source links
2. normalize whitespace
3. preserve lists`,
  },
  {
    id: "generic-en-code-and-paragraph",
    input: `Paste this code block as plain text:

\`\`\`bash
npm run test
npm run build
\`\`\`

It should stay readable.`,
    expected: `Paste this code block as plain text:

npm run test
npm run build

It should stay readable.`,
  },
  {
    id: "generic-ko-long-wrapped-paragraph",
    input: `이 도구의 가치는
사용자가 AI 출력물을 붙여넣은 다음
별도 설정 없이 바로 복사할 수 있게 만드는 데 있습니다.`,
    expected: `이 도구의 가치는 사용자가 AI 출력물을 붙여넣은 다음 별도 설정 없이 바로 복사할 수 있게 만드는 데 있습니다.`,
  },
  {
    id: "generic-en-long-wrapped-paragraph",
    input: `The core value of this app
is removing the last manual cleanup step
after copying from an AI interface.`,
    expected: `The core value of this app is removing the last manual cleanup step after copying from an AI interface.`,
  },
  {
    id: "generic-ko-brackets-spacing",
    input: `결과 는 ( 예시 ) 처럼 괄호 안팎 공백 도 정리되어야 합니다 .`,
    expected: `결과는 (예시) 처럼 괄호 안팎 공백도 정리되어야 합니다.`,
  },
  {
    id: "generic-en-brackets-spacing",
    input: `This should keep ( text ) tidy before export .`,
    expected: `This should keep (text) tidy before export.`,
  },
  {
    id: "generic-ko-image-markdown",
    input: `문단 중간에 ![도표](https://example.com/chart.png) 같은 이미지 마크다운이 들어갈 수 있습니다.`,
    expected: `문단 중간에 도표 같은 이미지 마크다운이 들어갈 수 있습니다.`,
  },
  {
    id: "generic-en-source-heading-korean-label",
    input: `Keep this paragraph.

출처
https://example.com/a
https://example.com/b`,
    expected: `Keep this paragraph.`,
  },
  {
    id: "generic-en-inline-code",
    input: `Use \`normalizeText\` before exporting the final txt.`,
    expected: `Use normalizeText before exporting the final txt.`,
  },
  {
    id: "generic-en-source-label-lines",
    input: `Keep this answer.

Source A: https://example.com/a
Source B: https://example.com/b`,
    expected: `Keep this answer.`,
  },
  {
    id: "generic-ko-copy-line",
    input: `이 설명은 유지하고

Copied`,
    expected: `이 설명은 유지하고`,
  },
  {
    id: "generic-en-view-more",
    input: `This paragraph should remain.

View more`,
    expected: `This paragraph should remain.`,
  },
  {
    id: "generic-ko-leading-filler-line",
    input: `물론입니다.

핵심 문장만 남겨야 합니다.`,
    expected: `핵심 문장만 남겨야 합니다.`,
  },
  {
    id: "generic-ko-leading-filler-inline",
    input: `좋습니다. 핵심 문장만 남겨야 합니다.`,
    expected: `핵심 문장만 남겨야 합니다.`,
  },
  {
    id: "generic-ko-trailing-offer",
    input: `핵심 문장만 남겨야 합니다.

원하시면 더 짧게 다시 정리해드릴게요.`,
    expected: `핵심 문장만 남겨야 합니다.`,
  },
  {
    id: "generic-en-leading-filler-line",
    input: `Sure.

Here is a clean version:

Keep only the main answer.`,
    expected: `Keep only the main answer.`,
  },
  {
    id: "generic-en-leading-filler-inline",
    input: `Of course. Keep only the main answer.`,
    expected: `Keep only the main answer.`,
  },
  {
    id: "generic-en-trailing-offer",
    input: `Keep only the main answer.

Let me know if you'd like a shorter version.`,
    expected: `Keep only the main answer.`,
  },
  {
    id: "generic-ko-leading-meta-paragraph",
    input: `아래는 불필요한 표현을 제거하고 본문만 남긴 버전입니다.

실제로 필요한 내용만 남아야 합니다.`,
    expected: `실제로 필요한 내용만 남아야 합니다.`,
  },
  {
    id: "generic-ko-leading-meta-inline",
    input: `핵심만 정리하면 다음과 같습니다: 실제로 필요한 내용만 남아야 합니다.`,
    expected: `실제로 필요한 내용만 남아야 합니다.`,
  },
  {
    id: "generic-ko-trailing-meta-paragraph",
    input: `실제로 필요한 내용만 남아야 합니다.

이대로 복사해서 문서에 붙여넣으시면 됩니다.`,
    expected: `실제로 필요한 내용만 남아야 합니다.`,
  },
  {
    id: "generic-en-leading-meta-paragraph",
    input: `Here is a cleaned plain-text version.

Only the useful content should remain.`,
    expected: `Only the useful content should remain.`,
  },
  {
    id: "generic-en-leading-meta-inline",
    input: `Below is the cleaned result: Only the useful content should remain.`,
    expected: `Only the useful content should remain.`,
  },
  {
    id: "generic-en-trailing-meta-paragraph",
    input: `Only the useful content should remain.

You can now copy this directly into your document.`,
    expected: `Only the useful content should remain.`,
  },
  {
    id: "generic-ko-leading-meta-requested",
    input: `요청하신 내용을 문서에 붙여넣기 좋게 정리한 버전입니다.

실제로 필요한 내용만 남아야 합니다.`,
    expected: `실제로 필요한 내용만 남아야 합니다.`,
  },
  {
    id: "generic-ko-trailing-meta-document",
    input: `실제로 필요한 내용만 남아야 합니다.

이제 바로 문서에 붙여넣어 사용하실 수 있습니다.`,
    expected: `실제로 필요한 내용만 남아야 합니다.`,
  },
  {
    id: "generic-en-leading-meta-requested",
    input: `Here is the refined version ready for your document.

Only the useful content should remain.`,
    expected: `Only the useful content should remain.`,
  },
  {
    id: "generic-en-trailing-meta-ready",
    input: `Only the useful content should remain.

This is now ready to paste into your document.`,
    expected: `Only the useful content should remain.`,
  },
  {
    id: "generic-ko-inline-numbered-links",
    input: `아래 링크 묶음은 보통 필요 없습니다.

1. https://a.example
2. https://b.example`,
    expected: `아래 링크 묶음은 보통 필요 없습니다.`,
  },
  {
    id: "generic-en-long-wrap-with-colon",
    input: `Checklist:
remove sources
keep paragraphs
normalize spacing`,
    expected: `Checklist:

remove sources keep paragraphs normalize spacing`,
  },
  {
    id: "generic-ko-source-heading-only-korean",
    input: `핵심 문단은 남기고 제목만 제거해야 합니다.

참고`,
    expected: `핵심 문단은 남기고 제목만 제거해야 합니다.`,
  },
  {
    id: "generic-ko-source-labels",
    input: `정리된 결과가 좋아 보여도 아래 링크 묶음은 보통 필요 없습니다.

관련 링크:
Example: https://example.com/a
Example2: https://example.com/b`,
    expected: `정리된 결과가 좋아 보여도 아래 링크 묶음은 보통 필요 없습니다.`,
  },
  {
    id: "generic-en-image-markdown",
    input: `The output may include ![chart](https://example.com/chart.png) between paragraphs.`,
    expected: `The output may include chart between paragraphs.`,
  },
  {
    id: "generic-ko-emoji-inline",
    input: `핵심 내용만 남기고 ✨ 불필요한 장식은 제거해야 합니다 👍`,
    expected: `핵심 내용만 남기고 불필요한 장식은 제거해야 합니다`,
  },
  {
    id: "generic-en-emoji-inline",
    input: `Keep the answer clean ✅ and remove celebratory emoji 🎉`,
    expected: `Keep the answer clean and remove celebratory emoji`,
  },
  {
    id: "generic-ko-emoji-leading-filler",
    input: `물론입니다. 😊 핵심 문장만 남겨야 합니다.`,
    expected: `핵심 문장만 남겨야 합니다.`,
  },
  {
    id: "generic-ko-conversational-answer-block",
    input: `네, 완전히 있습니다! 사실 그게 한숲시티와 남사읍 일대 집값을 들썩이게 만드는 가장 핵심적인 미래 호재입니다.

현재 가장 유력하게 추진되고 있는 노선은 다음과 같습니다.

경강선 연장 (일명 '반도체 철도')

- 어떤 노선인가요? 현재 경기 광주역에서 끝나는 경강선을 밑으로 끌어내려 용인(처인구) ~ 이동읍 ~ 남사읍(한숲시티)까지 연결하는 사업입니다.
- 현재 상황: 용인시에서 이를 국가철도망 구축계획에 반영시키기 위해 사활을 걸고 있습니다.

결론적으로, 삼성이라는 확실한 뒷배경 덕분에 지하철이 들어올 가능성은 매우 높아졌지만, 그 혜택을 실제로 누리기까지는 꽤 긴 인내가 필요합니다.

경강선 연장 타당성 확인 및 용인시 추진 현황이 영상은 반도체 클러스터 조성을 명분으로 용인시가 경강선 연장을 어떻게 추진하고 있는지 그 배경과 진행 상황을 상세히 다루고 있어 이해하는 데 도움이 될 것입니다. http://googleusercontent.com/youtube_content/0`,
    expected: `그게 한숲시티와 남사읍 일대 집값을 들썩이게 만드는 가장 핵심적인 미래 호재입니다.

경강선 연장 (일명 '반도체 철도')

- 어떤 노선인가요? 현재 경기 광주역에서 끝나는 경강선을 밑으로 끌어내려 용인(처인구) ~ 이동읍 ~ 남사읍(한숲시티)까지 연결하는 사업입니다.
- 현재 상황: 용인시에서 이를 국가철도망 구축계획에 반영시키기 위해 사활을 걸고 있습니다.

삼성이라는 확실한 뒷배경 덕분에 지하철이 들어올 가능성은 매우 높아졌지만, 그 혜택을 실제로 누리기까지는 꽤 긴 인내가 필요합니다.`,
  },
  {
    id: "generic-ko-structured-intro-drop",
    input: `현재 가장 유력하게 추진되고 있는 노선은 다음과 같습니다.

경강선 연장

- 용인(처인구) ~ 이동읍 ~ 남사읍까지 연결하는 사업입니다.
- 산단 수요 증가로 추진 가능성이 높아졌습니다.`,
    expected: `경강선 연장

- 용인(처인구) ~ 이동읍 ~ 남사읍까지 연결하는 사업입니다.
- 산단 수요 증가로 추진 가능성이 높아졌습니다.`,
  },
  {
    id: "generic-ko-document-style-guide",
    input: `지금까지 나눈 모든 핵심 내용을 바탕으로, 언제든 복사해서 참고하실 수 있도록 최종 문서 형태로 깔끔하게 정리해 드립니다.

이 문서를 ComfyUI 작업 공간 옆에 띄워두고 체크리스트처럼 활용해 보세요!

AceStep 1.5 4B 완벽 사용 가이드: ComfyUI 최적화 및 프롬프트 작법서

본 문서는 LLM과 DiT 구조가 결합된 하이브리드 모델인 AceStep 1.5 4B의 특성을 극대화하여, 고품질의 한국어/다국어 음원을 생성하기 위한 검증된 워크플로우를 담고 있습니다.

1. 프롬프트 작성의 황금 공식

- 추천 프롬프트 구조:
> [오디오 품질] + [보컬 성향] + [장르/템포/분위기] + [악기 구성 및 편곡] + [엔딩 방식]

2. 가사 (Lyrics) 및 곡 구조 마크업

- 기본 구조 태그:
- [Intro]: 전주
- [Chorus]: 코러스/싸비

이제 이 가이드라인을 바탕으로 멋진 음악을 완성해 보세요! 좋은 결과물이 나오기를 응원합니다!`,
    expected: `AceStep 1.5 4B 완벽 사용 가이드: ComfyUI 최적화 및 프롬프트 작법서

1. 프롬프트 작성의 황금 공식

- 추천 프롬프트 구조:
[오디오 품질] + [보컬 성향] + [장르/템포/분위기] + [악기 구성 및 편곡] + [엔딩 방식]

2. 가사 (Lyrics) 및 곡 구조 마크업

- 기본 구조 태그:
- [Intro]: 전주
- [Chorus]: 코러스/싸비`,
  },
  {
    id: "generic-ko-app-vpn-answer",
    input: `아하! 제가 'Exclave'라는 단어에 꽂혀서 너무 거창하게 시스템 보안/격리 쪽으로 설명했네요.

말씀하신 것처럼 스마트폰의 다른 앱들은 내 원래 한국 IP를 그대로 쓰고, 딱 특정 앱 하나만 VPN을 타게 만드는 기능을 찾으시는 거군요!

안드로이드에서는 이 기능이 아주 잘 되어 있습니다. 업계에서는 이를 '스플릿 터널링(Split Tunneling)' 또는 '앱별 VPN (Per-App VPN)'이라고 부릅니다.

어떻게 쓰는지 바로 알려드릴게요.

1. 일반적인 VPN 앱의 스플릿 터널링 기능 쓰기

- 추천 앱: ProtonVPN
- 설정 방법:
1. VPN 앱 설정에 들어갑니다.
2. Split Tunneling 또는 앱별 연결 메뉴를 찾습니다.
3. 선택한 앱만 VPN 사용으로 바꿉니다.
4. 원하는 앱 하나만 체크합니다.

결론적으로, 복잡하게 가실 필요 없이 스플릿 터널링을 지원하는 VPN을 설치하셔서 이 앱만 VPN 적용으로 세팅하시는 게 가장 깔끔한 해결책입니다!`,
    expected: `안드로이드에서는 이 기능이 아주 잘 되어 있습니다. 업계에서는 이를 '스플릿 터널링(Split Tunneling)' 또는 '앱별 VPN (Per-App VPN)'이라고 부릅니다.

1. 일반적인 VPN 앱의 스플릿 터널링 기능 쓰기

- 추천 앱: ProtonVPN
- 설정 방법:
1. VPN 앱 설정에 들어갑니다.
2. Split Tunneling 또는 앱별 연결 메뉴를 찾습니다.
3. 선택한 앱만 VPN 사용으로 바꿉니다.
4. 원하는 앱 하나만 체크합니다.

복잡하게 가실 필요 없이 스플릿 터널링을 지원하는 VPN을 설치하셔서 이 앱만 VPN 적용으로 세팅하시는 게 가장 깔끔한 해결책입니다!`,
  },
];
