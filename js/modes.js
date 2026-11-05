// Режими тренування. Кожен отримує ctx і викликає ctx.answer(grade, opts), коли відповідь готова.
// grade: 0 = не знаю / помилка, 1 = важко, 2 = знаю / правильно
import { speak } from "./tts.js";

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const $ = id => document.getElementById(id);
const CZ_LETTERS = ["á", "č", "ď", "é", "ě", "í", "ň", "ó", "ř", "š", "ť", "ú", "ů", "ý", "ž"];

// ---------- спільне ----------
const kind = w => (/вид/.test(w.note) ? "verb" : /рід|множина/.test(w.note) ? "noun" : /\s/.test(w.cz.trim()) ? "phrase" : "other");

function distractors(w, pool, field, n = 3) {
  const seen = new Set([w[field].toLowerCase()]);
  const pick = list => {
    const out = [];
    for (const x of shuffle([...list])) {
      const v = x[field].toLowerCase();
      if (x.id === w.id || seen.has(v)) continue;
      seen.add(v); out.push(x);
      if (out.length >= n) break;
    }
    return out;
  };
  const same = pool.filter(x => kind(x) === kind(w));
  let out = pick(same);
  if (out.length < n) out = out.concat(pick(pool).slice(0, n - out.length));
  return out;
}

