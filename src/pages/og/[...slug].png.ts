// OG 이미지 빌드 타임 자동 생성 (WORLDBOOK §3.4) — satori + resvg.
// 관례 URL: /og/<페이지 경로>.png — Base.astro의 매핑 규칙과 반드시 일치해야 한다.
//   기록:   /records/{slug}/  → /og/records/{slug}.png
//   일지:   /journal/{date}/  → /og/journal/{date}.png
//   장소:   /places/{slug}/   → /og/places/{slug}.png
//   정적:   홈·서고·열두 장소·연대기·일지 목록·쉼터 → /og/{index|records|places|chronicles|journal|rest}.png
//   폴백:   그 외 모든 페이지 → /og/default.png (브랜드만)
// 디자인: 양피지 + 이중 괘선 + 모서리 ✦ — 절제된 필사본 판형, 다크 버전 없음 (OG는 한 벌).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PLACES, placeBySlug, JOURNAL } from '../../data/places';
import { fmtDate } from '../../lib/format';
import spriteRaw from '../../../assets/emblems.svg?raw';

export const prerender = true;

// ── 팔레트 (global.css 라이트 토큰의 스냅샷 — OG는 라이트 한 벌) ──
const W = 1200;
const H = 630;
const BG = '#FAF5E9';
const INK = '#3a3226';
const MUTED = '#6e6353';
const GOLD = '#8B6914';
const GOLD_TEXT = '#7a5c10';

const SITE_EN = "THE WANDERER'S CROSSROADS";

interface OgProps {
  title: string;
  subtitle?: string; // 제목 아래 한 줄 (장소 카드의 플레이버 텍스트)
  emblem: string; // emblems.svg의 symbol id 접미사 (예: 'campfire', 'crossroads')
  color: string; // 문장색 (라이트 값)
  metaName?: string; // 하단 메타 행 — 장소명/코너명
  metaDate?: string; // 하단 메타 행 — 날짜 (표시용 문자열)
  brandOnly?: boolean; // default.png — 브랜드만
}

// 대표 정적 페이지 — Base.astro의 OG_STATIC 매핑과 1:1
const STATIC_PAGES: Array<{ slug: string; title: string }> = [
  { slug: 'index', title: '교차로' },
  { slug: 'places', title: '열두 장소' },
  { slug: 'records', title: '서고' },
  { slug: 'chronicles', title: '연대기' },
  { slug: 'journal', title: '방랑자의 일지' },
  { slug: 'rest', title: '여행자의 쉼터' },
];

export async function getStaticPaths() {
  const records = await getCollection('records', ({ data }) => !data.draft);
  const journal = await getCollection('journal');

  return [
    // 기본 폴백 — 브랜드만
    { params: { slug: 'default' }, props: { title: '', emblem: 'crossroads', color: GOLD, brandOnly: true } },
    // 대표 정적 페이지 — 페이지명 + 컴퍼스 로즈
    ...STATIC_PAGES.map(({ slug, title }) => ({
      params: { slug },
      props: { title, emblem: 'crossroads', color: GOLD } satisfies OgProps,
    })),
    // 모든 기록 — 제목 + 장소 문장 + 장소명 + 날짜
    ...records.map((rec) => {
      const place = placeBySlug(rec.data.place);
      return {
        params: { slug: `records/${rec.id}` },
        props: {
          title: rec.data.title,
          emblem: place.slug,
          color: place.light,
          metaName: place.ko,
          metaDate: fmtDate(rec.data.date),
        } satisfies OgProps,
      };
    }),
    // 열두 장소 상세 — 장소명(한) + 장소 문장 + 플레이버 + 영문명 메타 행
    ...PLACES.map((place) => ({
      params: { slug: `places/${place.slug}` },
      props: {
        title: place.ko,
        subtitle: place.flavor,
        emblem: place.slug,
        color: place.light,
        metaName: place.en,
      } satisfies OgProps,
    })),
    // 모든 일지 — 제목(없으면 날짜) + 나침반 문장 + "방랑자의 일지"
    ...journal.map((entry) => ({
      params: { slug: `journal/${entry.id}` },
      props: {
        title: entry.data.title ?? fmtDate(new Date(`${entry.id}T00:00:00`)),
        emblem: 'wanderers-journal',
        color: JOURNAL.light,
        metaName: JOURNAL.ko,
        metaDate: fmtDate(new Date(`${entry.id}T00:00:00`)),
      } satisfies OgProps,
    })),
  ];
}

// ── 폰트 — 모듈 스코프 캐시 (빌드 전체에서 1회 로드) ──
// import.meta.url은 번들 후 위치가 바뀌므로 프로젝트 루트(cwd) 기준으로 읽는다.
const FONT_DIR = path.join(process.cwd(), 'src/assets/og-fonts');
let fontsPromise: Promise<
  Array<{ name: string; data: Buffer; weight: 400 | 700; style: 'normal' }>
> | null = null;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(path.join(FONT_DIR, 'GowunBatang-Regular.ttf')).then((data) => ({
      name: 'Gowun Batang',
      data,
      weight: 400 as const,
      style: 'normal' as const,
    })),
    readFile(path.join(FONT_DIR, 'GowunBatang-Bold.ttf')).then((data) => ({
      name: 'Gowun Batang',
      data,
      weight: 700 as const,
      style: 'normal' as const,
    })),
    // Cinzel — 정적 인스턴스 wght 400 (브랜드 행 전용)
    readFile(path.join(FONT_DIR, 'Cinzel-Regular.ttf')).then((data) => ({
      name: 'Cinzel',
      data,
      weight: 400 as const,
      style: 'normal' as const,
    })),
  ]);
  return fontsPromise;
}

