// Гра «Знайди пару»: N чеських слів і N перекладів, з'єднати все до кінця таймера.
// На розумне повторення не впливає.
import { esc } from "./modes.js";

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const $ = id => document.getElementById(id);
const PENALTY = 2;

export function matchSetup({ render, words, title, record, onBack, onPlay }) {
  let pairs = Math.min(10, words.length), secs = 30;
  const opt = (name, list, cur, label) => `
    <div class="muted small">${label}</div>
    <div class="seg" data-name="${name}">${list.map(v => `<button data-v="${v}" class="${v === cur ? "on" : ""}" ${name === "pairs" && v > words.length ? "disabled" : ""}>${v}</button>`).join("")}</div>`;
  const draw = () => {
    const best = record && record[`p${pairs}`];
    render(`
      <header class="top"><button class="icon" id="back">←</button><h2>Знайди пару</h2><span></span></header>
      <div class="pad stack">
        <p class="muted">${esc(title)}. З'єднай кожне чеське слово з перекладом до кінця часу. Помилка — мінус ${PENALTY} с.</p>
        ${opt("pairs", [6, 10, 15], pairs, "Пар")}
        ${opt("secs", [20, 30, 60], secs, "Секунд")}
        <p class="muted small">${best ? `Твій рекорд для ${pairs} пар: ${best.toFixed(1)} с` : "Рекорду для цієї кількості пар ще немає"}</p>
        <button class="btn primary big" id="go">Старт</button>
      </div>`);
    $("back").onclick = onBack;
    document.querySelectorAll(".seg").forEach(seg => seg.querySelectorAll("button").forEach(b => (b.onclick = () => {
      if (seg.dataset.name === "pairs") pairs = +b.dataset.v; else secs = +b.dataset.v;
      draw();
    })));
    $("go").onclick = () => onPlay({ pairs, secs });
  };
  draw();
}

export function matchGame({ render, words, pairs, secs, record, onDone, onBack }) {
  const pick = shuffle([...words]).slice(0, pairs);
  const left = shuffle(pick.map(w => ({ id: w.id, text: w.cz })));
  const right = shuffle(pick.map(w => ({ id: w.id, text: w.ua })));
  render(`
    <header class="top">
      <button class="icon" id="close">✕</button>
      <div class="prog timer"><i id="bar" style="width:100%"></i></div>
      <span class="small mono" id="clock">${secs.toFixed(0)}</span>
    </header>
    <div class="match ${pairs > 10 ? "dense" : ""}">
      <div class="col">${left.map(x => `<button class="tile cz" data-side="l" data-id="${x.id}">${esc(x.text)}</button>`).join("")}</div>
      <div class="col">${right.map(x => `<button class="tile" data-side="r" data-id="${x.id}">${esc(x.text)}</button>`).join("")}</div>
    </div>`);
  let sel = null, left_ = pairs, penalty = 0, over = false;
  const t0 = performance.now();
  const elapsed = () => (performance.now() - t0) / 1000 + penalty;
  const tick = () => {
    if (over) return;
    const rem = Math.max(0, secs - elapsed());
    $("clock").textContent = rem.toFixed(0);
    $("bar").style.width = `${(100 * rem) / secs}%`;
    if (rem <= 0) return end(false);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  document.querySelectorAll(".tile").forEach(b => (b.onclick = () => {
    if (over || b.classList.contains("gone")) return;
    if (!sel || sel.dataset.side === b.dataset.side) {
      if (sel) sel.classList.remove("sel");
      sel = b === sel ? null : b;
      if (sel) sel.classList.add("sel");
      return;
    }
    if (sel.dataset.id === b.dataset.id) {
      [sel, b].forEach(x => { x.classList.remove("sel"); x.classList.add("gone"); x.disabled = true; });
      sel = null;
      if (--left_ === 0) end(true);
    } else {
      penalty += PENALTY;
      const a = sel; sel = null;
      [a, b].forEach(x => { x.classList.remove("sel"); x.classList.add("shake"); });
      setTimeout(() => [a, b].forEach(x => x.classList.remove("shake")), 400);
    }
  }));
  $("close").onclick = () => { over = true; onBack(); };

  function end(won) {
    over = true;
    const time = elapsed();
    const prev = record && record[`p${pairs}`];
    const isRecord = won && (!prev || time < prev);
    render(`
      <div class="center stack pad">
        <h2>${won ? "Готово!" : "Час вийшов"}</h2>
        ${won ? `<p class="big-num">${time.toFixed(1)} с</p>` : `<p class="muted">Знайдено ${pairs - left_} з ${pairs} пар</p>`}
        ${isRecord ? `<p>🏆 Новий рекорд для ${pairs} пар!</p>` : prev ? `<p class="muted">Рекорд: ${prev.toFixed(1)} с</p>` : ""}
        <button class="btn primary" id="again">Ще раз</button>
        <button class="btn" id="back">Назад</button>
      </div>`);
    onDone({ won, time, isRecord, pairs });
    $("again").onclick = () => matchGame({ render, words, pairs, secs, record, onDone, onBack });
    $("back").onclick = onBack;
  }
}
