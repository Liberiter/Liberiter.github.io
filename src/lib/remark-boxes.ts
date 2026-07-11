// 수학 정리/증명 박스 — remark-directive 컨테이너를 math-box div로 변환.
// 컨벤션 (HANDBOOK §4.5):
//   :::theorem{title="칸토어의 정리"} ... :::   → <div class="math-box math-box--theorem">
//   :::lemma / :::definition / :::proof 동일. title 없으면 기본 라벨.
// astro.config.mjs에서 remark-directive 뒤에 등록한다 (remark-math의 $$와는 충돌 없음 —
// 디렉티브는 ::: 블록 구조만 소비하고, 내부 수식 노드는 그대로 KaTeX로 흘러간다).
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

const BOX_LABELS: Record<string, { ko: string; en: string }> = {
  theorem: { ko: '정리', en: 'Theorem' },
  lemma: { ko: '보조정리', en: 'Lemma' },
  definition: { ko: '정의', en: 'Definition' },
  proof: { ko: '증명', en: 'Proof' },
};

export default function remarkBoxes() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node: any) => {
      const label = BOX_LABELS[node.name];
      if (!label) return;

      const title: string | undefined = node.attributes?.title;
      // 라벨: "정리 · 칸토어의 정리" / 기본 "정리 · Theorem" / 증명은 항상 "증명"
      const text =
        node.name === 'proof'
          ? title ?? label.ko
          : `${label.ko} · ${title ?? label.en}`;

      node.data = {
        ...node.data,
        hName: 'div',
        hProperties: { className: ['math-box', `math-box--${node.name}`] },
      };
      node.children.unshift({
        type: 'paragraph',
        data: { hName: 'p', hProperties: { className: ['math-box-label'] } },
        children: [{ type: 'text', value: text }],
      });
    });
  };
}
