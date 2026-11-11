# Джерело вправ за підручником «Česky raz dva» (CIC, 2022): граматика уроків, дорослі ситуації.
# Формати:
#   fill:   ("речення з ___", "відповідь" | ["варіант1", "варіант2"], "переклад/підказка")
#   choice: ("речення з ___", ["опція", ...], "правильна", "переклад")
#   build:  ("Правильне речення.", "переклад", [альтернативні правильні порядки])
import json

def T(*rows, head=None):
    h = "".join(f"<th>{c}</th>" for c in head) if head else ""
    body = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    return f'<table class="tbl">{"<tr>"+h+"</tr>" if h else ""}{body}</table>'

def conj(verb, forms, neg=None):
    # forms: já, ty, on/ona, my, vy, oni
    p = ["já", "ty", "on, ona", "my", "vy", "oni"]
    rows = [(p[i], f"<b>{forms[i]}</b>", p[i+3], f"<b>{forms[i+3]}</b>") for i in range(3)]
    t = f"<p><b>{verb}</b>{(' · заперечення: ' + neg) if neg else ''}</p>" + T(*rows)
    return t

L = []

# ---------------- 1 ----------------
L.append(dict(n=1, cz="Představujeme se", ua="Знайомство",
grammar=conj("BÝT — бути", ["jsem","jsi","je","jsme","jste","jsou"], "nejsem, nejsi, <b>není</b>, nejsme, nejste, nejsou") + """
<p><b>Звідки ти?</b> z + родовий відмінок (2. pád): Ukrajin<b>a</b> → z Ukrajin<b>y</b>, Česk<b>o</b> → z Česk<b>a</b>, Kyjev → z Kyjev<b>a</b>, Itálie → z Itálie.</p>
<p><b>ze</b> замість z — перед z, s, ž, š і важкими збігами: <b>ze</b> Žitomiru, <b>ze</b> Slovenska.</p>
<p><b>Kdo?</b> — про людей і тварин, <b>Co?</b> — про речі: Kdo to je? To je můj kolega. Co to je? To je stůl.</p>""",
sets=[
 dict(type="fill", title="Дієслово být", items=[
  ("(já) ___ z Ukrajiny.", "jsem", "Я з України."),
  ("(my) ___ v Česku dva roky.", "jsme", "Ми в Чехії два роки."),
  ("(vy) ___ paní Nováková?", "jste", "Ви пані Новакова?"),
  ("(ona) ___ moje kolegyně.", "je", "Вона моя колега."),
  ("(oni) ___ z Polska.", "jsou", "Вони з Польщі."),
  ("(ty) ___ tady nová?", "jsi", "Ти тут нова?"),
  ("(já, ne) ___ z Prahy, jsem z Brna.", "nejsem", "Я не з Праги, я з Брно."),
  ("(on, ne) ___ doma, je v práci.", "není", "Його немає вдома, він на роботі."),
 ]),
 dict(type="fill", title="Звідки ти? z + 2. відмінок", items=[
  ("Jsem z ___. (Ukrajina)", "Ukrajiny", "Я з України."),
  ("Kolega je z ___. (Česko)", "Česka", "Колега з Чехії."),
  ("Moje sestra je z ___. (Kyjev)", "Kyjeva", "Моя сестра з Києва."),
  ("Šéf je z ___. (Itálie)", "Itálie", "Начальник з Італії."),
  ("Sousedka je z ___. (Polsko)", "Polska", "Сусідка з Польщі."),
  ("Jsme z ___. (Praha)", "Prahy", "Ми з Праги."),
  ("Pan Novák je ze ___. (Slovensko)", "Slovenska", "Пан Новак зі Словаччини."),
 ]),
 dict(type="choice", title="Kdo чи co? z чи ze?", items=[
  ("___ to je? — To je můj manžel.", ["Kdo","Co"], "Kdo", "Хто це? — Це мій чоловік."),
  ("___ to je? — To je formulář.", ["Kdo","Co"], "Co", "Що це? — Це бланк."),
  ("___ to je? — To je paní doktorka.", ["Kdo","Co"], "Kdo", "Хто це? — Це пані лікарка."),
  ("___ to je? — To je můj pes.", ["Kdo","Co"], "Kdo", "Хто це? — Це мій пес."),
  ("Jsem ___ Žitomiru.", ["z","ze"], "ze", "Я з Житомира."),
  ("Jsem ___ Kyjeva.", ["z","ze"], "z", "Я з Києва."),
  ("Kolegyně je ___ Zlína.", ["z","ze"], "ze", "Колега зі Зліна."),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Jsem z Ukrajiny a bydlím v Brně.", "Я з України і живу в Брно."),
  ("Jak dlouho jste v Česku?", "Як довго ви в Чехії?"),
  ("Jsem tady tři měsíce.", "Я тут три місяці.", ["Tři měsíce jsem tady."]),
  ("Nerozumím, mluvte pomalu, prosím.", "Не розумію, говоріть повільно, будь ласка."),
 ]),
]))

# ---------------- 2 ----------------
L.append(dict(n=2, cz="Seznamujeme se", ua="Знайомимося",
grammar=conj("DĚLAT — робити", ["dělám","děláš","dělá","děláme","děláte","dělají"]) +
conj("MÍT — мати", ["mám","máš","má","máme","máte","mají"], "nemám, nemáš…") + """
<p><b>Чий?</b> Форма залежить від роду предмета:</p>""" + T(
 ("я","<b>můj</b> manžel","<b>moje</b> kolegyně"),("ти","<b>tvůj</b>","<b>tvoje</b>"),("ми","<b>náš</b>","<b>naše</b>"),("ви","<b>váš</b>","<b>vaše</b>"),
 ("він / вона / вони","<b>jeho / její / jejich</b>","<b>jeho / její / jejich</b>"), head=("","чол. рід","жін. рід")) + """
<p><b>Професії:</b> učitel → učitel<b>ka</b>, prodavač → prodavač<b>ka</b>, policista → policist<b>ka</b>, číšník → číšn<b>ice</b>.</p>""",
sets=[
 dict(type="fill", title="Дієслова dělat і mít", items=[
  ("(já) ___ kávu.", "dělám", "Я роблю каву."),
  ("Co ___ (ty) o víkendu?", "děláš", "Що ти робиш на вихідних?"),
  ("(vy) ___ test?", "děláte", "Ви пишете тест?"),
  ("(oni) ___ večeři.", "dělají", "Вони готують вечерю."),
  ("(já) ___ dvě děti.", "mám", "У мене двоє дітей."),
  ("(ona) ___ psa.", "má", "У неї є пес."),
  ("(my) ___ nový byt.", "máme", "У нас нова квартира."),
  ("(vy) ___ zítra čas?", "máte", "У вас є завтра час?"),
  ("(oni, ne) ___ auto.", "nemají", "У них немає машини."),
 ]),
 dict(type="choice", title="Чий? můj / moje…", items=[
  ("(já) ___ manžel", ["můj","moje"], "můj", "мій чоловік"),
  ("(já) ___ kolegyně", ["můj","moje"], "moje", "моя колега"),
  ("(ty) ___ šéf", ["tvůj","tvoje"], "tvůj", "твій начальник"),
  ("(my) ___ firma", ["náš","naše"], "naše", "наша фірма"),
  ("(vy) ___ byt", ["váš","vaše"], "váš", "ваша квартира"),
  ("(on) ___ dcera", ["jeho","její","jejich"], "jeho", "його донька"),
  ("(ona) ___ syn", ["jeho","její","jejich"], "její", "її син"),
  ("(oni) ___ děti", ["jeho","její","jejich"], "jejich", "їхні діти"),
 ]),
 dict(type="fill", title="Професії: жіноча форма", items=[
  ("učitel → ___", "učitelka", "учитель → учителька"),
  ("prodavač → ___", "prodavačka", "продавець → продавчиня"),
  ("lékař → ___", "lékařka", "лікар → лікарка"),
  ("programátor → ___", "programátorka", "програміст → програмістка"),
  ("řidič → ___", "řidička", "водій → водійка"),
  ("policista → ___", "policistka", "поліцейський → поліцейська"),
  ("číšník → ___", "číšnice", "офіціант → офіціантка"),
  ("manažer → ___", "manažerka", "менеджер → менеджерка"),
 ]),
]))

