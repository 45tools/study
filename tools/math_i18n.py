"""数学の英語・中国語：src/math.js の J`…` の文を src/math_i18n.json（キー → [英語, 繁体字]）で訳し、
src/math_i18n.js（MATH_TR、簡体字は繁体字から自動変換）を作る。
  uv run -q --with opencc-python-reimplemented python tools/math_i18n.py          … 作る
  python3 tools/math_i18n.py --check                                              … 訳のない文を一覧
訳のない文は日本語のまま出る。新しい問題を足したら --check で確かめ、json に訳を足す。"""
import json,os,re,sys
sys.path.insert(0,os.path.dirname(__file__))
from jlex import lex
R=os.path.join(os.path.dirname(__file__),"..")
src=open(os.path.join(R,"src","math.js")).read()
tr=json.load(open(os.path.join(R,"src","math_i18n.json")))
keys=[]
for t in lex(src):
    if t[0]=="tpl" and src[t[1]-1]=="J":
        keys.append("{}".join(src[a:b] for a,b in t[3]))
miss=sorted({k for k in keys if k not in tr})
bad=[k for k in tr if k in set(keys) and any(set(int(x) for x in re.findall(r"\{(\d+)\}",v))!=set(range(k.count("{}"))) for v in tr[k])]
if "--check" in sys.argv:
    print(f"J`…` {len(set(keys))} 文、訳なし {len(miss)}、{{}} の数ちがい {len(bad)}")
    for k in miss: print("  訳なし:",k)
    for k in bad: print("  数ちがい:",k)
    sys.exit(1 if miss or bad else 0)
import opencc
cc=opencc.OpenCC("t2s")
used={k:[v[0],v[1],cc.convert(v[1])] for k,v in tr.items() if k in set(keys)}
open(os.path.join(R,"src","math_i18n.js"),"w").write("/* 自動生成（tools/math_i18n.py）。直すのは src/math_i18n.json */\nconst MATH_TR="+json.dumps(used,ensure_ascii=False,separators=(",",":"))+";\n")
print("math_i18n.js:",len(used),"文",("訳なし %d"%len(miss)) if miss else "")
