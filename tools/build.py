"""45 Study を組み立てる。
  src/shell.html（画面とゲーム）＋ src/data/*（問題・音声の対応表・動画の記録）から公開用のファイルを書き出す。
  index.html / data.js / manifest.json / sw.js
使い方：src/shell.html の APP_VER を上げてから python3 tools/build.py
（簡体字は繁体字から自動変換。pip install opencc-python-reimplemented）
素材を取り込み直すときは先に python3 tools/import_data.py
"""
import csv, json, os, re
from opencc import OpenCC

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = lambda *p: os.path.join(ROOT, *p)
rows = lambda fn: list(csv.DictReader(open(S("src", "data", fn), encoding="utf-8")))

# ===== 単元（学習指導要領 平成29年告示 解説外国語編の項目の並び） =====
# id, まとまり, 日本語, English, 繁體, 学年の目安, 問題の種類, Partの範囲, 動画のキー
UNITS = [
    ("adj", "voc", "形容詞", "Adjectives", "形容詞", "1-3", "adj", range(1, 49), "adj"),
    ("verb", "voc", "動詞", "Verbs", "動詞", "1-3", "verb", range(1, 51), "verb"),
    ("noun", "voc", "名詞（総復習）", "Nouns (review)", "名詞（總複習）", "1-3", "noun", range(1, 27), "noun"),
    ("ant", "voc", "反対語", "Opposites", "反義詞", "1-3", "ant", range(1, 49), "adj"),
    ("cmp", "gram", "比較", "Comparisons", "比較", "2", "gram", range(1, 7), "gram"),
    ("inf", "gram", "不定詞", "To-infinitives", "不定詞", "2", "gram", range(7, 13), "gram"),
    ("itis", "gram", "It is 〜 to …", "It is ... to ...", "It is 〜 to …", "2", "gram", range(13, 15), "gram"),
    ("ger", "gram", "動名詞", "Gerunds", "動名詞", "2", "gram", range(15, 17), "gram"),
    ("aux", "gram", "助動詞", "Modal verbs", "助動詞", "2", "gram", range(33, 37), "gram"),
    ("pas", "gram", "受け身", "Passive voice", "被動語態", "2", "gram", range(17, 19), "gram"),
    ("pp", "gram", "現在完了", "Present perfect", "現在完成式", "3", "gram", range(19, 23), "gram"),
    ("rel", "gram", "関係代名詞", "Relative pronouns", "關係代名詞", "3", "gram", range(23, 27), "gram"),
    ("ind", "gram", "間接疑問", "Indirect questions", "間接問句", "3", "gram", range(27, 29), "gram"),
    ("ptc", "gram", "分詞の後置修飾", "Participles as modifiers", "分詞後置修飾", "3", "gram", range(29, 31), "gram"),
    ("sub", "gram", "仮定法", "Subjunctive", "假設語氣", "3", "gram", range(31, 33), "gram"),
    ("req", "talk", "依頼する", "Asking for help", "請求", "1-3", "gram", range(37, 39), "kaiwa"),
    ("inv", "talk", "誘う・提案する", "Inviting & suggesting", "邀請・提議", "1-3", "gram", range(39, 41), "kaiwa"),
    ("opi", "talk", "意見を言う", "Giving opinions", "表達意見", "1-3", "gram", range(47, 49), "kaiwa"),
    ("agr", "talk", "賛成・反対", "Agreeing & disagreeing", "贊成・反對", "1-3", "gram", range(49, 51), "kaiwa"),
    ("thx", "talk", "お礼・お詫び", "Thanks & apologies", "道謝・道歉", "1-3", "gram", range(51, 53), "kaiwa"),
    ("feel", "talk", "体調・気持ち", "Health & feelings", "身體狀況・心情", "1-3", "gram", range(53, 55), "kaiwa"),
    ("way", "talk", "道案内", "Giving directions", "問路・指路", "1-3", "gram", range(41, 43), "kaiwa"),
    ("shop", "talk", "買い物", "Shopping", "購物", "1-3", "gram", range(43, 45), "kaiwa"),
    ("tel", "talk", "電話", "On the phone", "講電話", "1-3", "gram", range(45, 47), "kaiwa"),
]

aud = json.load(open(S("src", "data", "audio.json")))
vids = json.load(open(S("src", "data", "videos.json")))
reasons = {}
if os.path.exists(S("src", "data", "reasons.csv")):
    for r in rows("reasons.csv"):
        reasons.setdefault(r["id"], {})[r["choice"].strip()] = r["reason"].strip()

