---
name: new-record
description: 새 기록(record) 또는 일지(journal)를 올바른 frontmatter로 스캐폴딩한다. 사용자가 "새 글", "글 쓸 준비", "일지 써줘" 등을 요청할 때 사용.
---

# 새 글 스캐폴딩

## 기록 (본편)

`src/content/records/{place}/{slug}.md` 생성 — 규칙은 HANDBOOK §4.1:

```yaml
---
title: "검색 친화적 제목"        # 세계관 용어 금지
description: "한 문장 요약"      # 필수 — 카드·meta에 사용
place: engineers-guild          # src/data/places.ts의 12슬러그 중 하나
date: 2026-07-12
tags: [python]                  # 소문자-케밥
draft: true                     # 집필 중엔 봉인, 발행 시 false
---
```

- 슬러그(파일명)는 **전역 유일** — Glob으로 확인. 폴더는 관리용, `place` 필드가 진짜 소속.
- 연재물이면 세 줄 추가: `series`(슬러그)·`seriesTitle`(1화에만 있어도 됨)·`seriesOrder`. 학습 시리즈(Ch01~N)는 과목 하나 = 연대기 하나. 집필실(authors-den) 글은 series 필수.
- 단발 이야기 글은 series 없이, 공통 태그로만 묶는다.
- 본문은 일반 문체 (판타지화 금지 — 도입·맺음 한 줄 양념만 선택 허용). 수식 `$..$`, 정리 박스 `:::theorem`(HANDBOOK §4.4), `---`는 ✦ 구분선.

## 일지 (TIL)

`src/content/journal/YYYY-MM-DD.md` — 파일명이 곧 날짜:

```yaml
---
title: "오늘 배운 것"   # 선택 (없으면 날짜가 제목)
tags: [python]         # 선택
---
```

세 줄이어도 당당하게. 일지의 적은 완벽주의다.
