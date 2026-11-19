"""45 Study のアイコン（icon-180/192/512.png）を作る。
シリーズ共通の形：紺の背景＋生成り色のボード＋青い「45」の駒。真ん中に開いた本と ✓。
使い方：python3 tools/icons.py（Playwright を使う）
"""
import asyncio, os
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COL = "#F26B1D"
ART = ('<path d="M4 11.5c6.5-2.6 13-2.6 19 1.2v26c-6-3.8-12.5-3.8-19-1.2z" fill="#fff"/>'
       '<path d="M42 11.5c-6.5-2.6-13-2.6-19 1.2v26c6-3.8 12.5-3.8 19-1.2z" fill="#fff"/>'
       '<path d="M8.5 18.5c3.6-1 7.2-.7 10.5.8M8.5 24.5c3.6-1 7.2-.7 10.5.8M8.5 30.5c3.6-1 7.2-.7 10.5.8" stroke="#F8B48A" stroke-width="2.2" stroke-linecap="round"/>'
       '<path d="M27.5 24.5l4 4.2 7-9" stroke="#F26B1D" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>')

def svg(size):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 512 512">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{COL}" stop-opacity=".62"/><stop offset=".7" stop-color="{COL}"/></linearGradient></defs>
<rect width="512" height="512" fill="#14213D"/>
<rect x="42" y="42" width="428" height="428" rx="40" fill="#F3F0E8"/>
<rect x="72" y="72" width="368" height="368" rx="12" fill="none" stroke="#A9A9A9" stroke-width="6"/>
<rect x="112" y="104" width="288" height="288" rx="66" fill="#fff"/>
<rect x="112" y="104" width="288" height="288" rx="66" fill="url(#g)"/>
<g transform="translate(148 132) scale(4.67)" fill="none">{ART}</g>
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
