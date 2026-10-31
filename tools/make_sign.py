"""
Render pilot/sign.html to pilot/pilot-sign.pdf (A4, print-ready).

    pip install playwright && playwright install chromium
    python tools/make_sign.py

Run make_qr.py first if the pilot URL changed.
"""
from pathlib import Path

from playwright.sync_api import sync_playwright

src = Path("pilot/sign.html").resolve()
out = Path("pilot/pilot-sign.pdf")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(src.as_uri(), wait_until="networkidle")
    page.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
    browser.close()

print(f"saved {out}")
