import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const records = (await getCollection('records', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  return rss({
    title: "The Wanderer's Crossroads",
    description: '방랑자의 기록이 쌓이는 교차로 — 기술, 수학, 책, 그리고 이야기.',
    site: context.site,
    items: records.map((rec) => ({
      title: rec.data.title,
      description: rec.data.description,
      pubDate: rec.data.date,
      link: `/records/${rec.id}/`,
    })),
    customData: '<language>ko</language>',
  });
}
