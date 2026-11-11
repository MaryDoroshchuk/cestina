import { createBackend, isDemo } from "./backend.js";
import { today, addDays, keyOf, review, againToday, status, DIRS } from "./srs.js";
import * as Modes from "./modes.js";
import { speak } from "./tts.js";
import { matchSetup, matchGame } from "./match.js";
import { showAlphabet } from "./alphabet.js";
import { TOPICS } from "./topics.js";
import { showExercises } from "./exercises.js";

const $app = document.getElementById("app");
const S = { be: null, user: null, profile: null, progress: {}, words: [], weeks: [], byId: {}, day: {} };
const kbProxy = document.getElementById("kbproxy");
const KB_MODES = ["type", "audio"];
const DEFAULTS = { newPerDay: 7, reviewsPerDay: 50, streak: 0, best: 0, lastDay: null };

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const render = html => { $app.innerHTML = html; window.scrollTo(0, 0); };
const fail = e => console.error(e);

// ---------- start ----------
async function boot() {
  render(`<div class="center muted">Завантаження…</div>`);
  const data = await (await fetch("data/words.json")).json();
  S.words = data.words; S.weeks = data.weeks;
  S.words.forEach(w => (S.byId[w.id] = w));
  try { S.sentences = await (await fetch("data/sentences.json")).json(); } catch { S.sentences = []; }
  S.sentences.forEach(x => (S.byId[x.id] = x));
  S.be = await createBackend();
  S.be.onUser(async u => {
    S.user = u;
    if (!u) return showLogin();
    render(`<div class="center muted">Завантаження…</div>`);
    if (!(await S.be.isAllowed(u))) return showDenied();
    S.profile = { ...DEFAULTS, name: u.name, ...((await S.be.loadProfile(u)) || {}) };
    S.progress = await S.be.loadProgress(u);
    S.day = await S.be.loadDay(u, today());
    showHome();
  });
}

function showLogin() {
  render(`
    <div class="center stack">
      <h1 class="logo">Čeština</h1>
      <p class="muted">Тренування чеських слів</p>
      <button class="btn primary big" id="in">Увійти через Google</button>
      ${isDemo ? `<p class="hint">Демо-режим: Firebase ще не налаштовано, прогрес зберігається лише в цьому браузері.</p>` : ""}
    </div>`);
  document.getElementById("in").onclick = () => S.be.signIn().catch(e => alertBox(e.message));
}

function showDenied() {
  render(`
    <div class="center stack">
      <h1>Немає доступу</h1>
      <p class="muted">Акаунт <b>${esc(S.user.email)}</b> не в списку дозволених.<br>Попроси Мері додати тебе.</p>
      <button class="btn" id="out">Вийти</button>
    </div>`);
  document.getElementById("out").onclick = () => S.be.signOut();
}

function alertBox(msg) {
  const d = document.createElement("div");
  d.className = "toast"; d.textContent = msg;
  document.body.appendChild(d); setTimeout(() => d.remove(), 4000);
}

// ---------- home ----------
function currentStreak() {
  const p = S.profile, t = today();
  return p.lastDay === t || p.lastDay === addDays(t, -1) ? p.streak : 0;
}

function buildDailyQueue() {
  const t = today(), P = S.progress, due = [], unlocked = [], fresh = [];
  for (const [key, st] of Object.entries(P)) {
    const [id, dir] = key.split(":");
    if (S.byId[id] && st.due <= t) due.push({ id, dir, d: st.due, step: st.step });
  }
  // Після першого «знаю» слово відкривається і в зворотному напрямку
  for (const w of S.words) {
    const r = P[keyOf(w.id, DIRS.R)];
    if (r && r.step >= 1 && !P[keyOf(w.id, DIRS.P)]) unlocked.push({ id: w.id, dir: DIRS.P });
  }
  // Спершу найбільш прострочені, серед них — найслабші; ліміт повторень на день
  due.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : a.step - b.step));
  const all = [...due.map(({ id, dir }) => ({ id, dir })), ...unlocked];
  const cap = S.profile.reviewsPerDay || DEFAULTS.reviewsPerDay;
  const reviews = all.slice(0, cap);
  const backlog = all.length - reviews.length;
  // Нові слова — лише коли накопичені повторення вміщаються в ліміт, щоб сесії не розросталися
  const left = backlog > 0 ? 0 : Math.max(0, S.profile.newPerDay - (S.day.newWords || 0));
  for (const w of S.words) {
    if (fresh.length >= left) break;
    if (!P[keyOf(w.id, DIRS.R)]) fresh.push({ id: w.id, dir: DIRS.R, isNew: true });
  }
  shuffle(reviews);
  // нові слова рівномірно між повтореннями
  const q = [...reviews];
  fresh.forEach((f, i) => q.splice(Math.floor(((i + 1) * q.length) / (fresh.length + 1)) + i, 0, f));
  return { queue: q, reviews: reviews.length, fresh: fresh.length, backlog };
}

