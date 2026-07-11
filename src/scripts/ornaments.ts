// 절차 생성 오너먼트 (v4 — docs/mockups/home.html 이식)
// 코너 플러리시(폴리오 프레임) · 헤드피스 · 테일피스를 SVG로 생성해
// [data-orn] / .folio-frame .corner 자리에 심는다. 색은 currentColor 상속.

const SVGNS = 'http://www.w3.org/2000/svg';

function mk(name: string, attrs: Record<string, string | number>, parent?: Element): SVGElement {
  const n = document.createElementNS(SVGNS, name) as SVGElement;
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(n);
  return n;
}

const fmt = (v: number) => Math.round(v * 100) / 100;

/* 아르키메데스 나선 (덩굴 끝 소용돌이) */
function spiralD(cx: number, cy: number, r0: number, turns: number, startAngle: number, dir: 1 | -1): string {
  const steps = Math.max(18, Math.round(turns * 22));
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + dir * (i / steps) * turns * Math.PI * 2;
    const r = r0 * (1 - (i / steps) * 0.86);
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    d += (i === 0 ? 'M' : 'L') + fmt(x) + ' ' + fmt(y);
  }
  return d;
}

function diamond(cx: number, cy: number, r: number, parent: Element) {
  mk(
    'path',
    {
      d: `M${fmt(cx)} ${fmt(cy - r)}L${fmt(cx + r)} ${fmt(cy)}L${fmt(cx)} ${fmt(cy + r)}L${fmt(cx - r)} ${fmt(cy)}Z`,
      fill: 'currentColor',
      stroke: 'none',
    },
    parent
  );
}

function berry(cx: number, cy: number, r: number, parent: Element) {
  mk('circle', { cx: fmt(cx), cy: fmt(cy), r, fill: 'currentColor', stroke: 'none' }, parent);
}

/* 코너 플러리시 — 폴리오 프레임 네 모서리 */
export function cornerFlourish(): SVGElement {
  const s = mk('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' });
  const g = mk('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round' }, s);
  mk('path', { d: 'M3 61 C3 25 25 3 61 3' }, g);
  mk('path', { d: 'M11 61 C11 30 30 11 61 11' }, g);
  mk('path', { d: spiralD(18, 52, 8, 1.35, Math.PI * 0.5, -1) }, g);
  mk('path', { d: spiralD(52, 18, 8, 1.35, Math.PI, 1) }, g);
  diamond(30, 30, 4, g);
  berry(40, 22, 1.8, g);
  berry(22, 40, 1.8, g);
  berry(48, 10, 1.4, g);
  berry(10, 48, 1.4, g);
  return s;
}

/* 물결 덩굴 반쪽 (헤드피스용) */
function vineHalfD(x0: number, x1: number, cy: number, amp: number): string {
  let d = `M${fmt(x0)} ${fmt(cy)}`;
  const n = 3;
  const seg = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    const xa = x0 + seg * i;
    const xb = xa + seg;
    const s = i % 2 === 0 ? -1 : 1;
    d += ` C ${fmt(xa + seg * 0.35)} ${fmt(cy + s * amp)}, ${fmt(xb - seg * 0.35)} ${fmt(cy + s * amp)}, ${fmt(xb)} ${fmt(cy)}`;
  }
  return d;
}

/* 헤드피스: 중앙 ✦ + 좌우 대칭 덩굴 + 끝 소용돌이 */
export function headpiece(): SVGElement {
  const W = 300;
  const H = 30;
  const cy = 15;
  const s = mk('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true' });
  const half = mk('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round' }, s);
  mk('path', { d: vineHalfD(132, 36, cy, 9) }, half);
  mk('path', { d: spiralD(26, cy, 7, 1.4, 0, 1) }, half);
  berry(116, cy - 8, 1.7, half);
  berry(84, cy + 8, 1.7, half);
  berry(52, cy - 8, 1.7, half);
  const mirror = half.cloneNode(true) as SVGElement;
  mirror.setAttribute('transform', `translate(${W},0) scale(-1,1)`);
  s.appendChild(mirror);
  diamond(W / 2, cy, 5, s);
  mk('circle', { cx: W / 2, cy, r: 8.5, fill: 'none', stroke: 'currentColor', 'stroke-width': '1' }, s);
  return s;
}

/* 테일피스: 작은 대칭 마무리 */
export function tailpiece(): SVGElement {
  const W = 170;
  const H = 22;
  const cy = 11;
  const s = mk('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true' });
  const half = mk('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.3', 'stroke-linecap': 'round' }, s);
  mk('path', { d: `M72 ${cy} C 58 ${cy - 7}, 44 ${cy + 7}, 30 ${cy}` }, half);
  mk('path', { d: spiralD(22, cy, 5.5, 1.3, 0, 1) }, half);
  berry(51, cy, 1.5, half);
  const mirror = half.cloneNode(true) as SVGElement;
  mirror.setAttribute('transform', `translate(${W},0) scale(-1,1)`);
  s.appendChild(mirror);
  diamond(W / 2, cy, 4, s);
  return s;
}

/* 페이지의 오너먼트 슬롯을 모두 채운다 (중복 호출 안전) */
export function initOrnaments() {
  // 폴리오 프레임 코너 — 모바일(≤768px)은 display:none이므로 SVG 생성 자체를 생략.
  // 이후 데스크톱 폭으로 커지는 순간(태블릿 회전 등) 한 번만 채운다.
  const fillCorners = () => {
    document.querySelectorAll('.folio-frame .corner').forEach((c) => {
      if (!c.querySelector('svg')) c.appendChild(cornerFlourish());
    });
  };
  const mqDesk = matchMedia('(min-width: 769px)');
  if (mqDesk.matches) fillCorners();
  else mqDesk.addEventListener('change', (e) => e.matches && fillCorners(), { once: true });
  document.querySelectorAll('[data-orn="headpiece"]').forEach((n) => {
    if (!n.querySelector('svg')) n.appendChild(headpiece());
  });
  document.querySelectorAll('[data-orn="tailpiece"]').forEach((n) => {
    if (!n.querySelector('svg')) n.appendChild(tailpiece());
  });
}
