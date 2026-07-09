// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://liberiter.github.io',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // 라이트 = 양피지 톤, 다크 = 숲의 밤 톤 (테마 전환은 global.css에서 처리)
      themes: { light: 'vitesse-light', dark: 'everforest-dark' },
    },
  },
});