# ---------------- 3 ----------------
L.append(dict(n=3, cz="Nakupujeme", ua="Покупки",
grammar=conj("JÍST — їсти", ["jím","jíš","jí","jíme","jíte","jedí"]) +
conj("PÍT — пити", ["piju","piješ","pije","pijeme","pijete","pijou"]) + """
<p>У книжній мові також <i>piji, pijí</i> — обидва варіанти правильні.</p>
<p><b>Ввічливе прохання:</b> chtěl bych (чоловік) / chtěla bych (жінка) + 4. відмінок: Chtěla bych kávu.</p>
<p><b>Ціна:</b> 1 korun<b>a</b>, 2–4 korun<b>y</b>, 5+ korun. Десятки: dvacet, třicet, čtyřicet, padesát, šedesát, sedmdesát, osmdesát, devadesát, sto.</p>
<p><b>25</b> = dvacet pět або pětadvacet.</p>""",
sets=[
 dict(type="fill", title="Дієслова jíst і pít", items=[
  ("(já) ___ rohlík.", "jím", "Я їм рогалик."),
  ("(ty) ___ maso?", "jíš", "Ти їси м'ясо?"),
  ("(my) ___ salát.", "jíme", "Ми їмо салат."),
  ("(oni) ___ v restauraci.", "jedí", "Вони їдять у ресторані."),
  ("(já) ___ kávu bez cukru.", ["piju","piji"], "Я п'ю каву без цукру."),
  ("(ona) ___ čaj.", "pije", "Вона п'є чай."),
  ("(vy) ___ pivo?", "pijete", "Ви п'єте пиво?"),
  ("(oni) ___ vodu.", ["pijou","pijí"], "Вони п'ють воду."),
 ]),
 dict(type="fill", title="Ціни словами", items=[
  ("25 Kč = ___ korun", ["dvacet pět","pětadvacet"], "25"),
  ("38 Kč = ___ korun", ["třicet osm","osmatřicet"], "38"),
  ("47 Kč = ___ korun", ["čtyřicet sedm","sedmačtyřicet"], "47"),
  ("59 Kč = ___ korun", ["padesát devět","devětapadesát"], "59"),
  ("64 Kč = ___ korun", ["šedesát čtyři","čtyřiašedesát"], "64"),
  ("86 Kč = ___ korun", ["osmdesát šest","šestaosmdesát"], "86"),
  ("99 Kč = ___ korun", ["devadesát devět","devětadevadesát"], "99"),
  ("120 Kč = ___ korun", "sto dvacet", "120"),
 ]),
 dict(type="choice", title="koruna / koruny / korun", items=[
  ("1 ___", ["koruna","koruny","korun"], "koruna", "1 крона"),
  ("3 ___", ["koruna","koruny","korun"], "koruny", "3 крони"),
  ("4 ___", ["koruna","koruny","korun"], "koruny", "4 крони"),
  ("5 ___", ["koruna","koruny","korun"], "korun", "5 крон"),
  ("68 ___", ["koruna","koruny","korun"], "korun", "68 крон"),
  ("100 ___", ["koruna","koruny","korun"], "korun", "100 крон"),
  ("(жінка) ___ bych dva rohlíky.", ["Chtěl","Chtěla"], "Chtěla", "Я б хотіла два рогалики."),
  ("(чоловік) ___ bych kávu.", ["Chtěl","Chtěla"], "Chtěl", "Я б хотів каву."),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Chtěla bych dva rohlíky a mléko.", "Я б хотіла два рогалики й молоко."),
  ("Kolik to stojí?", "Скільки це коштує?"),
  ("Platím kartou.", "Плачу карткою.", ["Kartou platím."]),
  ("Stojí to šedesát osm korun.", "Це коштує шістдесят вісім крон.", ["To stojí šedesát osm korun."]),
 ]),
]))

# ---------------- 4 ----------------
L.append(dict(n=4, cz="Jíme a pijeme", ua="Їжа й напої",
grammar="""<p><b>MÍT RÁD — любити</b> (rád — чоловік, ráda — жінка, rádi — множина) + 4. відмінок:</p>""" + T(
 ("já","mám <b>rád / ráda</b>","my","máme <b>rádi</b>"),("ty","máš rád / ráda","vy","máte rádi"),("on / ona","má rád / ráda","oni","mají rádi")) + """
<p><b>З чим?</b> s / se + орудний відмінок (7. pád):</p>""" + T(
 ("mléko","s mlék<b>em</b>"),("máslo","s másl<b>em</b>"),("sýr","<b>se</b> sýr<b>em</b>"),("šunka","<b>se</b> šunk<b>ou</b>"),("rýže","s rýž<b>í</b>"),("brambory","s brambor<b>ami</b>"), head=("що","з чим")) + """
<p><b>se</b> замість s — перед s, š, z, ž: <b>se</b> sýrem, <b>se</b> šunkou.</p>""",
sets=[
 dict(type="fill", title="Mít rád", items=[
  ("(já, жінка) Mám ___ kávu.", "ráda", "Я люблю каву."),
  ("(on) Má ___ pivo.", "rád", "Він любить пиво."),
  ("(my) Máme ___ českou kuchyni.", "rádi", "Ми любимо чеську кухню."),
  ("(ty, чоловік) Máš ___ ryby?", "rád", "Ти любиш рибу?"),
  ("(oni) Mají ___ pizzu.", "rádi", "Вони люблять піцу."),
  ("(ona) ___ ráda čaj.", "Má", "Вона любить чай."),
  ("(vy) ___ rádi sport?", "Máte", "Ви любите спорт?"),
  ("(já, жінка, ne) ___ ráda maso.", "Nemám", "Я не люблю м'ясо."),
 ]),
 dict(type="fill", title="З чим? s / se + 7. відмінок", items=[
  ("káva s ___ (mléko)", "mlékem", "кава з молоком"),
  ("chleba s ___ (máslo)", "máslem", "хліб з маслом"),
  ("rohlík se ___ (sýr)", "sýrem", "рогалик із сиром"),
  ("kuře s ___ (rýže)", "rýží", "курка з рисом"),
  ("čaj s ___ (citron)", "citronem", "чай з лимоном"),
  ("káva s ___ (cukr)", "cukrem", "кава з цукром"),
  ("toast se ___ (šunka)", "šunkou", "тост із шинкою"),
  ("řízek s ___ (brambory)", "bramborami", "шніцель з картоплею"),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Mám ráda kávu s mlékem.", "Я люблю каву з молоком."),
  ("Dám si kuře s rýží.", "Я візьму курку з рисом."),
  ("Mám hlad a mám žízeň.", "Я голодна і хочу пити."),
  ("Můj manžel nemá rád ryby.", "Мій чоловік не любить рибу."),
 ]),
]))