// ── 문장(紋章) — assets/emblems.svg의 symbol을 단독 SVG로 꺼내 data URI로 ──
function emblemDataUri(id: string, color: string): string {
  const m = spriteRaw.match(
    new RegExp(`<symbol id="emblem-${id}" viewBox="([^"]+)">([\\s\\S]*?)</symbol>`)
  );
  if (!m) throw new Error(`emblems.svg에 없는 문장: ${id}`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${m[1]}">${m[2].replaceAll('currentColor', color)}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// 네 모서리 ✦ (네 갈래 별) — 텍스트 글리프 대신 SVG (폰트 커버리지에 기대지 않는다)
function starDataUri(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4 Z" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

type Node = { type: string; props: Record<string, unknown> };
// satori는 빈 배열 children도 다중 자식으로 세므로, 비었으면 children을 아예 생략한다
const div = (style: Record<string, unknown>, children?: Node[] | string): Node => ({
  type: 'div',
  props: {
    style,
    ...(children === undefined || (Array.isArray(children) && children.length === 0)
      ? {}
      : { children }),
  },
});
const img = (src: string, size: number, extra: Record<string, unknown> = {}): Node => ({
  type: 'img',
  props: { src, width: size, height: size, style: { width: size, height: size, ...extra } },
});

function buildTree(p: OgProps): Node {
  const star = starDataUri(GOLD);
  // 모서리 ✦ — 내측 괘선(36px)의 꼭짓점 위에 얹는다
  const corners = (
    [
      { top: 25, left: 25 },
      { top: 25, right: 25 },
      { bottom: 25, left: 25 },
      { bottom: 25, right: 25 },
    ] as const
  ).map((pos) => img(star, 22, { position: 'absolute', ...pos }));

  // 좌상단 브랜드 행 — 컴퍼스 로즈 + 스몰캡스 사이트명 (default 카드는 중앙에 크게 대신)
  const brandRow = div(
    { display: 'flex', alignItems: 'center', gap: 16 },
    [
      img(emblemDataUri('crossroads', GOLD), 34),
      div(
        { fontFamily: 'Cinzel', fontSize: 22, letterSpacing: 5, color: GOLD_TEXT },
        SITE_EN
      ),
    ]
  );

  // 중앙 — 문장 + 제목 (긴 제목은 2줄 말줄임)
  const titleSize = p.title.length <= 14 ? 60 : p.title.length <= 26 ? 52 : 44;
  const middle = p.brandOnly
    ? div(
        {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 34,
        },
        [
          img(emblemDataUri('crossroads', GOLD), 110),
          div(
            { fontFamily: 'Cinzel', fontSize: 40, letterSpacing: 8, color: GOLD_TEXT },
            SITE_EN
          ),
          div(
            { fontSize: 24, color: MUTED },
            '방랑자의 기록이 쌓이는 교차로'
          ),
        ]
      )
    : div(
        {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 30,
        },
        [
          img(emblemDataUri(p.emblem, p.color), 68),
          div(
            {
              display: 'block',
              lineClamp: 2,
              maxWidth: 920,
              fontFamily: 'Gowun Batang',
              fontWeight: 700,
              fontSize: titleSize,
              lineHeight: 1.42,
              textAlign: 'center',
              color: INK,
            },
            p.title
          ),
          ...(p.subtitle
            ? [
                div(
                  {
                    display: 'block',
                    lineClamp: 2,
                    maxWidth: 880,
                    fontSize: 24,
                    lineHeight: 1.6,
                    textAlign: 'center',
                    color: MUTED,
                  },
                  p.subtitle
                ),
              ]
            : []),
        ]
      );

  // 하단 메타 행 — 장소 문장색 점(마름모) + 장소명 + 날짜 (정적 페이지는 비움)
  const metaRow = p.metaName
    ? div(
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          height: 40,
        },
        [
          div({
            width: 13,
            height: 13,
            backgroundColor: p.color,
            transform: 'rotate(45deg)',
          }, []),
          div({ fontSize: 25, fontWeight: 700, color: INK }, p.metaName),
          ...(p.metaDate
            ? [
                div({ fontSize: 24, color: MUTED }, '·'),
                div({ fontSize: 24, color: MUTED }, p.metaDate),
              ]
            : []),
        ]
      )
    : div({ height: 40, display: 'flex' }, []);

  return div(
    {
      width: W,
      height: H,
      display: 'flex',
      position: 'relative',
      fontFamily: 'Gowun Batang',
      backgroundColor: BG,
      // 아주 옅은 세피아 방사 그라데이션 — 가장자리로 갈수록 살짝 가라앉는 양피지
      backgroundImage:
        'radial-gradient(circle at 50% 42%, rgba(139,105,20,0.02) 0%, rgba(120,84,32,0.05) 60%, rgba(94,66,24,0.13) 100%)',
    },
    [
      // 각진 이중 괘선 프레임 (금)
      div({
        position: 'absolute',
        top: 26,
        left: 26,
        right: 26,
        bottom: 26,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(139,105,20,0.85)',
      }, []),
      div({
        position: 'absolute',
        top: 36,
        left: 36,
        right: 36,
        bottom: 36,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(139,105,20,0.5)',
      }, []),
      ...corners,
      // 본문 판형
      div(
        {
          position: 'absolute',
          top: 36,
          left: 36,
          right: 36,
          bottom: 36,
          display: 'flex',
          flexDirection: 'column',
          padding: '36px 46px 30px',
        },
        [...(p.brandOnly ? [] : [brandRow]), middle, metaRow]
      ),
    ]
  );
}

export const GET: APIRoute = async ({ props }) => {
  const fonts = await loadFonts();
  const svg = await satori(buildTree(props as unknown as OgProps), {
    width: W,
    height: H,
    fonts,
  });
  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
