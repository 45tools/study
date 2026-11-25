"""45 Study の紹介ショート。45 Play の撮影スタジオ（play/tools/shorts/studio.py）を借りる。
準備：python3 -m http.server 8770 --directory ~/projects/45tools ／ python3 -m http.server 8771 --directory ~/projects/45tools/play/tools/shorts
使い方：uv run --with playwright python study_short.py en1 ja|en|zh-Hant   （BGM=曲.mp3 でBGM入り）
  en1 = 11/29 公開（英語：2秒クイズ・聞いて埋める・反対語めくり）／math1 = 12/6 公開（数学：4択・図の問題・3秒○×）
"""
import asyncio, sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "play", "tools", "shorts"))
import studio
studio.APP = APP = "http://localhost:8770/study/"
studio.HERE = HERE  # 出力は study/tools/shorts/out
from studio import Studio

COL = "#F26A1B"
ICON = "http://localhost:8770/study/icon-512.png"
CHIP = "<div class=chip><i>45</i>Study</div>"

# 読み上げ（アプリの音声は入れない。say を止めて、時計を止めたまま撮る）
DEMO = ("(()=>{const v=[.95,.9,.86,.8,.72,.6,.92,.88,.45,.97]; let k=0;"
        " for(const u of UNITS.filter(u=>u.s==='en'&&u.k!=='ant')){ for(const p of u.parts.slice(0,u.k==='gram'?2:6)){ REC.part[u.id+':'+p]=v[k++%v.length]; } }"
        " REC.memo[1]=40; REC.memo[2]=52; REC.day={last:today(),streak:6}; REC.inf.mix=23; REC.save(); })();")
MUTE = "window.say=async()=>{}; window.tts=()=>{}; "

L = {
 "ja": {
  "name": "45 Study", "tag": "動画の続きを、自分の手で。",
  "t": ["45 Study。伊先生Labの動画と、同じ問題を解ける学習アプリです。",
        "ホームには、今日公開の動画の回。見たらすぐ、同じPartで遊べます。",
        "2秒クイズは、単語を見て4択。動画と同じテンポです。",
        "まちがえたら、えらんだ語の意味も出ます。時間は、ゆっくりやなしにもできます。",
        "聞いて埋めるは、例文を聞いて、空らんに入る語をえらびます。",
        "まちがえた理由を、一言で教えてくれます。",
        "反対語めくりは、反対の意味の2枚をそろえる神経衰弱。",
        "遊んだPartは、すすみ具合のタイルに色がつきます。",
        "45 Study。無料・広告なし。毎週日曜に、教科が増えます。"],
  "end": ("無料・広告なし・登録不要", ["中学の英語から", "動画と同じPart"], "毎週日曜、教科が増えます（12/6 数学）"),
 },
 "en": {
  "name": "45 Study", "tag": "Keep going after the video.",
  "t": ["45 Study. Solve the same questions as the Isensei Lab videos, for junior high students in Japan.",
        "The home screen shows today's videos. Watch one, then play the same part right away.",
        "Two-second quiz: see a word, pick from four. Same pace as the video.",
        "Miss one, and you see what your choice meant. You can slow the timer or turn it off.",
        "Listen and fill: hear a sentence and choose the missing word.",
        "It tells you why your answer was wrong, in one line.",
        "Opposites is a memory game. Match words with opposite meanings.",
        "Parts you play light up on your progress tiles.",
        "45 Study. Free, no ads. A new subject every Sunday."],
  "end": ("Free · No ads · No sign-up", ["Junior high English", "Same parts as the videos"], "A new subject every Sunday · Japanese explanations"),
 },
 "zh-Hant": {
  "name": "45 Study", "tag": "看完影片，自己動手練習。",
  "t": ["45 Study，可以練習和伊先生Lab影片相同題目的學習遊戲，給日本的國中生。",
        "首頁會顯示今天公開的影片，看完馬上就能練同一個Part。",
        "兩秒測驗，看單字從四個選項選答案，和影片一樣的節奏。",
        "答錯時會顯示你選的字的意思。時間也能放慢或關掉。",
        "聽力填空，聽例句，選出空格裡的字。",
        "答錯時，用一句話告訴你錯在哪裡。",
        "反義詞翻牌，是把意思相反的兩張牌湊成一對的記憶遊戲。",
        "玩過的Part，會在進度方塊上亮起顏色。",
        "45 Study，免費、無廣告。每週日新增科目。"],
  "end": ("免費・無廣告・免註冊", ["國中英文", "和影片同一個Part"], "每週日新增科目・解說為日文"),
 },
}


