# 🧭 The Wanderer's Handbook — 방랑자의 안내서

> 이 블로그를 **운영하는 방법**을 담은 실용 문서.
> 세계관·디자인의 "왜"는 [WORLDBOOK.md](./WORLDBOOK.md)에, "어떻게"는 여기에 있다.

---

## 1. 이 블로그는 무엇으로 만들어졌나

| 항목 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | **Astro 6** | `.md` 파일이 곧 글이 되는 콘텐츠 중심 정적 사이트. 커스텀 디자인 자유도 최고 |
| 호스팅 | **GitHub Pages** (무료) | 저장소 `Liberiter/Liberiter.github.io` → https://liberiter.github.io |
| 배포 | **GitHub Actions** | `main`에 push하면 자동 빌드·배포 (`.github/workflows/deploy.yml`) |
| 콘텐츠 관리 | Astro Content Collections | frontmatter 스키마 검증 (`src/content.config.ts`) |
| 수식 | remark-math + KaTeX | `$...$`, `$$...$$` 문법 |
| 코드 하이라이팅 | Shiki | 라이트 `vitesse-light` / 다크 `everforest-dark` 자동 전환 — 배경은 v4 "필사 노트" 톤(`--code-bg`)으로 오버라이드 |
| 폰트 (셀프호스팅) | Cinzel(영문 디스플레이) · 고운바탕(한글 제목) · Pretendard(본문) · 나눔고딕코딩(코드, 한:영 2:1 정폭) | npm 패키지로 번들 — 외부 CDN 의존 없음 |
| RSS / 사이트맵 | @astrojs/rss, @astrojs/sitemap | `/rss.xml`, `/sitemap-index.xml` |

**히스토리 메모**: 이 프로젝트는 두 세계의 합병이다. 전작(`github-page/`, Astro 6 + 시각 연출)과
신작(콘텐츠 아키텍처 + 세계관 체계)을 합쳤고, 전작의 디자인 유산은
`docs/legacy-design-system.md`에 보존되어 있다 (V2 Midjourney 에셋 프롬프트 포함).
2026-07에 **v4 "채색 필사본" 리디자인** — 규칙은 WORLDBOOK §3, 화면 스펙은 `docs/mockups/`, 문구는 `docs/copy-deck.md`.

## 2. 컨셉 요약

**판타지 세계 "교차로"에 세워진 블로그.** 모든 길이 만나는 교차로에 방랑자(블로그 주인)가
정착해, 주제마다 건물(장소)을 세우고 기록을 남긴다.

- **12개 장소 = 카테고리** (기록관·탑·연구실·길드·도서관·정원·예배당·광장·집필실·작업실·거울·모닥불)
- **방랑자의 일지 = TIL** — 장소가 아닌 메타 공간, 짧은 메모도 당당하게
- **안개 규칙**: 글이 0편인 장소는 지도에서 안개에 싸여 있다가, 첫 글 발행 시 자동 개방
- **칭호**: 장소별 글 수(1/5/15/30편)에 따라 "견습 연금술사 → 현자의 돌의 주인" 자동 표시
- **연대기 = 시리즈/연재물** (집필실의 소설은 연재 필수)

용어 사전, 장소 정의, 색·타이포 규칙 전체는 → **WORLDBOOK.md**

## 3. 저장소 구조

