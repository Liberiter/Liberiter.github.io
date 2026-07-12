#!/usr/bin/env node
// 학습 챕터의 기계적 변환기 — /import-record 스킬의 결정론 파트.
// 편집 판단(description·place·tags·제목 접두·mermaid 확인)은 사람/모델이 TODO를 채운다.
//
// 사용:
//   node scripts/import-chapter.mjs <원고.md> [--series slug] [--out 경로]
//   series 생략 시 원고의 부모 폴더명을 쓴다 (inbox/learning/{슬러그}/ 관례).
//   --out 생략 시 stdout으로 출력.
//
// 수행 규칙 (.claude/skills/import-record/SKILL.md §5와 동일해야 한다):
//   1. H1 `# Chapter N: 제목` 제거 → title·seriesOrder 추출
//   2. HTML 주석(<!-- LO-MAP … --> 등) 제거
//   3. `.md` 상대 링크 해제 — [텍스트](….md) → 텍스트
//   4. `---` 수평선은 국면 전환 4곳만 유지: 워밍업 / N.1 본문 시작 / 자기 점검 / 연습 문제 직전
//      (코드펜스 안의 ---는 건드리지 않는다)

import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname } from 'node:path';

const args = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) flags[args[i].slice(2)] = args[++i];
  else positional.push(args[i]);
}
const srcPath = positional[0];
if (!srcPath) {
  console.error('사용법: node scripts/import-chapter.mjs <원고.md> [--series slug] [--out 경로]');
  process.exit(1);
}

let text = readFileSync(srcPath, 'utf8').replace(/\r\n/g, '\n');

// ── 1. H1에서 화수·제목 추출 ──
const h1 = text.match(/^# Chapter (\d+):\s*(.+)$/m);
if (!h1) {
  console.error('H1이 "# Chapter N: 제목" 형식이 아닙니다 — 일반 원고는 스킬 절차로 직접 변환하세요.');
  process.exit(1);
}
const order = Number(h1[1]);
const title = h1[2].trim();
const series = flags.series ?? basename(dirname(srcPath));

// ── 2. HTML 주석 제거 (LO-MAP·블록 마커) ──
text = text.replace(/<!--[\s\S]*?-->\n?/g, '');

// ── 3. .md 상대 링크 해제 ──
text = text.replace(/\[([^\]]+)\]\([^)\s]*\.md\)/g, '$1');

// ── 4. H1 제거 + hr 정리 (코드펜스 추적) ──
const KEEP_BEFORE = /^## (워밍업|\d+\.1\b|자기 점검|연습 문제)/;
const lines = text.split('\n');
const out = [];
let inFence = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (/^(```|~~~)/.test(line.trim())) inFence = !inFence;
  if (!inFence) {
    if (/^# Chapter \d+:/.test(line)) continue;
    if (/^---\s*$/.test(line)) {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      if (!(j < lines.length && KEEP_BEFORE.test(lines[j]))) continue;
    }
  }
  out.push(line);
}
const body = out.join('\n').replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n');

// ── frontmatter 골격 (TODO는 편집 판단 몫) ──
const today = new Date().toISOString().slice(0, 10);
const fm = `---
title: "${title}"
# TODO: 제목만으로 주제가 모호하면 과목명 접두 (예: "Python ${title}")
description: "TODO: 학습 목표를 근거로 1~2문장 (세계관 용어 금지)"
place: engineers-guild
# TODO: place 확인 — 수학=mathematicians-tower · 과학=alchemists-laboratory · AI=oracles-mirror 등 (HANDBOOK §4.1)
date: ${today}
tags: []
# TODO: 소문자-케밥 3~6개
series: ${series}
seriesOrder: ${order}
# TODO: 시리즈 첫 화라면 seriesTitle·seriesDescription 추가, 마지막 화까지 수입 완료면 seriesStatus: completed
draft: true
---

`;

const result = fm + body;
if (flags.out) {
  writeFileSync(flags.out, result, 'utf8');
  console.error(`생성: ${flags.out} (series=${series}, 제${order}화, draft=true — TODO 채운 뒤 발행)`);
} else {
  process.stdout.write(result);
}
