---
name: import-record
description: 외부에서 작성한 순수 .md 원고(특히 learning-harness-fable 학습 챕터)를 블로그 기록으로 변환한다. inbox/에 원고가 들어왔거나 사용자가 원고를 "가져와줘/변환해줘/블로그 글로 만들어줘"라고 할 때 사용.
---

# 외부 원고 → 블로그 기록 변환

## 1. 입력

- 인자로 파일/디렉터리 경로를 받으면 그것을 처리한다. 없으면 `inbox/`를 스캔해 `.md` 전부(README 제외)를 대상으로 삼는다.
- **inbox 디렉터리가 원고의 종류를 알린다**: `inbox/learning/{코스슬러그}/`(학습 챕터 — 폴더명이 series 슬러그의 근거), `inbox/essay/`(단발 에세이), `inbox/fiction/{시리즈슬러그}/`(소설 연재 — 폴더명과 import-hint의 series를 교차 검증, 불일치 시 보고). 분류 밖 경로에 놓인 원고는 내용으로 형식을 판별하되 판단 근거를 보고한다.
- learning-harness-fable(`D:\Coding\learning-harness-fable`)에서 직접 가져올 때는 `courses/<slug>/public/`의 **공개 사본을 우선** 사용한다. `chapters/` 원본은 하네스 내부 참조(LO-MAP, shared_context 등)를 포함하므로, public이 없을 때만 쓰고 아래 제거 규칙을 적용한다.

## 2. 원고 형식 판별

**learning-harness 챕터**의 특징: YAML frontmatter 없음 · `# Chapter N: 제목` H1 · `> **난이도**: ⭐⭐ | **예상 학습 시간**: …` 메타 blockquote · 고정 H2 구조(워밍업/학습 목표/…/추가 학습 자원) · 파일 끝 `<!-- LO-MAP: … -->` 주석 · mermaid 코드펜스 · 파일명 `Ch{NN}_{제목}.md`.

그 외는 일반 원고 — frontmatter 생성과 최소 변환만 한다.

**import-hint 주석**: essay-harness-fable(`D:\Coding\essay-harness-fable`)·fiction-harness-fable(`D:\Coding\fiction-harness-fable`) 산출물은 원고 **1행**에 다음 형식의 힌트를 싣는다:

```
<!-- import-hint: title="…" | description="…" | place=슬러그 | tags=a,b,c | series=… | seriesTitle=… | seriesOrder=N | seriesStatus=completed -->
```

힌트가 있으면 그 값을 frontmatter의 **1차 근거**로 쓰고(스키마 검증은 그대로 수행 — place 슬러그 유효성, authors-den의 series 필수 등), 주석은 본문에서 **제거**한다. 값이 스키마 위반이면 맹종하지 말고 교정 후 판단 근거와 함께 보고. 힌트가 없으면 아래 frontmatter 절 규칙대로 직접 생성한다. 소설 화의 파일명은 `{series}-ep{NNN}` 관례로 들어온다 — 슬러그로 그대로 쓰되 전역 유일 확인은 동일하게.

## 3. 분할 정책 — 한 챕터 = 한 기록

챕터를 절(Section) 단위로 쪼개지 않는다. 챕터는 워밍업→본문→점검→문제로 설계된 하나의 학습 단위이고, 긴 글 탐색은 기록 페이지의 목차("이 기록의 지도")와 연대기 이전/다음 화 내비게이션이 이미 담당한다. 쪼개면 학습 흐름이 끊기고 연대기가 부풀며(36챕터 → 200+ 기록) 화수 체계도 무너진다.

## 4. frontmatter 생성 (스키마: `src/content.config.ts`)

| 필드 | 규칙 |
|---|---|
| `title` | H1에서 `Chapter N:` 접두를 뗀 제목. 검색 친화적으로, **세계관 용어 금지**. 화수는 seriesOrder가 표현하므로 제목에 번호 불필요. 제목만으로 주제가 모호하면 과목명을 접두 (예: "환경 구축과 첫 프로그램" → "Python 환경 구축과 첫 프로그램") |
| `description` | 학습 목표/도입부를 근거로 1~2문장 직접 작성 (카드·meta에 노출) |
| `place` | 주제 매핑: IT/프로그래밍/인프라 → `engineers-guild` · 수학 → `mathematicians-tower` · 과학(물리·화학·생물) → `alchemists-laboratory` · AI/ML → `oracles-mirror` · 역사 → `historians-archive` · 독서 → `wizards-library`. 애매하면 근거와 함께 선택을 보고 |
| `date` | 오늘 (같은 시리즈 여러 편 동시 수입 시 화수 순서대로 같은 날짜 허용) |
| `tags` | 소문자-케밥 3~6개. 세계관 용어 금지 |
| `series` | 코스 슬러그 그대로 (예: `apache-spark`). 학습 챕터는 필수 |
| `seriesTitle` | 한국어 과목명 (시리즈 첫 수입 화에만 있어도 됨) |
| `seriesOrder` | 챕터 번호 N |
| `seriesDescription` | 시리즈 첫 수입 시 한 문장 작성 (연대기 목차 서문에 드롭캡으로 노출). **frontmatter 값에도 세계관 용어 금지** — "학습 연대기" 같은 표현 불가 |
| `seriesStatus` | 커리큘럼 마지막 화까지 수입 완료 시에만 `completed` |
| `draft` | 기본 `false`. 미해결 항목(mermaid 등)이 있으면 `true`로 두고 보고 |

