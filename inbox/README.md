# inbox — 외부 원고 투입함

외부 하네스에서 작성한 순수 `.md`를 여기에 넣고, Claude Code에서 `/import-record`를
실행하면 블로그 기록으로 변환된다.

## 디렉터리 구조 — 폴더가 곧 원고의 종류

```
inbox/
├─ learning/{코스슬러그}/Ch01_….md   ← 학습 챕터 (learning-harness-fable)
│                                      폴더명 = series 슬러그의 근거
├─ essay/….md                        ← 지식 에세이 (essay-harness-fable) — 단발
│                                      분야 하위 폴더는 자유 (메타는 import-hint가 전달)
└─ fiction/{시리즈슬러그}/….md        ← 소설 연재 (fiction-harness-fable)
                                       폴더명 = series (import-hint와 교차 검증)
```

## 규칙

- 이 폴더는 git에 올라가지 않는다 (이 README 제외).
- 변환이 끝난 원고는 삭제한다 — 정본은 원 하네스에 있다.
- learning-harness-fable에서 가져올 때는 `courses/<slug>/public/`의 공개 사본을 쓴다.
- essay-harness-fable·fiction-harness-fable 산출물은 1행에 `<!-- import-hint: … -->`
  주석을 싣고 들어온다 — /import-record가 frontmatter 근거로 소비 후 제거한다.
- **TIL(일지)·일상 글은 inbox를 거치지 않는다** — 짧은 글은 블로그에서 직접 쓴다 (`/new-record`).
