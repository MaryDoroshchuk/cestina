// Тематичні набори: місяці, дні тижня, числа.
// Слова беруться з основного словника, тому прогрес спільний з тижнями.
const chip = (cz, ua) => `<button class="chip" data-say="${cz}"><b>${cz}</b>${ua ? ` — ${ua}` : ""}</button>`;

export const TOPICS = [
  {
    id: "months", tab: "Місяці", title: "Місяці",
    cols: 2,
    items: [
      ["leden", "1"], ["únor", "2"], ["březen", "3"], ["duben", "4"], ["květen", "5"], ["červen", "6"],
      ["červenec", "7"], ["srpen", "8"], ["září", "9"], ["říjen", "10"], ["listopad", "11"], ["prosinec", "12"]
    ],
    tips: `
      <div class="rule"><b>Пастки</b>
        <p><b>květen</b> — це <b>травень</b>, а не квітень. Квітень — <b>duben</b>.</p>
        <p><b>červen</b> (червень) і <b>červenec</b> (липень) майже однакові: спершу коротший červen (6), потім довший červenec (7).</p>
        <p><b>listopad</b> — листопад, збігається з українським.</p>
      </div>
      <div class="rule"><b>Як запам'ятати: назви від природи</b>
        <p><b>leden</b> ← led (лід) · <b>březen</b> ← bříza (береза) · <b>duben</b> ← dub (дуб) · <b>květen</b> ← květ (квітка) · <b>srpen</b> ← srp (серп, жнива) · <b>listopad</b> ← листя падає.</p>
      </div>
      <div class="rule"><b>«У січні» — v + місцевий відмінок</b>
        <div class="pairs">
          ${chip("v lednu", "у січні")}${chip("v únoru", "у лютому")}${chip("v březnu", "у березні")}${chip("v dubnu", "у квітні")}
          ${chip("v květnu", "у травні")}${chip("v červnu", "у червні")}${chip("v červenci", "у липні")}${chip("v srpnu", "у серпні")}
          ${chip("v září", "у вересні")}${chip("v říjnu", "у жовтні")}${chip("v listopadu", "у листопаді")}${chip("v prosinci", "у грудні")}
        </div>
        <p class="muted small">Зверни увагу: випадає -e-: led<b>e</b>n → led<b>n</b>u, dub<b>e</b>n → dub<b>n</b>u.</p>
      </div>`
  },
  {
    id: "days", tab: "Дні", title: "Дні тижня",
    cols: 1,
    items: [["pondělí", "Пн"], ["úterý", "Вт"], ["středa", "Ср"], ["čtvrtek", "Чт"], ["pátek", "Пт"], ["sobota", "Сб"], ["neděle", "Нд"]],
    tips: `
      <div class="rule"><b>Як запам'ятати</b>
        <p><b>pondělí</b> — «по неділі» · <b>úterý</b> — «другий» (як вівторок) · <b>středa</b> — середа · <b>čtvrtek</b> ← čtvrtý (четвертий) · <b>pátek</b> ← pátý (п'ятий) · <b>neděle</b> — «не діло», день без роботи.</p>
      </div>
      <div class="rule"><b>«У понеділок» — v + знахідний відмінок</b>
        <div class="pairs">
          ${chip("v pondělí", "у понеділок")}${chip("v úterý", "у вівторок")}${chip("ve středu", "у середу")}${chip("ve čtvrtek", "у четвер")}
          ${chip("v pátek", "у п'ятницю")}${chip("v sobotu", "у суботу")}${chip("v neděli", "у неділю")}
        </div>
        <p class="muted small">Перед st- і čt- замість <b>v</b> пишеться <b>ve</b>, щоб легше вимовити.</p>
      </div>
      <div class="rule"><b>Корисне</b>
        <div class="pairs">${chip("o víkendu", "на вихідних")}${chip("každé pondělí", "щопонеділка")}${chip("příští týden", "наступного тижня")}${chip("minulý týden", "минулого тижня")}</div>
      </div>`
  },
  {
    id: "numbers", tab: "Числа", title: "Числа",
    cols: 3,
    items: [
      ["nula", "0"], ["jeden, jedna, jedno", "1"], ["dva, dvě", "2"], ["tři", "3"], ["čtyři", "4"], ["pět", "5"],
      ["šest", "6"], ["sedm", "7"], ["osm", "8"], ["devět", "9"], ["deset", "10"], ["jedenáct", "11"],
      ["dvanáct", "12"], ["třináct", "13"], ["čtrnáct", "14"], ["patnáct", "15"], ["šestnáct", "16"], ["sedmnáct", "17"],
      ["osmnáct", "18"], ["devatenáct", "19"], ["dvacet", "20"], ["třicet", "30"], ["čtyřicet", "40"], ["padesát", "50"],
      ["šedesát", "60"], ["sedmdesát", "70"], ["osmdesát", "80"], ["devadesát", "90"], ["sto", "100"], ["tisíc", "1000"]
    ],
    tips: `
      <div class="rule"><b>11–19: число + -náct</b>
        <p>Як українське «-надцять»: jede<b>náct</b>, dva<b>náct</b>, tři<b>náct</b>. Пастки: <b>čtrnáct</b> (не čtyřnáct), <b>patnáct</b> (не pětnáct), <b>devatenáct</b>.</p>
      </div>
      <div class="rule"><b>Десятки: -cet / -desát</b>
        <p>20–40: dva<b>cet</b>, tři<b>cet</b>, čtyři<b>cet</b>. 50–90: pa<b>desát</b>, še<b>desát</b>, sedm<b>desát</b>, osm<b>desát</b>, deva<b>desát</b>.</p>
      </div>
      <div class="rule"><b>21, 35, 99 — як в українській</b>
        <div class="pairs">${chip("dvacet jedna", "21")}${chip("třicet pět", "35")}${chip("devadesát devět", "99")}${chip("sto dvacet", "120")}</div>
        <p class="muted small">Також кажуть навпаки: jedenadvacet (21), але для старту вистачить першого способу.</p>
      </div>
      <div class="rule"><b>Сотні й тисячі</b>
        <div class="pairs">
          ${chip("sto", "100")}${chip("dvě stě", "200")}${chip("tři sta", "300")}${chip("pět set", "500")}
          ${chip("tisíc", "1000")}${chip("dva tisíce", "2000")}${chip("pět tisíc", "5000")}
        </div>
        <p class="muted small">Логіка та сама, що в українській: 2 — stě, 3–4 — sta, 5+ — set (двісті / триста / п'ятсот).</p>
      </div>
      <div class="rule"><b>1 і 2 змінюються за родом</b>
        <div class="pairs">${chip("jeden rohlík", "один рогалик")}${chip("jedna káva", "одна кава")}${chip("jedno pivo", "одне пиво")}${chip("dva rohlíky", "два рогалики")}${chip("dvě kávy", "дві кави")}</div>
      </div>
      <div class="rule"><b>Після числа — як в українській</b>
        <p>1 — однина, 2–4 — називний множини, 5+ — родовий множини:</p>
        <div class="pairs">${chip("jedna koruna", "1 крона")}${chip("tři koruny", "3 крони")}${chip("pět korun", "5 крон")}</div>
      </div>`
  }
];
