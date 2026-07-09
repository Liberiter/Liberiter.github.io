import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { PLACE_SLUGS } from './data/places';

// 기록(Record) — 열두 장소에 남기는 글.
// 파일은 src/content/records/{place}/{slug}.md 에 두지만
// URL은 /records/{slug}/ — 폴더는 관리용일 뿐, 주소에 넣지 않는다 (WORLDBOOK §4.1).
const records = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/records',
    generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      place: z.enum(PLACE_SLUGS),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      seriesTitle: z.string().optional(),
      seriesOrder: z.number().optional(),
      draft: z.boolean().default(false), // true = 봉인된 기록
    })
    .refine((d) => d.place !== 'authors-den' || !!d.series, {
      message: '집필실(authors-den)의 기록은 연재물이므로 series가 필요합니다.',
    }),
});

// 방랑자의 일지 — 파일명이 곧 날짜: src/content/journal/2026-07-09.md
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { records, journal };
