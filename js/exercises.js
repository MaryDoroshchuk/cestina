// Вправи за підручником «Česky raz dva» (граматика уроків, дорослі ситуації).
// Робочий аркуш: усі завдання на одному екрані → «Перевірити» → розбір, результат, найкращий результат зберігається.
// На розклад повторень і серію днів не впливає.
import { speak } from "./tts.js";
import { esc, norm } from "./modes.js";

const $ = id => document.getElementById(id);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clean = s => norm(s).replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();
const TYPE_LABEL = { fill: "Впиши", choice: "Обери", build: "Склади речення" };
const CZ_LETTERS = ["á", "č", "ď", "é", "ě", "í", "ň", "ó", "ř", "š", "ť", "ú", "ů", "ý", "ž"];

let data = null, rec = null;
async function load(ctx) {
  if (!data) data = await (await fetch("data/exercises.json")).json();
  if (!rec) rec = (await ctx.be.loadRecord(ctx.user, "exercises").catch(() => null)) || {};
}
const score = id => rec[id];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const fullSentence = (q, a) => cap(q.replace(/\s*\([^)]*\)/g, "").replace(/^.*→\s*/, "").replace(/^\p{Extended_Pictographic}+\s*/u, "").replace("___", a).trim());

// ---------- список уроків ----------
export async function showExercises(ctx) {
  ctx.render(`<div class="center muted">Завантаження…</div>`);
  await load(ctx);
  ctx.render(`
    <header class="top"><button class="icon" id="back">←</button><h2>Вправи</h2><span></span></header>
    <div class="pad stack">
      <p class="muted small">За підручником «Česky raz dva» (Centrum pro integraci cizinců): граматика уроків, речення з дорослого життя. На прогрес слів не впливає.</p>
      <div class="weeks" style="padding:0">
        ${data.map(l => {
          const done = l.sets.filter(s => score(s.id) && score(s.id).best === score(s.id).total).length;
          const tried = l.sets.filter(s => score(s.id)).length;
          return `<button class="week" data-l="${l.n}">
            <span class="wk">${l.n}</span>
            <span class="wt"><b>${esc(l.cz)}</b><br><span class="muted small">${esc(l.ua)}</span></span>
            <span class="wn">${done ? `${done}/${l.sets.length} ✓` : tried ? `${tried}/${l.sets.length}` : `${l.sets.length} впр.`}</span>
          </button>`;
        }).join("")}
      </div>
    </div>`);
  $("back").onclick = ctx.back;
  document.querySelectorAll("[data-l]").forEach(b => (b.onclick = () => showLesson(ctx, +b.dataset.l)));
}

// ---------- урок ----------
function showLesson(ctx, n) {
  const l = data.find(x => x.n === n);
  ctx.render(`
    <header class="top"><button class="icon" id="back">←</button><h2>Урок ${n}</h2><span></span></header>
    <div class="pad stack">
      <div><b style="font-size:20px">${esc(l.cz)}</b><br><span class="muted">${esc(l.ua)}</span></div>
      ${l.drill && l.drill.length ? `<button class="btn primary mode" id="drill"><span>✍️ Тренувати правопис<br><span class="soon" style="color:inherit;opacity:.8">слова й форми зі шпаргалки · ${l.drill.length}</span></span><span>›</span></button>` : ""}
      <details class="mark" open>
        <summary><span class="mark-sign small-sign">📘</span><span><b>Шпаргалка</b><br><span class="small muted">торкнись чеського слова, щоб почути</span></span></summary>
        <div class="mark-body">${l.grammar}</div>
      </details>
      ${l.sets.map(s => {
        const r = score(s.id);
        return `<button class="btn mode" data-s="${s.id}">
          <span>${esc(s.title)}<br><span class="soon">${TYPE_LABEL[s.type]} · ${s.items.length} завд.</span></span>
          <span class="soon">${r ? `${r.best}/${r.total}${r.best === r.total ? " ✓" : ""}` : ""}</span>
        </button>`;
      }).join("")}
      ${n < data.length ? `<button class="btn" id="next-l">Наступний урок →</button>` : ""}
    </div>`);
  $("back").onclick = () => showExercises(ctx);
  // дотик до чеського слова в шпаргалці — озвучка
  document.querySelectorAll(".say-cz").forEach(b => (b.onclick = () => speak(b.dataset.say)));
  const dr = $("drill"); if (dr) dr.onclick = () => ctx.drill(l, () => showLesson(ctx, l.n));
  document.querySelectorAll("[data-s]").forEach(b => (b.onclick = () => runSet(ctx, l, l.sets.find(s => s.id === b.dataset.s))));
  const nx = $("next-l"); if (nx) nx.onclick = () => showLesson(ctx, n + 1);
}

