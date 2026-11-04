// Довідник «Чеська абетка»: 42 літери, назва, звук, приклад, озвучка.
import { speak } from "./tts.js";
import { esc } from "./modes.js";

const $ = id => document.getElementById(id);
let data = null;

const RULES = [
  ["Наголос", "Завжди на першому складі: <b>ká</b>va, <b>u</b>niverzita. З коротким прийменником — на прийменнику: <b>do</b> školy."],
  ["Довгі голосні", "Риска або кружечок = звук удвічі довший: á, é, í, ý, ó, ú, ů. Довжина змінює значення: <i>byt</i> — квартира, <i>být</i> — бути."],
  ["Голосні i та y", "Обидві звучать як українське і. Різниця лише на письмі та в тому, як вони впливають на d, t, n перед собою."],
  ["М'якість", "<b>di, ti, ni</b> → дьі, тьі, ньі; <b>dy, ty, ny</b> → ди, ти, ни. <b>dě, tě, ně</b> → дьє, тьє, ньє; <b>bě, pě, vě</b> → бйе, пйе, вйе; <b>mě</b> → мньє."],
  ["Оглушення", "Дзвінкий приголосний у кінці слова звучить глухо: chléb → хлеп, muž → муш, led → лет."],
  ["ou", "Один склад, як «оу»: m<b>ou</b>ka (борошно), d<b>ou</b>fat (сподіватися)."]
];

export async function showAlphabet({ render, back }) {
  if (!data) data = await (await fetch("data/alphabet.json")).json();
  let cur = 0;
  render(`
    <header class="top"><button class="icon" id="back">←</button><h2>Чеська абетка</h2><span></span></header>
    <div class="pad stack">
      <div class="abc-card" id="abc-card"></div>
      <div class="abc-grid" id="abc-grid">
        ${data.map((l, i) => `<button class="abc-tile ${l.note ? "special" : ""}" data-i="${i}" aria-label="${esc(l.up)}">${esc(l.up)}<small>${esc(l.lo)}</small></button>`).join("")}
      </div>
      <p class="muted small">Торкнись літери, щоб почути її назву і приклад. Позначені крапкою — з особливостями вимови.</p>
      <h3 class="section" style="margin:8px 0 0">Правила вимови</h3>
      ${RULES.map(([h, t]) => `<div class="rule"><b>${h}</b><p>${t}</p></div>`).join("")}
    </div>`);
  $("back").onclick = back;

  const show = (i, say) => {
    cur = i;
    const l = data[i];
    document.querySelectorAll(".abc-tile").forEach((b, j) => b.classList.toggle("on", j === i));
    $("abc-card").innerHTML = `
      <div class="abc-big">${esc(l.up)}<span>${esc(l.lo)}</span></div>
      <div class="abc-info">
        <div class="abc-name">«${esc(l.name)}»</div>
        <div class="abc-sound">звучить як <b>[${esc(l.sound)}]</b></div>
        <div class="abc-ex"><b class="cz">${esc(l.word)}</b> <span class="muted">[${esc(l.pron)}]</span> — ${esc(l.ua)}</div>
        ${l.note ? `<div class="note">${esc(l.note)}</div>` : ""}
      </div>
      <div class="abc-btns">
        <button class="btn slim" id="say-l">🔊 Літера</button>
        <button class="btn slim" id="say-w">🔊 Слово</button>
        <button class="btn slim" id="say-s">🐢</button>
      </div>`;
    $("say-l").onclick = () => speak(l.name);
    $("say-w").onclick = () => speak(l.word);
    $("say-s").onclick = () => speak(`${l.name}. ${l.word}`, { slow: true });
    if (say) speak(`${l.name}. ${l.word}`);
  };
  document.querySelectorAll(".abc-tile").forEach(b => (b.onclick = () => show(+b.dataset.i, true)));
  show(0, false);
}
