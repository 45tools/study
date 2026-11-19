"""伊先生Labの素材（~/projects/勉強動画/入試2027）から 45 Study に必要な分を取り込む。
  src/data/*.csv        … 問題のCSV（そのままコピー）
  src/data/audio.json   … 問題ID → 音声ファイル名（edge-tts のハッシュ）
  src/data/videos.json  … 動画のキー（adj_01 など）→ {id, at}
  audio/<hash>.mp3      … 使う音声だけ
素材が増えたら（投稿が進んだら）もう一度実行する：python3 tools/import_data.py
"""
import csv, json, os, shutil
SRC = os.path.expanduser("~/projects/勉強動画/入試2027")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = lambda *p: os.path.join(ROOT, *p)
CSVS = {"adj": "10_adjective_quiz.csv", "verb": "11_verb_quiz.csv", "noun": "12_noun_final_review.csv",
        "gram": "20_nyushi_grammar_part01-36.csv", "kaiwa": "21_nyushi_kaiwa_part37-54.csv"}

man = json.load(open(os.path.join(SRC, "tts_manifest.json"), encoding="utf-8"))
by = {}
for h, v in man.items():
    if os.path.exists(os.path.join(SRC, "edge_mp3", h + ".mp3")):
        by.setdefault((v["text"].strip(), v["lang"]), h)

audio, miss = {}, []
def want(key, text, lang="en"):
    h = by.get((text.strip(), lang))
    if h: audio[key] = h
    else: miss.append((key, text))

for kind, fn in CSVS.items():
    shutil.copy(os.path.join(SRC, "csv", fn), S("src", "data", fn))
    for r in csv.DictReader(open(os.path.join(SRC, "csv", fn), encoding="utf-8")):
        p, n = int(r["part"]), int(r["no"])
        if kind in ("adj", "verb", "noun"):
            k = f"{kind[0]}{p}-{n}"
            want(k, r["word"])
            if kind == "adj" and r.get("antonym"): want(f"{k}x", r["antonym"])
        else:
            want(f"g{p}-{n}", r["en"])

os.makedirs(S("audio"), exist_ok=True)
keep = set(audio.values())
for f in os.listdir(S("audio")):
    if f[:-4] not in keep: os.remove(S("audio", f))
size = 0
for h in keep:
    d = S("audio", h + ".mp3")
    if not os.path.exists(d): shutil.copy(os.path.join(SRC, "edge_mp3", h + ".mp3"), d)
    size += os.path.getsize(d)
json.dump(audio, open(S("src", "data", "audio.json"), "w"), ensure_ascii=False, separators=(",", ":"), sort_keys=True)

log = json.load(open(os.path.join(SRC, "upload_log.json"), encoding="utf-8"))
vids = {k: {"id": v["video_id"], "at": v["publish_at"]} for k, v in log.items() if v.get("video_id")}
json.dump(vids, open(S("src", "data", "videos.json"), "w"), ensure_ascii=False, indent=0, sort_keys=True)
print(f"audio {len(keep)} files {size/1e6:.1f}MB, missing {len(miss)}", miss[:8])
print("videos", len(vids))
