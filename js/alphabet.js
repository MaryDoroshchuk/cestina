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


// ---------- значки над літерами ----------
const say = (cz, ua) => `<button class="chip" data-say="${cz}"><b>${cz}</b>${ua ? ` — ${ua}` : ""}</button>`;

const MARKS = [
  {
    sign: "á", name: "Риска", cz: "čárka", short: "голосний довшає",
    body: `
      <p><b>Де:</b> тільки на голосних — <b>á é í ó ú ý</b>.</p>
      <p><b>Що означає:</b> звук триває вдвічі довше. Це <b>не наголос</b> — наголос завжди на першому складі: у <i>dobrý</i> наголос на <i>do</i>, а розтягується <i>ý</i>.</p>
      <p><b>Навіщо:</b> довжина змінює значення слова. Послухай пари:</p>
      <div class="pairs">
        ${say("byt", "квартира")}${say("být", "бути")}
        ${say("pas", "паспорт")}${say("pás", "пояс")}
        ${say("dal", "дав")}${say("dál", "далі")}
        ${say("rada", "порада")}${say("ráda", "рада")}
      </div>
      <p class="tip">💡 Риска нахилена, ніби тягне літеру вбік — розтягни звук. Подумки рахуй «раз-два».</p>`
  },
  {
    sign: "ů", name: "Кружечок", cz: "kroužek", short: "тільки ů, теж довше",
    body: `
      <p><b>Де:</b> лише на одній літері — <b>ů</b>.</p>
      <p><b>Що означає:</b> те саме довге [у:], що й <b>ú</b>. На слух однаково — різниця тільки в написанні. Коли що писати — у блоці «ú чи ů» нижче.</p>
      <p class="tip">💡 Кружечок схожий на маленьку <b>о</b>: колись тут було <i>о</i>, і в інших формах слова воно повертається — <i>dům → domu</i>.</p>`
  },
  {
    sign: "č", name: "Гачок", cz: "háček", short: "інший звук",
    body: `
      <p><b>Де:</b> на приголосних <b>č š ž ř ď ť ň</b> і на голосному <b>ě</b>.</p>
      <p><b>Що означає:</b> це <b>інший звук</b>, а не довший. В українській для них є окремі літери, у чеській — звичайна літера + гачок:</p>
      <table class="tbl">
        <tr><td>c [ц]</td><td>→</td><td><b>č</b> [ч]</td></tr>
        <tr><td>s [с]</td><td>→</td><td><b>š</b> [ш]</td></tr>
        <tr><td>z [з]</td><td>→</td><td><b>ž</b> [ж]</td></tr>
        <tr><td>r [р]</td><td>→</td><td><b>ř</b> [рж]</td></tr>
        <tr><td>d, t, n</td><td>→</td><td><b>ď, ť, ň</b> [дь, ть, нь]</td></tr>
        <tr><td>e</td><td>→</td><td><b>ě</b> пом'якшує попередню: dě [дьє], bě [бйе], mě [мньє]</td></tr>
      </table>
      <p><b>Навіщо:</b> без гачка — інше слово:</p>
      <div class="pairs">
        ${say("rád", "радий")}${say("řád", "порядок")}
        ${say("kos", "дрізд")}${say("koš", "кошик")}
      </div>
      <p><b>Зверни увагу:</b> у малих <b>ď</b> і <b>ť</b> гачок схожий на апостроф — це той самий гачок. У великих він звичайний: <b>Ď, Ť</b>.</p>
      <p class="tip">💡 Гачок «чіпляє» звук і змінює його. Для ň, ď, ť це чеський м'який знак: <i>kůň</i> = кінь.</p>`
  }
];

const UU_RULES = `
  <p>На слух <b>ú</b> і <b>ů</b> однакові — довге [у:]. Різниця лише в тому, <b>де в слові</b> стоїть звук.</p>
  <ol class="steps">
    <li><b>Початок слова → ú.</b> ů ніколи не буває першою літерою.
      <div class="pairs">${say("úterý", "вівторок")}${say("účet", "рахунок")}${say("úkol", "завдання")}${say("úřad", "установа")}</div></li>
    <li><b>Після префікса → ú,</b> якщо корінь починається з ú. Прибери префікс і перевір.
      <div class="pairs">${say("neúspěch", "ne + úspěch")}${say("neúplný", "ne + úplný")}${say("trojúhelník", "troj + úhelník")}</div></li>
    <li><b>Усередині й у кінці рідних чеських слів → ů.</b> Сюди ж закінчення <b>-ů</b> (pět měsíců) і <b>-ův</b> (Petrův).
      <div class="pairs">${say("dům", "будинок")}${say("stůl", "стіл")}${say("domů", "додому")}${say("pět stolů", "п'ять столів")}</div></li>
    <li><b>Винятки з ú усередині:</b> іншомовні слова й вигуки — запам'ятовуй окремо.
      <div class="pairs">${say("túra", "похід")}${say("múza", "муза")}${say("skútr", "скутер")}</div></li>
  </ol>
  <p><b>Перевірка через «о».</b> Якщо в іншій формі слова з'являється <b>o</b> — пиши <b>ů</b>. Як в українській <b>і ↔ о</b>:</p>
  <table class="tbl">
    <tr><th>Чеською</th><th>Форма з o</th><th>Українською</th></tr>
    <tr><td>d<b>ů</b>m</td><td>d<b>o</b>mu</td><td>д<b>і</b>м — д<b>о</b>му</td></tr>
    <tr><td>st<b>ů</b>l</td><td>st<b>o</b>lu</td><td>ст<b>і</b>л — ст<b>о</b>лу</td></tr>
    <tr><td>k<b>ů</b>ň</td><td>k<b>o</b>ně</td><td>к<b>і</b>нь — к<b>о</b>ня</td></tr>
    <tr><td>n<b>ů</b>ž</td><td>n<b>o</b>že</td><td>н<b>і</b>ж — н<b>о</b>жа</td></tr>
    <tr><td>s<b>ů</b>l</td><td>s<b>o</b>li</td><td>с<b>і</b>ль — с<b>о</b>лі</td></tr>
    <tr><td>v<b>ů</b>z</td><td>v<b>o</b>zu</td><td>в<b>і</b>з — в<b>о</b>за</td></tr>
  </table>`;