# ---------------- 5 ----------------
L.append(dict(n=5, cz="Co máme ve městě?", ua="Що є в місті",
grammar=conj("JÍT — іти (пішки)", ["jdu","jdeš","jde","jdeme","jdete","jdou"], "nejdu…") + """
<p><b>Куди?</b> <b>do</b> + 2. відмінок (всередину): do obchodu, do banky, do práce. <b>na</b> + 4. відмінок: na poštu, na úřad, na nádraží.</p>
<p><b>Кого? Що?</b> — 4. відмінок (об'єкт): káva → káv<b>u</b>, pošta → pošt<b>u</b>, kolega → koleg<b>u</b>, pes → ps<b>a</b>. Неживий чоловічий рід не змінюється: Vidím dům.</p>""" +
conj("PRACOVAT — працювати (усі на -ovat так само)", ["pracuju","pracuješ","pracuje","pracujeme","pracujete","pracujou"]),
sets=[
 dict(type="fill", title="Дієслово jít", items=[
  ("(já) ___ do práce.", "jdu", "Я йду на роботу."),
  ("(ty) ___ na poštu?", "jdeš", "Ти йдеш на пошту?"),
  ("(ona) ___ do banky.", "jde", "Вона йде в банк."),
  ("(my) ___ do kina.", "jdeme", "Ми йдемо в кіно."),
  ("(vy) ___ domů?", "jdete", "Ви йдете додому?"),
  ("(oni) ___ na úřad.", "jdou", "Вони йдуть в установу."),
  ("(já, ne) Dnes ___ do práce.", "nejdu", "Сьогодні я не йду на роботу."),
 ]),
 dict(type="choice", title="Куди? do чи na", items=[
  ("Jdu ___ obchodu.", ["do","na"], "do", "Я йду в магазин."),
  ("Jdu ___ poštu.", ["do","na"], "na", "Я йду на пошту."),
  ("Jdu ___ banky.", ["do","na"], "do", "Я йду в банк."),
  ("Jdu ___ úřad.", ["do","na"], "na", "Я йду в установу."),
  ("Jdu ___ lékárny.", ["do","na"], "do", "Я йду в аптеку."),
  ("Jdu ___ nádraží.", ["do","na"], "na", "Я йду на вокзал."),
 ]),
 dict(type="fill", title="Кого? Що? 4. відмінок", items=[
  ("Piju ___. (káva)", "kávu", "Я п'ю каву."),
  ("Hledám ___. (lékárna)", "lékárnu", "Я шукаю аптеку."),
  ("Potřebuju ___. (taška)", "tašku", "Мені потрібна сумка."),
  ("Mám ___. (pes)", "psa", "У мене є пес."),
  ("Čekám na ___. (kolega)", "kolegu", "Я чекаю на колегу."),
  ("Vařím ___. (polévka)", "polévku", "Я варю суп."),
  ("Vidím ___. (dům)", "dům", "Я бачу будинок."),
 ]),
 dict(type="fill", title="Дієслова на -ovat", items=[
  ("(já) ___ v kanceláři. (pracovat)", ["pracuju","pracuji"], "Я працюю в офісі."),
  ("(on) ___ jako řidič. (pracovat)", "pracuje", "Він працює водієм."),
  ("(my) ___ češtinu. (studovat)", "studujeme", "Ми вивчаємо чеську."),
  ("(ty) ___ každý den? (sportovat)", "sportuješ", "Ти займаєшся спортом щодня?"),
  ("(oni) ___ v Lidlu. (nakupovat)", ["nakupujou","nakupují"], "Вони купують у Lidl."),
 ]),
]))

# ---------------- 6 ----------------
L.append(dict(n=6, cz="Jdeme do města", ua="Транспорт і дорога",
grammar=conj("JET — їхати", ["jedu","jedeš","jede","jedeme","jedete","jedou"]) +
conj("MUSET — мусити", ["musím","musíš","musí","musíme","musíte","musí"]) + """
<p><b>Чим їдеш?</b> 7. відмінок: autobus → autobus<b>em</b>, metro → metr<b>em</b>, tramvaj → tramvaj<b>í</b>, auto → aut<b>em</b>. Але: na kole (на велосипеді), pěšky (пішки).</p>
<p><b>Поруч з чим?</b> vedle + 2. відмінок: vedle bank<b>y</b>, vedle park<b>u</b>.</p>
<p><b>Напрямок:</b> rovně — прямо, doleva — ліворуч, doprava — праворуч.</p>""",
sets=[
 dict(type="fill", title="Дієслова jet і muset", items=[
  ("(já) ___ do práce autobusem.", "jedu", "Я їду на роботу автобусом."),
  ("(ona) ___ do Prahy.", "jede", "Вона їде до Праги."),
  ("(my) ___ vlakem.", "jedeme", "Ми їдемо потягом."),
  ("(oni) ___ metrem.", "jedou", "Вони їдуть метро."),
  ("(já) ___ jít k doktorovi.", "musím", "Мені треба йти до лікаря."),
  ("(ty) ___ zaplatit nájem.", "musíš", "Ти мусиш заплатити оренду."),
  ("(my) ___ vstávat brzo.", "musíme", "Нам треба вставати рано."),
  ("(vy) ___ vyplnit formulář.", "musíte", "Ви мусите заповнити бланк."),
 ]),
 dict(type="fill", title="Чим? 7. відмінок", items=[
  ("Jedu ___. (autobus)", "autobusem", "Я їду автобусом."),
  ("Jedu ___. (tramvaj)", "tramvají", "Я їду трамваєм."),
  ("Jedu ___. (metro)", "metrem", "Я їду метро."),
  ("Jedu ___. (vlak)", "vlakem", "Я їду потягом."),
  ("Jedu ___. (auto)", "autem", "Я їду машиною."),
  ("Jedu ___. (taxík)", "taxíkem", "Я їду таксі."),
  ("Letím ___. (letadlo)", "letadlem", "Я лечу літаком."),
 ]),
 dict(type="fill", title="Де? vedle + 2. відмінок", items=[
  ("Pošta je vedle ___. (banka)", "banky", "Пошта поруч з банком."),
  ("Lékárna je vedle ___. (park)", "parku", "Аптека поруч з парком."),
  ("Zastávka je vedle ___. (nádraží)", "nádraží", "Зупинка поруч з вокзалом."),
  ("Banka je vedle ___. (lékárna)", "lékárny", "Банк поруч з аптекою."),
  ("Bydlím vedle ___. (škola)", "školy", "Я живу поруч зі школою."),
  ("Parkuju vedle ___. (obchod)", "obchodu", "Я паркуюся поруч з магазином."),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Jak se dostanu na nádraží?", "Як мені дістатися до вокзалу?"),
  ("Jděte rovně a pak doleva.", "Ідіть прямо, а потім ліворуч."),
  ("Musím jet do práce tramvají.", "Мені треба їхати на роботу трамваєм.", ["Do práce musím jet tramvají."]),
 ]),
]))

# ---------------- 7 ----------------
L.append(dict(n=7, cz="Bydlíme", ua="Житло і розпорядок",
grammar=conj("DÁT SI — взяти собі (замовити)", ["dám si","dáš si","dá si","dáme si","dáte si","dají si"]) +
conj("CHTÍT — хотіти", ["chci","chceš","chce","chceme","chcete","chtějí"]) + """
<p><b>se / si</b> — як українське «-ся / собі». Стоять на <b>другому місці</b> в реченні: Ráno <b>se</b> sprchuju. Večer <b>si</b> čtu.</p>
<p><b>se</b> — дію роблю над собою (sprchuju se, oblékám se, učím se). <b>si</b> — «собі» (čistím si zuby, dám si kávu, myju si ruce).</p>
<p><b>Кімнати:</b> kuchyň → v kuchyni, koupelna → v koupelně, ložnice → v ložnici, obývák → v obýváku, předsíň → v předsíni.</p>""",
sets=[
 dict(type="fill", title="Dát si і chtít", items=[
  ("(já) ___ kávu.", "dám si", "Я візьму каву."),
  ("(vy) Co si ___?", "dáte", "Що ви візьмете?"),
  ("(my) ___ polévku.", "dáme si", "Ми візьмемо суп."),
  ("(já) ___ bydlet v centru.", "chci", "Я хочу жити в центрі."),
  ("(ty) ___ nový byt?", "chceš", "Ти хочеш нову квартиру?"),
  ("(oni) ___ jet na dovolenou.", "chtějí", "Вони хочуть поїхати у відпустку."),
  ("(my, ne) ___ platit tolik.", "nechceme", "Ми не хочемо стільки платити."),
 ]),
 dict(type="choice", title="se чи si?", items=[
  ("Ráno ___ sprchuju.", ["se","si"], "se", "Вранці я приймаю душ."),
  ("Čistím ___ zuby.", ["se","si"], "si", "Я чищу зуби."),
  ("Oblékám ___.", ["se","si"], "se", "Я одягаюся."),
  ("Dám ___ čaj.", ["se","si"], "si", "Я візьму чай."),
  ("Večer ___ dívám na film.", ["se","si"], "se", "Ввечері я дивлюся фільм."),
  ("Myju ___ ruce.", ["se","si"], "si", "Я мию руки."),
  ("Učím ___ česky.", ["se","si"], "se", "Я вчу чеську."),
 ]),
 dict(type="choice", title="Де це в квартирі?", items=[
  ("Vařím v ___.", ["kuchyni","koupelně","ložnici"], "kuchyni", "Я готую на кухні."),
  ("Spím v ___.", ["kuchyni","koupelně","ložnici"], "ložnici", "Я сплю в спальні."),
  ("Sprchuju se v ___.", ["kuchyni","koupelně","obýváku"], "koupelně", "Я приймаю душ у ванній."),
  ("Díváme se na televizi v ___.", ["koupelně","obýváku","předsíni"], "obýváku", "Ми дивимося телевізор у вітальні."),
  ("Boty jsou v ___.", ["předsíni","ložnici","kuchyni"], "předsíni", "Взуття в передпокої."),
 ]),
 dict(type="build", title="Порядок слів: se / si на 2-му місці", items=[
  ("Ráno se sprchuju a snídám.", "Вранці я приймаю душ і снідаю."),
  ("Večer si čtu knihu.", "Ввечері я читаю книжку."),
  ("Co si dáte?", "Що ви візьмете?"),
  ("V kuchyni máme novou ledničku.", "На кухні в нас новий холодильник.", ["Máme v kuchyni novou ledničku.", "Novou ledničku máme v kuchyni."]),
 ]),
]))

