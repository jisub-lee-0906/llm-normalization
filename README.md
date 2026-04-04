# AI 답변 정리기

AI 출력물을 붙여넣으면 citation, 링크 꼬리, 마크다운 잔재, 불필요한 줄바꿈을 자동 정리해 plain text로 바꿔주는 개인용 MVP입니다.

## 범위

- 포함: 붙여넣기, 즉시 정규화, 복사, TXT 다운로드, 초기화
- 제외: 로그인, 저장, 히스토리, 데이터베이스, 서버 API, 옵션 패널
- 처리 방식: 브라우저 내부에서만 정규화하며 서버에 입력 텍스트를 저장하지 않습니다

## 스택

- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Vitest + Testing Library

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 검증

```bash
npm run lint
npm run test
npm run build
```

## 정규화 규칙

현재 정규화 파이프라인은 아래 순서로 동작합니다.

1. 입력 공백과 줄바꿈 정리
2. citation marker 제거
3. markdown 장식 제거
4. UI 잔재 제거
5. 문단 줄바꿈 복원
6. 리스트 표기 통일
7. trailing links 제거
8. 최종 whitespace 정리

지원 품질 최적화 대상은 한국어와 영어입니다.