async def app_wait(s, ms=600):
    await s.page.clock.run_for(ms); await s.page.wait_for_timeout(300)


async def pick(s, ok=True):
    """正解（ok=True）か、まちがい（ok=False）の選択肢を押す"""
    if ok: i = await s.js("Z.q.ch.findIndex(c=>c.ok)")
    else:  # 数学は「計算ミスです」以外の、具体的な理由がある誤答を選ぶ
        i = await s.js("(()=>{const ch=Z.q.ch; let k=ch.findIndex(c=>!c.ok&&c.why&&!/^計算ミス/.test(c.why)); return k<0?ch.findIndex(c=>!c.ok):k})()")
    await s.tap(f'#qBody [data-c="{i}"]', after=0.2)


async def run_en1(lang, bgm=None):
    D = L[lang]; T = D["t"]
    async with Studio(f"study_en1_{lang}", lang, COL) as s:
        await s.page.clock.set_system_time("2026-11-29T07:30:00+09:00")
        await s.stage(f"document.querySelector('#top .chip').innerHTML='<i>45</i>Study'")
        # タイトル
        await s.scene("title")
        title = (f'{CHIP}<img src="{ICON}" style="width:330px;height:330px;border-radius:78px;box-shadow:0 16px 40px rgba(30,36,69,.25)">'
                 f'<div class=big>{D["name"]}</div><div class=tag>{D["tag"]}</div>')
        await s.stage(f"__card({json.dumps(title)})")
        await s.hold(0.2)
        await s.say(T[0], caption=""); await s.wait_speech(0.3)
        # ホーム
        await s.stage(f"__app({json.dumps(APP)})"); await s.page.clock.run_for(1500); await s.page.wait_for_timeout(1500)
        await s.page.frame(name="app").wait_for_selector('[data-pane="home"].act', timeout=15000)
        await s.js(MUTE + "store.set('s_lang'," + json.dumps(lang) + ");1")
        await s.stage(f"__card(''); __title('45 Study'); __finger(true)")
        await s.scene("home")
        await s.say(T[1]); await s.hold(1.0)
        await s.wait_speech(0.2)
        # 2秒クイズ（今日の単語クイズの回）
        await s.scene("quiz")
        await s.tap('#todayList [data-pp^="adj:"]', after=0.3)
        await s.js(MUTE + "1")
        await s.say(T[2]); await s.hold(0.2)
        await pick(s, True); await s.hold(1.25)   # 正解すると1.1秒で次の問題へ自動で進む
        await pick(s, False)
        await s.say(T[3]); await s.hold(1.4)
        await s.wait_speech(0.4)
        await s.js("stopTimer(); Z=null; goHome(); 1")
        await app_wait(s)
        # 聞いて埋める（今日の例文の回）
        await s.scene("listen")
        await s.tap('#todayList [data-pp]', after=0.3)
        await s.js(MUTE + "1")
        await s.say(T[4]); await s.hold(1.6)
        await pick(s, False)
        await s.say(T[5]); await s.hold(0.6)
        await s.wait_speech(0.8)
        await s.js("stopTimer(); Z=null; goHome(); 1")
        await app_wait(s)
        # 反対語めくり
        await s.scene("memo")
        await s.tap('#games [data-go="memo"]', after=0.6)
        await s.tap('#uBody [data-p="1"]', after=0.6)
        await s.js(MUTE + "1")
        await s.say(T[6])
        n = await s.js("M?M.cards.length:0")
        if not n:
            await s.js(MUTE + "startMemo(1); 1"); await app_wait(s, 300)
        pairs = await s.js("(()=>{const g={}; M.cards.forEach((c,i)=>{(g[c.pi]=g[c.pi]||[]).push(i)}); return Object.values(g)})()")
        for a, b in pairs[:3]:
            await s.tap(f'#mGrid [data-m="{a}"]', after=0.35)
            await s.tap(f'#mGrid [data-m="{b}"]', after=0.9)
        await s.wait_speech(0.3)
        # すすみ具合
        # 見本の記録（いくつかのPartを遊んだ状態にして、タイルの色を見せる）
        await s.js("clearInterval(memoTick); M=null; " + DEMO + " goHome(); 1")
        await app_wait(s)
        await s.scene("prog")
        await s.js("(()=>{const e=document.querySelector('#prog'); e.scrollIntoView({block:'start'}); let p=e.parentElement; while(p&&p.scrollHeight<=p.clientHeight) p=p.parentElement; (p||document.scrollingElement).scrollTop-=150; return 1})()")
        await s.say(T[7]); await s.hold(1.0)
        await s.wait_speech(0.6)
        # 終わり
        await s.scene("end")
        await s.stage("__finger(false); __cap('')")
        x, pills, wk = D["end"]
        html = (f'{CHIP}<div class=tag>{x}</div><div class=url>45tools.github.io/study</div>'
                f'<div class=pills>{"".join(f"<span>{p}</span>" for p in pills)}</div><div class=small>{wk}</div>')
        await s.stage(f"__card({json.dumps(html)})")
        await s.say(T[-1], caption=""); await s.wait_speech(0.8)
    return s.finish(bgm)

