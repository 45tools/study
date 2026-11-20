"""45 Study のアイコン（icon-180/192/512.png）を作る。
シリーズ共通の形：紺の背景＋生成り色のボード＋青い「45」の駒。真ん中に卒業帽と ✓。
使い方：python3 tools/icons.py（Playwright を使う）
"""
import asyncio, os
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COL = "#F26B1D"
# 卒業帽と ✓（512 の座標でそのまま描く）。2026-11-20 案D に決定
ART = ('<path d="M256 168 L376 216 L256 264 L136 216 Z" fill="#fff"/>'
       '<path d="M190 240 V300 C220 322 292 322 322 300 V240 L256 266 Z" fill="#fff"/>'
       '<path d="M360 222 V292" stroke="#fff" stroke-width="10" stroke-linecap="round"/>'
       '<circle cx="360" cy="298" r="12" fill="#fff"/>'
       '<path d="M226 286 l20 20 36-40" fill="none" stroke="#F26B1D" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>')

def svg(size):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 512 512">
<rect width="512" height="512" fill="#14213D"/>
<rect x="42" y="42" width="428" height="428" rx="40" fill="#F3F0E8"/>
<rect x="72" y="72" width="368" height="368" rx="12" fill="none" stroke="#A9A9A9" stroke-width="6"/>
<rect x="112" y="104" width="288" height="288" rx="66" fill="{COL}"/>
{ART}
<path d="M318 318 L352 330 L332 352 Z" fill="#2456D6"/>
<circle cx="372" cy="374" r="50" fill="#2456D6"/>
<text x="372" y="393" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="52" fill="#FFFFFF">45</text>
</svg>'''

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        for size in (512, 192, 180):
            await pg.set_viewport_size({"width": size, "height": size})
            await pg.set_content(f'<html><body style="margin:0">{svg(size)}</body></html>')
            await pg.wait_for_timeout(50)
            await pg.screenshot(path=os.path.join(ROOT, f"icon-{size}.png"))
        await b.close()
    print("icons ok")

asyncio.run(main())