const UU_QUIZ = [
  ["_terý", "ú", "úterý", "початок слова"],
  ["d_m", "ů", "dům", "є форма з o: domu"],
  ["pět stol_", "ů", "pět stolů", "закінчення -ů (родовий множини)"],
  ["ne_spěch", "ú", "neúspěch", "префікс ne- + úspěch"],
  ["k_ň", "ů", "kůň", "є форма з o: koně"],
  ["_kol", "ú", "úkol", "початок слова"],
  ["st_l", "ů", "stůl", "є форма з o: stolu"],
  ["t_ra", "ú", "túra", "іншомовне слово"],
  ["dom_", "ů", "domů", "кінець рідного слова"],
  ["_řad", "ú", "úřad", "початок слова"],
  ["n_ž", "ů", "nůž", "є форма з o: nože"],
  ["troj_helník", "ú", "trojúhelník", "troj- + úhelník"],
  ["m_j", "ů", "můj", "є форма з o: moje"],
  ["_zký", "ú", "úzký", "початок слова"],
  ["Petr_v", "ů", "Petrův", "закінчення -ův"]
];

function uuQuiz() {
  const box = $("uu-quiz");
  const q = [...UU_QUIZ].sort(() => Math.random() - 0.5).slice(0, 10);
  let i = 0, right = 0;
  const step = () => {
    if (i >= q.length) {
      box.innerHTML = `<div class="uu-done"><b>${right} / ${q.length}</b> правильно</div><button class="btn" id="uu-again">Ще раз</button>`;
      $("uu-again").onclick = uuQuiz;
      return;
    }
    const [mask, ans, word, why] = q[i];
    box.innerHTML = `
      <div class="muted small">${i + 1} / ${q.length}</div>
      <div class="uu-word">${esc(mask).replace("_", '<span class="gap">?</span>')}</div>
      <div class="uu-btns"><button class="btn" data-a="ú">ú</button><button class="btn" data-a="ů">ů</button></div>
      <div id="uu-res"></div>`;
    box.querySelectorAll("[data-a]").forEach(b => (b.onclick = () => {
      const ok = b.dataset.a === ans;
      if (ok) right++;
      box.querySelectorAll("[data-a]").forEach(x => { x.disabled = true; x.classList.add(x.dataset.a === ans ? "right" : "dim"); });
      if (!ok) b.classList.add("wrong");
      speak(word);
      $("uu-res").innerHTML = `
        <p class="${ok ? "ok" : "no"}"><b>${ok ? "Так" : "Ні"}:</b> <b class="cz">${esc(word)}</b> — ${esc(why)}</p>
        <button class="btn primary" id="uu-next">Далі</button>`;
      $("uu-next").onclick = () => { i++; step(); };
    }));
  };
  step();
}

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
      <h3 class="section" style="margin:8px 0 0">Значки над літерами</h3>
      <p class="muted small">Риска й кружечок — звук <b>довшає</b>. Гачок — звук <b>інший</b>. Значок на голосному (крім ě) = тягни, на приголосному = змінюй звук.</p>
      ${MARKS.map(m => `
        <details class="mark">
          <summary><span class="mark-sign">${m.sign}</span><span><b>${m.name}</b> <span class="muted">(${m.cz})</span><br><span class="small muted">${m.short}</span></span></summary>
          <div class="mark-body">${m.body}</div>
        </details>`).join("")}
      <details class="mark">
        <summary><span class="mark-sign small-sign">ú ů</span><span><b>ú чи ů — коли що писати</b><br><span class="small muted">алгоритм і перевірка через «о»</span></span></summary>
        <div class="mark-body">${UU_RULES}</div>
      </details>
      <div class="rule"><b>Перевір себе: ú чи ů?</b><div id="uu-quiz" class="uu"></div></div>
      <h3 class="section" style="margin:8px 0 0">Правила вимови</h3>
      ${RULES.map(([h, t]) => `<div class="rule"><b>${h}</b><p>${t}</p></div>`).join("")}
    </div>`);
  $("back").onclick = back;
  document.querySelectorAll(".chip[data-say]").forEach(b => (b.onclick = () => speak(b.dataset.say)));
  uuQuiz();

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
