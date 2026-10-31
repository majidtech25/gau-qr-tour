"""
Generate the stone-ready QR code.

    pip install "qrcode[pil]"
    python tools/make_qr.py https://tour.gau.ac.ke/?from=stone

Outputs qr/gau-qr.png (for printing the pilot) and qr/gau-qr.svg
(vector, for the engraver). Uses error-correction level H (~30%
of the code can be damaged and it still scans) and a 4-module
quiet zone. ALWAYS test-scan the final size with several phones.
"""
import sys
from pathlib import Path

import qrcode
import qrcode.image.svg

if len(sys.argv) != 2:
    sys.exit("Usage: python tools/make_qr.py <final-url>")

url = sys.argv[1]
out = Path("qr")
out.mkdir(exist_ok=True)


def build(**kw):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=4, **kw)
    qr.add_data(url)
    qr.make(fit=True)
    return qr


png = build(box_size=40)
png.make_image(fill_color="black", back_color="white").save(out / "gau-qr.png")

svg = build(box_size=10, image_factory=qrcode.image.svg.SvgPathImage)
svg.make_image().save(out / "gau-qr.svg")

print(f"QR for {url}")
print(f"  version {png.version} ({png.modules_count}x{png.modules_count} modules)")
print(f"  saved to {out}/gau-qr.png and {out}/gau-qr.svg")
