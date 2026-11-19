# 45 Study

伊先生Labの動画と同じ単語・例文で、1日1分の英語学習ゲーム（中学英語・高校入試）。https://45tools.github.io/study/

- 公開は `src/shell.html` の `RELEASE`（2026-12-26 20:00）。それまではお知らせだけ。`?preview=1` で中を見られる（`?preview=0` で戻す）。プレビュー中は `&day=2026-12-26` で日付を変えて「今日の1分」を確かめられる
- 遊び：2秒クイズ（単語）・聞いて埋める（文法・会話）・反対語めくり。単元ごとの10問／Part／無限モード、入試ミックス、復習（1日・3日・1週間後）、1周プラン、苦手マップ、前回の○×、日本語→英語
- 単元の並びは中学校学習指導要領（平成29年告示）解説 外国語編。単元の表は `tools/build.py` の `UNITS`

## 作り方
- 編集するのは `src/shell.html`（画面とゲーム）と `src/data/reasons.csv`（まちがえた理由：問題ID・選択肢・理由）
- 素材（CSV・音声・動画の記録）は `~/projects/勉強動画/入試2027/` から `python3 tools/import_data.py` で取り込む（投稿が進んだら取り込み直すと「動画」ボタンが各ショートに直接つながる）
- `python3 tools/build.py` → `index.html`・`data.js`・`manifest.json`・`sw.js` を書き出す（`src/shell.html` の `APP_VER` を上げてから）
- アイコンは `python3 tools/icons.py`（Playwright）