LM = {
 "ja": {"name": "45 Study 数学", "tag": "紙もペンも、いらない数学。",
  "t": ["45 Study に、数学が加わりました。中1から中3まで、21単元です。",
        "ホームで数学に切りかえ。今日やるPartが出ます。",
        "4択の選択肢は、よくあるミス。",
        "まちがえたら、どこでミスしたかを一言で教えてくれます。",
        "図やグラフの問題も、計算用紙なしで解ける形にしました。",
        "3秒○×は、式を見て、正しいかを3秒で判断。",
        "45 Study。無料・広告なし。毎週日曜に、教科が増えます。"],
  "end": ("無料・広告なし・登録不要", ["中1〜中3の数学", "21単元・95 Part"], "毎週日曜、教科が増えます"),
 },
 "en": {"name": "45 Study Math", "tag": "Math without paper or pencil.",
  "t": ["Math is now in 45 Study. Grades seven to nine, twenty-one units.",
        "Switch to Math on the home screen to see today's parts.",
        "The wrong choices are common mistakes.",
        "Pick one, and it tells you where the mistake was.",
        "Even figure and graph questions work without scratch paper.",
        "Three-second true or false: is the equation right? Decide in three seconds.",
        "45 Study. Free, no ads. A new subject every Sunday."],
  "end": ("Free · No ads · No sign-up", ["Junior high math", "21 units · 95 parts"], "A new subject every Sunday · Japanese explanations"),
 },
 "zh-Hant": {"name": "45 Study 數學", "tag": "不用紙筆的數學。",
  "t": ["45 Study 新增數學，國一到國三，共21個單元。",
        "在首頁切換到數學，就會顯示今天要練的Part。",
        "四選一的錯誤選項，都是常見的錯誤。",
        "答錯時，用一句話告訴你錯在哪裡。",
        "圖形和圖表的題目，也不用計算紙就能作答。",
        "三秒是非題，看算式，三秒內判斷對不對。",
        "45 Study，免費、無廣告。每週日新增科目。"],
  "end": ("免費・無廣告・免註冊", ["國中數學", "21個單元・95個Part"], "每週日新增科目・解說為日文"),
 },
}


