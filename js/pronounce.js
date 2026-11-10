// Режим «Вимова»: послухати еталон → сказати → побачити, що розпізнав браузер → порівняти свій запис з еталоном.
// Розпізнавання — вбудоване в браузер (Safari: Диктування iOS, Chrome: сервіс Google), мова cs-CZ.
// Якщо розпізнавання недоступне, лишається запис і самооцінка на слух.
import { speak } from "./tts.js";
import { esc, acceptable, norm } from "./modes.js";
import { TOPICS } from "./topics.js";

// розпізнавач часто пише числа цифрами: «12» замість «dvanáct»
const DIGITS = Object.fromEntries(TOPICS.find(t => t.id === "numbers").items.map(([cz, d]) => [cz, d]));

const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const $ = id => document.getElementById(id);
const strip = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const MAX_MS = 6000;
let micDenied = false;

// Порівняння: точний збіг / збіг без діакритики («майже») / ні
export function compare(heard, w) {
  const ok = acceptable(w.cz);
  const h = norm(heard).replace(/[.,!?]/g, "");
  const okList = [...ok].map(x => x.replace(/[.,!?]/g, ""));
  if (DIGITS[w.cz] && h.replace(/\s/g, "") === DIGITS[w.cz]) return "ok";
  if (okList.some(x => x === h || (x.length > 3 && h.includes(x)))) return "ok";
  if (okList.some(x => strip(x) === strip(h) || (x.length > 3 && strip(h).includes(strip(x))))) return "almost";
  return "no";
}

