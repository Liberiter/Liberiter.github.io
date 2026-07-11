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
// - 모바일(<768px 또는 coarse pointer)은 상시 rAF 루프 없이 "정적 파티클":
//   표류·반짝임을 끄고, 스크롤 때만 rAF 스로틀로 현재 위치 프레임을 다시 그린다
//   (reduced-motion과 같은 경로). 데스크톱은 현행 유지
// - 모바일은 분포 공간을 히어로/배너([data-hd-range])까지로 제한:
//   히어로를 지나면 파티클이 없으므로 본문 스크롤 중 그리기 부담이 사라진다

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
  const mqCoarse = matchMedia('(pointer: coarse)');
  // 모바일 판정 — 좁은 화면(<768px) 또는 터치 주력 기기(태블릿 포함)
  const isMobileView = () => window.innerWidth < 768 || mqCoarse.matches;
  // 정적 모드 — 모션 감소 또는 모바일: 루프 없이 스크롤 때만 재그리기
  const isStatic = () => mqMotion.matches || isMobileView();

  let stars: Star[] = [];
  let movers: Mover[] = [];
  let rafId: number | null = null;
  let dpr = 1;
  let docHpx = 0; // 파티클 분포 공간 높이 (캔버스 픽셀 단위) — 데스크톱: 문서 전체 / 모바일: 히어로까지
  let frameCount = 0;
  let glowSprite: HTMLCanvasElement | null = null;
  let haloScale = 6; // 헤일로 반경 = r * haloScale (라이트는 축소 — 얼룩 방지)

  // Base.astro 인라인 스크립트가 페인트 전에 항상 data-theme를 확정한다
  const isDark = () => root.dataset.theme !== 'light';
  const docHeight = () => document.documentElement.scrollHeight;
  // 히어로/배너 하단의 문서 좌표 — 모든 페이지가 [data-hd-range]를 가진다 (없으면 한 화면)
  function heroBottom() {
    const el = document.querySelector('[data-hd-range]');
    if (!el) return window.innerHeight;
    return el.getBoundingClientRect().bottom + (window.scrollY || 0);
  }
  // 분포 공간 높이(CSS px) — 모바일은 히어로까지만 뿌려 본문 스크롤 부담 제거
  const distHeight = () => (isMobileView() ? heroBottom() : docHeight());

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
    const distH = distHeight();
    docHpx = distH * dpr;
    // 테마별 헤일로 — 라이트 발광 먼지는 반경·불투명도를 낮춰 "은은한 먼지"로
    const dark = isDark();
    haloScale = dark ? 6 : 4.5;
    glowSprite = makeGlowSprite(dark ? '212,170,48' : '139,105,20', dark ? 0.5 : 0.3);
    // 화면(100dvh)당 동일 밀도 — 분포 공간 높이에 비례해 생성. 모바일은 60%
    // (모바일 배너는 한 화면보다 작을 수 있으므로 하한 0.5화면 분량은 보장)
    const screens = Math.max(isMobileView() ? 0.5 : 1, distH / Math.max(1, window.innerHeight));
    const density = isMobileView() ? 0.6 : 1;
    const ns = Math.round(44 * screens * density);
    const nm = Math.round(12 * screens * density);
    stars = [];
    movers = [];
    for (let i = 0; i < ns; i++) stars.push(mkStar());
    for (let i = 0; i < nm; i++) movers.push(mkMover());
    if (isStatic()) {
      // 모션 감소·모바일: 정적 프레임 한 장 (스크롤 핸들러가 위치 갱신)
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
    else if (!isStatic()) startLoop();
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

  // 정적 모드(모션 감소·모바일): 스크롤을 "따라가는" 임시 rAF 루프.
  // 스크롤 이벤트만 믿으면 관성 스크롤(fling) 중 이벤트가 띄엄띄엄 와서
  // 멈춘 뒤에야 파티클이 제자리를 찾는다("파팟"). 스크롤이 시작되면
  // 매 프레임 scrollY를 직접 읽어 그리고, 움직임이 잦아들면 루프를 끈다.
  let followRaf = 0;
  let followLastY = -1;
  let followIdle = 0;
  function followLoop() {
    const y = window.scrollY || 0;
    if (y !== followLastY) {
      followLastY = y;
      followIdle = 0;
      if (isMobileView()) {
        // 모바일 분포 공간은 히어로 높이라 문서 높이 변화와 무관 — 재감지 없이 그리기만
        // (스크롤 중 getBoundingClientRect 강제 레이아웃도 피한다)
        drawFrame(true);
      } else {
        // 루프가 없는 모드이므로 문서 높이 변화도 여기서 감지 → 재분포
        const dh = docHeight() * dpr;
        if (Math.abs(dh - docHpx) > 2 * dpr) init();
        else drawFrame(true);
      }
    } else if (++followIdle > 15) {
      // ~0.25초 정지 → 추적 종료 (다음 스크롤에서 다시 시작)
      followRaf = 0;
      return;
    }
    followRaf = requestAnimationFrame(followLoop);
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!isStatic() || followRaf) return;
      followLastY = -1; // 첫 프레임은 무조건 그린다
      followRaf = requestAnimationFrame(followLoop);
    },
    { passive: true }
  );

  init();
}
