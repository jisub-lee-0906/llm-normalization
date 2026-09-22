# Markdown To TXT

마크다운이나 웹에서 복사한 텍스트를 붙여넣으면 citation, 링크 꼬리, 마크다운 잔재, 불필요한 줄바꿈을 자동 정리해 보기 좋은 plain text로 바꿔주는 개인용 MVP입니다.

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
npm run quality:report
```

`npm run quality:report`는 잠긴 개발 의존성의 `tsx`로 fixture 기준 통과율을 source별, 패턴별로 요약하고 `output/quality/quality-report.md`에 리포트를 저장합니다.

## 배포

- 정적 자산과 메타는 앱 라우터 기준으로 구성되어 있습니다.
- 포함 항목: `icon.svg`, `apple-icon.svg`, `opengraph-image`, `manifest`, `robots`
- 일반적인 Next.js 배포 환경에서 바로 동작합니다.

권장 배포:

```bash
npm run build
npm run start
```

## 정규화 범위

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
