// Розумне повторення «сходинками».
// Сходинка → через скільки днів наступне повторення.
export const INTERVALS = [0, 1, 3, 7, 16, 35];
export const MAX_STEP = INTERVALS.length - 1;
export const DIRS = { R: "r", P: "p" }; // r: чеська → українська, p: українська → чеська

export function today(d = new Date()) {
  const z = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return today(new Date(y, m - 1, d + n));
}

export const keyOf = (wordId, dir) => `${wordId}:${dir}`;

// grade: 0 = не знаю, 1 = важко, 2 = знаю
// maxGain: на скільки сходинок може піднятися слово (тест з варіантами обмежує це в наступних етапах)
export function review(state, grade, { day = today(), stepCap = MAX_STEP } = {}) {
  const s = { step: 0, ok: 0, bad: 0, ...(state || {}) };
  if (grade === 0) { s.step = 0; s.bad++; }
  else if (grade === 2) { s.ok++; if (s.step < stepCap) s.step = Math.min(s.step + 1, MAX_STEP); }
  else { s.ok++; }
  s.due = addDays(day, INTERVALS[s.step]);
  s.seen = day;
  return s;
}

// Чи треба ще раз показати картку в цій же сесії
export const againToday = s => s.step === 0;

export function status(s) {
  if (!s) return "new";
  if (s.step >= MAX_STEP) return "done";
  if (s.step >= 3) return "known";
  return "learning";
}
