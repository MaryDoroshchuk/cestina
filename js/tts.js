// Озвучка чеською через вбудований голос браузера (на Apple — Zuzana).
let voice = null;
function pick() {
  const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  voice = vs.find(v => /^cs/i.test(v.lang)) || null;
}
if (window.speechSynthesis) { pick(); speechSynthesis.onvoiceschanged = pick; }

export const hasCzechVoice = () => !!voice;

export function speak(text, { slow = false } = {}) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, ", ").replace(/…/g, ""));
  u.lang = "cs-CZ";
  if (voice) u.voice = voice;
  u.rate = slow ? 0.6 : 0.9;
  speechSynthesis.speak(u);
}
