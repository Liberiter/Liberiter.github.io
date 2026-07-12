// Mermaid 다이어그램 — ```mermaid 코드펜스를 클라이언트 렌더 대상으로 변환.
// Shiki 하이라이팅을 우회해 <div class="mermaid-figure"><pre class="mermaid-src">원본</pre></div>로 바꾸면,
// Base.astro의 로더가 페이지에 .mermaid-src가 있을 때만 mermaid를 동적 로드해 SVG로 그린다
// (src/scripts/mermaid-client.ts — 테마 토큰 연동·theme-changed 재렌더 포함).
// JS가 없거나 렌더에 실패하면 원본 소스가 그대로 보이는 것이 폴백이다.
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, 'code', (node: any) => {
      if (node.lang !== 'mermaid') return;
      node.type = 'html';
      node.value = `<div class="mermaid-figure"><pre class="mermaid-src">${escapeHtml(node.value)}</pre></div>`;
    });
  };
}