# ---------------- 8 ----------------
L.append(dict(n=8, cz="Hrajeme si", ua="Вільний час",
grammar="""<p><b>Люблю щось робити</b> = rád / ráda / rádi + дієслово в особовій формі (не інфінітив!):</p>""" + T(
 ("Rád hraju tenis.","Я (чол.) люблю грати в теніс."),("Ráda čtu.","Я (жін.) люблю читати."),("Rádi cestujeme.","Ми любимо подорожувати."),("Nerad vařím.","Я не люблю готувати.")) + """
<p><b>Форма «я»</b> за типом дієслова:</p>""" + T(
 ("-at","dělat → děl<b>ám</b>, hrát → hr<b>aju</b>"),("-it / -et","vařit → vař<b>ím</b>, uklízet → uklíz<b>ím</b>"),("-ovat","malovat → mal<b>uju</b>, cestovat → cest<b>uju</b>"),("неправильні","číst → <b>čtu</b>, psát → <b>píšu</b>, spát → <b>spím</b>, plavat → <b>plavu</b>")),
sets=[
 dict(type="fill", title="rád / ráda / rádi", items=[
  ("(já, жінка) ___ čtu.", "Ráda", "Я люблю читати."),
  ("(on) ___ vaří.", "Rád", "Він любить готувати."),
  ("(my) ___ cestujeme.", "Rádi", "Ми любимо подорожувати."),
  ("(ona) ___ tancuje.", "Ráda", "Вона любить танцювати."),
  ("(oni) ___ hrajou fotbal.", "Rádi", "Вони люблять грати у футбол."),
  ("(ty, чоловік) ___ plaveš?", "Rád", "Ти любиш плавати?"),
  ("(já, жінка, ne) ___ uklízím.", "Nerada", "Я не люблю прибирати."),
 ]),
 dict(type="fill", title="Форма «я»", items=[
  ("hrát → já ___", ["hraju","hraji"], "грати"),
  ("vařit → já ___", "vařím", "готувати"),
  ("tancovat → já ___", ["tancuju","tancuji"], "танцювати"),
  ("uklízet → já ___", "uklízím", "прибирати"),
  ("malovat → já ___", ["maluju","maluji"], "малювати"),
  ("číst → já ___", "čtu", "читати"),
  ("psát → já ___", ["píšu","píši"], "писати"),
  ("plavat → já ___", "plavu", "плавати"),
  ("cestovat → já ___", ["cestuju","cestuji"], "подорожувати"),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Ráda vařím a čtu knihy.", "Я люблю готувати й читати книжки."),
  ("O víkendu rádi hrajeme tenis.", "На вихідних ми любимо грати в теніс.", ["Rádi hrajeme tenis o víkendu."]),
  ("Co rád děláš ve volném čase?", "Що ти любиш робити у вільний час?", ["Co děláš rád ve volném čase?"]),
 ]),
]))

# ---------------- 9 ----------------
L.append(dict(n=9, cz="Jsme ve škole", ua="Курси, робота, час",
grammar="""<p><b>О котрій?</b> v + число: v osm, v devět, v šest. <b>ve</b> перед dvě, tři, čtyři, dvanáct, třináct, čtrnáct: <b>ve</b> tři, <b>ve</b> 12:15.</p>
<p><b>Дні:</b> v pondělí, v úterý, <b>ve</b> středu, <b>ve</b> čtvrtek, v pátek, v sobotu, v neděli.</p>
<p><b>Де?</b> 6. відмінок (lokál):</p>""" + T(
 ("kancelář","v kancelář<b>i</b>"),("škola","ve škol<b>e</b>"),("banka","v ban<b>ce</b>"),("pošta","na pošt<b>ě</b>"),("Praha","v Pra<b>ze</b>"),("úřad","na úřad<b>ě</b>"),("restaurace","v restaurac<b>i</b>"), head=("що","де")) + """
<p>Зверни увагу на чергування: bank<b>a</b> → ban<b>ce</b>, Prah<b>a</b> → Pra<b>ze</b> (k → c, h → z).</p>""",
sets=[
 dict(type="choice", title="v чи ve?", items=[
  ("Porada je ___ 8:00.", ["v","ve"], "v", "Нарада о 8:00."),
  ("Oběd je ___ 12:30.", ["v","ve"], "ve", "Обід о 12:30."),
  ("Kurz začíná ___ 14:00.", ["v","ve"], "ve", "Курс починається о 14:00."),
  ("Vstávám ___ 6:15.", ["v","ve"], "v", "Я встаю о 6:15."),
  ("Vlak jede ___ 3:40.", ["v","ve"], "ve", "Потяг їде о 3:40."),
  ("Mám volno ___ středu.", ["v","ve"], "ve", "У середу я вільна."),
  ("Pracuju ___ pátek.", ["v","ve"], "v", "Я працюю в п'ятницю."),
  ("Kurz je ___ čtvrtek.", ["v","ve"], "ve", "Курс у четвер."),
 ]),
 dict(type="fill", title="Де? 6. відмінок", items=[
  ("Pracuju v ___. (kancelář)", "kanceláři", "Я працюю в офісі."),
  ("Syn je ve ___. (škola)", "škole", "Син у школі."),
  ("Jsem v ___. (banka)", "bance", "Я в банку."),
  ("Sestra pracuje na ___. (pošta)", "poště", "Сестра працює на пошті."),
  ("Bydlím v ___. (Praha)", "Praze", "Я живу в Празі."),
  ("Jsem na ___. (úřad)", "úřadě", "Я в установі."),
  ("Obědvám v ___. (restaurace)", "restauraci", "Я обідаю в ресторані."),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Kurz češtiny je ve středu v šest.", "Курс чеської в середу о шостій.", ["Ve středu v šest je kurz češtiny."]),
  ("V pondělí pracuju v kanceláři.", "У понеділок я працюю в офісі.", ["Pracuju v pondělí v kanceláři.", "V kanceláři pracuju v pondělí."]),
  ("Kdy začíná porada?", "Коли починається нарада?"),
 ]),
]))

# ---------------- 10 ----------------
L.append(dict(n=10, cz="Poznáváme barvy a oblečení", ua="Кольори й одяг",
grammar="""<p><b>ten / ta / to</b> — цей / ця / це, за родом: <b>ten</b> svetr, <b>ta</b> bunda, <b>to</b> tričko.</p>
<p><b>Прикметник</b> узгоджується з родом:</p>""" + T(
 ("modr<b>ý</b> svetr","modr<b>á</b> bunda","modr<b>é</b> tričko"),("jak<b>ý</b>?","jak<b>á</b>?","jak<b>é</b>?"), head=("чол.","жін.","сер.")) + """
<p><b>Що на мені?</b> mám na sobě + 4. відмінок: жіночий рід змінюється — modr<b>ou</b> bund<b>u</b>, zelen<b>ou</b> sukn<b>i</b>. Чоловічий неживий і середній — без змін: černý kabát, bílé tričko.</p>
<p><b>Як часто:</b> vždycky, často, někdy, nikdy. Після <b>nikdy</b> дієслово із запереченням: Nikdy <b>ne</b>nosím sukni.</p>""",
sets=[
 dict(type="choice", title="ten / ta / to", items=[
  ("___ svetr", ["ten","ta","to"], "ten", "цей светр"),
  ("___ bunda", ["ten","ta","to"], "ta", "ця куртка"),
  ("___ tričko", ["ten","ta","to"], "to", "ця футболка"),
  ("___ kabát", ["ten","ta","to"], "ten", "це пальто"),
  ("___ sukně", ["ten","ta","to"], "ta", "ця спідниця"),
  ("___ košile", ["ten","ta","to"], "ta", "ця сорочка"),
  ("___ deštník", ["ten","ta","to"], "ten", "ця парасолька"),
 ]),
 dict(type="fill", title="Узгодь прикметник", items=[
  ("___ bunda (modrý)", "modrá", "синя куртка"),
  ("___ kabát (černý)", "černý", "чорне пальто"),
  ("___ tričko (bílý)", "bílé", "біла футболка"),
  ("___ košile (zelený)", "zelená", "зелена сорочка"),
  ("___ auto (nový)", "nové", "нова машина"),
  ("___ bunda (drahý)", "drahá", "дорога куртка"),
  ("___ tričko (levný)", "levné", "дешева футболка"),
 ]),
 dict(type="fill", title="Mám na sobě… (4. відмінок)", items=[
  ("Mám na sobě ___. (modrá bunda)", "modrou bundu", "На мені синя куртка."),
  ("Mám na sobě ___. (černý kabát)", "černý kabát", "На мені чорне пальто."),
  ("Mám na sobě ___. (bílé tričko)", "bílé tričko", "На мені біла футболка."),
  ("Mám na sobě ___. (zelená sukně)", "zelenou sukni", "На мені зелена спідниця."),
  ("Mám na sobě ___. (nová košile)", "novou košili", "На мені нова сорочка."),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Nikdy nenosím sukni.", "Я ніколи не ношу спідницю.", ["Sukni nikdy nenosím."]),
  ("V práci často nosím košili.", "На роботі я часто ношу сорочку.", ["Často nosím v práci košili.", "V práci nosím často košili."]),
  ("Ta modrá bunda je moc drahá.", "Ця синя куртка надто дорога."),
 ]),
]))

