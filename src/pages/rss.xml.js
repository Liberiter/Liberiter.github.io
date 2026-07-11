import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { fmtDate } from '../lib/format';

export async function GET(context) {
  const records = await getCollection('records', ({ data }) => !data.draft);
  const journal = await getCollection('journal');

  // 기록 + 일지를 한 물길로 — 시간순 병합 (일지는 제목이 없으면 날짜가 제목)
  const items = [
    ...records.map((rec) => ({
      title: rec.data.title,
      description: rec.data.description,
      pubDate: rec.data.date,
      link: `/records/${rec.id}/`,
    })),
    ...journal.map((entry) => ({
      title: entry.data.title ?? fmtDate(new Date(`${entry.id}T00:00:00`)),
      description: `${entry.id}에 남긴 짧은 학습 기록 (TIL).`,
      pubDate: new Date(`${entry.id}T00:00:00`),
      link: `/journal/${entry.id}/`,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: "The Wanderer's Crossroads",
    description: '방랑자의 기록이 쌓이는 교차로 — 역사에서 수학까지, 신앙에서 소설까지의 기록.',
    site: context.site,
    // 브라우저로 /rss.xml을 열면 사람 눈에 맞는 안내 페이지로 렌더 (public/rss-style.xsl)
    stylesheet: '/rss-style.xsl',
    items,
    customData: '<language>ko</language>',
  });
}