// ---------- робочий аркуш ----------
function runSet(ctx, l, set) {
  const items = shuffle(set.items.map((it, i) => ({ ...it, i })));
  const state = items.map(() => ({ val: "", picked: [] }));
  ctx.render(`
    <header class="top"><button class="icon" id="back">←</button><h2 class="small-h">${esc(set.title)}</h2><span class="small muted">${l.n}</span></header>
    <div class="pad stack">
      <p class="muted small">${set.type === "fill" ? "Впиши пропущене слово. Підказка в дужках." : set.type === "choice" ? "Обери правильний варіант." : "Натискай слова по черзі, щоб скласти речення. Натисни слово в рядку, щоб повернути його."}</p>
      ${items.map((it, k) => itemHtml(set.type, it, k)).join("")}
      ${set.type === "fill" ? `<div class="letters sticky-letters" id="letters">${CZ_LETTERS.map(c => `<button type="button" class="ltr">${c}</button>`).join("")}</div>` : ""}
      <button class="btn primary big" id="check" style="margin:8px auto 0;display:block">Перевірити</button>
      <div id="summary"></div>
    </div>`);
  $("back").onclick = () => showLesson(ctx, l.n);

  // fill: вставка чеських літер у поле, де курсор
  let lastInp = null;
  document.querySelectorAll(".ex-inp").forEach((inp, k, all) => {
    inp.onfocus = () => (lastInp = inp);
    inp.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); (all[k + 1] || $("check")).focus(); } };
  });
  document.querySelectorAll(".ltr").forEach(b => {
    b.onmousedown = e => e.preventDefault();
    b.onclick = () => {
      const inp = lastInp; if (!inp || inp.readOnly) return;
      const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? s;
      inp.value = inp.value.slice(0, s) + b.textContent + inp.value.slice(e);
      inp.setSelectionRange(s + 1, s + 1); inp.focus();
    };
  });

  // choice
  document.querySelectorAll(".ex-opt").forEach(b => (b.onclick = () => {
    if (b.disabled) return;
    const k = +b.dataset.k;
    state[k].val = b.dataset.v;
    document.querySelectorAll(`.ex-opt[data-k="${k}"]`).forEach(x => x.classList.toggle("on", x === b));
  }));

  // build
  const drawBuild = k => {
    const it = items[k], st = state[k];
    $(`b-line-${k}`).innerHTML = st.picked.map((w, j) => `<button class="chip-w in" data-k="${k}" data-j="${j}">${esc(it.bank[w])}</button>`).join("") || `<span class="muted small">натисни слова нижче</span>`;
    $(`b-bank-${k}`).innerHTML = it.bank.map((w, j) => st.picked.includes(j) ? `<span class="chip-w ghost">${esc(w)}</span>` : `<button class="chip-w" data-k="${k}" data-b="${j}">${esc(w)}</button>`).join("");
    document.querySelectorAll(`#b-bank-${k} [data-b]`).forEach(b => (b.onclick = () => { if (st.locked) return; st.picked.push(+b.dataset.b); drawBuild(k); }));
    document.querySelectorAll(`#b-line-${k} [data-j]`).forEach(b => (b.onclick = () => { if (st.locked) return; st.picked.splice(+b.dataset.j, 1); drawBuild(k); }));
  };
  // перше слово з малої літери, щоб велика буква не підказувала початок речення
  const lowerFirst = w => w.charAt(0).toLowerCase() + w.slice(1);
  if (set.type === "build") items.forEach((it, k) => {
    const words = it.cz.replace(/[.?!]$/, "").split(" ");
    it.bank = shuffle(words.map((w, j) => (j === 0 ? lowerFirst(w) : w)));
    drawBuild(k);
  });

  $("check").onclick = () => {
    let right = 0;
    items.forEach((it, k) => {
      const st = state[k];
      let ok, given, correct;
      if (set.type === "fill") {
        const inp = $(`inp-${k}`); given = inp.value; inp.readOnly = true;
        ok = it.a.some(a => clean(a) === clean(given));
        correct = it.a[0];
      } else if (set.type === "choice") {
        given = st.val; ok = it.a.includes(given); correct = it.a[0];
        document.querySelectorAll(`.ex-opt[data-k="${k}"]`).forEach(x => {
          x.disabled = true;
          if (x.dataset.v === correct) x.classList.add("right"); else if (x.dataset.v === given) x.classList.add("wrong");
        });
      } else {
        st.locked = true;
        given = st.picked.map(j => it.bank[j]).join(" ");
        ok = [it.cz, ...it.alt].some(s => clean(s) === clean(given));
        correct = it.cz;
      }
      if (ok) right++;
      const say = set.type === "build" ? correct : fullSentence(it.q, correct === "—" ? "" : correct).replace(/\s+/g, " ");
      const box = $(`fb-${k}`);
      box.className = "ex-fb " + (ok ? "ok" : "no");
      box.innerHTML = `${ok ? "✓" : `✗ Правильно: <b class="cz">${esc(set.type === "build" ? correct : correct)}</b>`}
        <button class="chip" data-say="${esc(say)}"><b>${esc(say)}</b></button>`;
      $(`row-${k}`).classList.add(ok ? "is-ok" : "is-no");
    });
    document.querySelectorAll(".ex-fb [data-say]").forEach(b => (b.onclick = () => speak(b.dataset.say)));
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    const total = items.length;
    const prev = rec[set.id];
    const best = Math.max(right, prev ? prev.best : 0);
    rec[set.id] = { best, total };
    ctx.be.saveRecord(ctx.user, "exercises", { [set.id]: { best, total } }).catch(() => {});
    $("check").remove();
    const ltr = $("letters"); if (ltr) ltr.remove();
    $("summary").innerHTML = `
      <div class="center-text"><p class="big-num">${right}/${total}</p>
      <p class="muted">${right === total ? "Чудово, без помилок!" : prev && right > prev.best ? "Новий найкращий результат" : "Подивись на червоні рядки вище"}</p></div>
      <div class="row2"><button class="btn" id="again">Ще раз</button><button class="btn primary" id="to-lesson">До уроку</button></div>`;
    $("again").onclick = () => runSet(ctx, l, set);
    $("to-lesson").onclick = () => showLesson(ctx, l.n);
    $("summary").scrollIntoView({ behavior: "smooth", block: "end" });
  };
}

function itemHtml(type, it, k) {
  if (type === "fill") {
    const [a, b] = it.q.split("___");
    return `<div class="ex-row" id="row-${k}">
      <div class="ex-q">${esc(a)}<input class="ex-inp" id="inp-${k}" lang="cs" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="off" enterkeyhint="next">${esc(b)}</div>
      <div class="ex-ua">${esc(it.ua)}</div><div class="ex-fb" id="fb-${k}"></div></div>`;
  }
  if (type === "choice") {
    const [a, b] = it.q.split("___");
    return `<div class="ex-row" id="row-${k}">
      <div class="ex-q">${esc(a)}<span class="ex-gap">…</span>${esc(b)}</div>
      <div class="ex-opts">${it.opts.map(o => `<button class="ex-opt" data-k="${k}" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>
      <div class="ex-ua">${esc(it.ua)}</div><div class="ex-fb" id="fb-${k}"></div></div>`;
  }
  return `<div class="ex-row" id="row-${k}">
    <div class="ex-ua" style="margin:0 0 6px">${esc(it.ua)}</div>
    <div class="b-line" id="b-line-${k}"></div>
    <div class="b-bank" id="b-bank-${k}"></div>
    <div class="ex-fb" id="fb-${k}"></div></div>`;
}
