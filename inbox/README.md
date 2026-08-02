# inbox — 외부 원고 투입함

외부 하네스에서 작성한 순수 `.md`를 여기에 넣고, Claude Code에서 `/import-record`를
실행하면 블로그 기록·일지로 변환된다.

**이 저장소로 들어오는 유일한 입구다.** 글은 여기서 쓰지 않는다 (CLAUDE.md 절대 규칙 1).

## 디렉터리 구조 — 폴더가 곧 원고의 종류

```
inbox/
├─ til/YYYY-MM-DD-….md               ← 일지/TIL (blog-loop `til/`)
│                                      → records가 아니라 journal 컬렉션으로 간다
├─ learning/{코스슬러그}/Ch01_….md   ← 학습 챕터 (study-loop)
│                                      폴더명 = series 슬러그의 근거
├─ essay/….md                        ← 이야기·지식 에세이 (blog-loop) — 단발
│                                      분야 하위 폴더는 자유 (메타는 import-hint가 전달)
└─ fiction/{시리즈슬러그}/….md        ← 소설 연재 (novel-loop, 미착수)
                                       폴더명 = series (import-hint와 교차 검증)
```

## 규칙

- 이 폴더는 git에 올라가지 않는다 (이 README 제외).
- 변환이 끝난 원고는 삭제한다 — **정본은 원 하네스에 있다.**
- 발행 후 본문을 고칠 일이 생기면 원 하네스에서 고쳐 다시 들여온다. 여기서 손대면
  정본이 둘이 된다.
- 저작 하네스 산출물은 1행에 `<!-- import-hint: … -->` 주석을 싣고 들어올 수 있다 —
  /import-record가 frontmatter 근거로 소비한 뒤 제거한다.