```
blog/
├─ WORLDBOOK.md            ← 세계관·디자인 헌법 (바꿀 땐 여기부터)
├─ HANDBOOK.md             ← 이 문서 (운영 매뉴얼)
├─ README.md               ← 저장소 첫인사 (요약)
├─ assets/emblems.svg      ← 문장(紋章) 14종 SVG 스프라이트 원본
├─ docs/
│  ├─ copy-deck.md         ← v4 화면별 문구 사전 (마이크로카피의 원본)
│  ├─ mockups/*.html       ← v4 화면 스펙 목업 (home·record·archive 등)
│  └─ legacy-design-system.md  ← 전작 디자인 유산 + Midjourney 프롬프트
├─ .github/workflows/deploy.yml  ← 자동 배포
├─ public/favicon.svg
└─ src/
   ├─ content/
   │  ├─ records/{장소}/{슬러그}.md   ← 본편 글
   │  └─ journal/YYYY-MM-DD.md       ← TIL
   ├─ data/places.ts       ← 12장소 정의(색·lore·칭호)의 코드측 원본
   ├─ content.config.ts    ← frontmatter 스키마
   ├─ components/          ← Hero(시네마틱 히어로), PageBanner, FolioFrame,
   │                          AmbientParticles, RecordBibliography, PlaceCard·RecordCard 등
   ├─ layouts/Base.astro   ← 공통 레이아웃 (테마·폰트·문장 스프라이트)
   ├─ pages/               ← 라우트 (아래 URL 지도 참고)
   ├─ scripts/             ← 파티클, 스크롤 등장 애니메이션, 오너먼트 주입
   └─ styles/              ← global.css (디자인 시스템 v4 토큰), hero.css
```

**URL 지도**: `/`(교차로) · `/places/`(여정) · `/places/{장소}/` · `/records/`(서고) ·
`/records/{슬러그}/` · `/journal/` · `/chronicles/{시리즈}/` · `/tags/{태그}/` · `/rest/`(소개) · `/rss.xml`

## 4. 글 쓰는 법

### 4.1 기록 (본편)

`src/content/records/{장소슬러그}/{글슬러그}.md` 파일 생성:

```yaml
---
title: "Python 데코레이터, 제대로 이해하기"   # 검색 친화적으로 (세계관 용어 금지)
description: "클로저부터 functools.wraps까지"  # 필수 — 카드·메타에 사용
place: engineers-guild                        # 아래 슬러그 표 참고
date: 2026-07-10
tags: [python, decorator]                     # 소문자-케밥
draft: false                                  # true = 봉인된 기록 (빌드 제외)
# updated: 2026-08-01                         # 크게 수정했을 때
---

본문은 마크다운. 수식은 $E = mc^2$ 또는 $$...$$,
코드는 ```python 펜스, --- 는 ✦ 오너먼트 구분선이 된다.
```

**장소 슬러그**: `historians-archive`(역사) · `mathematicians-tower`(수학) ·
`alchemists-laboratory`(과학) · `engineers-guild`(IT/공학) · `wizards-library`(독서) ·
`sages-garden`(철학) · `chapel-of-grace`(신앙) · `the-agora`(시사) ·
`authors-den`(소설 연재) · `artists-atelier`(그림) · `oracles-mirror`(AI/미래) · `campfire`(일상)

주의할 규칙 두 가지:
- **글 슬러그(파일명)는 전체에서 유일**해야 한다 — URL이 `/records/{슬러그}/`로 장소와 무관해서,
  나중에 글의 장소를 옮겨도 링크가 안 깨진다.
- 폴더는 관리용일 뿐이다. frontmatter의 `place`가 진짜 소속.

### 4.2 연재물 (연대기)

frontmatter에 세 줄 추가 — **집필실(authors-den) 글은 필수**:

```yaml
series: ashen-chronicle      # 시리즈 슬러그
seriesTitle: 잿빛 연대기      # 표시 이름 (1화에만 있어도 됨)
seriesOrder: 3               # 화수
```

→ 글 상단에 연재 정보 박스, 하단에 이전/다음 화 내비게이션,
`/chronicles/ashen-chronicle/`에 목차 페이지가 자동 생성된다.

### 4.3 일지 (TIL)

`src/content/journal/2026-07-10.md` — 파일명이 곧 날짜:

```yaml
---
title: "오늘 배운 것"    # 선택 (없으면 날짜가 제목)
tags: [python]          # 선택
---
- 세 줄이어도 당당하게. 일지의 적은 완벽주의다.
```

### 4.4 발행

```bash
git add . && git commit -m "Add record: python decorators"   # 커밋 메시지는 영어
git push
```
push하면 GitHub Actions가 자동으로 빌드·배포한다 (약 1~2분).

## 5. 로컬 개발

```bash
npm install        # 최초 1회
npm run dev        # http://localhost:4321 (저장 시 실시간 반영)
npm run build      # 정적 빌드 (dist/) — 배포 전 검증용
npm run preview    # 빌드 결과물 로컬 확인
```

- 테마 강제: URL에 `?theme=dark` 또는 `?theme=light`
- 앵커: `/#realms`(홈 지도), `/places/#epilogue`(일지 에필로그)

