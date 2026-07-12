# The Wanderer's Crossroads — 프로젝트 지침

판타지 세계관 개인 블로그. Astro 6 + GitHub Pages → https://liberiter.github.io
(저장소 `Liberiter/Liberiter.github.io`, main push → Actions 자동 배포, Node 22)

## 문서 지도 — 코드보다 문서가 먼저다

| 문서 | 역할 |
|---|---|
| `WORLDBOOK.md` | 세계관·용어·디자인 규칙의 유일한 진실 (왜). 디자인 시스템 v4 = §3 |
| `HANDBOOK.md` | 운영 매뉴얼 — 글쓰기·배포·수정 절차 (어떻게) |
| `docs/copy-deck.md` | 화면별 UI 문구의 단일 원천 |
| `docs/mockups/*.html` | v4 화면 스펙 확정 목업 |
| `src/data/places.ts` | 12장소 정의의 코드측 원본 (WORLDBOOK §2와 일치 유지) |
| `docs/harness-guide.md` | 하네스 상세 가이드 — 스킬·에이전트·import 워크플로우·확장법 |

## 절대 규칙

- **세계관 용어는 화면에 보이는 UI에만.** `<title>`·meta·OG·aria-label·URL·frontmatter(title/description/tags)는 평범하고 정확하게 (WORLDBOOK §1.2).
- **방랑자(블로그 주인)는 여관(쉼터)의 주인이 아니라 오래 머무는 손님.** "여관 주인" 표현 금지 (WORLDBOOK §1.1).
- **게시글 본문은 일반 기술/일반 블로그 문체.** 본문을 판타지화하지 않는다 — 도입·맺음 한 줄 양념만 선택 허용.
- 디자인·세계관 변경은 코드보다 `WORLDBOOK.md`를 먼저 고친다. UI 문구 변경은 `copy-deck.md` 동기화.
- 글 슬러그(파일명)는 **전체에서 유일** — URL이 `/records/{slug}/`로 장소와 무관하다.
- 커밋 메시지는 영어.

## 명령어

- `npm run dev` — localhost:4321 (테마 강제: `?theme=dark|light`)
- `npm run build` — astro build + pagefind. 발행 전 필수 통과.

## 콘텐츠 구조

- 기록: `src/content/records/{place}/{slug}.md` — 스키마는 `src/content.config.ts`
- 일지(TIL): `src/content/journal/YYYY-MM-DD.md`
- 연대기(시리즈): frontmatter `series`/`seriesTitle`/`seriesOrder` (+1화에 `seriesDescription`, 완결 시 `seriesStatus: completed`)
- **학습 시리즈(과목별 Ch01~N) = 연대기 하나. 단발 글은 series 없이 발행 (말머리 대신 태그).**
- 수식: `$..$`/`$$..$$` (KaTeX). 정리·증명 박스: `:::theorem` 등 (HANDBOOK §4.4).
- 다이어그램: ` ```mermaid ` 코드펜스 그대로 지원 — 클라이언트 동적 로드 + 테마 연동 (HANDBOOK §4.6).

## 하네스 (프로젝트 스킬·에이전트)

- `/import-record` — 외부 순수 .md(learning-harness-fable 산출물 등)를 블로그 기록으로 변환. 원고 투입함은 `inbox/`
- `/new-record` — 새 기록/일지 스캐폴딩
- `/design-work` — 디자인·UI·기능 변경 절차와 확정 정책 (디자인 작업 전 필수 로드)
- `/release-check` — 발행 전 최종 점검 (빌드·스키마·세계관 감사)
- `lore-auditor` 서브에이전트 — 세계관·카피 규칙 감사
