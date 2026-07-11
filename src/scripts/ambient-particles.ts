// 전역 앰비언트 파티클 (v4 — WORLDBOOK §3.3)
// 파티클을 "문서 좌표"에 앵커: 스크롤하면 콘텐츠와 함께 흘러가고,
// 아래 화면엔 거기 뿌려져 있던 새 파티클이 나타난다.
// 캔버스는 성능상 fixed, 매 프레임 worldY - scrollY 위치에 그린다.
// 밀도: 뷰포트 한 화면당 미세 입자 44 + 발광 입자 12 — 양 테마 동등.
// 다크 = 별 + 반딧불이 / 라이트 = 황금 먼지 + 발광 먼지.

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

  // Base.astro 인라인 스크립트가 페인트 전에 항상 data-theme를 확정한다
  const isDark = () => root.dataset.theme !== 'light';
  const docHeight = () => document.documentElement.scrollHeight;

  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
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

  function init() {
    sizeCanvas();
    docHpx = docHeight() * dpr;
    // 화면(100dvh)당 동일 밀도 — 문서 높이에 비례해 생성
    const screens = Math.max(1, docHeight() / Math.max(1, window.innerHeight));
    const ns = Math.round(44 * screens);
    const nm = Math.round(12 * screens);
    stars = [];
    movers = [];
    for (let i = 0; i < ns; i++) stars.push(mkStar());
    for (let i = 0; i < nm; i++) movers.push(mkMover());
    if (mqMotion.matches) {
      // 모션 감소: 정적 프레임 한 장
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      drawFrame(true);
      return;
    }
    if (rafId === null) loop();
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
      const alpha = 0.25 + pulse * 0.55; // 라이트=다크 동일 밝기
      const grad = ctx!.createRadialGradient(p.x, sy, 0, p.x, sy, p.r * 6);
      grad.addColorStop(0, `rgba(${color},${(alpha * 0.5).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${color},0)`);
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(p.x, sy, p.r * 6, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(p.x, sy, p.r, 0, Math.PI * 2);
      ctx!.fill();
    }
  }

  function loop() {
    if (document.hidden) {
      rafId = requestAnimationFrame(loop);
      return;
    }
    frameCount++;
    // 문서 높이 변화 감지(약 1초 주기) → 재분포
    if (frameCount % 60 === 0) {
      const dh = docHeight() * dpr;
      if (Math.abs(dh - docHpx) > 2 * dpr) {
        init();
        rafId = requestAnimationFrame(loop);
        return;
      }
    }
    drawFrame(false);
    rafId = requestAnimationFrame(loop);
  }

  // 테마 전환 → 색·분포 재생성 (Base.astro 토글이 발행하는 이벤트)
  document.addEventListener('theme-changed', init);

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });

  mqMotion.addEventListener('change', () => {
    if (mqMotion.matches && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
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
