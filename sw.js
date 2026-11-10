// Кеш файлів сайту, щоб він відкривався без інтернету.
// Збільшуй VERSION після кожної зміни файлів, щоб телефон підтягнув нову версію.
const VERSION = "v15";
const FILES = ["./", "index.html", "css/style.css", "js/app.js", "js/backend.js", "js/srs.js", "js/tts.js", "js/modes.js", "js/match.js", "js/alphabet.js", "js/topics.js", "js/pronounce.js", "data/sentences.json", "data/alphabet.json",
  "js/firebase-config.js", "data/words.json", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png"];

self.addEventListener("install", e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
// Спершу мережа (з перевіркою свіжості, щоб не брати застарілу копію з кешу браузера), без мережі — кеш
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" }).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request))
  );
});
