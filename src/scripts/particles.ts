interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacityDir: number;
  type: "star" | "firefly" | "sparkle" | "mote";
  life: number;
  maxLife: number;
  angle: number;
  // 반딧불이 전용
  wobbleOffset: number;
  wobbleSpeed: number;
}

const DARK_CONFIG = {
  types: ["star", "firefly", "sparkle"] as const,
  starCount: 50,
  fireflyCount: 15,
  sparkleChance: 0.008,
  colors: {
    star: "#ffffff",
    firefly: "#f0d060",
    sparkle: "#f0d060",
  },
};

const LIGHT_CONFIG = {
  types: ["mote", "sparkle"] as const,
  moteCount: 25,
  sparkleChance: 0.005,
  colors: {
    mote: "#d4aa30",
    sparkle: "#d4aa30",
  },
};

export function initParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) return;

  let particles: Particle[] = [];
  let animId = 0;
  let theme: "dark" | "light" = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
  let isVisible = true;
  let lastTime = 0;

  const isMobile = window.innerWidth < 768;
  const maxParticles = isMobile ? 40 : 80;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx!.scale(dpr, dpr);
  }

  function createStar(): Particle {
    return {
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight * 0.6,
      vx: 0, vy: 0,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      opacityDir: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.008 + 0.003),
      type: "star",
      life: 0, maxLife: Infinity,
      angle: 0,
      wobbleOffset: 0, wobbleSpeed: 0,
    };
  }

  function createFirefly(): Particle {
    return {
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight * 0.3 + Math.random() * canvas.offsetHeight * 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
      opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.01,
      type: "firefly",
      life: 0, maxLife: Infinity,
      angle: 0,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  function createMote(): Particle {
    return {
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight * 0.2 + Math.random() * canvas.offsetHeight * 0.6,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.3 - 0.1,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.4 + 0.2,
      opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.006,
      type: "mote",
      life: 0, maxLife: Infinity,
      angle: 0,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.015 + 0.005,
    };
  }

  function createSparkle(x?: number, y?: number): Particle {
    return {
      x: x ?? Math.random() * canvas.offsetWidth,
      y: y ?? Math.random() * canvas.offsetHeight * 0.7,
      vx: 0, vy: 0,
      size: Math.random() * 3 + 2,
      opacity: 1,
      opacityDir: -0.02,
      type: "sparkle",
      life: 0,
      maxLife: 60,
      angle: Math.random() * Math.PI * 2,
      wobbleOffset: 0, wobbleSpeed: 0,
    };
  }

  function spawnThemeParticles() {
    particles = [];
    if (theme === "dark") {
      const starCount = isMobile ? 25 : DARK_CONFIG.starCount;
      const fireflyCount = isMobile ? 8 : DARK_CONFIG.fireflyCount;
      for (let i = 0; i < starCount; i++) particles.push(createStar());
      for (let i = 0; i < fireflyCount; i++) particles.push(createFirefly());
    } else {
      const moteCount = isMobile ? 12 : LIGHT_CONFIG.moteCount;
      for (let i = 0; i < moteCount; i++) particles.push(createMote());
    }
  }

  function drawStar(p: Particle) {
    ctx!.beginPath();
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx!.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx!.fill();
  }

  function drawFirefly(p: Particle) {
    ctx!.save();
    ctx!.beginPath();
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx!.fillStyle = `rgba(240, 208, 96, ${p.opacity})`;
    ctx!.shadowColor = "#f0d060";
    ctx!.shadowBlur = 15;
    ctx!.fill();
    ctx!.restore();
  }

  function drawMote(p: Particle) {
    ctx!.save();
    ctx!.beginPath();
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx!.fillStyle = `rgba(212, 170, 48, ${p.opacity})`;
    ctx!.shadowColor = "rgba(212, 170, 48, 0.4)";
    ctx!.shadowBlur = 8;
    ctx!.fill();
    ctx!.restore();
  }

  function drawSparkle(p: Particle) {
    ctx!.save();
    ctx!.translate(p.x, p.y);
    ctx!.rotate(p.angle);
    const color = theme === "dark" ? "240, 208, 96" : "180, 140, 30";
    ctx!.strokeStyle = `rgba(${color}, ${p.opacity})`;
    ctx!.lineWidth = 1;
    ctx!.beginPath();
    // 4-point star
    const s = p.size;
    ctx!.moveTo(0, -s);
    ctx!.lineTo(0, s);
    ctx!.moveTo(-s, 0);
    ctx!.lineTo(s, 0);
    ctx!.stroke();
    ctx!.restore();
  }

  function update(dt: number) {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life++;

      // 수명 끝난 파티클 제거
      if (p.maxLife !== Infinity && p.life > p.maxLife) {
        particles.splice(i, 1);
        continue;
      }

      // opacity 흔들림
      p.opacity += p.opacityDir;
      if (p.type === "sparkle") {
        if (p.opacity <= 0) { particles.splice(i, 1); continue; }
      } else {
        if (p.opacity > 0.9) p.opacityDir = -Math.abs(p.opacityDir);
        if (p.opacity < 0.1) p.opacityDir = Math.abs(p.opacityDir);
      }

      // 반딧불이: 부드러운 사인파 움직임
      if (p.type === "firefly") {
        p.wobbleOffset += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobbleOffset) * 0.5;
        p.y += p.vy + Math.cos(p.wobbleOffset * 0.7) * 0.3;
        // 화면 밖으로 나가면 반대편에서 등장
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < h * 0.1) p.vy = Math.abs(p.vy);
        if (p.y > h * 0.9) p.vy = -Math.abs(p.vy);
      }

      // 먼지 입자: 위로 부드럽게
      if (p.type === "mote") {
        p.wobbleOffset += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobbleOffset) * 0.3;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }
    }

    // 랜덤 반짝임 추가
    const chance = theme === "dark" ? DARK_CONFIG.sparkleChance : LIGHT_CONFIG.sparkleChance;
    if (Math.random() < chance && particles.length < maxParticles) {
      particles.push(createSparkle());
    }
  }

  function draw() {
    ctx!.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    for (const p of particles) {
      switch (p.type) {
        case "star": drawStar(p); break;
        case "firefly": drawFirefly(p); break;
        case "mote": drawMote(p); break;
        case "sparkle": drawSparkle(p); break;
      }
    }
  }

  function loop(time: number) {
    if (!isVisible) { animId = requestAnimationFrame(loop); return; }
    const dt = Math.min(time - lastTime, 50);
    lastTime = time;
    update(dt);
    draw();
    animId = requestAnimationFrame(loop);
  }

  // 테마 변경 리스너
  document.addEventListener("theme-changed", ((e: CustomEvent) => {
    theme = e.detail.theme;
    spawnThemeParticles();
  }) as EventListener);

  // 가시성 최적화
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  }, { threshold: 0 });
  observer.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) isVisible = false;
    else isVisible = true;
  });

  // 초기화
  resize();
  window.addEventListener("resize", resize);
  spawnThemeParticles();
  animId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(animId);
    observer.disconnect();
    window.removeEventListener("resize", resize);
  };
}