# ---------------- 11 ----------------
L.append(dict(n=11, cz="Jdeme ven", ua="Погода й пори року",
grammar="""<p><b>Je mi</b> + прислівник — як мені: je mi zima, je mi teplo, je mi horko, je mi špatně.<br><b>Jsem</b> + прикметник — яка я: jsem unavená, jsem nachlazená, jsem nemocná.</p>
<p><b>Пори року:</b> <b>na</b> jaře, <b>v</b> létě, <b>na</b> podzim, <b>v</b> zimě.</p>
<p><b>Погода:</b> svítí slunce, prší, sněží, fouká vítr, je zataženo, je mlha, je horko, je zima.</p>
<p><b>Když</b> = коли, якщо: Když prší, potřebuju deštník.</p>""",
sets=[
 dict(type="choice", title="Je mi чи jsem?", items=[
  ("___ zima.", ["Je mi","Jsem"], "Je mi", "Мені холодно."),
  ("___ unavená.", ["Je mi","Jsem"], "Jsem", "Я втомлена."),
  ("___ teplo.", ["Je mi","Jsem"], "Je mi", "Мені тепло."),
  ("___ nachlazená.", ["Je mi","Jsem"], "Jsem", "Я застуджена."),
  ("___ špatně.", ["Je mi","Jsem"], "Je mi", "Мені погано."),
  ("___ nemocná.", ["Je mi","Jsem"], "Jsem", "Я хвора."),
 ]),
 dict(type="choice", title="Пори року й місця: v чи na?", items=[
  ("___ jaře", ["v","na"], "na", "навесні"),
  ("___ létě", ["v","na"], "v", "влітку"),
  ("___ podzim", ["v","na"], "na", "восени"),
  ("___ zimě", ["v","na"], "v", "взимку"),
  ("Lyžujeme ___ horách.", ["v","na"], "na", "Ми катаємося на лижах у горах."),
  ("Jdeme na procházku, jsme ___ parku.", ["v","na"], "v", "Ми на прогулянці, ми в парку."),
 ]),
 dict(type="fill", title="Яка погода?", items=[
  ("☀️ Svítí ___.", "slunce", "Світить сонце."),
  ("🌧 ___.", "Prší", "Іде дощ."),
  ("❄️ ___.", "Sněží", "Іде сніг."),
  ("💨 Fouká ___.", "vítr", "Дме вітер."),
  ("🥵 Je ___.", "horko", "Спекотно."),
  ("☁️ Je ___.", "zataženo", "Хмарно."),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Když prší, potřebuju deštník.", "Коли йде дощ, мені потрібна парасолька.", ["Potřebuju deštník, když prší."]),
  ("V zimě je mi pořád zima.", "Взимку мені постійно холодно."),
  ("Na jaře rádi jezdíme na kole.", "Навесні ми любимо їздити на велосипеді.", ["Rádi jezdíme na kole na jaře."]),
 ]),
]))

# ---------------- 12 ----------------
L.append(dict(n=12, cz="Jsme u doktora", ua="У лікаря",
grammar="""<p><b>Bolí mě</b> + що болить (1. відмінок): Bolí mě hlava. Bolí mě záda. <b>Bolí mě v krku</b> — болить горло.</p>
<p><b>Mám</b> + хвороба (4. відмінок): mám horečku, mám kašel, mám rýmu, mám chřipku.</p>
<p><b>Множина з особливостями:</b> oko → <b>oči</b>, ucho → <b>uši</b>, ruka → <b>ruce</b>, noha → nohy.</p>
<p><b>Що каже лікар</b> (наказовий спосіб на «ви»):</p>""" + T(
 ("sednout si","<b>Sedněte si.</b>","Сідайте."),("lehnout si","<b>Lehněte si.</b>","Лягайте."),("otevřít","<b>Otevřete</b> ústa.","Відкрийте рот."),("dýchat","<b>Dýchejte</b> zhluboka.","Дихайте глибоко."),("počkat","<b>Počkejte</b> chvíli.","Зачекайте хвилинку.")) + """
<p><b>Де?</b> u + 2. відмінок: u doktora, u zubaře. <b>Куди?</b> k + 3. відмінок: k doktorovi.</p>""",
sets=[
 dict(type="fill", title="Множина: частини тіла", items=[
  ("1 oko → 2 ___", "oči", "око → очі"),
  ("1 ucho → 2 ___", "uši", "вухо → вуха"),
  ("1 ruka → 2 ___", "ruce", "рука → руки"),
  ("1 noha → 2 ___", "nohy", "нога → ноги"),
  ("1 zub → 2 ___", "zuby", "зуб → зуби"),
  ("1 prst → 2 ___", "prsty", "палець → пальці"),
 ]),
 dict(type="choice", title="Bolí mě чи mám?", items=[
  ("___ hlava.", ["Bolí mě","Mám"], "Bolí mě", "У мене болить голова."),
  ("___ horečku.", ["Bolí mě","Mám"], "Mám", "У мене температура."),
  ("___ kašel.", ["Bolí mě","Mám"], "Mám", "У мене кашель."),
  ("___ v krku.", ["Bolí mě","Mám"], "Bolí mě", "У мене болить горло."),
  ("___ rýmu.", ["Bolí mě","Mám"], "Mám", "У мене нежить."),
  ("___ záda.", ["Bolí mě","Mám"], "Bolí mě", "У мене болить спина."),
  ("___ chřipku.", ["Bolí mě","Mám"], "Mám", "У мене грип."),
 ]),
 dict(type="fill", title="Що каже лікар", items=[
  ("sednout si → ___ si, prosím.", "Sedněte", "Сідайте, будь ласка."),
  ("lehnout si → ___ si tady.", "Lehněte", "Лягайте тут."),
  ("otevřít → ___ ústa.", "Otevřete", "Відкрийте рот."),
  ("dýchat → ___ zhluboka.", "Dýchejte", "Дихайте глибоко."),
  ("ukázat → ___ mi jazyk.", "Ukažte", "Покажіть мені язик."),
  ("počkat → ___ chvíli.", "Počkejte", "Зачекайте хвилинку."),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Potřebuju se objednat k doktorovi.", "Мені треба записатися до лікаря."),
  ("Od včera mě bolí v krku.", "З учора в мене болить горло.", ["Bolí mě v krku od včera."]),
  ("Mám horečku a kašel.", "У мене температура й кашель.", ["Mám kašel a horečku."]),
 ]),
]))