items = {}
for kind, fn in (("adj", "10_adjective_quiz.csv"), ("verb", "11_verb_quiz.csv"), ("noun", "12_noun_final_review.csv")):
    items[kind] = [[f"{kind[0]}{r['part']}-{r['no']}", int(r["part"]), r["word"], r["ja"], r["example_en"], r["example_ja"],
                    r.get("antonym", ""), r.get("antonym_ja", ""), int(r.get("pair_in_part") or 0)] for r in rows(fn)]
gram = []
for fn in ("20_nyushi_grammar_part01-36.csv", "21_nyushi_kaiwa_part37-54.csv"):
    for r in rows(fn):
        i = f"g{r['part']}-{r['no']}"
        ch = [c.strip() for c in r["choices"].split("|")]
        assert r["blank"].strip() in ch and r["blank"].strip() in r["en"], i
        gram.append([i, int(r["part"]), r["en"], r["ja"], r["blank"].strip(), ch, r["key_phrase"], r["type"], r["source"],
                     re.sub(r"（[前後]編）$", "", r["theme"]), reasons.get(i, {})])
items["gram"] = gram

units = [{"id": u[0], "g": u[1], "n": {"ja": u[2], "en": u[3], "zh-Hant": u[4]}, "gr": u[5], "k": u[6], "parts": list(u[7]), "vk": u[8]} for u in UNITS]
data = {"units": units, "items": items, "aud": aud, "vid": {k: v["id"] for k, v in vids.items()}}
js = "/* 45 Study の問題データ（tools/build.py が作る。直接編集しない） */\nconst D=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(S("data.js"), "w", encoding="utf-8").write(js)

shell = open(S("src", "shell.html"), encoding="utf-8").read()
a = shell.index('"zh-Hant":{'); b = shell.index("/*ZH*/")
zh = OpenCC("tw2sp").convert(shell[a:b].rstrip()).replace('"zh-Hant":{', '"zh":{', 1)
shell = shell[:b] + "," + zh + "\n" + shell[b + len("/*ZH*/"):]
ver = re.search(r'APP_VER="([^"]+)"', shell).group(1)
shell = shell.replace("{{VER}}", ver)
open(S("index.html"), "w", encoding="utf-8").write(shell)
open(S("manifest.json"), "w", encoding="utf-8").write(json.dumps({
    "name": "45 Study", "short_name": "45 Study", "start_url": "./", "scope": "./", "display": "standalone",
    "background_color": "#FFF6EE", "theme_color": "#FFF6EE",
    "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
              {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]}, ensure_ascii=False, indent=1))

import shutil
shutil.copy(S("src", "math.js"), S("math.js"))
files = ["./", "index.html", "data.js", "math.js", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png"]
sw = f'''const C="study-{ver}";
const FILES={json.dumps(files)};
self.addEventListener("install",e=>{{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(u=>new Request(u,{{cache:"reload"}})))).catch(()=>{{}}));self.skipWaiting();}});
// 音声（audio/）は版をまたいで残す
self.addEventListener("activate",e=>{{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(x=>x!==C&&x!=="study-audio").map(x=>caches.delete(x)))).then(()=>self.clients.claim()));}});
self.addEventListener("fetch",e=>{{
  const r=e.request; if(r.method!=="GET"||!r.url.startsWith(self.location.origin)) return;
  const key=r.url.split("#")[0].split("?")[0];
  if(key.includes("/audio/")){{ e.respondWith(caches.open("study-audio").then(c=>c.match(key).then(m=>m||fetch(r).then(res=>{{ if(res.ok) c.put(key,res.clone()); return res; }})))); return; }}
  e.respondWith(fetch(r,{{cache:"no-cache"}}).then(res=>{{ if(res.ok){{ const cp=res.clone(); caches.open(C).then(c=>c.put(key,cp)); }} return res; }})
    .catch(()=>caches.match(key).then(m=>m||caches.match(r,{{ignoreSearch:true}})).then(m=>m||(r.mode==="navigate"?caches.match(new URL("index.html",self.registration.scope).href):undefined))));
}});
'''
open(S("sw.js"), "w").write(sw)
n = sum(len(v) for v in items.values())
print("built", ver, "units", len(units), "items", n, "reasons", sum(len(v) for v in reasons.values()), f"data.js {len(js.encode())/1e3:.0f}KB")
