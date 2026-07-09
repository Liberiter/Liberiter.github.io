# The Wanderer's Crossroads ✦

판타지 세계관 블로그 — 모든 길이 만나는 교차로. https://liberiter.github.io

- 세계관·디자인 규칙(왜): **[WORLDBOOK.md](./WORLDBOOK.md)** — 유일한 진실의 원천. 구조를 바꿀 때는 설정집부터.
- 운영 매뉴얼(어떻게): **[HANDBOOK.md](./HANDBOOK.md)** — 글쓰기·배포·수정 절차 전부.

## 개발

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 에 정적 빌드
```

## 글쓰기

**기록 (본편)** — `src/content/records/{장소}/{슬러그}.md`

```yaml
---
title: "제목"
description: "한 줄 요약 (필수 — 메타/카드에 사용)"
place: engineers-guild   # WORLDBOOK §2.1의 슬러그
date: 2026-07-09
tags: [python]
draft: false             # true = 봉인된 기록 (빌드 제외)
# 연재물(집필실은 필수):
# series: ashen-chronicle
# seriesTitle: 잿빛 연대기
# seriesOrder: 1
---
```

- 파일을 두는 폴더는 관리용일 뿐, URL은 `/records/{슬러그}/` — 슬러그는 전역에서 유일해야 한다.
- 기록이 1편 이상인 장소는 지도에서 자동으로 안개가 걷힌다.

**일지 (TIL)** — `src/content/journal/YYYY-MM-DD.md`, 프론트매터는 `title`, `tags`만 (둘 다 선택).

## 배포

GitHub에 `Liberiter/Liberiter.github.io` 저장소를 만들고 `main`에 push →
`.github/workflows/deploy.yml`이 자동 배포한다.
(최초 1회: 저장소 Settings → Pages → Source를 **GitHub Actions**로 설정)
