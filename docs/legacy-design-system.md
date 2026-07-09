# The Wanderer's Crossroads — Design System

> 블로그의 디자인 정체성을 담은 문서.
> **Part I**은 V1 현재 상태의 완전한 기록(정체성 확립),
> **Part II**는 V2로 나아갈 Midjourney 에셋 가이드.

---

## 목차

### Part I — V1: The Established Identity
1. [브랜드 정체성](#1-브랜드-정체성)
2. [타이포그래피 시스템](#2-타이포그래피-시스템)
3. [컬러 시스템](#3-컬러-시스템)
4. [Hero 디자인 — 두 테마의 다른 세계](#4-hero-디자인--두-테마의-다른-세계)
5. [12개 영역 (Realms) 정의](#5-12개-영역-realms-정의)
6. [컴포넌트 시스템](#6-컴포넌트-시스템)
7. [재질감 & 마이크로 디테일](#7-재질감--마이크로-디테일)
8. [레이아웃 & 여정 구조](#8-레이아웃--여정-구조)
9. [애니메이션 & 인터랙션](#9-애니메이션--인터랙션)
10. [SVG 아이콘 시스템](#10-svg-아이콘-시스템)

### Part II — V2: Midjourney Asset Roadmap
11. [V2 비전](#11-v2-비전)
12. [생성할 에셋 목록](#12-생성할-에셋-목록)
13. [스타일 가이드 (일관성)](#13-스타일-가이드-일관성)
14. [Hero 장면 프롬프트](#14-hero-장면-프롬프트)
15. [12개 영역 일러스트 프롬프트](#15-12개-영역-일러스트-프롬프트)
16. [기타 에셋 프롬프트](#16-기타-에셋-프롬프트)
17. [기술적 스펙 & 구현 노트](#17-기술적-스펙--구현-노트)

---

# Part I — V1: The Established Identity

## 1. 브랜드 정체성

### 이름
**The Wanderer's Crossroads** (방랑자의 교차로)

- 정관사 *The*: 고전 판타지 제목의 무게감 (*The Hobbit*, *The Witcher*)
- 단수 *Wanderer's*: 저자(블로거) 본인이 방랑자, 이곳은 "그"의 교차로
- *Crossroads*: 서로 다른 관심사(수학·과학·신앙·일상)가 한 지점에서 만남

### 컨셉
한 방랑자가 여러 갈래 길이 만나는 교차로에 머물며 각 영역을 탐구하는 블로그.
방문자는 **동료 여행자(Traveler)** 로서 이 세계로 초대됨.

### 톤 & 무드
- **정통 판타지 × 모던 세련됨**: 고딕 판타지의 무게감 + 현대 편집 디자인의 절제
- **레퍼런스 감성**: Hollow Knight(실루엣+제한 팔레트), Studio Ghibli(painterly 대기감), Illuminated Manuscript(장식+본문 대비)
- **피해야 할 것**: 게임 UI 느낌, 유아틱 컬러, 과도한 장식

### 철학
- **절제된 장식으로 세련됨을 얻는다** (Hollow Knight 교훈)
- **여백 신뢰** — 요소를 쌓지 않음
- **값(value) 위계로 깊이 표현** — 색보다 명도차로 공간감
- **한국어 × 영문 타이포의 조화**

---

## 2. 타이포그래피 시스템

### 폰트 스택
```css
--font-heading: "Cinzel", "Noto Serif KR", Georgia, serif;
--font-body:    "Noto Serif KR", Georgia, "Times New Roman", serif;
--font-mono:    "Fira Code", "Consolas", monospace;
```

- **Cinzel** — 영문 display 제목. 고대 로마 비문에서 파생된 serif 대문자 폰트. 판타지/클래식 무게감.
- **Noto Serif KR** — 한국어 본문. Cinzel의 serif 흐름과 자연스럽게 어울림.
- **Fira Code** — 개발/코드 블록용 (추후 블로그 글에서 사용).

### 위계 (Hierarchy)

| 용도 | Size | Letter-spacing | 특이사항 |
|------|------|----------------|----------|
| hero title | 2.8rem (3.5rem ≥768px) | `-0.012em` | text-wrap: balance |
| hero welcome (소제목 대문자) | 0.95rem | `0.22em` | uppercase, gold |
| h1 | 2rem (2.5rem ≥768px) | `-0.005em` | editorial tight |
| h2 | 1.5rem | `0.02em` | Cinzel |
| realm-name | 1.55rem | 기본 | Cinzel |
| body text | 1rem | 기본 | Noto Serif KR |
| post-title | 1.15rem | 기본 | Cinzel |
| labels (Realm 01, UPPERCASE) | 0.7~0.75rem | `0.2~0.25em` | uppercase, gold-dim |

### 마이크로 디테일
body 전역에 적용:
```css
font-feature-settings: "kern", "liga";  /* 커닝 + 표준 리가처 */
text-rendering: optimizeLegibility;      /* 서브픽셀 품질 ↑ */
-webkit-font-smoothing: antialiased;
word-break: keep-all;                    /* 한국어 어절 단위 줄바꿈 */
overflow-wrap: break-word;
```

display 제목에는 `"dlig"` (discretionary ligatures) 추가.
`<time>` 요소는 `tabular-nums`, `"tnum"` — 날짜 세로 정렬 깔끔함.
긴 문장 영역(`.realm-lore`, `.realms-intro-sub`, `.hero-sub`)에 `text-wrap: pretty` — 고아 단어 방지.

---

## 3. 컬러 시스템

### 3.1 Dark Mode (Night Forest)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--bg-primary` | `#1a2e28` | 페이지 배경 (deep forest green) |
| `--bg-secondary` | `#223830` | 헤더/드롭다운 배경 |
| `--bg-card` | `#2a4038` | 카드 기본 배경 |
| `--bg-card-hover` | `#324a40` | 카드 호버 배경 |
| `--accent-gold` | `#d4aa30` | 메인 액센트 (황금) |
| `--accent-gold-dim` | `#b8932a` | 보조 액센트 (어두운 황금) |
| `--accent-warm` | `#e8956a` | 경고/따뜻함 (거의 안 씀) |
| `--text-primary` | `#e2ddd0` | 본문 (크림) |
| `--text-secondary` | `#9bb0a4` | 보조 텍스트 (sage) |
| `--text-heading` | `#f0ebe0` | 제목 (밝은 크림) |
| `--border-ornate` | `#d4aa3044` | 금빛 장식 테두리 (alpha) |
| `--border-subtle` | `#3a5548` | 기본 구분선 |
| `--shadow-glow` | `rgba(212,170,48,0.15)` | 황금 그림자 |

**분위기**: 밤의 숲속 은신처 — 깊은 전나무빛 녹청 위에 황금빛 등불/룬이 빛남.

### 3.2 Light Mode (Dawn / Parchment)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--bg-primary` | `#f0ebe0` | 페이지 배경 (parchment cream) |
| `--bg-secondary` | `#e6dfd0` | 헤더/드롭다운 배경 |
| `--bg-card` | `#faf6ed` | 카드 기본 배경 |
| `--bg-card-hover` | `#f2eee3` | 카드 호버 배경 |
| `--accent-gold` | `#8b6914` | 메인 액센트 (어두운 황금/세피아) |
| `--accent-gold-dim` | `#a67c1a` | 보조 액센트 |
| `--accent-warm` | `#c46240` | 따뜻한 강조 |
| `--text-primary` | `#2a3a30` | 본문 (deep forest) |
| `--text-secondary` | `#5a6e60` | 보조 텍스트 |
| `--text-heading` | `#1a2a20` | 제목 (거의 검정) |
| `--border-ornate` | `#8b691444` | 금빛 테두리 |
| `--border-subtle` | `#c8c0ae` | 기본 구분선 |

**분위기**: 새벽의 양피지 — 크림빛 종이 위에 고대 황금으로 쓴 듯한 엄숙함.

### 3.3 공통 원칙
- **황금(gold)이 양 테마의 hinge** — 다크에서는 빛처럼, 라이트에서는 잉크처럼.
- **테마 전환**: `<html data-theme="dark|light">` 속성 기반, `transition: 0.5s ease` 로 부드럽게 cross-fade.
- **FOUC 방지**: BaseHead.astro에 inline blocking script로 첫 페인트 전 테마 확정.

---

## 3.4 Realm Accent 팔레트 서사

각 영역(realm)에는 고유의 `accent` 색이 있어. 카드 호버 글로우, 아이콘 뒤 방사형 빛, 카테고리 헤더 톤에 쓰여. 단순한 카테고리 구분이 아니라 **각 영역의 심상(lore) + 블로그 주제(판타지 컨테이너 / 현대 콘텐츠) 양쪽을 함께 담는 장치**야.

### 3.4.1 설계 원칙
색 하나를 고를 때 세 가지를 모두 통과해야 해:
1. **다크 포레스트 배경(#1a2e28) 위에서 가라앉지 않는 중간 채도** — 너무 어두우면 배경에 먹히고, 너무 채도 높으면 판타지 톤이 깨짐.
2. **메인 악센트 골드(#d4aa30)와 충돌하지 않는 톤** — 카테고리 색이 UI 악센트를 덮으면 위계가 무너짐.
3. **lore 심상과 블로그 콘텐츠 주제 모두에 충실** — 예: 공학자 길드의 물리적 공간은 톱니·길드(판타지)지만 실제 쓸 글은 IT/전자공학(현대)이라, 이 둘이 모두 떠오르는 톤이 되어야 함.

### 3.4.2 6 계열 × 2 영역 구조
12개 색은 **6개 계열 × 각 2 영역**으로 대칭 배치돼. 차가운 계열(Cool) 6 : 따뜻한 계열(Warm) 6 균형.

| 계열 | 영역 A | 영역 B | 온도 |
|------|--------|--------|------|
| **Blue** (강철/별빛) | 수학자의 탑 `#7a93c4` | 공학자 길드 `#5e7d95` | Cool |
| **Violet** (신비/마법) | 마법사의 도서관 `#6a3f6a` | 예언자의 거울 `#8a7dc9` | Cool |
| **Green** (자연/연금) | 연금술사의 연구실 `#5fa886` | 현자의 정원 `#7da55c` | Cool |
| **Gold** (빛/햇살) | 은혜의 예배당 `#dcc278` | 광장 `#c9a55e` | Warm |
| **Earth** (흙/양피지) | 역사가의 기록관 `#b08458` | 장인의 공방 `#b87855` | Warm |
| **Fire** (불꽃/열정) | 이야기꾼의 전당 `#c75f55` | 모닥불 `#e89255` | Warm |

### 3.4.3 각 realm 색감 서사

#### Blue 계열 — 차가운 사유
- **수학자의 탑 `#7a93c4`** — 먼지 낀 밤하늘 블루. "밤마다 별의 궤도를 헤아리는" lore에서 출발. 순수 cold blue 대신 **보라가 살짝 섞인 dusty blue**로 가서, 숫자의 차가움보다 "만물의 패턴 속 시"라는 낭만을 담음.
- **공학자 길드 `#5e7d95`** — 강철 블루-그레이. 톱니·회로·블루프린트의 색. 현대 IT/전자공학 SaaS 블루(#3b82f6)로 가면 판타지 톤이 깨져서, **그레이가 섞인 steel blue**로 중화. 수학자 탑이 *보라 섞인 꿈꾸는 블루*라면 공학자 길드는 *그레이 섞인 단단한 블루* — 같은 계열이지만 감정 온도가 다름.

#### Violet 계열 — 신비와 예언
- **마법사의 도서관 `#6a3f6a`** — 딥 플럼. "스스로 빛나는 양피지"의 어두운 서재 그림자. 마법=보라는 클리셰지만 채도를 낮추고 어둡게 밀어붙여 **밝은 퍼플이 아닌 저채도 암자색**으로.
- **예언자의 거울 `#8a7dc9`** — 미스틱 바이올렛. AI/미래를 전형적 네온 시안으로 가면 전체 톤이 깨지니까, **수정구슬·안개 신전의 라벤더 보라**로. 도서관의 어두운 플럼 대비 **옅고 반짝이는 쪽**으로 분리.

#### Green 계열 — 자연과 성장
- **연금술사의 연구실 `#5fa886`** — 녹청(verdigris). 플라스크의 에메랄드, 구리 증류기에 핀 녹. "청록 → 블루로 흐르는 초록"으로 실험적·이질적 느낌.
- **현자의 정원 `#7da55c`** — 세이지 그린. 이끼·허브·오래된 나뭇잎. 연금술사의 초록과 겹치지 않도록 **yellow가 섞인 올리브/세이지** 방향으로 — "초록 → 옐로로 흐르는 초록"이라 식물성·고요함.

#### Gold 계열 — 빛과 햇살
- **은혜의 예배당 `#dcc278`** — 페일 샴페인 골드. "스테인드글라스 사이로 쏟아지는 빛". 블로그 메인 악센트(#d4aa30)와 겹치지 않게 채도를 낮춰 **성스러운 부드러운 금빛**으로.
- **광장 `#c9a55e`** — 햇살 골드. 고대 그리스 아고라의 대리석에 내리쬐는 햇빛, 노점 천막의 황금빛. 예배당이 *고요한 페일 골드*라면 광장은 *활기찬 구리 섞인 골드* — 같은 빛이지만 예배당은 은은하게 빛나고 광장은 따뜻하게 타오름.

#### Earth 계열 — 양피지와 흙
- **역사가의 기록관 `#b08458`** — 세피아 양피지 갈색. "먼지 쌓인 고문서"의 실내 톤. 여정의 초입이라 눈에 튀기보다 관조적·묵직하게.
- **장인의 공방 `#b87855`** — 구운 시에나/점토. 물감·캔버스·테라코타. 이야기꾼의 전당(Fire) 위층이라는 공간적 연결 때문에 의도적으로 **붉은 기가 도는 흙색**으로 묶음 — 이야기가 시각으로 확장되는 연장선을 색으로 표현.

#### Fire 계열 — 불꽃과 열정
- **이야기꾼의 전당 `#c75f55`** — 테라코타 레드. 극장 커튼의 붉은색 + 모험 서사의 피·열정. 순수 빨강은 톤을 해치니 오렌지 섞인 **따뜻한 테라코타**로.
- **모닥불 `#e89255`** — 엠버 오렌지. 불꽃 + 일상의 온기. 12개 중 **채도가 제일 높은** 색 — 여정의 마지막, "거창하지 않은 일상"이라는 역설적 정체성이 있어 오히려 친근하게 튀어야 맞음.

### 3.4.4 여정 서사 × 팔레트 리듬
색은 랜딩 페이지에서 영역이 등장하는 순서대로 **감정 리듬**을 만들어:

```
01 역사가 (Earth 갈색) — 조용한 시작
02 수학자 (Blue 밤하늘) — 차가운 사유로 진입
03 연금술사 (Green 녹청) — 실험적 호기심
04 공학자 (Blue 강철) — 단단한 구조로 수렴
05 도서관 (Violet 플럼) — 어두운 몰입
06 현자 (Green 세이지) — 고요한 자연
07 예배당 (Gold 페일) — 성스러운 빛
08 광장 (Gold 햇살) — 세상과 다시 만남
09 이야기꾼 (Fire 테라코타) — 감정 고조
10 공방 (Earth 시에나) — 창작으로 연장
11 거울 (Violet 라벤더) — 미래로 시선
12 모닥불 (Fire 엠버) — 따뜻한 귀환
```

→ 전반부(01-06): **차분 → 몰입 → 고요**
→ 후반부(07-12): **각성 → 감정 고조 → 쉼**

### 3.4.5 구현 위치
- `src/lib/categories.ts` — 각 Category 객체의 `accent` 필드가 단일 진실 원천(SSOT).
- 런타임에서는 CSS 커스텀 프로퍼티 `--realm-accent`로 주입 (realm 섹션, category 카드, post 헤더 등).
- 호버 글로우(`box-shadow`), 아이콘 뒤 방사형 광(`::before`), 카테고리 헤더 구분선에서 참조.

---

## 4. Hero 디자인 — 두 테마의 다른 세계

Hero는 단순한 다크/라이트 변주가 아니라 **오브제 자체가 다른 장면**.

### 4.1 Dark — "The Hidden Grove" (숲속 은신처)

**구성 요소**:
- 깊은 밤하늘 그라데이션 (`#02040a → #070d18 → #0e1a1c → #1a2e28`)
- **중앙 상단의 달** (viewBox 중심 `800, 320`, halo r=280, core r=65)
  - Halo: 옅은 크림→금빛 radial gradient (투명하게 퍼짐)
  - Body: 흰색→아이보리→옅은 금빛 3단 radial (영롱한 펄 느낌)
  - 내부 shimmer glow 레이어
  - `moon-breathe` 애니메이션으로 8초마다 미묘한 brightness pulse
- 먼 능선 (blur 처리된 어두운 실루엣)
- 안개 띠 2겹
- 낮은 언덕 실루엣
- **왼쪽 중간의 모닥불 빛 점** (x=480, y=620)
  - 넓은 halo (warm orange radial gradient)
  - 중심 코어 + 작은 실루엣 힌트 (텐트/돌)
  - `fire-glow` 애니메이션으로 3초마다 halo 맥동
- Canvas 파티클: **별 50개 + 반딧불이 15마리** (모바일 조정)

**무드**: 동료 여행자가 멀리서 피운 불을 보며 숲속에 혼자 있는 느낌. 고요하고 신비로움.

### 4.2 Light — "The Road Begins" (새벽, 모험의 시작)

**구성 요소**:
- 새벽 하늘 그라데이션 (`#b8bfce → #d4bcbe → #e4c8a8 → #ecd8ba → #f0ebe0`)
- **중앙 상단의 태양** (같은 좌표 `800, 320`)
  - Halo만 (디스크 생략) + 작은 soft core
  - `sun-breathe` 애니메이션으로 6초마다 scale pulse
- 먼 산맥 (blur, 옅은 베이지)
- 안개 띠
- 중간 산맥 + rim light 하이라이트 (태양 반사)
- 가까운 언덕 실루엣
- **오른쪽 중간의 이정표** (x=1120, y=620 — 모닥불과 좌우 미러)
  - 나무 기둥 + 3개 화살표 표지판 (풍화된 갈색)
  - 받침 돌들 + 그림자
- Canvas 파티클: **황금 먼지 25개 + sparkle**

**무드**: 새벽녘 여행을 떠나려는 자의 들뜸. 이정표가 "어느 길로 가볼까?" 묻는 듯.

### 4.3 두 장면의 공통 규칙

| 요소 | 값 |
|------|-----|
| viewBox | `0 0 1600 900` (16:9) |
| preserveAspectRatio | `xMidYMid slice` (화면 비율에 상관없이 중앙 고정) |
| 천체 위치 | 중앙 (x=800, y=320) — 달/태양 동일 |
| 포컬 오브제 | **좌우 미러**: 모닥불(x=480) ↔ 이정표(x=1120) |
| 하단 fade | SVG `<linearGradient>` 위로 `hero-portal::after` CSS 그라데이션 이중 레이어 — body bg와 seam 없이 연결 |
| 포탈 아치 | **없음** (V1에서 제거) — 이정표가 교차로 상징 |

**미러 구도 의미**: 두 테마가 같은 교차로의 다른 순간. 밤에는 캠프에서 쉬고, 새벽에는 이정표 앞에서 떠날 길을 고르는 여행자.

---

## 5. 12개 영역 (Realms) 정의

### 여정 서사 순서
방랑자가 교차로에 도착해 차례로 둘러보는 흐름. **배열 순서 = 서사 순서 = 지리적 경로**.

```
도착 & 토대       → 안으로, 깊이        → 밖으로, 세상과        → 앞을 보고, 쉬다
01. 역사가의 기록관   05. 마법사의 도서관    08. 광장               11. 예언자의 거울
02. 수학자의 탑      06. 현자의 정원        09. 이야기꾼의 전당     12. 모닥불
03. 연금술사의 연구실 07. 은혜의 예배당      10. 장인의 공방
04. 공학자 길드
```

### 지리적 경로 (lore 안의 공간 연결)
```
교차로 초입 [기록관]
  → 북쪽, 구름 뚫고 솟은 [수학자의 탑]
    → 탑 지하 [연금술사의 연구실]
      → 교차로 한복판 [공학자 길드]
        → 길드 너머 [마법사의 도서관]
          → 도서관 뒤편 [현자의 정원]
            → 정원 가장 깊숙한 곳 [은혜의 예배당]
              → 종소리 따라 다시 중앙 [광장]
                → 광장 바로 옆 [이야기꾼의 전당]
                  → 전당 위층 계단 [장인의 공방]
                    → 공방을 나와 동쪽 [예언자의 거울]
                      → 하루 끝, 한구석 [모닥불]
```

### 전체 영역 표

| # | 한국어명 | 영문명 | 주제 | 아이콘 | Accent 컬러 | 의미 |
|---|---------|--------|------|--------|-------------|------|
| 01 | 역사가의 기록관 | Historian's Archive | 역사 | 두루마리 (parchment with curled ends + text) | `#b08458` 세피아 | 교차로의 뿌리, 과거가 미래에 건네는 이야기 |
| 02 | 수학자의 탑 | Mathematician's Tower | 수학 | 뾰족지붕 탑 + 꼭대기 별 | `#7a93c4` 스틸 블루 | 만물의 가장 오래된 언어, 패턴 읽기 |
| 03 | 연금술사의 연구실 | Alchemist's Laboratory | 과학 | Erlenmeyer 플라스크 + 기포 | `#5fa886` 비리디안 | 자연이 감춘 법칙을 푸는 실험 |
| 04 | 공학자 길드 | Engineer's Guild | 공학 | 8각 톱니바퀴 + 중앙 홀 | `#5e7d95` 스틸 블루-그레이 | 코드와 회로로 세상을 다시 설계 |
| 05 | 마법사의 도서관 | Wizard's Library | 독서 | 펼친 책 + 텍스트 라인 | `#6a3f6a` 딥 플럼 | 책이 여는 무한한 세계 |
| 06 | 현자의 정원 | Sage's Garden | 사유 | 잎사귀 + 잎맥(위쪽 바깥 방향) | `#7da55c` 세이지 그린 | 철학·삶의 통찰·성장 |
| 07 | 은혜의 예배당 | Chapel of Grace | 묵상 | 십자가 + 후광(halo) | `#dcc278` 웜 골드 | 말씀 묵상, 신앙의 여정 |
| 08 | 광장 | The Agora | 시사 | 그리스식 기둥 | `#c9a55e` 햇살 골드 | 오늘의 세상을 함께 이야기하는 포럼 |
| 09 | 이야기꾼의 전당 | Storyteller's Hall | 이야기 | 원형극장 평면도 + 중앙 별 | `#c75f55` 디프 레드 | SF·판타지·로맨스의 전당 |
| 10 | 장인의 공방 | Artisan's Atelier | 시각 창작 | 페인트 브러시 (handle+ferrule+bristle) | `#b87855` 테라코타 | Midjourney·디자인·시각 작품 |
| 11 | 예언자의 거울 | Oracle's Mirror | 미래 | 눈 + 방사형 광채 | `#8a7dc9` 바이올렛 | AI·기술·다가올 세상 |
| 12 | 모닥불 | Camp Fire | 일상 | 불꽃 + 교차 장작 | `#e89255` 앰버 오렌지 | 하루 끝의 작고 따뜻한 일상 |

### 각 영역의 lore (완결판은 `src/lib/categories.ts` 참고)
모든 lore는 "공간적 도입부" + "활동 묘사" + "격언/통찰" 3단 구조로 리듬 통일됨.

---

## 6. 컴포넌트 시스템

### 6.1 OrnamentDivider (`src/components/OrnamentDivider.astro`)
판타지 챕터 구분선. 수평 라인 + 중앙 8각 별 + 외곽 원.

- `variant="default"` — 420px max, margin 2.5rem
- `variant="compact"` — 240px max, margin 1.25rem 0 0 (섹션 간 좁은 여백)
- `currentColor` 기반으로 부모에서 color 제어
- 각 인스턴스마다 unique id (defs `<linearGradient>` 충돌 방지)

**사용처**: 랜딩 페이지 섹션 구분, Footer, Category 헤더 아래, Post 상세 페이지 헤더 아래.

### 6.2 RuneRing (`src/components/RuneRing.astro`)
Realm 아이콘 주변을 도는 룬 원. 12개 realm 섹션 각각에 배치.

- 외곽 원 (90초 시계방향 회전)
- 안쪽 점선 원 (70초 반시계방향)
- 4방 cardinal point + 룬 문자 8개 (외곽)
- 내부 작은 4점 별 장식
- `prefers-reduced-motion`에서 정지

### 6.3 PostCard (`src/components/PostCard.astro`)
블로그 글 카드.

- 좌측 금빛 3px 보더 (호버 시 4px로 굵어짐)
- 날짜(`<time>`, tabular-nums) + 카테고리 뱃지(RealmIcon + 한국어명)
- 제목 + 설명
- 호버: `translateX(4px)` + box-shadow 글로우 + 빛 sweep (`::before`로 사선 이동)
- 하단에 parchment grain (`::after`)

### 6.4 Category Card / Quick Travel (`.category-card` in index.astro)
홈의 Quick Travel 그리드 셀.

- 4 코너 장식 span (호버 시 커짐: 14→18px)
- card-glow span (하단 radial gradient, 호버 시 opacity 0 → 1)
- 아이콘 + 이름 + 부주제
- 아이콘 뒤 방사형 글로우 `::before` (아이콘 위치와 정확히 일치, realm accent 색)
- 호버: `translateY(-5px)` + realm accent 색의 box-shadow 글로우
- 아이콘: `scale(1.1) rotate(-3deg)` + 뒤 글로우 pulse

### 6.5 RealmIcon (`src/components/RealmIcon.astro`)
→ [섹션 10 참고](#10-svg-아이콘-시스템)

### 6.6 ThemeToggle (`src/components/ThemeToggle.astro`)
달 🌙 / 해 ☀ 아이콘 토글 버튼. localStorage 저장 + `theme-changed` CustomEvent 발행 (Canvas 파티클 재생성 트리거).

### 6.7 Header (`src/components/Header.astro`)
- 좌측: 사이트 타이틀 (Cinzel, 금빛)
- 우측: Home / Scrolls / Realms▾ (12개 드롭다운) / ThemeToggle
- 모바일: 햄버거 메뉴 토글
- Sticky, `background: var(--bg-primary)`, 하단에 금빛 테두리

### 6.8 Footer (`src/components/Footer.astro`)
- OrnamentDivider (default)
- Copyright 텍스트 (Cinzel, 작고 부드러운 회색)

---

## 7. 재질감 & 마이크로 디테일

### 7.1 Body Grain (전역 양피지 노이즈)
```css
body::before {
  position: fixed; inset: 0; z-index: 9999; pointer-events: none;
  background-image: url("data:image/svg+xml... feTurbulence ...");
  background-size: 180px 180px;
  opacity: 0.18;
  mix-blend-mode: overlay;
}
[data-theme="light"] body::before {
  opacity: 0.14;
  mix-blend-mode: multiply;
}
```
- SVG `feTurbulence` fractalNoise 기반
- Dark: overlay 블렌딩 → 밝은 점으로 텍스처
- Light: multiply 블렌딩 → 어두운 점으로 양피지 느낌
- 뷰포트 전체에 `position: fixed`로 고정 → 스크롤해도 grain 위치 불변

### 7.2 Card Parchment Grain
```css
.post-card::after,
.category-card::after {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background-image: url(... feTurbulence + feColorMatrix(세피아 톤) ...);
  background-size: 140px 140px;
  opacity: 0.22; mix-blend-mode: overlay;
}
[data-theme="light"] .post-card::after,
[data-theme="light"] .category-card::after {
  opacity: 0.14; mix-blend-mode: multiply;
}
```
- 카드에 **세피아 톤 grain** 추가 (R=0.5 G=0.4 B=0.25)
- 양피지가 배경 위에 얹힌 느낌
- `isolation: isolate`로 stacking context 제한 (z-index -1 탈출 방지)

### 7.3 Text Wrapping (한국어 최적화)
```css
body {
  word-break: keep-all;       /* 어절 중간에서 끊김 방지 */
  overflow-wrap: break-word;  /* 너무 긴 어절은 안전하게 */
}
.hero-title { text-wrap: balance; }    /* 제목 줄 분배 균형 */
.hero-sub,
.realm-lore,
.realms-intro-sub { text-wrap: pretty; }  /* 고아 단어 방지 */
```

---

## 8. 레이아웃 & 여정 구조

### 8.1 Container
```css
.container {
  max-width: 1400px;            /* full-wide */
  padding: 0 clamp(1.5rem, 5vw, 6rem);
  margin: 0 auto;
}
```
- 사이드 패딩 `clamp()` — 모바일(1.5rem) → 데스크톱(6rem) 부드러운 스케일링
- `.container-narrow` (960px) — 본문 가독성용

### 8.2 랜딩 페이지 구조
```
[Hero 100vh — 풀스크린]
 ↓
[Realms Intro — "열두 갈래 길이 이곳에서 만납니다"]
 ↓
[12 Realm 섹션 × 각 ~270px — compact, 좌우 교차 배치]
  ├ 홀수 섹션: 아이콘 왼쪽, 콘텐츠 오른쪽 정렬 (text-align: right)
  └ 짝수 섹션: 반전 (row-reverse)
  ├ 각 섹션에 --realm-accent CSS 변수 적용
  └ 섹션 간: OrnamentDivider (compact)
 ↓
[OrnamentDivider (default)]
 ↓
[Quick Travel — 12개 카드 grid]
 ↓
[OrnamentDivider (default)]
 ↓
[Recent Scrolls — 최근 글 6개]
```

### 8.3 Realm 섹션 치수 (압축 레이아웃)
| 요소 | 값 |
|------|-----|
| 섹션 padding | `2rem 0` (모바일 `1.75rem 0`) |
| 내부 gap | `2.25rem` |
| realm-visual | 120×120px (모바일 100×100) |
| realm-icon font-size | `3rem` (모바일 `2.6rem`) |
| realm-name | `1.55rem` (모바일 `1.3rem`) |
| realm-lore | `0.9rem`, line-height `1.8`, max-width 540px |

### 8.4 반응형 중단점
- `<768px`: 모바일 (햄버거, 단일 컬럼, 패럴랙스 비활성)
- `768px~1199px`: 태블릿/소형 데스크톱 (2열 post-grid)
- `≥1200px`: 풀 데스크톱 (3열 post-grid)

---

## 9. 애니메이션 & 인터랙션

### 9.1 Hero 전용
| 요소 | 애니메이션 | 주기 |
|------|-----------|------|
| `.moon-core`, `.sun-core` | breathe (opacity/brightness) | 6~8s |
| `.fire-glow` | scale 1 → 1.08 + opacity 0.65 → 0.9 | 3s |
| hero-welcome/title/sub | fade-up (opacity 0 → 1, translateY 15 → 0) | 0.3s, 0.6s, 0.9s 지연 |
| scroll-arrow | bounce (translateY 0 → 6px) | 2s |

### 9.2 Canvas 파티클 (`src/scripts/particles.ts`)
- **Dark**: 별 50개 (정적 트윈클) + 반딧불이 15마리 (사인파 이동) + 랜덤 sparkle (확률 0.008)
- **Light**: 골드 먼지 25개 (상승 + 약간 좌우) + sparkle (확률 0.005)
- **최적화**: IntersectionObserver로 뷰포트 밖이면 정지, visibilitychange도 고려
- 테마 변경 시 `theme-changed` CustomEvent로 파티클 재생성

### 9.3 Scroll Animations (`src/scripts/scroll-animations.ts`)
- `data-animate="fade-up|fade-in|fade-left|fade-right|scale-in"` 기반
- IntersectionObserver로 뷰포트 진입 시 `.is-visible` 클래스 추가
- `[data-stagger]` 컨테이너 내부 자식들은 순차 delay
- `prefers-reduced-motion` 시 즉시 visible

### 9.4 View Transitions
- Astro `<ClientRouter />` 사용
- `astro:page-load`에서 모든 리스너 재바인딩
- `astro:after-swap`에서 테마 재설정 (`setTheme(getTheme())`)

### 9.5 RuneRing 회전
- 외곽 원: 90초 시계방향 한 바퀴
- 안쪽 원: 70초 반시계방향
- 룬 그룹: 역회전으로 항상 정자세 유지
- `transform-box: view-box` + `transform-origin: 100px 100px` (viewBox 좌표 고정)

### 9.6 Category Card 호버 (Quick Travel)
```
기본 상태 ──── 호버 진입 ────────────── 호버 유지
border: subtle                → realm-accent 혼합 gold-dim 70/30
transform: 0                  → translateY(-5px)
box-shadow: 없음              → 0 10px 28px black + 0 0 30px realm-accent
card-corner size: 14px        → 18px
card-corner opacity: 0.55     → 1
card-glow opacity: 0          → 1
cat-icon transform: 0         → scale(1.1) rotate(-3deg)
cat-icon ::before opacity: 0  → 1 (아이콘 뒤 방사형 realm-accent 글로우)

transition: cubic-bezier(.2,.8,.2,1) 0.4s
```

### 9.7 Post Card 호버
- `translateX(4px)`
- 좌측 금빛 보더 3px → 4px
- box-shadow: 검정 + 금빛 2겹
- `::before` 빛 sweep 좌 → 우 이동 (0.7s)

### 9.8 Realm Enter 버튼
- `translateY(-1px)`
- 내부 `::before` sweep (transparent → gold → transparent) 좌 → 우
- 화살표 `translateX(4px)`

---

## 10. SVG 아이콘 시스템

### 10.1 규격
- **viewBox**: `0 0 24 24`
- **Stroke**: `1.5` 기본, 일부 디테일 `0.4~1`
- **Color**: `currentColor` (부모에서 `color: var(--realm-accent)`)
- **Fill**: 기본 `none`, 강조 디테일만 `fill="currentColor" stroke="none"`
- **Linecap/join**: `round` (핸드 드로잉 느낌)

### 10.2 컴포넌트
`src/components/RealmIcon.astro` — `slug` prop으로 12개 중 해당 SVG `<g>` 렌더.

### 10.3 사용 위치 (7곳)
| 위치 | 크기 (font-size 기반) |
|------|---------------------|
| 홈 realm 섹션 | 3rem (≈48px) |
| Quick Travel 카드 | 2rem (≈32px) |
| PostCard 카테고리 뱃지 | 0.8rem (≈13px) |
| scrolls 필터 버튼 | 0.85rem (≈14px) |
| Header Realms 드롭다운 | 0.85rem (≈14px) |
| Category 페이지 헤더 | 3rem (≈48px) |
| Post 상세 페이지 뱃지 | 0.9rem (≈15px) |

### 10.4 아이콘 상세 (디자인 원칙 메모)

| Realm | 아이콘 구성 | 핵심 디테일 |
|-------|-----------|-----------|
| 역사가의 기록관 | 수직 parchment 사각형 + 상하에 curled ends + 텍스트 3줄 | 원기둥 느낌 방지 위해 Bezier curl로 "말려 올라간 paper" |
| 수학자의 탑 | 뾰족 지붕 탑 + 아치창 + 꼭대기 다이아몬드 별 | 꼭대기 별이 "관측" 암시 |
| 연금술사의 연구실 | 좁은 목 + 삼각 body + 표면 dashed + 기포 3개 | Erlenmeyer 실루엣 뚜렷하게 |
| 공학자 길드 | 8개 직사각형 이빨 (45° 간격 rotate) + 몸체 원 + 중앙 홀 | 이빨을 line 아닌 rect로 → 태양이 아닌 톱니 |
| 마법사의 도서관 | 책 외곽 + V-shape 페이지 + 중앙 spine + 텍스트 라인 | 펼쳐진 책의 3D 볼륨 |
| 현자의 정원 | 티어드롭 잎 + 중앙 vein + 측면 veins(위쪽 바깥 방향, 가장자리까지) | 잎 방향 맞춤: 뾰족한 쪽이 위 |
| 은혜의 예배당 | 십자가 + 은은한 후광 원 + end caps | 묘비 느낌 피하고 신성한 분위기 |
| 광장 | capital + shaft 3줄 flute + base + 바닥 연단 | 그리스 기둥 실루엣 |
| 이야기꾼의 전당 | 2겹 동심 반원(관객석) + 바닥선 + 중앙 무대 위 5각 별 | 평면도 뷰 — 하늘에서 내려다본 원형극장 |
| 장인의 공방 | 사선 나무 손잡이 + 짧은 금속 ferrule(+grooves) + teardrop 털뭉치(+hair lines) + 물감 방울 | 3파트의 폭 차이로 "누가 봐도 붓" |
| 예언자의 거울 | 눈 outline + 홍채 원 + 동공 + 6방 광채 | "보는 눈"의 신비 |
| 모닥불 | 곡선 불꽃 외곽 + 내부 highlight(fill) + 장작 수평 + 교차 | 따뜻함과 움직임 |

---

# Part II — V2: Midjourney Asset Roadmap

## 11. V2 비전

V1은 순수 SVG/CSS로 만들어진 "벡터 그래픽 중심" 디자인이야. V2의 목표는 **Midjourney로 생성한 painterly 일러스트**로 깊이와 질감을 추가하는 거.

### V1 vs V2의 분업
- **V1 SVG**: 기능적 UI 요소 (아이콘, 장식, 구조) — 그대로 유지
- **V2 MJ 이미지**: 감성적 배경 & 분위기 (hero, realm 헤더, OG 이미지) — 추가

### V2가 성공하려면
- V1이 구축한 **팔레트/폰트/타이포그래피** 위에 얹어야 함
- **일관된 아트 스타일** (12개 realm 이미지가 한 세트처럼 보여야)
- **raster 이미지의 용량** 관리 (WebP, AVIF, 적절한 해상도)

---

## 12. 생성할 에셋 목록

### 🔥 최우선 (V2 필수)
1. **Hero Dark scene** — Hidden Grove painterly 배경
2. **Hero Light scene** — Road Begins painterly 배경
3. **12개 Realm 헤더 일러스트** — 각 카테고리 페이지 상단 풀와이드 이미지
4. **OG 이미지 (소셜 공유용)** — 1200×630 블로그 메인 카드

### ⭐ 우선도 중간
5. **About 페이지 일러스트** — 저자(방랑자) 분위기 이미지
6. **각 Realm 서브일러스트** — 블로그 글 상세 페이지 상단(heroImage 필드) 옵션 이미지
7. **404/에러 페이지 이미지**

### ✨ 여유 있을 때
8. **모바일 홈 스크린 아이콘** (PWA용)
9. **Favicon 고급화** — 현재 기본 favicon.svg, 더 정교한 버전
10. **Blog post 용 반복 사용 가능한 이미지 뱅크** (각 realm당 3~5장씩)

---

## 13. 스타일 가이드 (일관성)

**중요**: 12개 realm 이미지가 한 세트로 보이려면 아래를 **모든 프롬프트 말미에 고정 postfix** 로 붙여.

### 13.1 공통 Style Postfix (아트 스타일)
```
painterly digital illustration, soft brushwork, atmospheric depth, 
storybook fantasy, mood lighting, limited palette, 
editorial key art style, not cartoon, refined, --style raw --v 6 --ar 16:9
```

### 13.2 아트 레퍼런스 아티스트/작품 (스타일 anchor)
프롬프트에 섞어 쓰면 좋은 레퍼런스:
- *Studio Ghibli background art* — painterly 자연
- *Hollow Knight concept art* — 절제된 팔레트, 실루엣
- *Ori and the Blind Forest* — 발광 + 어둠 대비
- *Hayao Miyazaki* — 부드러운 일본 회화
- *Kilian Eng* — 레트로 퓨처 + 판타지
- *Paul Lasaine* (Studio Ghibli art director) — 대기 풍경
- *illuminated manuscript margin art* — 고전 장식

### 13.3 피해야 할 키워드
프롬프트에 **부정 프롬프트** 또는 빼야 할 것:
- `cartoon`, `chibi`, `anime` (Miyazaki는 OK, 일반 anime는 NO)
- `cute mascot`, `kawaii`
- `vibrant`, `oversaturated`, `neon`
- `realistic photo`, `photorealistic`
- `3D render`, `CGI` (painterly가 목표)
- `low quality`, `blurry`, `noisy`

Midjourney v6에서는 `--no [키워드]` 로 명시 가능.

### 13.4 팔레트 고정
프롬프트에 팔레트 언급 필수:

**다크 모드 이미지**:
```
color palette: deep forest green (#1a2e28), midnight navy (#02040a),
warm amber firelight accent (#e89255), golden rune glow (#d4aa30),
pale moonlight (#f0e8c8)
```

**라이트 모드 이미지**:
```
color palette: parchment cream (#f0ebe0), dusty rose-gold dawn (#d4bcbe),
soft lavender sky (#b8bfce), warm terracotta accent, 
aged gold (#8b6914), muted earth tones
```

### 13.5 Seed 관리
일관성 중요한 12 realm 시리즈는:
1. 첫 이미지 만족스러우면 **Seed 번호 기록** (Info 버튼 or `/info`)
2. 나머지 11개에 **같은 seed** 사용 (`--seed 12345`)
3. Chaos 낮게 (`--chaos 0~10`), Stylize 낮게 (`--stylize 50~100`)
4. Aspect ratio 고정 (`--ar 16:9` 권장)

---

## 14. Hero 장면 프롬프트

### 14.1 Dark — Hidden Grove

```
A tranquil nighttime forest clearing, viewed through gaps in ancient trees,
large luminous moon rising in deep indigo sky, distant campfire glow 
flickering warm orange through misty trees on the left side, wooden signpost
silhouette barely visible in middle distance, fireflies and stars drifting,
deep forest green and midnight navy atmosphere with single warm accent,
painterly digital illustration, Studio Ghibli background art meets 
Hollow Knight concept art, soft brushwork, atmospheric depth with multiple 
haze layers, mood lighting, refined editorial key art, cinematic composition,
--style raw --v 6 --ar 16:9 --seed [고정]
--no cartoon, cute, oversaturated, realistic photo, 3D render
```

**의도**: 정확히 V1 scene의 painterly 버전. 달/모닥불/이정표 실루엣은 그대로 유지하되 배경에 나무/안개의 깊이.

### 14.2 Light — Road Begins

```
Dawn over gentle rolling hills, soft pastel sky with lavender, dusty rose,
and golden horizon, warm sun glowing behind distant mountain silhouettes,
weathered wooden signpost with multiple arrow planks on right middle ground,
faint path diverging into mist, morning haze and golden rim light on mountains,
parchment cream and rose-gold palette, one small warm terracotta accent,
painterly digital illustration, Ghibli dawn background art, soft brushwork,
editorial key art style, cinematic wide composition, hopeful adventurous mood,
--style raw --v 6 --ar 16:9 --seed [Dark와 같은 seed]
--no cartoon, vibrant, neon, 3D, photo
```

**의도**: Dark의 미러. 태양/이정표 위치 유지.

### 14.3 구현 방법 (Astro)
생성 후 `public/images/hero-dark.webp` / `hero-light.webp` 저장. HeroPortal.astro에서 SVG 장면을 background-image로 교체:

```css
[data-theme="dark"] .hero-scene {
  background-image: url("/images/hero-dark.webp");
  background-size: cover;
  background-position: center;
}
```

또는 기존 SVG 실루엣을 **레이어로 유지**하고 MJ 이미지는 가장 뒤에 배경으로 깔 수 있음 (SVG의 정교한 위치 제어 + MJ의 깊이 결합).

---

## 15. 12개 영역 일러스트 프롬프트

각 프롬프트 앞에 **공통 prefix**:
```
Fantasy realm illustration showing [장소 설명], 
```
뒤에 **공통 postfix**:
```
painterly style, Studio Ghibli meets Hollow Knight, atmospheric mood lighting,
limited palette with one accent, refined editorial illustration, 
--style raw --v 6 --ar 16:9 --seed [고정]
--no cartoon, cute, vibrant, 3D, photo
```

### 15.1 역사가의 기록관 (#b08458 세피아)
```
Ancient stone archive building at the entrance of a crossroads, dusty
tomes and faded maps on tall wooden shelves, warm candlelight spilling 
through tall windows, aged parchment color palette with sepia browns 
and soft golds, mote of dust floating in sunbeams, one scholar silhouette 
at a reading desk in distance.
```

### 15.2 수학자의 탑 (#7a93c4 스틸 블루)
```
Tall solitary tower piercing through clouds at night, observatory dome 
with telescope pointing at star-filled sky, stone construction with 
glowing windows, steel blue and deep indigo palette with golden rune 
accents, constellations visible above tower.
```

### 15.3 연금술사의 연구실 (#5fa886 비리디안)
```
Underground alchemist laboratory filled with bubbling flasks and glowing
vials, smoke and vapor swirling, shelves of mysterious ingredients,
verdant green glow from potions with warm candle accents, scrolls and 
notes pinned to stone walls.
```

### 15.4 공학자 길드 (#5e7d95 스틸 블루-그레이)
```
Vast clockwork guild hall filled with massive turning gears and polished 
steel machinery, riveted iron pipes and slate-grey plating, workbenches 
with glowing blueprints and softly humming circuit-runes, cool blueprint-blue
forge light in background, industrial fantasy with steel blue and slate-grey 
palette with subtle golden rune accents etched on metal.
```

### 15.5 마법사의 도서관 (#6a3f6a 딥 플럼)
```
Infinite library with impossibly tall bookshelves disappearing into misty 
darkness above, levitating books and glowing parchment pages, deep plum 
and aged leather palette with golden book-spine accents, a floating ladder, 
soft purple twilight atmosphere.
```

### 15.6 현자의 정원 (#7da55c 세이지 그린)
```
Quiet contemplative walled garden with moss-covered stones, ancient twisted
tree with a seat beneath, herbs and flowers, time seems to move slowly, 
soft sage green palette with golden hour sunlight, a stone path meandering,
peaceful philosophical mood.
```

### 15.7 은혜의 예배당 (#dcc278 웜 골드)
```
Small stone chapel with stained-glass windows casting rays of warm light 
inside, single cross at the altar, wooden pews, golden dust motes in beams 
of colored light, warm honey-gold and cream palette, sacred peaceful 
atmosphere, reverence and quiet.
```

### 15.8 광장 (#c9a55e 햇살 골드)
```
Ancient Greek agora with marble columns and wide stone plaza, merchants 
and scholars in robes gathered in small groups, warm sunlit gold and honey 
palette with white marble accents, golden afternoon light streaming between
columns, sense of lively discourse, classical architecture.
```

### 15.9 이야기꾼의 전당 (#c75f55 디프 레드)
```
Ancient amphitheater with curved stone seating rising in rows around a 
central stage, storyteller silhouette center stage with arms raised, audience
in shadow, deep crimson drape accents, warm theatrical lighting, dusk sky 
behind, dramatic and enchanting atmosphere.
```

### 15.10 장인의 공방 (#b87855 테라코타)
```
Artist's attic workshop with canvas on easel, scattered paintbrushes and 
palette, warm afternoon sun through dormer window, terracotta and burnt 
sienna earthy palette with canvas whites, painted masterpiece in progress 
showing fantasy landscape, bohemian creative clutter.
```

### 15.11 예언자의 거울 (#8a7dc9 바이올렛)
```
Misty oracle's temple with a large ornate mirror at center reflecting 
future visions — a landscape not of this place, floating runes and 
constellations, deep violet and soft silver palette with glowing cyan
accents, hooded oracle silhouette in shadow, ethereal prophetic atmosphere.
```

### 15.12 모닥불 (#e89255 앰버 오렌지)
```
Small campfire in a traveler's clearing at dusk, two figures seated on 
rocks sharing simple food, warm amber and orange glow illuminating their
faces, starry purple-blue sky above, distant soft mountain silhouettes,
intimate peaceful end-of-day mood, rough bread and a kettle by the fire.
```

### 15.13 생성 순서 권장
1. **역사가의 기록관**을 가장 먼저 만들고 **seed 확정**
2. 같은 seed로 **수학자의 탑** (비슷한 분위기의 차가운 밤)
3. 순서대로 12개 진행
4. 어색한 게 있으면 seed 유지하고 프롬프트 단어만 조정

---

## 16. 기타 에셋 프롬프트

### 16.1 OG 이미지 (소셜 공유용)
```
Cinematic wide panorama of a mystical crossroads at twilight, ancient 
wooden signpost with multiple arrow planks pointing in different directions,
moon and rising sun both visible in gradient sky (hybrid of night and dawn),
distant silhouettes of tower, library, chapel, campfire glow, 
"The Wanderer's Crossroads" mood, editorial key art painterly style,
--ar 1200:630 --style raw --v 6
```
저장: `public/images/og-default.png` (Astro site config에서 참조 중)

### 16.2 About 페이지 (저자 = 방랑자)
```
Silhouette of a cloaked figure standing at a crossroads holding a lantern,
viewed from behind, gazing at infinite paths stretching into misty horizon,
warm golden light from lantern, deep forest green and cream parchment 
palette, introspective contemplative mood, painterly, --ar 3:4
```

### 16.3 404 페이지
```
Lost traveler's journal page floating in a misty forest void, blank pages 
fluttering, warm lantern light but no one around, deep indigo and sepia 
palette, melancholic but not sad, painterly, "you've wandered off the path" 
mood, --ar 16:9
```

### 16.4 Favicon (고급 버전)
현재 `public/favicon.svg` 기본. MJ로 만든다면:
```
Single iconic ornate medieval crossroads signpost, centered, minimal 
detail for small display, gold on dark parchment, heraldic emblem style,
--ar 1:1 --style raw --v 6
```
→ 32x32, 16x16 파비콘 변환 필요 (크롭 후 favicon.io 등으로 변환)

---

## 17. 기술적 스펙 & 구현 노트

### 17.1 이미지 포맷
| 용도 | 포맷 | 품질 |
|------|------|------|
| Hero 배경 | **WebP** (fallback: JPG) | 80~85 |
| Realm 헤더 | **WebP** | 80 |
| OG 이미지 | **PNG** (소셜 미디어 호환성) | - |
| Favicon | **SVG** 또는 **ICO** | - |
| Blog post heroImage | **WebP** | 75~80 |

### 17.2 해상도 & AR
| 용도 | 권장 해상도 | Aspect Ratio |
|------|-------------|-------------|
| Hero 배경 | 2400×1350 (2x) | 16:9 |
| Realm 헤더 | 1600×900 | 16:9 |
| OG 이미지 | 1200×630 | ~1.91:1 |
| About 일러스트 | 900×1200 | 3:4 |
| Post heroImage | 1600×900 | 16:9 |

### 17.3 파일 위치
```
public/
├─ images/
│  ├─ hero-dark.webp
│  ├─ hero-light.webp
│  ├─ og-default.png
│  ├─ about.webp
│  ├─ 404.webp
│  └─ realms/
│     ├─ historians-archive.webp
│     ├─ mathematicians-tower.webp
│     ├─ alchemists-laboratory.webp
│     ├─ engineers-guild.webp
│     ├─ wizards-library.webp
│     ├─ sages-garden.webp
│     ├─ chapel-of-grace.webp
│     ├─ the-agora.webp
│     ├─ storytellers-hall.webp
│     ├─ artisans-atelier.webp
│     ├─ oracles-mirror.webp
│     └─ camp-fire.webp
```

### 17.4 Astro Image 최적화
Astro의 `<Image>` 컴포넌트 사용하면 자동 최적화:
```astro
---
import { Image } from "astro:assets";
import heroDark from "../../public/images/hero-dark.webp";
---
<Image src={heroDark} alt="Hidden Grove" widths={[800, 1600, 2400]}
       sizes="100vw" format="webp" quality={85} />
```

### 17.5 구현 우선순위 (단계별 적용)
1. **Phase A**: OG 이미지 먼저 (소셜 공유 노출 증가)
2. **Phase B**: 12개 Realm 헤더 (category 페이지에 `heroImage` 필드 활용)
3. **Phase C**: Hero 배경 (V1 SVG 장면 뒤에 레이어로 깔기)
4. **Phase D**: About 페이지 + 404 + Favicon 고급화

각 단계 커밋 분리해서 되돌리기 쉽게.

### 17.6 접근성
- 모든 이미지에 의미 있는 `alt` 텍스트 (한국어)
- 장식용 이미지는 `alt=""` + `aria-hidden="true"`
- 배경 이미지는 CSS `background-image` 사용 (접근성 트리에서 제외)

### 17.7 용량 가이드
- Hero 배경: **< 300KB** per 이미지 (압축 후)
- Realm 헤더: **< 200KB**
- OG 이미지: **< 500KB** (소셜은 큰 이미지 허용)
- 합계: `public/images` 폴더 **< 5MB** 유지 목표

### 17.8 라이트/다크 전환 전략
Realm 헤더 이미지는 **한 세트만 생성** (테마 중립적 palette 선택):
- 전체적으로 중간 톤 이미지
- CSS mix-blend-mode나 opacity로 양 테마에 적응

Hero는 **두 세트 필수** (완전히 다른 장면이므로).

### 17.9 백업 전략
Midjourney 히스토리 유실 대비:
- 생성한 이미지 원본 별도 저장 (Google Drive, iCloud 등)
- 사용한 seed + 프롬프트를 `docs/midjourney-log.md` (추가 생성)에 기록

---

## 부록 A: 체크리스트 (V1 → V2 이행 시)

- [ ] Midjourney 계정 + 사용법 숙련 (기본 프롬프트, seed, --ar 이해)
- [ ] `docs/midjourney-log.md` 생성해 각 이미지의 seed/prompt 기록
- [ ] OG 이미지 1장 생성 + 적용 → 트위터 카드 테스트
- [ ] Realm 중 하나(기록관 권장) 먼저 만들어 **스타일 기준점** 확정
- [ ] Seed 확정 후 나머지 11개 일관된 스타일로 생성
- [ ] WebP 변환 + 용량 최적화 (Squoosh, TinyPNG 등)
- [ ] `public/images/` 폴더 구조 대로 배치
- [ ] Category page에 `heroImage` prop 추가 + 스타일 정의
- [ ] Hero 배경에 MJ 이미지 레이어 추가 (기존 SVG 요소 유지)
- [ ] 라이트/다크 모두에서 렌더링 확인
- [ ] Lighthouse 성능 점수 회귀 없음 확인 (LCP, CLS)
- [ ] 모바일에서 이미지 로딩 테스트

## 부록 B: 참고 키워드 모음

**분위기/무드**:
painterly, cinematic, atmospheric, moody, dreamlike, etherealmystical, intimate, contemplative, twilight, dawn, dusk, misty, haunted,
reverent, ancient, timeworn, weathered, aged

**조명**:
warm light, cool moonlight, golden hour, candlelight, lantern glow,
rim lighting, chiaroscuro, soft diffused, volumetric light, god rays

**구도**:
wide composition, low angle, high angle, silhouette, layered depth,
negative space, leading lines, framed view, symmetrical, asymmetrical balance

**스타일 수식어**:
Studio Ghibli, Hayao Miyazaki, Hollow Knight concept art, Ori and the Blind Forest,
Paul Lasaine, Kilian Eng, John Howe, Alan Lee (Tolkien 일러스트레이터),
illuminated manuscript, pre-Raphaelite painting, art nouveau border

**피하기**:
--no cartoon, chibi, anime, oversaturated, neon, 3D render, CGI,
photorealistic, stock photo, low quality, blurry, generic fantasy

---

## 마무리

V1은 **코드로 만들 수 있는 최선의 정체성**을 완성했어. V2는 Midjourney로 **그 위에 감성의 레이어**를 더하는 작업.

V1 디자인 시스템을 지키기만 하면 (팔레트/폰트/여정 구조) V2 이미지들은 자연스럽게 정체성 안에 녹아들어.

가장 중요한 건: **한 번에 12개 다 만들려 하지 말고**, 1~2개 만들어서 만족스러운 스타일 정착 → Seed 고정 → 나머지 일관되게 → WebP 최적화 → 적용 순서로 차근차근.

V2 여정에 행운을 — 🍀
