// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import remarkBoxes from './src/lib/remark-boxes.ts';
import remarkMermaid from './src/lib/remark-mermaid.ts';

export default defineConfig({
  site: 'https://liberiter.github.io',
  integrations: [sitemap()],
  markdown: {
    // remark-math가 $$를 먼저 수식 노드로 확보한 뒤, directive → math-box 변환.
    remarkPlugins: [remarkMath, remarkDirective, remarkBoxes, remarkMermaid],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // 라이트 = 양피지 톤, 다크 = 숲의 밤 톤 (테마 전환은 global.css에서 처리)
      themes: { light: 'vitesse-light', dark: 'everforest-dark' },
    },
  },
});
