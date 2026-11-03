// Озвучка чеською через вбудований голос браузера (на Apple — Zuzana).
// Особливості iOS Safari, які тут обійдено:
//  - перший звук має пролунати у відповідь на дотик, інакше озвучка «мовчить» → розблоковуємо на першому дотику;
//  - cancel() і одразу speak() часто губить фразу → після cancel() говоримо з невеликою паузою;
//  - список голосів з'являється не одразу → шукаємо чеський голос щоразу, поки не знайдемо.
const ss = window.speechSynthesis || null;
let voice = null, unlocked = false, warned = false, spokeReal = false;

function pick() {
  if (!ss) return null;
  const vs = ss.getVoices();
  voice = vs.find(v => /^cs([-_]|$)/i.test(v.lang)) || null;
  return voice;
}

if (ss) {
  pick();
  if (ss.addEventListener) ss.addEventListener("voiceschanged", pick);
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    ss.speak(u);
  };
  document.addEventListener("touchend", unlock, { capture: true, once: true });
  document.addEventListener("click", unlock, { capture: true, once: true });
}

export const hasCzechVoice = () => !!(voice || pick());

function hint(msg) {
  if (warned) return;
  warned = true;
  const d = document.createElement("div");
  d.className = "toast";
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 7000);
}

export function speak(text, { slow = false } = {}) {
  if (!ss) return hint("Цей браузер не вміє озвучувати текст.");
  if (!voice) pick();
  if (!voice && ss.getVoices().length) {
    hint("Немає чеського голосу. iPhone: Параметри → Універсальний доступ → Усний вміст → Голоси → Čeština → завантаж Zuzana.");
  }
  const u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, ", ").replace(/…/g, ""));
  u.lang = "cs-CZ";
  if (voice) u.voice = voice;
  u.rate = slow ? 0.6 : 0.9;
  u.volume = 1;
  if (ss.paused) ss.resume();
  // беззвучну «розблокувальну» фразу не перериваємо — нове слово просто стане в чергу за нею
  const interrupt = spokeReal && (ss.speaking || ss.pending);
  spokeReal = true;
  if (interrupt) {
    ss.cancel();
    setTimeout(() => ss.speak(u), 80);
  } else {
    ss.speak(u);
  }
}
