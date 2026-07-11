export function initScrollAnimations() {
  const elements = document.querySelectorAll<HTMLElement>("[data-animate]");
  if (elements.length === 0) return;

  // 모바일·터치 기기: 등장 애니메이션 생략 (global.css 미디어 쿼리와 쌍).
  // 1열 레이아웃에선 스크롤 내내 카드 여러 장이 동시에 트랜지션되어
  // (blend-mode grain + filter 코너 장식까지 매 프레임 재합성) 버벅임의 주범이 된다
  if (matchMedia("(pointer: coarse)").matches || window.innerWidth < 768) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // stagger delay 적용
  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((container) => {
    const children = container.querySelectorAll<HTMLElement>("[data-animate]");
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    // rootMargin 하단 +15%: 요소가 뷰포트에 들어오기 전에 미리 발화 —
    // 빠른 스크롤에도 콘텐츠가 빈 채로 기다리지 않는다
    { threshold: 0, rootMargin: "0px 0px 15% 0px" }
  );

  elements.forEach((el) => observer.observe(el));

  // 관찰 실패 폴백 — 어떤 이유로든(옵저버 미발화·조건 미충족) 3초가 지나면 전부 드러낸다
  window.setTimeout(() => {
    elements.forEach((el) => {
      if (!el.classList.contains("is-visible")) {
        el.classList.add("is-visible");
        observer.unobserve(el);
      }
    });
  }, 3000);
}
