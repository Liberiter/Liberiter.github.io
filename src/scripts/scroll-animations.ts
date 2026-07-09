export function initScrollAnimations() {
  const elements = document.querySelectorAll<HTMLElement>("[data-animate]");
  if (elements.length === 0) return;

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
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}
