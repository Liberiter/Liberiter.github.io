---
name: design-work
description: 블로그 디자인·UI·기능 변경 작업의 절차와 확정 정책. 색/타이포/레이아웃/애니메이션/카피 수정, 새 컴포넌트·페이지 추가 등 화면에 보이는 변경 전에 반드시 로드.
---

# 디자인·기능 변경 절차

## 순서 (철칙: 코드보다 WORLDBOOK 먼저)

1. `WORLDBOOK.md` §3(디자인 시스템 v4)의 해당 절을 읽는다. 규칙 자체가 바뀌는 변경이면 WORLDBOOK부터 고친다.
2. 화면 단위 스펙은 `docs/mockups/`의 해당 HTML, UI 문구는 `docs/copy-deck.md` — 문구를 바꾸면 copy-deck을 반드시 동기화한다.
3. 구현: 색·간격·타이포는 `src/styles/global.css` 상단 토큰 우선. 장소 관련은 `src/data/places.ts`가 코드측 원본 (WORLDBOOK §2와 일치 유지).
4. 담당 컴포넌트: 히어로 `Hero.astro`+`hero.css` · 서브페이지 배너 `PageBanner` · 화면 가장자리 `FolioFrame` · 파티클 `AmbientParticles` · 목록 `RecordBibliography`.

## 확정 정책 (재론하지 말 것)

- 정통 하이 판타지 — 레트로/픽셀 금지. 비리디안 색 애정.
- 라이트 = 여명(라벤더→장미→앰버) / 다크 = 밤하늘(파랑→청록→숲→황금올리브).
- 세계관 용어는 화면 UI에만 — `<title>`·meta·OG·aria-label·URL은 평범하게 (WORLDBOOK §1.2 절대 규칙).
- 방랑자는 여관의 주인이 아니라 오래 머무는 손님 — 카피에서 "여관 주인" 금지.
- **12는 구조다** — 여정 서사·6계열×2 문장색·지도 그리드가 전부 12 기준. 깨려면 색 짝을 함께 재설계.
- 모바일(2026-07-12 QA 확정): 뷰포트는 `dvh` 금지·`svh` 기준. 폴리오 프레임은 visualViewport(`--vvh`) 추적. 안개(mist) 흐름·카드 등장 애니메이션은 데스크톱(fine pointer, >768px) 전용. 파티클은 모바일에서 히어로 한정. 화면 높이 <850px면 히어로에 헤더만큼 패딩.

## QA

- 라이트/다크 **둘 다** 스크린샷으로 확인 (`?theme=dark|light` 강제). headless Chrome 패턴:
  ```
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
    --window-size=1600,900 --hide-scrollbars --virtual-time-budget=6000 \
    --screenshot=<스크래치패드>/shot.png "http://localhost:4321/?theme=dark"
  ```
  모바일 확인은 `--window-size=390,844`.
- 큰 시각 결정은 **A|B 전환 컨트롤이 있는 목업**으로 만들어 직접 비교하게 한다 (사용자가 선호하는 확정 방식). 사용자가 판단을 위임하면 프로 디자이너로서 결정하고 근거를 설명한다.
- 마지막에 `npm run build` 통과 확인.
