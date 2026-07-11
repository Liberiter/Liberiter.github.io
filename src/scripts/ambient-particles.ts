// 전역 앰비언트 파티클 (v4 — WORLDBOOK §3.3)
// 파티클을 "문서 좌표"에 앵커: 스크롤하면 콘텐츠와 함께 흘러가고,
// 아래 화면엔 거기 뿌려져 있던 새 파티클이 나타난다.
// 캔버스는 성능상 fixed, 매 프레임 worldY - scrollY 위치에 그린다.
// 밀도: 뷰포트 한 화면당 미세 입자 44 + 발광 입자 12 — 양 테마 동등.
// 모바일(<768px)은 60%로 축소. 다크 = 별 + 반딧불이 / 라이트 = 황금 먼지 + 발광 먼지.
//
// 성능 (모바일 QA 반영):
// - DPR 캡 1.5 — 고DPR 폰에서 픽셀 과대 렌더 방지
// - 발광 헤일로는 매 프레임 createRadialGradient 대신, init 때 한 번 그린
//   radial-gradient 스프라이트(오프스크린 캔버스)를 drawImage로 찍는다
// - 탭이 숨겨지면 rAF 루프 정지, 다시 보이면 재개 (visibilitychange)

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

interface Mover extends Star {
  vx: number;
  vy: number;
}

