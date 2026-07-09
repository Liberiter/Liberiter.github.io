export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);

// "약 N분의 여정" — 한글 기준 분당 500자
export const readingTime = (body = '') =>
  Math.max(1, Math.round(body.replace(/\s+/g, '').length / 500));
