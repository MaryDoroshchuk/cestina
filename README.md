# Čeština

Сайт для тренування чеських слів: картки, щоденна сесія з розумним повторенням, серія днів.
770 слів по 20 тижнях (A2), вимова, переклад українською.

Статус: етапи 1–4 — вхід, щоденна сесія, картки, тест з варіантами, написання, аудіо, «Знайди пару». Наступне: статистика й власні набори.

Демо-режим без входу (прогрес лише в браузері): додай `?demo` до адреси.

## Як це влаштовано

- Звичайні файли HTML/CSS/JS, без збирання. GitHub Pages просто віддає їх.
- Вхід через Google і прогрес — у Firebase (Authentication + Firestore).
- Поки в `js/firebase-config.js` порожньо, сайт працює в **демо-режимі**: без входу, прогрес лише в цьому браузері.

## Налаштування (один раз)

### 1. GitHub Pages
Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, папка `/ (root)` → Save.
За хвилину сайт з'явиться на `https://marydoroshchuk.github.io/cestina/`.

### 2. Firebase
1. [console.firebase.google.com](https://console.firebase.google.com) → створи проєкт.
2. **Build → Authentication → Get started → Google → Enable** → Save.
3. **Authentication → Settings → Authorized domains → Add domain** → `marydoroshchuk.github.io`.
4. **Build → Firestore Database → Create database** → регіон `eur3 (europe-west)` → Production mode.
5. **Firestore → Rules** → встав вміст файлу `firestore.rules` → Publish.
6. **Project settings (⚙) → General → Your apps → Web (`</>`)** → назва `cestina` → Register. Скопіюй `firebaseConfig` у `js/firebase-config.js`.

### 3. Хто має доступ
Firestore → Data → **Start collection** → ID колекції `allowedEmails`.
Кожна людина — окремий документ: **Document ID = її email малими літерами**, поле `name` (string) з її ім'ям.

## Оновлення сайту на телефоні
Після змін у файлах збільш `VERSION` у `sw.js` (`v1` → `v2`), інакше телефон може показувати стару версію.

## Структура
```
index.html            сторінка
css/style.css         стилі
js/app.js             екрани і логіка сесії
js/modes.js           режими: картки, тест, написання, аудіо
js/match.js           гра «Знайди пару»
js/alphabet.js        довідник «Чеська абетка»
js/topics.js          місяці, дні тижня, числа
data/alphabet.json    42 літери: назва, звук, приклад
js/srs.js             розумне повторення (сходинки 0–5: 0, 1, 3, 7, 16, 35 днів)
js/backend.js         Firebase або демо-режим
js/tts.js             озвучка чеським голосом браузера
js/firebase-config.js конфіг Firebase
data/words.json       770 слів
firestore.rules       правила доступу до бази
sw.js                 офлайн-кеш
```
