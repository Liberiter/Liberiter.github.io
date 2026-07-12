// Mermaid 클라이언트 렌더러 — remark-mermaid가 심어 둔 .mermaid-src를 SVG로 그린다.
// 디자인 토큰(global.css)을 읽어 base 테마를 입히고, 낮↔밤 전환(theme-changed) 시 재렌더한다.
// 이 모듈 자체가 동적 import 대상이라, 다이어그램 없는 페이지는 mermaid를 내려받지 않는다.

import mermaid from 'mermaid';

// 원본 소스 보존 — 테마 전환 재렌더용
const figures: { host: HTMLElement; src: string }[] = [];

function tokens() {
  const cs = getComputedStyle(document.documentElement);
  const t = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    bg: t('--code-bg', '#ece2c9'),
    card: t('--card', '#f3ebd8'),
    ink: t('--ink', '#3a3226'),
    muted: t('--muted', '#6e6353'),
    line: t('--line', '#dfd3b8'),
    gold: t('--gold-dim', '#a67c1a'),
    sans: t('--sans', 'Pretendard, sans-serif'),
  };
}

function initMermaid() {
  const c = tokens();
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    fontFamily: c.sans,
    themeVariables: {
      background: c.bg,
      primaryColor: c.card,
      primaryTextColor: c.ink,
      primaryBorderColor: c.gold,
      secondaryColor: c.bg,
      tertiaryColor: c.card,
      lineColor: c.muted,
      textColor: c.ink,
      clusterBkg: c.bg,
      clusterBorder: c.line,
      edgeLabelBackground: c.bg,
      noteBkgColor: c.card,
      noteBorderColor: c.line,
      noteTextColor: c.ink,
      actorBorder: c.gold,
      actorBkg: c.card,
      fontSize: '15px',
    },
  });
}

let seq = 0;
async function renderAll() {
  initMermaid();
  for (const { host, src } of figures) {
    try {
      const { svg } = await mermaid.render(`mmd-${seq++}`, src);
      host.innerHTML = svg;
      host.classList.add('is-rendered');
    } catch {
      // 렌더 실패 → 원본 소스 폴백 유지
      host.innerHTML = `<pre class="mermaid-src">${src.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
      host.classList.remove('is-rendered');
    }
  }
}

for (const pre of document.querySelectorAll<HTMLPreElement>('.mermaid-figure > pre.mermaid-src')) {
  figures.push({ host: pre.parentElement!, src: pre.textContent ?? '' });
}

renderAll();

// 낮↔밤 전환 — 새 토큰이 확정된 다음 프레임에 다시 그린다
document.addEventListener('theme-changed', () => requestAnimationFrame(() => renderAll()));