# ---------------- 13 ----------------
L.append(dict(n=13, cz="Co jsme dělali včera?", ua="Минулий час",
grammar="""<p><b>Минулий час</b> = форма на -l + jsem / jsi / jsme / jste. У 3-й особі допоміжного немає.</p>""" + T(
 ("já","dělal / dělala <b>jsem</b>"),("ty","dělal / dělala <b>jsi</b>"),("on / ona","dělal / dělala"),("my","dělali <b>jsme</b>"),("vy","dělali <b>jste</b>"),("oni","dělali"), head=("хто","DĚLAT")) + """
<p><b>Неправильні:</b> být → byl, jít → <b>šel / šla</b>, jíst → <b>jedl</b>, číst → <b>četl</b>, mít → měl, jet → jel, pít → pil, chtít → chtěl.</p>
<p><b>jsem / jsi</b> стоять на 2-му місці: Včera <b>jsem</b> byla v práci. Co <b>jsi</b> dělala?</p>""",
sets=[
 dict(type="fill", title="Форма на -l", items=[
  ("(já, жінка) Včera jsem ___ do šesti. (pracovat)", "pracovala", "Учора я працювала до шостої."),
  ("(on) ___ večeři. (vařit)", "Vařil", "Він готував вечерю."),
  ("(my) ___ jsme v kině. (být)", "Byli", "Ми були в кіні."),
  ("(ona) ___ do obchodu. (jít)", "Šla", "Вона пішла в магазин."),
  ("(já, чоловік) ___ jsem knihu. (číst)", "Četl", "Я читав книжку."),
  ("(ty, жінка) ___ jsi čas? (mít)", "Měla", "У тебе був час?"),
  ("(oni) ___ do Brna. (jet)", "Jeli", "Вони поїхали до Брно."),
  ("(já, жінка) ___ jsem rohlík. (jíst)", "Jedla", "Я з'їла рогалик."),
 ]),
 dict(type="choice", title="jsem / jsi / jsme / jste або нічого", items=[
  ("(já) Včera ___ byla v práci.", ["jsem","jsi","jsme","—"], "jsem", "Учора я була на роботі."),
  ("(ty) Kde ___ byl?", ["jsem","jsi","jste","—"], "jsi", "Де ти був?"),
  ("(my) O víkendu ___ jeli na výlet.", ["jsme","jste","jsou","—"], "jsme", "На вихідних ми їздили на екскурсію."),
  ("(vy) Co ___ dělali?", ["jsme","jste","jsi","—"], "jste", "Що ви робили?"),
  ("(on) Petr ___ byl doma.", ["je","jsem","jsi","—"], "—", "Петр був удома (у 3-й особі допоміжного немає)."),
 ]),
 dict(type="build", title="Порядок слів у минулому часі", items=[
  ("Včera jsem byla na úřadě.", "Учора я була в установі.", ["Byla jsem včera na úřadě.", "Na úřadě jsem byla včera."]),
  ("O víkendu jsme byli v Brně.", "На вихідних ми були в Брно.", ["Byli jsme o víkendu v Brně.", "V Brně jsme byli o víkendu."]),
  ("Co jsi dělala v sobotu?", "Що ти робила в суботу?"),
  ("Ráno jsem se učila česky.", "Вранці я вчила чеську.", ["Učila jsem se ráno česky.", "Česky jsem se učila ráno."]),
 ]),
]))

# ---------------- 14 ----------------
L.append(dict(n=14, cz="Jak se cítíme?", ua="Почуття і вподобання",
grammar="""<p><b>Líbí se mi</b> + 1. відмінок — подобається те, що бачу або переживаю: Líbí se mi Praha.</p>
<p><b>Chutná mi</b> (одне) / <b>chutnají mi</b> (кілька) — смакує: Chutná mi polévka. Chutnají mi knedlíky.</p>
<p><b>Mám rád / ráda</b> + 4. відмінок — люблю, маю стосунок: Mám ráda maminku.</p>
<p><b>Кому?</b> 3. відмінок: maminka → mamin<b>ce</b>, kolega → koleg<b>ovi</b>, doktor → doktor<b>ovi</b>, kamarádka → kamarád<b>ce</b>, zubař → zubař<b>i</b>.</p>
<p><b>Як я себе почуваю:</b> jsem šťastná, smutná, unavená, nervózní, naštvaná.</p>""",
sets=[
 dict(type="choice", title="Líbí se mi чи chutná mi?", items=[
  ("___ Praha.", ["Líbí se mi","Chutná mi","Chutnají mi"], "Líbí se mi", "Мені подобається Прага."),
  ("___ ta polévka.", ["Líbí se mi","Chutná mi","Chutnají mi"], "Chutná mi", "Мені смакує цей суп."),
  ("___ knedlíky.", ["Líbí se mi","Chutná mi","Chutnají mi"], "Chutnají mi", "Мені смакують кнедлики."),
  ("___ česká káva.", ["Líbí se mi","Chutná mi","Chutnají mi"], "Chutná mi", "Мені смакує чеська кава."),
  ("___ ten film.", ["Líbí se mi","Chutná mi","Chutnají mi"], "Líbí se mi", "Мені подобається цей фільм."),
  ("___ tvoje šaty.", ["Líbí se mi","Chutná mi","Chutnají mi"], "Líbí se mi", "Мені подобається твоя сукня."),
 ]),
 dict(type="fill", title="Кому? 3. відмінок", items=[
  ("Volám ___. (maminka)", "mamince", "Я дзвоню мамі."),
  ("Píšu ___. (kolega)", "kolegovi", "Я пишу колезі."),
  ("Jdu k ___. (doktor)", ["doktorovi","doktoru"], "Я йду до лікаря."),
  ("Dám dárek ___. (kamarádka)", "kamarádce", "Я подарую подарунок подрузі."),
  ("Pomáhám ___. (soused)", ["sousedovi","sousedu"], "Я допомагаю сусідові."),
  ("Telefonuju ___. (šéf)", ["šéfovi","šéfu"], "Я телефоную начальнику."),
  ("Jdu k ___. (zubař)", "zubaři", "Я йду до стоматолога."),
 ]),
 dict(type="build", title="Склади речення", items=[
  ("Dnes jsem trochu unavená.", "Сьогодні я трохи втомлена.", ["Jsem dnes trochu unavená."]),
  ("Líbí se mi tady v Česku.", "Мені подобається тут, у Чехії.", ["Tady v Česku se mi líbí."]),
  ("Zítra zavolám mamince.", "Завтра я подзвоню мамі.", ["Mamince zavolám zítra."]),
 ]),
]))


# ---------- шпаргалки простою мовою (замінюють grammar вище) ----------
def EX(*rows):
    """Приклади: (чеською, українською)"""
    return '<table class="tbl ex-tbl">' + "".join(f'<tr><td><b class="cz">{c}</b></td><td>{u}</td></tr>' for c, u in rows) + "</table>"
def H(t): return f'<h4 class="g-h">{t}</h4>'
def P(t): return f"<p>{t}</p>"
def TIP(t): return f'<p class="tip">💡 {t}</p>'
def VERB(rows): return EX(*rows)

G = {}
G[1] = H("1. «Бути» — být") + P("Українською ми кажемо «Я з України» без дієслова. Чех обов'язково додає «є»: <b>Jsem</b> z Ukrajiny — дослівно «Я є з України».") + VERB([
 ("jsem","я є"),("jsi","ти є"),("je","він / вона є"),("jsme","ми є"),("jste","ви є"),("jsou","вони є")]) + P("Щоб сказати «не», додай <b>ne</b> разом зі словом: nejsem, nejsi, nejsme, nejste, nejsou. Один виняток: «він / вона не є» = <b>není</b>.") + EX(
 ("Jsem z Ukrajiny.","Я з України."),("Nejsem z Prahy.","Я не з Праги."),("Není doma.","Його / її немає вдома.")) + \
 H("2. Звідки? — z …") + P("Після <b>z</b> («з») у назві країни чи міста змінюється закінчення — так само, як в українській: Україна → з Україн<b>и</b>, Київ → з Києв<b>а</b>.") + EX(
 ("Ukrajina → z Ukrajiny","Україна → з України"),("Česko → z Česka","Чехія → з Чехії"),("Kyjev → z Kyjeva","Київ → з Києва"),("Itálie → z Itálie","Італія → з Італії (не змінюється)")) + \
 TIP("Коли слово починається на z, s, ž, š або на два приголосні, замість <b>z</b> пишемо <b>ze</b> — так легше вимовити: <b>ze</b> Žitomiru, <b>ze</b> Slovenska, <b>ze</b> Zlína.") + \
 H("3. Хто? Що?") + EX(("Kdo to je?","Хто це? — про людей і тварин"),("Co to je?","Що це? — про речі"))