export function pronounce(ctx) {
  const { w } = ctx;
  ctx.mount(`
    <div class="prompt">
      <div class="muted small">${w.sentence ? "Скажи речення вголос" : "Скажи слово вголос"}</div>
      <div class="word cz">${esc(w.cz)}</div>
      <div class="pron">[${esc(w.pron)}]</div>
      <div class="tr" style="font-size:18px;margin-top:6px">${esc(w.ua)}</div>
      <div class="listen">
        <button class="btn slim" id="ref">🔊 Еталон</button>
        <button class="btn slim" id="ref-slow">🐢</button>
      </div>
    </div>
    <button class="mic" id="mic" aria-label="Записати"><span>🎤</span></button>
    <div class="muted small center-text" id="mic-hint">${SR ? "Натисни і скажи. Запис зупиниться сам." : "Натисни, скажи і натисни ще раз, щоб зупинити."}</div>
    <div id="result"></div>`);
  $("ref").onclick = () => speak(w.cz);
  $("ref-slow").onclick = () => speak(w.cz, { slow: true });
  speak(w.cz);

  let rec = null, stream = null, chunks = [], recUrl = null, recog = null, active = false, timer = null;
  let heard = [], recogFailed = !SR;

  const stopAll = () => {
    clearTimeout(timer);
    try { if (rec && rec.state !== "inactive") rec.stop(); } catch {}
    try { if (recog) recog.stop(); } catch {}
  };

  async function start() {
    if (active) return stopAll();
    if (window.speechSynthesis) speechSynthesis.cancel();
    active = true; heard = []; chunks = [];
    $("mic").classList.add("on");
    $("mic-hint").textContent = "Слухаю… Натисни ще раз, щоб зупинити.";
    $("result").innerHTML = "";
    const canRec = !!(navigator.mediaDevices && window.MediaRecorder);
    let pending = (SR ? 1 : 0) + (canRec ? 1 : 0);
    const done = () => { if (--pending <= 0) finish(); };

    // 1) розпізнавання
    if (SR) {
      try {
        recog = new SR();
        recog.lang = "cs-CZ";
        recog.interimResults = false;
        recog.maxAlternatives = 5;
        recog.continuous = false;
        recog.onresult = e => {
          for (const res of e.results) for (const alt of res) if (alt.transcript) heard.push(alt.transcript.trim());
        };
        recog.onerror = e => { if (e.error !== "no-speech" && e.error !== "aborted") recogFailed = true; if (e.error === "not-allowed") micDenied = true; };
        recog.onend = () => { try { if (rec && rec.state !== "inactive") rec.stop(); } catch {} done(); };
        recog.start();
      } catch { recogFailed = true; done(); }
    }
    // 2) запис для порівняння на слух
    if (canRec) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        rec = new MediaRecorder(stream);
        rec.ondataavailable = e => e.data && e.data.size && chunks.push(e.data);
        rec.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          if (chunks.length) { if (recUrl) URL.revokeObjectURL(recUrl); recUrl = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/mp4" })); }
          done();
        };
        rec.start();
      } catch (e) { if (e && e.name === "NotAllowedError") micDenied = true; rec = null; done(); }
    }
    if (!SR && !canRec) return finish();
    timer = setTimeout(stopAll, MAX_MS);
  }

  function finish() {
    if (!active) return;
    active = false; clearTimeout(timer);
    $("mic").classList.remove("on");
    $("mic-hint").textContent = "Можна спробувати ще раз.";
    if (micDenied) {
      $("result").innerHTML = `<p class="verdict bad">Немає доступу до мікрофона</p>
        <p class="muted small center-text">iPhone: Параметри → Safari → Мікрофон → Дозволити. Потім онови сторінку.</p>`;
      return selfButtons();
    }
    const verdict = heard.length ? (heard.map(h => compare(h, w)).includes("ok") ? "ok" : heard.map(h => compare(h, w)).includes("almost") ? "almost" : "no") : null;
    const best = heard[0] || "";
    let html = "";
    if (verdict === "ok") html = `<p class="verdict good">Зрозуміло ✓</p><p class="center-text muted">Розпізнано: <b class="cz">${esc(best)}</b></p>`;
    else if (verdict === "almost") html = `<p class="verdict mid-c">Майже</p><p class="center-text muted">Розпізнано: <b class="cz">${esc(best)}</b><br>Перевір довгі голосні й гачки — порівняй з еталоном.</p>`;
    else if (verdict === "no") html = `<p class="verdict bad">Не впізнано</p><p class="center-text muted">Розпізнано: <b class="cz">${esc(best)}</b></p>`;
    else if (!recogFailed) html = `<p class="verdict bad">Нічого не розпізнано</p><p class="center-text muted small">Скажи трохи голосніше або ближче до телефона.</p>`;
    else html = `<p class="center-text muted small">Автоматична перевірка тут недоступна${SR ? " (увімкни чеську в Диктуванні: Параметри → Загальні → Клавіатура)" : ""}. Порівняй на слух.</p>`;
    html += `<div class="listen" style="margin-top:6px">
        ${recUrl ? `<button class="btn slim" id="mine">▶︎ Мій запис</button>` : ""}
        <button class="btn slim" id="ref2">🔊 Еталон</button>
        ${recUrl ? `<button class="btn slim" id="both">⇄ По черзі</button>` : ""}
      </div>`;
    $("result").innerHTML = html;
    const playMine = () => new Promise(res => { const a = new Audio(recUrl); a.onended = res; a.onerror = res; a.play().catch(res); });
    if (recUrl) {
      $("mine").onclick = () => playMine();
      $("both").onclick = async () => {
        await new Promise(res => { speak(w.cz); const t0 = Date.now(); const iv = setInterval(() => { if (!speechSynthesis.speaking && Date.now() - t0 > 300) { clearInterval(iv); res(); } }, 100); });
        await playMine();
      };
    }
    $("ref2").onclick = () => speak(w.cz);
    if (verdict === "ok") nextButton(2);
    else if (verdict) nextButton(0, true);
    else selfButtons();
    setTimeout(() => { const g = $("result"); if (g) g.lastElementChild.scrollIntoView({ block: "end", behavior: "smooth" }); }, 50);
  }

  function nextButton(grade, alsoSelf) {
    $("result").insertAdjacentHTML("beforeend", `
      <div class="row2" style="margin-top:12px">
        ${alsoSelf ? `<button class="btn" id="self-ok">Звучало добре</button>` : `<span></span>`}
        <button class="btn primary" id="go">Далі</button>
      </div>`);
    $("go").onclick = () => ctx.answer(grade);
    if (alsoSelf) $("self-ok").onclick = () => ctx.answer(2);
  }
  function selfButtons() {
    $("result").insertAdjacentHTML("beforeend", `
      <div class="row2" style="margin-top:12px">
        <button class="btn" id="self-no">Ще потренуюсь</button>
        <button class="btn primary" id="self-ok">Звучало схоже</button>
      </div>`);
    $("self-no").onclick = () => ctx.answer(0);
    $("self-ok").onclick = () => ctx.answer(2);
  }

  $("mic").onclick = start;
  ctx.keys(e => { if (e.key === " ") { e.preventDefault(); start(); } });
}