// Нормалізація для перевірки написаного: регістр, пробіли, крапки/…/?/! у кінці. Діакритика ВАЖЛИВА.
export const norm = s => s.toLowerCase().replace(/[…]/g, "").replace(/\s+/g, " ").replace(/^[\s«"']+|[\s.?!,;:»"']+$/g, "").trim();

// Усі прийнятні варіанти: повний рядок, частини через «/», частини через кому (якщо це окремі слова)
export function acceptable(cz) {
  const out = new Set([norm(cz)]);
  for (const part of cz.split("/")) {
    out.add(norm(part));
    const commas = part.split(",").map(x => x.trim()).filter(Boolean);
    if (commas.length > 1 && commas.every(x => !/\s/.test(x))) commas.forEach(x => out.add(norm(x)));
  }
  out.delete("");
  return out;
}

function diffHtml(typed, expected) {
  const a = [...typed], b = [...expected];
  return b.map((ch, i) => `<span class="${a[i] && a[i].toLowerCase() === ch.toLowerCase() ? "ok" : "no"}">${esc(ch)}</span>`).join("");
}

const reveal = w => `
  <div class="reveal">
    <div class="word cz">${esc(w.cz)} <button class="say" data-say>🔊</button></div>
    <div class="pron">[${esc(w.pron)}]</div>
    <div class="tr">${esc(w.ua)}</div>
    ${w.note ? `<div class="note">${esc(w.note)}</div>` : ""}
  </div>`;

function bindSay(root, w) {
  root.querySelectorAll("[data-say]").forEach(b => (b.onclick = e => { e.stopPropagation(); speak(w.cz); }));
}

// ---------- 1. Картки ----------
export function cards(ctx) {
  const { w, item } = ctx;
  const czFront = item.dir === "r";
  ctx.mount(`
    ${item.isNew ? `<div class="tag">Нове слово</div>` : ""}
    <div class="card" id="card" tabindex="0">
      <div class="face front">
        <div class="word ${czFront ? "cz" : ""}">${esc(czFront ? w.cz : w.ua)}</div>
        ${czFront ? `<button class="say" data-say>🔊</button>` : ""}
        <div class="tap muted small">Торкнись, щоб перевернути</div>
      </div>
      <div class="face back">${reveal(w)}</div>
    </div>
    <div class="answers" id="answers"><button class="btn wide" id="flip">Показати <kbd>пробіл</kbd></button></div>`);
  const card = $("card");
  let flipped = false;
  const flip = () => {
    if (flipped) return;
    flipped = true; card.classList.add("flipped");
    $("answers").innerHTML = `
      <button class="btn bad" data-g="0">Не знаю <kbd>1</kbd></button>
      <button class="btn mid" data-g="1">Важко <kbd>2</kbd></button>
      <button class="btn good" data-g="2">Знаю <kbd>3</kbd></button>`;
    document.querySelectorAll("[data-g]").forEach(b => (b.onclick = () => ctx.answer(+b.dataset.g)));
    if (!czFront) speak(w.cz);
  };
  bindSay(card, w);
  card.onclick = flip;
  $("flip").onclick = flip;
  let x0 = null;
  card.ontouchstart = e => (x0 = e.touches[0].clientX);
  card.ontouchend = e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (flipped && Math.abs(dx) >= 60) ctx.answer(dx > 0 ? 2 : 0);
  };
  if (czFront && item.isNew) speak(w.cz);
  ctx.keys(e => {
    if (e.key === " ") { e.preventDefault(); flip(); }
    else if (flipped && ["1", "2", "3"].includes(e.key)) ctx.answer(+e.key - 1);
  });
}

// ---------- 2. Тест з варіантами ----------
export function quiz(ctx) {
  const { w, item, pool } = ctx;
  const czPrompt = item.dir === "r";
  const ask = czPrompt ? "ua" : "cz";
  const opts = shuffle([w, ...distractors(w, pool, ask)]);
  ctx.mount(`
    <div class="prompt">
      <div class="muted small">${czPrompt ? "Обери переклад" : "Обери чеське слово"}</div>
      <div class="word ${czPrompt ? "cz" : ""}">${esc(czPrompt ? w.cz : w.ua)}</div>
      ${czPrompt ? `<button class="say" data-say>🔊</button>` : ""}
    </div>
    <div class="options" id="opts">
      ${opts.map((o, i) => `<button class="btn opt ${ask === "cz" ? "cz" : ""}" data-i="${i}"><kbd>${i + 1}</kbd> ${esc(o[ask])}</button>`).join("")}
    </div>
    <div id="after"></div>`);
  bindSay(document, w);
  if (czPrompt) speak(w.cz);
  let done = false;
  const choose = i => {
    if (done) return; done = true;
    const right = opts[i].id === w.id;
    document.querySelectorAll(".opt").forEach((b, j) => {
      b.disabled = true;
      if (opts[j].id === w.id) b.classList.add("right");
      else if (j === i) b.classList.add("wrong");
    });
    if (!czPrompt || !right) speak(w.cz);
    const go = () => ctx.answer(right ? 2 : 0, { stepCap: 3 });
    // якщо далі буде написання, відкриваємо клавіатуру зараз, поки це ще відповідь на дотик
    if (right) { ctx.prepKeyboard(); setTimeout(go, 700); return; }
    $("after").innerHTML = `${reveal(w)}<button class="btn primary wide" id="next">Далі <kbd>Enter</kbd></button>`;
    bindSay($("after"), w);
    $("next").onclick = go;
    ctx.keys(e => { if (e.key === "Enter") go(); });
  };
  document.querySelectorAll(".opt").forEach(b => (b.onclick = () => choose(+b.dataset.i)));
  ctx.keys(e => { if (["1", "2", "3", "4"].includes(e.key)) choose(+e.key - 1); });
}

// ---------- 3. Написання і 4. Аудіо ----------
function typing(ctx, { audio }) {
  const { w } = ctx;
  ctx.mount(`
    <div class="prompt">
      ${audio
        ? `<div class="muted small">Послухай і напиши чеською</div>
           <div class="listen"><button class="say big" data-say id="play">🔊</button><button class="btn slim" id="slow">🐢 Повільно</button></div>`
        : `<div class="muted small">Напиши чеською</div><div class="word">${esc(w.ua)}</div>`}
    </div>
    <form id="f" autocomplete="off">
      <input id="inp" class="inp" lang="cs" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Твоя відповідь">
      <div class="letters">${CZ_LETTERS.map(l => `<button type="button" class="ltr">${l}</button>`).join("")}</div>
      <div class="row2">
        <button type="button" class="btn" id="skip">Не знаю</button>
        <button class="btn primary" id="check">Перевірити</button>
      </div>
    </form>
    <div id="after"></div>`);
  let done = false, lastGrade = 0;
  const inp = $("inp");
  const focusInp = () => { if (!done) inp.focus({ preventScroll: true }); };
  if (audio) {
    // кнопки звуку заодно відкривають клавіатуру (дотик дозволяє iOS це зробити)
    $("play").onclick = e => { e.stopPropagation(); speak(w.cz); focusInp(); };
    $("slow").onclick = e => { e.stopPropagation(); speak(w.cz, { slow: true }); focusInp(); };
    $("slow").onmousedown = $("play").onmousedown = e => e.preventDefault();
    speak(w.cz);
  }
  // дотик будь-де по картці із завданням теж відкриває клавіатуру
  document.querySelector(".prompt").addEventListener("click", focusInp);
  document.querySelectorAll(".ltr").forEach(b => {
    b.onmousedown = e => e.preventDefault(); // не забирати фокус з поля
    b.onclick = () => {
      const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? s;
      inp.value = inp.value.slice(0, s) + b.textContent + inp.value.slice(e);
      inp.setSelectionRange(s + 1, s + 1); inp.focus();
    };
  });
  // фокус одразу, у тому ж дотику, що й перехід, — тоді iOS не ховає клавіатуру
  inp.focus({ preventScroll: true });
  setTimeout(() => { if (document.activeElement !== inp && !done) inp.focus({ preventScroll: true }); }, 50);
  const check = given => {
    if (done) return; done = true;
    const typed = norm(given);
    const right = typed !== "" && acceptable(w.cz).has(typed);
    inp.readOnly = true;
    if (right) {
      // правильно: поле лишається у фокусі, клавіатура не закривається; Enter = «Далі»
      $("f").classList.add("locked");
    } else {
      // помилка: ховаємо поле й клавіатуру, щоб розбір помилки було видно цілком
      inp.blur();
      $("f").hidden = true;
    }
    $("after").innerHTML = `
      <div class="verdict ${right ? "good" : "bad"}">${right ? "Правильно" : typed ? "Помилка" : "Правильна відповідь"}</div>
      ${!right && typed ? `<div class="diff"><div class="muted small">Ти написала: ${esc(given.trim())}</div><div class="word">${diffHtml(typed, norm(w.cz))}</div></div>` : ""}
      ${reveal(w)}
      <button class="btn primary wide" id="next">Далі <kbd>Enter</kbd></button>`;
    bindSay($("after"), w);
    if (!audio || !right) speak(w.cz);
    lastGrade = right ? 2 : 0;
    const go = () => ctx.answer(lastGrade);
    $("next").onclick = go;
    $("next").onmousedown = e => e.preventDefault();
    if (right) inp.focus({ preventScroll: true });
    else {
      // після того як клавіатура сховається, показуємо розбір від завдання до кнопки «Далі»
      const show = () => {
        document.querySelector(".prompt").scrollIntoView({ block: "start", behavior: "smooth" });
        const nb = $("next");
        if (nb && nb.getBoundingClientRect().bottom > window.innerHeight) nb.scrollIntoView({ block: "end", behavior: "smooth" });
      };
      setTimeout(show, 350);
    }
    ctx.keys(e => { if (e.key === "Enter" && document.activeElement !== inp) { e.preventDefault(); go(); } });
  };
  $("f").onsubmit = e => { e.preventDefault(); if (done) ctx.answer(lastGrade); else check(inp.value); };
  $("skip").onclick = () => check("");
  // кнопки не забирають фокус у поля — клавіатура лишається відкритою
  ["skip", "check"].forEach(id => ($(id).onmousedown = e => e.preventDefault()));
  ctx.keys(() => {});
}

export const type = ctx => typing(ctx, { audio: false });
export const audio = ctx => typing(ctx, { audio: true });

// Який режим показати в щоденній сесії
export function pickMode(item, st) {
  const step = st ? st.step : 0;
  if (item.isNew) return "cards";
  if (item.dir === "r") {
    if (step <= 1) return "quiz";
    return ["cards", "quiz", "audio"][Math.floor(Math.random() * 3)];
  }
  if (step === 0) return "quiz";
  if (step === 1) return Math.random() < 0.5 ? "quiz" : "type";
  return "type";
}