G[2] = H("1. «Робити» — dělat") + VERB([("dělám","я роблю"),("děláš","ти робиш"),("dělá","він / вона робить"),("děláme","ми робимо"),("děláte","ви робите"),("dělají","вони роблять")]) + \
 H("2. «Мати» — mít") + P("Чехи кажуть «я маю», де ми кажемо «у мене є»: <b>Mám</b> dvě děti — У мене двоє дітей.") + VERB([("mám","у мене є"),("máš","у тебе є"),("má","у нього / неї є"),("máme","у нас є"),("máte","у вас є"),("mají","у них є")]) + \
 P("«Не маю» = <b>nemám</b>, nemáš, nemá…") + \
 H("3. Мій, моя, наш…") + P("Як в українській: форма залежить від того, <b>яке слово після</b> — чоловічого чи жіночого роду.") + EX(
 ("můj manžel / moje kolegyně","мій чоловік / моя колега"),("tvůj / tvoje","твій / твоя"),("náš / naše","наш / наша"),("váš / vaše","ваш / ваша"),("jeho · její · jejich","його · її · їхній — не змінюються")) + \
 H("4. Професії: чоловік → жінка") + EX(("učitel → učitelka","вчитель → вчителька (+ka)"),("lékař → lékařka","лікар → лікарка"),("číšník → číšnice","офіціант → офіціантка (-ník → -nice)"))

G[3] = H("1. «Їсти» — jíst і «пити» — pít") + VERB([("jím / piju","я їм / я п'ю"),("jíš / piješ","ти їси / п'єш"),("jí / pije","він, вона їсть / п'є"),("jíme / pijeme","ми їмо / п'ємо"),("jíte / pijete","ви їсте / п'єте"),("jedí / pijou","вони їдять / п'ють")]) + \
 TIP("Можна казати і <i>piju</i>, і книжне <i>piji</i> — обидва правильні.") + \
 H("2. Ввічливо попросити") + EX(("Chtěl bych kávu.","Я б хотів каву. (чоловік)"),("Chtěla bych kávu.","Я б хотіла каву. (жінка)")) + \
 H("3. Ціни") + P("Як в українській: 1 крон<b>а</b>, 2–4 крон<b>и</b>, 5 і більше — крон.") + EX(("1 koruna","1 крона"),("3 koruny","3 крони"),("68 korun","68 крон")) + \
 P("Числа складаються як у нас: <b>dvacet pět</b> = двадцять п'ять. Ще кажуть навпаки: <i>pětadvacet</i> — теж правильно.")

G[4] = H("1. «Любити» — mít rád") + P("Дослівно «мати радо». Слово <b>rád</b> змінюється: чоловік — <b>rád</b>, жінка — <b>ráda</b>, кілька людей — <b>rádi</b>.") + EX(
 ("Mám rád kávu.","Я люблю каву. (чоловік)"),("Mám ráda kávu.","Я люблю каву. (жінка)"),("Má rád pivo.","Він любить пиво."),("Máme rádi sport.","Ми любимо спорт."),("Nemám ráda maso.","Я не люблю м'ясо. (жінка)")) + \
 H("2. З чим? — s …") + P("Після <b>s</b> («з») закінчення змінюється, як в українській: з молок<b>ом</b>, з шинк<b>ою</b>.") + EX(
 ("mléko → s mlékem","молоко → з молоком (-em)"),("máslo → s máslem","масло → з маслом"),("šunka → se šunkou","шинка → з шинкою (-a → -ou)"),("rýže → s rýží","рис → з рисом (-e → -í)"),("brambory → s bramborami","картопля → з картоплею")) + \
 TIP("Перед s, š, z, ž пишемо <b>se</b>: <b>se</b> sýrem, <b>se</b> šunkou.")

G[5] = H("1. «Іти» — jít") + VERB([("jdu","я йду"),("jdeš","ти йдеш"),("jde","він / вона йде"),("jdeme","ми йдемо"),("jdete","ви йдете"),("jdou","вони йдуть")]) + \
 H("2. Куди? — do чи na") + P("<b>do</b> — коли заходиш усередину будівлі. <b>na</b> — пошта, вокзал, установа (запам'ятовуй разом зі словом).") + EX(
 ("do obchodu, do banky, do práce","у магазин, у банк, на роботу"),("na poštu, na nádraží, na úřad","на пошту, на вокзал, в установу")) + \
 H("3. Кого? Що?") + P("Слова жіночого роду на <b>-a</b> змінюють закінчення на <b>-u</b> — точно як в українській: кав<b>а</b> → п'ю кав<b>у</b>.") + EX(
 ("káva → Piju kávu.","кава → Я п'ю каву."),("pošta → Jdu na poštu.","пошта → Я йду на пошту."),("pes → Mám psa.","пес → У мене є пес (люди й тварини змінюються)."),("dům → Vidím dům.","будинок → Я бачу будинок (речі чол. роду — без змін).")) + \
 H("4. Дієслова на -ovat") + P("Усі змінюються однаково: <b>-ovat</b> → <b>-uju</b>.") + VERB([("pracuju","я працюю"),("pracuješ","ти працюєш"),("pracuje","він / вона працює"),("pracujeme","ми працюємо"),("pracujete","ви працюєте"),("pracujou","вони працюють")])

G[6] = H("1. «Їхати» — jet") + VERB([("jedu","я їду"),("jedeš","ти їдеш"),("jede","він / вона їде"),("jedeme","ми їдемо"),("jedete","ви їдете"),("jedou","вони їдуть")]) + \
 TIP("<b>jít</b> — іти пішки, <b>jet</b> — їхати транспортом.") + \
 H("2. «Мусити, треба» — muset") + VERB([("musím","я мушу / мені треба"),("musíš","ти мусиш"),("musí","він / вона мусить; вони мусять"),("musíme","ми мусимо"),("musíte","ви мусите")]) + \
 EX(("Musím jít k doktorovi.","Мені треба йти до лікаря.")) + \
 H("3. Чим їдеш?") + P("Як в українській: автобус → автобус<b>ом</b>.") + EX(
 ("autobusem, vlakem, autem","автобусом, потягом, машиною"),("metrem","метро"),("tramvají","трамваєм"),("na kole · pěšky","на велосипеді · пішки")) + \
 H("4. Поруч з чим? — vedle") + EX(("vedle banky","поруч з банком"),("vedle parku","поруч з парком")) + \
 H("5. Як пройти") + EX(("rovně","прямо"),("doleva · doprava","ліворуч · праворуч"))

G[7] = H("1. «Візьму собі» — dát si") + P("Так замовляють у кафе: <b>Dám si</b> kávu — Я візьму каву.") + VERB([("dám si","я візьму"),("dáš si","ти візьмеш"),("dá si","він / вона візьме"),("dáme si","ми візьмемо"),("dáte si","ви візьмете")]) + \
 H("2. «Хотіти» — chtít") + VERB([("chci","я хочу"),("chceš","ти хочеш"),("chce","він / вона хоче"),("chceme","ми хочемо"),("chcete","ви хочете"),("chtějí","вони хочуть")]) + \
 H("3. se чи si") + P("<b>se</b> = українське <b>-ся</b>. <b>si</b> = <b>собі</b>.") + EX(
 ("sprchuju se · učím se · oblékám se","приймаю душ · вчуся · одягаюся"),("čistím si zuby · myju si ruce · dám si kávu","чищу (собі) зуби · мию руки · візьму (собі) каву")) + \
 TIP("Головне правило: <b>se / si</b> стоїть <b>другим</b> у реченні. Ráno <b>se</b> sprchuju (а не «Ráno sprchuju se»).") + \
 H("4. Кімнати") + EX(("v kuchyni","на кухні"),("v koupelně","у ванній"),("v ložnici","у спальні"),("v obýváku","у вітальні"),("v předsíni","у передпокої"))

G[8] = H("1. «Люблю щось робити»") + P("<b>rád / ráda / rádi</b> + дієслово у звичайній формі (не «грати», а «граю»).") + EX(
 ("Rád hraju tenis.","Я люблю грати в теніс. (чоловік)"),("Ráda čtu.","Я люблю читати. (жінка)"),("Rádi cestujeme.","Ми любимо подорожувати."),("Nerada vařím.","Я не люблю готувати. (жінка)")) + \
 H("2. Як сказати «я …»") + P("Залежить від закінчення дієслова:") + EX(
 ("dělat → dělám","-at → -ám (роблю)"),("vařit → vařím · uklízet → uklízím","-it, -et → -ím (готую · прибираю)"),("malovat → maluju","-ovat → -uju (малюю)"),("hrát → hraju","грати → граю")) + \
 P("Неправильні — просто запам'ятати:") + EX(("číst → čtu","читати → читаю"),("psát → píšu","писати → пишу"),("plavat → plavu","плавати → плаваю"),("spát → spím","спати → сплю"))