function weekStats(week) {
  const ws = S.words.filter(w => w.week === week);
  const known = ws.filter(w => ["known", "done"].includes(status(S.progress[keyOf(w.id, DIRS.R)]))).length;
  const started = ws.filter(w => S.progress[keyOf(w.id, DIRS.R)]).length;
  return { total: ws.length, known, started };
}

function showHome() {
  const d = buildDailyQueue();
  const streak = currentStreak();
  const doneToday = S.day.done;
  const weeks = S.weeks.map(({ week, topic }) => {
    const s = weekStats(week);
    return `<button class="week" data-week="${week}">
      <span class="wk">${week}</span>
      <span class="wt">${esc(topic)}<span class="bar"><i style="width:${(100 * s.known) / s.total}%"></i><b style="width:${(100 * (s.started - s.known)) / s.total}%"></b></span></span>
      <span class="wn">${s.known}/${s.total}</span></button>`;
  }).join("");
  render(`
    <header class="top">
      <div class="streak" title="Серія днів">🔥 ${streak}</div>
      <div class="muted small">${esc(S.profile.name || "")}</div>
      <button class="icon" id="settings" aria-label="Налаштування">⚙︎</button>
    </header>
    <section class="hero">
      ${d.queue.length && !doneToday
        ? `<h2>Сьогодні</h2>
           <p class="muted">${d.reviews} на повторення · ${d.fresh} нових</p>
           ${d.backlog ? `<p class="muted small">Ще ${d.backlog} повторень чекають на наступні дні. Нові слова повернуться, коли їх розбереш.</p>` : ""}
           <button class="btn primary big" id="daily">Почати</button>`
        : `<h2>${doneToday ? "На сьогодні все ✓" : "Немає слів на сьогодні"}</h2>
           <p class="muted">${doneToday ? "Повертайся завтра або потренуй будь-який тиждень нижче." : "Обери тиждень нижче для вільного тренування."}</p>
           ${doneToday && d.queue.length ? `<button class="btn" id="daily">Ще повторення: ${d.queue.length}</button>` : ""}`}
    </section>
    <button class="link-row" id="abc"><span class="abc-ico">Áa</span><span><b>Чеська абетка</b><br><span class="muted small">42 літери з вимовою та озвучкою</span></span><span class="muted">›</span></button>
    <button class="link-row" id="topics"><span class="abc-ico" style="background:var(--blue)">12</span><span><b>Місяці, дні, числа</b><br><span class="muted small">усе на одному екрані + тренування</span></span><span class="muted">›</span></button>
    <button class="link-row" id="exercises"><span class="abc-ico" style="background:var(--good)">✎</span><span><b>Вправи з граматики</b><br><span class="muted small">14 уроків за «Česky raz dva»</span></span><span class="muted">›</span></button>
    <h3 class="section">Вільне тренування</h3>
    <p class="hint" style="text-align:left;margin:-4px 16px 10px;padding:0">Практика без впливу на розклад повторень: тренуй скільки хочеш.</p>
    <div class="weeks">${weeks}</div>
    ${isDemo ? `<p class="hint">Демо-режим: прогрес лише в цьому браузері.</p>` : ""}`);
  const daily = document.getElementById("daily");
  if (daily) daily.onclick = () => runSession(d.queue, { daily: true, title: "Щоденна сесія" });
  document.querySelectorAll(".week").forEach(b => (b.onclick = () => showWeek(+b.dataset.week)));
  document.getElementById("settings").onclick = showSettings;
  document.getElementById("abc").onclick = () => showAlphabet({ render, back: showHome });
  document.getElementById("topics").onclick = () => showTopic("months");
  document.getElementById("exercises").onclick = () => showExercises({ render, back: showHome, be: S.be, user: S.user, drill: grammarDrill });
}