**파일 위치·슬러그**: `src/content/records/{place}/{slug}.md`, 슬러그는 `{series}-ch{NN}` (예: `apache-spark-ch01`). 단발 원고는 내용 기반 영문 케밥. **전역 유일**을 Glob(`src/content/records/**/*.md`)으로 확인한다.

## 5. 본문 변환 규칙

**학습 챕터는 기계적 변환을 스크립트로 먼저 돌린다** — `node scripts/import-chapter.mjs <원고> --series <슬러그> --out <목적지>` 가 아래 1·3·4·7을 결정론적으로 수행하고 frontmatter 골격(TODO 포함)을 생성한다. 그 뒤 TODO(description·place·tags·제목 접두·seriesTitle)만 편집 판단으로 채우고 `draft: false`로 바꾼다. 스크립트 규칙을 바꿀 땐 이 문서와 함께 고칠 것.

1. H1 제거 — frontmatter `title`이 페이지 제목을 렌더한다. H2부터가 본문 최상위.
2. `> **난이도**: …` 메타 blockquote는 독자에게 유용하므로 유지.
3. `<!-- LO-MAP: … -->`·블록 마커 등 HTML 주석 전부 제거. 하네스 내부 참조(shared_context, concept_ledger, 환경_안내, work_log 언급)도 제거하거나 자연스러운 문장으로 치환.
4. 챕터 간 상대 링크(`Ch03_….md`)는 해당 화가 이미 발행됐으면 `/records/{slug}/`로 치환, 미발행이면 링크를 풀고 텍스트만 남긴다. `[환경 안내](환경_안내.md)` 링크도 링크를 풀고 텍스트만 남긴다 (코스 전체를 수입할 때는 환경 안내를 `seriesOrder: 0`의 기록으로 먼저 들여오고 링크를 복원하는 것을 고려).
5. mermaid 코드펜스는 **그대로 둔다** — 블로그가 렌더를 지원한다(HANDBOOK §4.6, 테마 연동 자동). 단, 발행 전 해당 페이지를 열어 다이어그램이 실제로 그려지는지 확인한다 (문법 오류 시 원본 소스 폴백으로 노출됨).
6. 수식: 소스 하네스들은 표준 LaTeX `$...$`/`$$...$$`로 쓰기로 통일돼 있다 — **수식은 무변환**(KaTeX가 그대로 렌더). 정리/증명은 소스에서 blockquote 마커(`> **정리 N.M (이름)**: …`, `> **증명**: … ∎`)로 들어오므로 `:::theorem`/`:::lemma`/`:::definition`/`:::proof` 박스로 기계 변환한다 (HANDBOOK §4.4). 증명 끝 ∎는 CSS 자동이므로 소스의 ∎·`$\blacksquare$`는 제거.
7. `---` 수평선은 ✦ 오너먼트로 렌더된다 — 원고는 H2마다 hr을 넣지만(챕터당 ~19개) 블로그에선 과하다. **국면 전환 4곳만 남긴다**: 메타→워밍업, 개념 지도→본문(N.1 앞), 본문→자기 점검, 개념 연결 맵→연습 문제.
8. `<details><summary>` 접이식 문답은 그대로 둔다 — 블로그에서 정상 렌더된다 (2026-07-12 리허설 검증).
9. ASCII 다이어그램·코드펜스는 그대로 둔다 (나눔고딕코딩 정폭 전제, Shiki 하이라이팅은 언어 식별자 유지).
10. **본문 문체는 원고 그대로** — 판타지화하지 않는다 (CLAUDE.md 절대 규칙).

## 6. 검증과 보고

1. `npm run build` 통과 확인 (스키마 위반은 여기서 잡힌다).
2. `lore-auditor` 서브에이전트로 새 파일의 frontmatter·본문 규칙 감사.
3. 보고: 생성 파일 경로, place/series 판단 근거, 수동 확인 필요 항목(mermaid 등), draft 상태.
4. 처리 완료한 inbox/ 원고는 삭제한다 (정본은 원 하네스에 있다). 커밋·push는 사용자 확인 후, 커밋 메시지는 영어.
5. **대량 수입 주의**: 한 코스(수십 화)를 같은 날짜로 한 번에 발행하면 서고·RSS가 도배된다. 전량 수입하더라도 발행은 나눠서 — `date`를 화수 순서대로 과거로 며칠씩 분산하거나, 몇 화씩 `draft: false`를 풀며 단계 발행할지 사용자에게 확인한다.