## 6. 배포 설정 (최초 1회)

1. GitHub에 **`Liberiter.github.io`** 공개 저장소 생성
2. `git remote add origin https://github.com/Liberiter/Liberiter.github.io.git && git push -u origin main`
3. 저장소 **Settings → Pages → Source = "GitHub Actions"**

이후로는 push만 하면 끝.

## 7. 세계를 고치는 법

**철칙: 코드보다 WORLDBOOK.md를 먼저 고친다.**

- **장소 추가/삭제/이름 변경**: WORLDBOOK §2 표 → `src/data/places.ts`(정의) →
  `assets/emblems.svg`(문장 추가 — 48×48, stroke 2.5, 모노라인, `currentColor`) 순서로.
  지도·여정·안개·칭호는 `places.ts`만 고치면 전부 자동 반영된다.
- **색·폰트·장식 (디자인 시스템 v4 "채색 필사본")**: 규칙의 원본은 WORLDBOOK §3.
  구현은 `src/styles/global.css` 상단 토큰(라이트 "새벽의 양피지" / 다크 "칠흑의 숲") —
  화면 단위 스펙이 필요하면 `docs/mockups/`의 해당 HTML, 문구는 `docs/copy-deck.md`를 본다
- **히어로**: `src/components/Hero.astro`(금박 타이포 시네마틱) + `src/styles/hero.css`.
  서브페이지 상단은 `PageBanner`, 화면 가장자리 장식은 `FolioFrame`,
  배경 파티클은 `AmbientParticles`, 서고/태그 목록은 `RecordBibliography`가 담당
- **12라는 숫자는 구조**다 — 여정 서사, 6계열×2 색 체계, 지도 그리드가 전부 12 기준.
  깨야 할 때는 색 짝(Blue/Violet/Green/Gold/Earth/Fire × 2)을 함께 재설계할 것.

## 8. 로드맵 (남은 장)

- **제3장 문명**: Pagefind 검색("길잡이에게 묻기"), giscus 댓글("모닥불 곁 대화"),
  OG 이미지 자동 생성, 칭호 시스템 노출 확대
- **제4장 지도 제작**: Midjourney로 painterly 히어로/장소 일러스트 생성 —
  프롬프트 초안은 `docs/legacy-design-system.md` Part II에 이미 있다.
  생성 후 WebP 최적화 + 시차(parallax) 레이어로 교체
- 아이디어 창고: 방명록(여관의 방명록), 다크모드 배경 유성, 장소별 OG 문장 도장

## 9. 문서 지도

| 문서 | 역할 |
|---|---|
| `WORLDBOOK.md` | 세계관·용어·디자인 규칙의 유일한 진실 (왜) — 디자인 시스템 v4는 §3 |
| `HANDBOOK.md` | 운영 매뉴얼 — 글쓰기·배포·수정 절차 (어떻게) |
| `README.md` | 저장소 방문자용 요약 |
| `docs/copy-deck.md` | v4 화면별 문구 사전 |
| `docs/mockups/` | v4 화면 스펙 목업 (HTML) |
| `docs/legacy-design-system.md` | 전작 디자인 유산 + V2 Midjourney 로드맵 |

*길을 잃었다면 이 안내서로 돌아올 것. 안내서에 없는 길은 설정집에 있다.* ✦