export function initAmbientParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const root = document.documentElement;
  const mqMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let stars: Star[] = [];
  let movers: Mover[] = [];
  let rafId: number | null = null;
  let dpr = 1;
  let docHpx = 0; // 문서 전체 높이 (캔버스 픽셀 단위)
  let frameCount = 0;
  let glowSprite: HTMLCanvasElement | null = null;
  let haloScale = 6; // 헤일로 반경 = r * haloScale (라이트는 축소 — 얼룩 방지)

  // Base.astro 인라인 스크립트가 페인트 전에 항상 data-theme를 확정한다
  const isDark = () => root.dataset.theme !== 'light';
  const docHeight = () => document.documentElement.scrollHeight;

  function sizeCanvas() {
    // DPR 캡 1.5 — 3x 폰에서도 렌더 픽셀을 절반 이하로
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  }

  // 발광 헤일로 스프라이트 — init 때 한 번만 그린다 (프레임당 그라데이션 생성 제거)
  const SPRITE = 64;
  function makeGlowSprite(color: string, centerAlpha: number): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = SPRITE;
    c.height = SPRITE;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
    grad.addColorStop(0, `rgba(${color},${centerAlpha})`);
    grad.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, SPRITE, SPRITE);
    return c;
  }

  function mkStar(): Star {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * docHpx,
      r: (0.5 + Math.random() * 0.9) * dpr,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.018,
    };
  }

  function mkMover(): Mover {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * docHpx,
      r: (1.4 + Math.random() * 1.8) * dpr,
      vx: (Math.random() - 0.5) * 0.16 * dpr,
      vy: -(0.04 + Math.random() * 0.1) * dpr,
      phase: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.012,
    };
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  function startLoop() {
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function init() {
    sizeCanvas();
    docHpx = docHeight() * dpr;
    // 테마별 헤일로 — 라이트 발광 먼지는 반경·불투명도를 낮춰 "은은한 먼지"로
    const dark = isDark();
    haloScale = dark ? 6 : 4.5;
    glowSprite = makeGlowSprite(dark ? '212,170,48' : '139,105,20', dark ? 0.5 : 0.3);
    // 화면(100dvh)당 동일 밀도 — 문서 높이에 비례해 생성. 모바일은 60%
    const screens = Math.max(1, docHeight() / Math.max(1, window.innerHeight));
    const density = window.innerWidth < 768 ? 0.6 : 1;
    const ns = Math.round(44 * screens * density);
    const nm = Math.round(12 * screens * density);
    stars = [];
    movers = [];
    for (let i = 0; i < ns; i++) stars.push(mkStar());
    for (let i = 0; i < nm; i++) movers.push(mkMover());
    if (mqMotion.matches) {
      // 모션 감소: 정적 프레임 한 장
      stopLoop();
      drawFrame(true);
      return;
    }
    startLoop();
  }

  function drawFrame(staticFrame: boolean) {
    const dark = isDark();
    const w = canvas.width;
    const h = canvas.height;
    const offY = (window.scrollY || 0) * dpr; // 문서 좌표 → 화면 좌표
    const margin = 100 * dpr; // 뷰포트 밖 ±100px 스킵
    ctx!.clearRect(0, 0, w, h);

    // 미세 입자 — 다크: 크림빛 별 / 라이트: 진한 금 먼지. 문서 공간 고정, 반짝임만
    const starColor = dark ? '240,232,206' : '184,134,11';
    for (const p of stars) {
      if (!staticFrame) p.phase += p.speed;
      const sy = p.y - offY;
      if (sy < -margin || sy > h + margin) continue;
      const tw = 0.5 + 0.5 * Math.sin(p.phase);
      ctx!.fillStyle = `rgba(${starColor},${(0.16 + tw * 0.44).toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(p.x, sy, p.r, 0, Math.PI * 2);
      ctx!.fill();
    }

    // 발광 입자 — 다크: 반딧불이 / 라이트: 큰 황금 먼지. 문서 좌표 기준 느린 표류
    const color = dark ? '212,170,48' : '139,105,20';
    for (let i = 0; i < movers.length; i++) {
      const p = movers[i];
      if (!staticFrame) {
        p.phase += p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.12 * dpr;
        p.y += p.vy;
        if (p.y < -10) p.y = docHpx + 5; // 분포 공간 상단 이탈 → 하단 재진입
        if (p.x < -10 || p.x > w + 10) {
          movers[i] = mkMover();
          continue;
        }
      }
      const sy = p.y - offY;
      if (sy < -margin || sy > h + margin) continue;
      const pulse = 0.5 + 0.5 * Math.sin(p.phase * 3);
      const alpha = 0.25 + pulse * 0.55; // 라이트=다크 동일 밝기 (코어 점 기준)
      // 헤일로 — 미리 그린 스프라이트를 스케일해 찍는다
      if (glowSprite) {
        const hr = p.r * haloScale;
        ctx!.globalAlpha = alpha;
        ctx!.drawImage(glowSprite, p.x - hr, sy - hr, hr * 2, hr * 2);
        ctx!.globalAlpha = 1;
      }
      ctx!.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(p.x, sy, p.r, 0, Math.PI * 2);
      ctx!.fill();
    }
  }

  function loop() {
    frameCount++;
    // 문서 높이 변화 감지(약 1초 주기) → 재분포
    if (frameCount % 60 === 0) {
      const dh = docHeight() * dpr;
      if (Math.abs(dh - docHpx) > 2 * dpr) {
        rafId = null; // init의 startLoop가 새 루프를 건다
        init();
        return;
      }
    }
    drawFrame(false);
    rafId = requestAnimationFrame(loop);
  }

  // 탭 숨김 → 루프 정지 / 복귀 → 재개 (fixed 캔버스라 IntersectionObserver는 불필요)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLoop();
    else if (!mqMotion.matches) startLoop();
  });

  // 테마 전환 → 색·분포 재생성 (Base.astro 토글이 발행하는 이벤트)
  document.addEventListener('theme-changed', init);

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });

  mqMotion.addEventListener('change', () => {
    if (mqMotion.matches) stopLoop();
    init();
  });

  // 모션 감소: 스크롤 시 현재 위치의 정적 프레임 재그리기 (rAF 스로틀)
  // — 문서 좌표 앵커이므로 스크롤에 따라 보이는 파티클이 달라져야 한다
  let staticScrollPending = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!mqMotion.matches || staticScrollPending) return;
      staticScrollPending = true;
      requestAnimationFrame(() => {
        staticScrollPending = false;
        drawFrame(true);
      });
    },
    { passive: true }
  );

  init();
}
