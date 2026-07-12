---
name: release-check
description: 발행(커밋·push) 전 최종 점검 — 빌드·frontmatter·세계관 규칙·렌더 확인. 사용자가 "발행", "배포", "올려줘"를 요청하거나 새 글/변경을 push하기 직전에 사용.
---

# 발행 전 점검

1. `npm run build` 통과 (astro build + pagefind — frontmatter 스키마 위반은 여기서 잡힌다).
2. 새/변경된 글의 frontmatter 점검:
   - `description` 있음, `place` 유효, 태그 소문자-케밥
   - 슬러그 전역 유일 (`src/content/records/**/*.md`)
   - series 글이면 `seriesOrder` 있음, 화수 중복 없음
   - `draft` 상태가 의도와 일치 (true = 빌드 제외)
3. `lore-auditor` 서브에이전트 실행 — title/description/slug/tags의 세계관 용어, "여관 주인" 표현, 본문 판타지화 여부 감사.
4. 수식·박스 글이면 `dist/records/{slug}/index.html`에서 KaTeX·`:::theorem` 박스가 실제 렌더됐는지 grep으로 확인. mermaid가 있는 글이면 `.mermaid-figure` 마크업이 생성됐는지 확인하고, 가능하면 프리뷰 스크린샷으로 실제 렌더를 본다 (문법 오류는 원본 소스 폴백으로 노출됨).
5. 새 글의 OG 이미지가 빌드됐는지 확인 — `dist/og/records/{slug}.png` 존재 여부 (일지는 `dist/og/journal/`).
6. 커밋 메시지는 영어. push 후 `gh run list --limit 1`로 Actions 성공 확인 (약 1~2분).