G[9] = H("1. О котрій?") + P("<b>v</b> + число: <b>v</b> osm — о восьмій.") + TIP("Перед <b>2, 3, 4, 12, 13, 14</b> пишемо <b>ve</b>, бо «в дв…» важко вимовити: <b>ve</b> dvě, <b>ve</b> tři, <b>ve</b> 12:15.") + \
 H("2. Коли? Дні тижня") + EX(("v pondělí · v úterý","у понеділок · у вівторок"),("ve středu · ve čtvrtek","у середу · у четвер"),("v pátek · v sobotu · v neděli","у п'ятницю · у суботу · у неділю")) + \
 H("3. Де?") + P("Після <b>v / na</b> закінчення стає <b>-e / -ě / -i</b>, як в українському «в офіс<b>і</b>».") + EX(
 ("v kanceláři","в офісі"),("ve škole","у школі"),("v bance","у банку"),("v Praze","у Празі"),("na poště","на пошті"),("na úřadě","в установі")) + \
 TIP("Літера може мінятися, як в українському «рука → в руці»: ban<b>k</b>a → v ban<b>c</b>e, Pra<b>h</b>a → v Pra<b>z</b>e.")

G[10] = H("1. Цей, ця, це") + EX(("ten svetr","цей светр"),("ta bunda","ця куртка"),("to tričko","ця футболка (у чеській — середній рід)")) + \
 H("2. Колір / прикметник") + P("Закінчення як в українському: -ий / -а / -е → чеською <b>-ý / -á / -é</b>.") + EX(
 ("modrý svetr","синій светр"),("modrá bunda","синя куртка"),("modré tričko","синя футболка")) + \
 H("3. Що на мені? — Mám na sobě …") + P("Слова жіночого роду змінюються (-á → <b>-ou</b>, -a → <b>-u</b>), як в українському «маю синю куртку». Інші — без змін.") + EX(
 ("modrá bunda → Mám na sobě modrou bundu.","На мені синя куртка."),("černý kabát → Mám na sobě černý kabát.","На мені чорне пальто (без змін).")) + \
 H("4. Як часто?") + EX(("vždycky · často","завжди · часто"),("někdy · nikdy","іноді · ніколи")) + TIP("Після <b>nikdy</b> дієслово теж з <b>ne</b>: Nikdy <b>ne</b>nosím sukni — Я ніколи не ношу спідницю.")

G[11] = H("1. «Мені холодно» чи «я втомлена»") + P("Якщо українською кажеш <b>«мені …»</b> — чеською <b>Je mi</b>. Якщо <b>«я …»</b> — чеською <b>Jsem</b>.") + EX(
 ("Je mi zima.","Мені холодно."),("Je mi teplo · horko · špatně.","Мені тепло · спекотно · погано."),("Jsem unavená.","Я втомлена."),("Jsem nachlazená · nemocná.","Я застуджена · хвора.")) + \
 H("2. Пори року") + EX(("na jaře · v létě","навесні · влітку"),("na podzim · v zimě","восени · взимку")) + \
 H("3. Погода") + EX(("Svítí slunce.","Світить сонце."),("Prší. · Sněží.","Іде дощ. · Іде сніг."),("Fouká vítr.","Дме вітер."),("Je zataženo.","Хмарно.")) + \
 H("4. Коли / якщо — když") + EX(("Když prší, potřebuju deštník.","Коли йде дощ, мені потрібна парасолька."))

G[12] = H("1. Що болить") + P("Дослівно «болить мене голова».") + EX(("Bolí mě hlava.","У мене болить голова."),("Bolí mě záda.","У мене болить спина."),("Bolí mě v krku.","У мене болить горло.")) + \
 H("2. Що в мене є (хвороба)") + EX(("Mám horečku.","У мене температура."),("Mám kašel · rýmu · chřipku.","У мене кашель · нежить · грип.")) + \
 H("3. Двоє очей, вух, рук") + P("Ці слова у множині особливі — запам'ятай:") + EX(("oko → oči","око → очі"),("ucho → uši","вухо → вуха"),("ruka → ruce","рука → руки")) + \
 H("4. Що каже лікар") + EX(("Sedněte si.","Сідайте."),("Lehněte si.","Лягайте."),("Otevřete ústa.","Відкрийте рот."),("Dýchejte zhluboka.","Дихайте глибоко."),("Počkejte chvíli.","Зачекайте хвилинку.")) + \
 H("5. У лікаря / до лікаря") + EX(("Jsem u doktora.","Я в лікаря."),("Jdu k doktorovi.","Я йду до лікаря."))

G[13] = H("1. Минулий час") + P("Як в українському «я робив», але для «я» і «ти» додаємо <b>jsem / jsi</b>. Для «він, вона, вони» — нічого не додаємо.") + EX(
 ("dělal jsem / dělala jsem","я робив / я робила"),("dělal jsi / dělala jsi","ти робив / ти робила"),("dělal / dělala","він робив / вона робила"),("dělali jsme","ми робили"),("dělali jste","ви робили"),("dělali","вони робили")) + \
 H("2. Неправильні — запам'ятати") + EX(("být → byl, byla","бути → був, була"),("jít → šel, šla","іти → пішов, пішла"),("jíst → jedl, jedla","їсти → їв, їла"),("číst → četl, četla","читати → читав, читала"),("mít → měl, měla","мати → мав, мала"),("jet → jel, jela","їхати → їхав, їхала")) + \
 TIP("<b>jsem / jsi</b> стоїть <b>другим</b> у реченні: Včera <b>jsem</b> byla v práci. Co <b>jsi</b> dělala?")

G[14] = H("1. Подобається, смакує, люблю") + EX(
 ("Líbí se mi Praha.","Мені подобається Прага. — про те, що бачиш"),("Chutná mi polévka.","Мені смакує суп. — про їжу (одне)"),("Chutnají mi knedlíky.","Мені смакують кнедлики. — про їжу (кілька)"),("Mám ráda maminku.","Я люблю маму. — про людей і речі загалом")) + \
 H("2. Кому?") + P("Закінчення як в українському «колез<b>і</b>, мам<b>і</b>»:") + EX(
 ("kolega → kolegovi","колега → колезі (чол.: -ovi)"),("maminka → mamince","мама → мамі (жін. на -ka: -ce)"),("zubař → zubaři","стоматолог → стоматологу")) + EX(("Volám mamince.","Я дзвоню мамі."),("Jdu k doktorovi.","Я йду до лікаря.")) + \
 H("3. Як я себе почуваю") + EX(("šťastná · smutná","щаслива · сумна"),("unavená · nervózní · naštvaná","втомлена · нервова · зла"))

for les in L:
    les["grammar"] = G[les["n"]]

# ---------- експорт ----------
def as_list(a): return a if isinstance(a, list) else [a]
out = []
for les in L:
    sets = []
    for si, s in enumerate(les["sets"]):
        items = []
        for it in s["items"]:
            if s["type"] == "fill":
                q, a, ua = it; items.append(dict(q=q, a=as_list(a), ua=ua))
            elif s["type"] == "choice":
                q, opts, a, ua = it; assert a in opts, (q, a); items.append(dict(q=q, opts=opts, a=[a], ua=ua))
            else:
                cz, ua, *alt = it; items.append(dict(cz=cz, ua=ua, alt=alt[0] if alt else []))
            if s["type"] != "build": assert items[-1]["q"].count("___") == 1, items[-1]["q"]
        sets.append(dict(id=f"L{les['n']}{'ABCD'[si]}", type=s["type"], title=s["title"], items=items))
    out.append(dict(n=les["n"], cz=les["cz"], ua=les["ua"], grammar=les["grammar"], sets=sets))
json.dump(out, open("data/exercises.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(out), "lessons,", sum(len(l["sets"]) for l in out), "sets,", sum(len(s["items"]) for l in out for s in l["sets"]), "items")