function showSettings() {
  const opts = [3, 5, 7, 10, 15, 20].map(n => `<option ${n === S.profile.newPerDay ? "selected" : ""}>${n}</option>`).join("");
  render(`
    <header class="top"><button class="icon" id="back">←</button><h2>Налаштування</h2><span></span></header>
    <div class="stack pad">
      <label class="row">Нових слів на день <select id="npd">${opts}</select></label>
      <label class="row">Повторень на день <select id="rpd">${[30, 50, 80, 120, 200].map(n => `<option ${n === (S.profile.reviewsPerDay || 50) ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <p class="muted small">Якщо повторень накопичилося більше, решта перейде на наступні дні, а нові слова почекають.</p>
      <p class="muted small">Серія: зараз ${currentStreak()}, найдовша ${S.profile.best}</p>
      <button class="btn" id="out">Вийти з акаунта</button>
    </div>`);
  document.getElementById("back").onclick = showHome;
  document.getElementById("rpd").onchange = e => {
    S.profile.reviewsPerDay = +e.target.value;
    S.be.saveProfile(S.user, { reviewsPerDay: S.profile.reviewsPerDay }).catch(fail);
  };
  document.getElementById("npd").onchange = e => {
    S.profile.newPerDay = +e.target.value;
    S.be.saveProfile(S.user, { newPerDay: S.profile.newPerDay }).catch(fail);
  };
  document.getElementById("out").onclick = () => S.be.signOut();
}

function showWeek(week) {
  const { topic } = S.weeks.find(w => w.week === week);
  const ws = S.words.filter(w => w.week === week);
  const modes = [
    ["cards", "Картки", "з перевертанням"], ["quiz", "Тест з варіантами", "4 варіанти"],
    ["type", "Написання", "бачиш переклад, пишеш чеською"], ["audio", "Аудіо", "чуєш слово, пишеш його"], ["pronounce", "Вимова", "кажеш вголос, сайт перевіряє"],
    ["match", "Знайди пару", "на час"]
  ];
  render(`
    <header class="top"><button class="icon" id="back">←</button><h2>Тиждень ${week}</h2><span></span></header>
    <div class="pad stack">
      <p class="muted">${esc(topic)} · ${ws.length} слів</p>
      <div class="seg" id="dir">
        <button data-d="r" class="on">CZ → UA</button><button data-d="p">UA → CZ</button><button data-d="mix">Мікс</button>
      </div>
      <p class="muted small">Напрямок діє для карток і тесту.</p>
      ${modes.map(([m, label, sub]) => `<button class="btn mode" data-m="${m}">${label}<span class="soon">${sub}</span></button>`).join("")}
      <details><summary>Список слів</summary>
        <ul class="list">${ws.map(w => `<li><b>${esc(w.cz)}</b> — ${esc(w.ua)}</li>`).join("")}</ul>
      </details>
    </div>`);
  let dir = "r";
  document.querySelectorAll("#dir button").forEach(b => (b.onclick = () => {
    dir = b.dataset.d;
    document.querySelectorAll("#dir button").forEach(x => x.classList.toggle("on", x === b));
  }));
  document.getElementById("back").onclick = showHome;
  const back = () => showWeek(week);
  document.querySelectorAll(".mode").forEach(b => (b.onclick = () => {
    const m = b.dataset.m;
    if (m === "match") return showMatch(`w${String(week).padStart(2, "0")}`, `Тиждень ${week}`, ws, back);
    const d = m === "type" ? () => "p" : m === "audio" ? () => "r" : () => (dir === "mix" ? (Math.random() < 0.5 ? "r" : "p") : dir);
    const list = m === "pronounce" ? [...S.sentences.filter(x => x.week === week), ...ws] : ws;
    const q = m === "pronounce" ? list.map(w => ({ id: w.id, dir: "r", mode: m })) : shuffle(list.map(w => ({ id: w.id, dir: d(), mode: m })));
    runSession(q, { title: `Тиждень ${week}`, back });
  }));
}

async function showMatch(setId, title, words, back) {
  render(`<div class="center muted">Завантаження…</div>`);
  const record = (await S.be.loadRecord(S.user, setId).catch(() => null)) || {};
  const setup = () => matchSetup({
    render, words, title, record, onBack: back,
    onPlay: ({ pairs, secs }) => matchGame({
      render, words, pairs, secs, record, onBack: setup,
      onDone: ({ isRecord, time }) => {
        if (!isRecord) return;
        record[`p${pairs}`] = time;
        S.be.saveRecord(S.user, setId, { [`p${pairs}`]: time }).catch(fail);
      }
    })
  });
  setup();
}

// ---------- місяці, дні, числа ----------
const MODES = [
  ["cards", "Картки"], ["quiz", "Тест"], ["type", "Написання"], ["audio", "Аудіо"], ["pronounce", "Вимова"], ["match", "Знайди пару"]
];

function topicWords(T) {
  const byCz = Object.fromEntries(S.words.map(w => [w.cz, w]));
  return T.items.map(([cz]) => byCz[cz]).filter(Boolean);
}
const allTopicWords = () => TOPICS.flatMap(topicWords);

// Змішаний тренажер: тільки письмо — написання за перекладом і на слух, по черзі.
// Варіанти в тесті — з того ж списку (місяць серед місяців). Розклад і рахунок не змінюються.
function mixedTopicSession(topics, back) {
  const poolById = {};
  topics.forEach(T => { const ws = topicWords(T); ws.forEach(w => (poolById[w.id] = ws)); });
  writingSession(topics.flatMap(topicWords), "Змішаний тренажер", back, w => poolById[w.id]);
}

// Тренажер правопису: лише письмо, по черзі «напиши за перекладом» і «напиши почуте». Практика — без впливу на прогрес.
function writingSession(list, title, back, poolOf) {
  const words = shuffle([...list]);
  const q = words.map((w, i) => (i % 2 ? { id: w.id, dir: "r", mode: "audio" } : { id: w.id, dir: "p", mode: "type" }));
  runSession(q, { title, back, poolOf: poolOf || (() => list) });
}

// Правопис форм зі шпаргалки уроку вправ (я є → jsem, …)
function grammarDrill(lesson, back) {
  const items = lesson.drill.map((x, i) => ({ ...x, id: `g${lesson.n}-${i}`, week: 0, note: "" }));
  items.forEach(w => (S.byId[w.id] = w));
  writingSession(items, `Урок ${lesson.n}: правопис`, back);
}

function showTopic(id) {
  const T = TOPICS.find(t => t.id === id);
  const byCz = Object.fromEntries(S.words.map(w => [w.cz, w]));
  const items = T.items.map(([cz, label]) => ({ w: byCz[cz], label })).filter(x => x.w);
  const ws = items.map(x => x.w);
  const short = cz => cz.split(/,\s*/)[0];
  render(`
    <header class="top"><button class="icon" id="back">←</button><h2>${esc(T.title)}</h2><span></span></header>
    <div class="pad stack">
      <div class="seg" id="tabs">${TOPICS.map(t => `<button data-t="${t.id}" class="${t.id === id ? "on" : ""}">${t.tab}</button>`).join("")}</div>
      <div class="tlist c${T.cols}">
        ${items.map(({ w, label }) => {
          const st = S.progress[keyOf(w.id, DIRS.R)];
          const known = ["known", "done"].includes(status(st));
          return `<button class="titem ${known ? "known" : ""}" data-say="${esc(w.cz)}">
            <span class="tl">${esc(label)}</span>
            <span class="tw"><b>${esc(T.id === "numbers" ? short(w.cz) : w.cz)}</b><small>${esc(T.id === "numbers" ? w.pron.split(",")[0] : w.pron)}</small>${T.id === "numbers" ? "" : `<em>${esc(w.ua)}</em>`}</span>
          </button>`;
        }).join("")}
      </div>
      <p class="muted small">Торкнись, щоб почути. Зелена позначка — слово вже добре знаєш.</p>
      <div class="mix">
        <div><b>Змішаний тренажер</b><br><span class="muted small">Тільки письмо: пишеш слово за перекладом або на слух, по черзі. Не впливає на прогрес і загальний рахунок.</span></div>
        <div class="mix-btns">
          <button class="btn" id="mix-one">${esc(T.tab)} (${ws.length})</button>
          <button class="btn primary" id="mix-all">Усе разом (${allTopicWords().length})</button>
        </div>
      </div>
      <div class="seg" id="dir"><button data-d="r" class="on">CZ → UA</button><button data-d="p">UA → CZ</button><button data-d="mix">Мікс</button></div>
      <div class="mgrid">${MODES.map(([m, l]) => `<button class="btn" data-m="${m}">${l}</button>`).join("")}</div>
      ${T.tips}
    </div>`);
  document.getElementById("back").onclick = showHome;
  document.querySelectorAll("#tabs button").forEach(b => (b.onclick = () => showTopic(b.dataset.t)));
  document.querySelectorAll("[data-say]").forEach(b => (b.onclick = () => speak(b.dataset.say)));
  let dir = "r";
  document.querySelectorAll("#dir button").forEach(b => (b.onclick = () => {
    dir = b.dataset.d;
    document.querySelectorAll("#dir button").forEach(x => x.classList.toggle("on", x === b));
  }));
  const back = () => showTopic(id);
  document.getElementById("mix-one").onclick = () => mixedTopicSession([T], back);
  document.getElementById("mix-all").onclick = () => mixedTopicSession(TOPICS, back);
  document.querySelectorAll("[data-m]").forEach(b => (b.onclick = () => {
    const m = b.dataset.m;
    if (m === "match") return showMatch(`t_${id}`, T.title, ws, back);
    const d = m === "type" ? () => "p" : m === "audio" ? () => "r" : () => (dir === "mix" ? (Math.random() < 0.5 ? "r" : "p") : dir);
    runSession(shuffle(ws.map(w => ({ id: w.id, dir: d(), mode: m }))), { title: T.title, back, pool: ws });
  }));
}

// ---------- session ----------
function runSession(queue, opts) {
  const t = today();
  const pool = S.words;
  const sess = { queue: [...queue], done: 0, right: 0, mistakes: new Map() };
  let keyHandler = null;
  const onKey = e => keyHandler && keyHandler(e);
  document.addEventListener("keydown", onKey);
  const cleanup = () => { document.removeEventListener("keydown", onKey); keyHandler = null; };

  // режим кожного слова визначаємо один раз, щоб можна було «заглянути» на наступне
  const modeOf = it => it.mode || it._m || (it._m = Modes.pickMode(it, S.progress[keyOf(it.id, it.dir)]));
  const next = () => {
    if (!sess.queue.length) { if (document.activeElement === kbProxy) kbProxy.blur(); return finish(); }
    const item = sess.queue[0];
    const key = keyOf(item.id, item.dir);
    const mode = modeOf(item);
    const w = S.byId[item.id];
    const weekPool = pool.filter(x => x.week === w.week);
    let answered = false;
    keyHandler = null;
    Modes[mode]({
      w, item, pool: (opts.poolOf && opts.poolOf(w)) || opts.pool || (weekPool.length >= 8 ? weekPool : pool),
      prepKeyboard() {
        const n = sess.queue[1];
        if (n && KB_MODES.includes(modeOf(n))) kbProxy.focus({ preventScroll: true });
      },
      mount(body) {
        // клавіатура відкрита? передаємо фокус «тримачу», щоб вона не сховалася під час перемальовування
        const ae = document.activeElement;
        if (ae && ae.tagName === "INPUT" && ae !== kbProxy) kbProxy.focus({ preventScroll: true });
        const total = sess.done + sess.queue.length;
        render(`
          <header class="top">
            <button class="icon" id="close" aria-label="Закрити">✕</button>
            <div class="prog"><i style="width:${(100 * sess.done) / total}%"></i></div>
            <span class="small muted">${sess.done}/${total}</span>
          </header>
          <div class="pad">${body}</div>`);
        document.getElementById("close").onclick = () => { cleanup(); (opts.back || showHome)(); };
      },
      keys(fn) { keyHandler = fn; },
      answer(grade, o = {}) {
        if (answered) return;
        answered = true;
        answer(item, grade, o);
      }
    });
    if (document.activeElement === kbProxy && !KB_MODES.includes(mode)) kbProxy.blur();
  };

  function answer(item, grade, { stepCap } = {}) {
    sess.queue.shift();
    const key = keyOf(item.id, item.dir);
    const delta = { answers: 1, correct: grade > 0 ? 1 : 0 };
    let again;
    if (opts.daily) {
      // розклад повторень змінює лише щоденна сесія
      const wasNew = !S.progress[key];
      const st = review(S.progress[key], grade, { day: t, stepCap });
      S.progress[key] = st;
      S.be.saveProgress(S.user, key, st).catch(fail);
      if (wasNew && item.dir === DIRS.R) { delta.newWords = 1; S.day.newWords = (S.day.newWords || 0) + 1; }
      again = againToday(st);
    } else {
      // вільне тренування: лише практика; помилкове слово з'явиться ще раз один раз у цій же сесії,
      // а далі — у списку помилок наприкінці
      again = grade === 0 && !item.retried;
    }
    if (opts.daily) S.be.logDay(S.user, t, delta).catch(fail); // практика не входить у загальний рахунок
    sess.done++;
    if (grade > 0) sess.right++; else sess.mistakes.set(key, item);
    // у вільному тренуванні режим фіксований; у щоденній сесії повтор піде іншим режимом
    if (again) sess.queue.splice(Math.min(3, sess.queue.length), 0, { id: item.id, dir: item.dir, mode: item.mode, retried: !opts.daily });
    next();
  }

  async function finish() {
    cleanup();
    if (opts.daily && sess.done > 0) await completeDay(t);
    const mistakes = [...sess.mistakes.values()];
    render(`
      <div class="center stack pad">
        <h2>${opts.daily ? "Щоденну сесію завершено" : "Готово"}</h2>
        <p class="big-num">${sess.right}/${sess.done}</p>
        <p class="muted">правильних відповідей</p>
        ${opts.daily ? `<p>🔥 Серія: ${currentStreak()} ${dayWord(currentStreak())}</p>` : ""}
        ${mistakes.length ? `<div class="mist"><h3>Помилки</h3><ul class="list">${mistakes.map(m => `<li><b>${esc(S.byId[m.id].cz)}</b> — ${esc(S.byId[m.id].ua)}</li>`).join("")}</ul></div>
           <button class="btn" id="again">Повторити помилки</button>` : ""}
        <button class="btn primary" id="home">${opts.back ? "Назад" : "На головну"}</button>
      </div>`);
    document.getElementById("home").onclick = opts.back || showHome;
    const again = document.getElementById("again");
    if (again) again.onclick = () => runSession(shuffle(mistakes.map(m => ({ id: m.id, dir: m.dir, mode: m.mode }))), { title: "Помилки", back: opts.back });
  }

  next();
}

const dayWord = n => (n % 10 === 1 && n % 100 !== 11 ? "день" : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? "дні" : "днів");

async function completeDay(t) {
  if (S.day.done) return;
  const p = S.profile;
  p.streak = p.lastDay === addDays(t, -1) ? p.streak + 1 : p.lastDay === t ? p.streak : 1;
  p.best = Math.max(p.best || 0, p.streak);
  p.lastDay = t;
  S.day.done = true;
  await Promise.all([
    S.be.saveProfile(S.user, { streak: p.streak, best: p.best, lastDay: t, name: p.name, newPerDay: p.newPerDay }),
    S.be.logDay(S.user, t, { done: true })
  ]).catch(fail);
}

boot().catch(e => { fail(e); render(`<div class="center"><p>Помилка завантаження: ${esc(e.message)}</p></div>`); });

if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(fail);