async def run_math1(lang, bgm=None):
    D = LM[lang]; T = D["t"]
    async with Studio(f"study_math1_{lang}", lang, "#12A08A") as s:
        await s.page.clock.set_system_time("2026-12-06T07:30:00+09:00")
        await s.stage(f"document.querySelector('#top .chip').innerHTML='<i>45</i>Study'")
        await s.scene("title")
        title = (f'{CHIP}<img src="{ICON}" style="width:330px;height:330px;border-radius:78px;box-shadow:0 16px 40px rgba(30,36,69,.25)">'
                 f'<div class=big style="font-size:112px">{D["name"]}</div><div class=tag>{D["tag"]}</div>')
        await s.stage(f"__card({json.dumps(title)})")
        await s.hold(0.2)
        await s.say(T[0], caption=""); await s.wait_speech(0.3)
        await s.stage(f"__app({json.dumps(APP)})"); await s.page.clock.run_for(1500); await s.page.wait_for_timeout(1500)
        await s.page.frame(name="app").wait_for_selector('[data-pane="home"].act', timeout=15000)
        await s.js(MUTE + "1")
        await s.stage(f"__card(''); __title({json.dumps(D['name'])}); __finger(true)")
        # ホーム → 数学
        await s.scene("home")
        await s.say(T[1]); await s.hold(0.6)
        await s.tap('#subjSeg [data-sj="math"]', after=1.0)
        await s.wait_speech(0.2)
        # 4択（計算）
        await s.scene("mc")
        await s.tap('#todayList [data-pp]', after=0.5)
        await s.say(T[2]); await s.hold(1.4)
        await pick(s, False)
        await s.say(T[3]); await s.hold(0.6)
        await s.wait_speech(0.8)
        await s.js("stopTimer(); Z=null; goHome(); 1"); await app_wait(s)
        # 図の問題（三平方の定理）
        await s.scene("fig")
        await s.js("playPart(U.pyth,1); 1"); await app_wait(s, 300)
        await s.say(T[4]); await s.hold(1.6)
        await pick(s, True)
        await s.wait_speech(0.8)
        await s.js("stopTimer(); Z=null; goHome(); 1"); await app_wait(s)
        # 3秒○×
        await s.scene("tf")
        await s.tap('#games [data-go="tf"]', after=0.5)
        await s.js("document.querySelector('#uList [data-u=calc2]').scrollIntoView({block:'center'}); 1"); await s.hold(0.3)
        await s.tap('#uList [data-u="calc2"]', after=0.5)
        await s.tap('#uBody [data-p="1"]', after=0.3)
        await s.say(T[5]); await s.hold(0.3)
        for _ in range(3):
            await pick(s, True); await s.hold(1.25)
        await s.wait_speech(0.4)
        await s.js("stopTimer(); Z=null; store.set('s_mm','mc'); goHome(); 1")
        # 終わり
        await s.scene("end")
        await s.stage("__finger(false); __cap('')")
        x, pills, wk = D["end"]
        html = (f'{CHIP}<div class=tag>{x}</div><div class=url>45tools.github.io/study</div>'
                f'<div class=pills>{"".join(f"<span>{p}</span>" for p in pills)}</div><div class=small>{wk}</div>')
        await s.stage(f"__card({json.dumps(html)})")
        await s.say(T[-1], caption=""); await s.wait_speech(0.8)
    return s.finish(bgm)


if __name__ == "__main__":
    kind, lang = sys.argv[1], sys.argv[2]
    print(asyncio.run({"en1": run_en1, "math1": run_math1}[kind](lang, os.environ.get("BGM"))))
