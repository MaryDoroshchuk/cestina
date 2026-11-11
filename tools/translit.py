import re

# ---------- pronunciation ----------
CZ_VOW = set("aáeéěiíyýoóuúů")
CONS = {"b":"б","c":"ц","č":"ч","d":"д","f":"ф","g":"ґ","h":"г","k":"к","l":"л","m":"м","n":"н",
        "p":"п","q":"к","r":"р","ř":"рж","s":"с","š":"ш","t":"т","v":"в","w":"в","x":"кс","z":"з","ž":"ж"}
VOW = {"a":"а","á":"а:","e":"е","é":"е:","i":"і","í":"і:","y":"і","ý":"і:","o":"о","ó":"о:","u":"у","ú":"у:","ů":"у:"}
SOFT = {"ď":"д","ť":"т","ň":"н"}
JV = {"a":"я","á":"я:","e":"є","é":"є:","u":"ю","ú":"ю:","ů":"ю:","i":"ї","í":"ї:","o":"йо","ó":"йо:"}
DEVOICE = {"б":"п","д":"т","ґ":"к","г":"х","в":"ф","з":"с","ж":"ш"}
UA_CONS = set("бвгґджзйклмнпрстфхцчшщ")
UA_VOW = set("аеєиіїоуюя")

def tr_word(w):
    w = w.lower()
    out, i, n = "", 0, len(w)
    while i < n:
        c = w[i]; nx = w[i+1] if i+1 < n else "#"
        if c == "c" and nx == "h":
            out += "х"; i += 2; continue
        if c == "j":
            if nx in JV:
                if out and out[-1] in UA_CONS: out += "'"
                out += JV[nx]; i += 2; continue
            out += "й"; i += 1; continue
        if c in SOFT:
            base = SOFT[c]
            if nx in JV and nx not in "iíoó":
                out += base + JV[nx]; i += 2; continue
            if nx in "oó":
                out += base + "ь" + VOW[nx]; i += 2; continue
            out += base + "ь"; i += 1; continue
        if c in "dtn" and nx in "yý":
            out += CONS[c] + ("и:" if nx == "ý" else "и"); i += 2; continue
        if c in CONS and nx == "ě":
            if c in "bpvf": out += CONS[c] + "'є"
            elif c in "dtn": out += CONS[c] + "є"
            elif c == "m": out += "мнє"
            else: out += CONS[c] + "е"
            i += 2; continue
        if c == "ě":
            out += "є"; i += 1; continue
        if c in CONS: out += CONS[c]; i += 1; continue
        if c in VOW: out += VOW[c]; i += 1; continue
        out += c; i += 1
    # final devoicing
    if out.endswith("рж"): out = out[:-2] + "рш"
    elif out.endswith("дь"): out = out[:-2] + "ть"
    elif out and out[-1] in DEVOICE: out = out[:-1] + DEVOICE[out[-1]]
    # stress on first vowel if 2+ syllables
    syl = len(re.findall(r"ou|au|[aáeéěiíyýoóuúů]", w))
    if syl >= 2:
        for k, ch in enumerate(out):
            if ch in UA_VOW:
                out = out[:k+1] + "́" + out[k+1:]; break
    return out

def tr(text):
    return re.sub(r"[A-Za-zÁÉĚÍÝÓÚŮČĎŇŘŠŤŽáéěíýóúůčďňřšťž]+", lambda m: tr_word(m.group(0)), text)

