"""
Generate a print-ready QR code.

    pip install "qrcode[pil]"
    python tools/make_qr.py <url> [out_dir] [name]

Examples:
    # pilot (laminated sign)
    python tools/make_qr.py "https://majidtech25.github.io/gau-qr-tour/?campaign=pilot&ref=qr" pilot qr-pilot
    # stone (permanent; university-owned address only)
    python tools/make_qr.py "https://tour.gau.ac.ke/?campaign=stone&ref=qr" qr qr-stone

Writes <out_dir>/<name>.png (high-res) and <out_dir>/<name>.svg (vector).
Uses error-correction level H (~30% of the code can be damaged and it
still scans) and a 4-module quiet zone. ALWAYS test-scan the printed
size with several phones.
"""
import sys
from pathlib import Path

import qrcode
import qrcode.image.svg

if not 2 <= len(sys.argv) <= 4:
    sys.exit(__doc__)

url = sys.argv[1]
out = Path(sys.argv[2] if len(sys.argv) > 2 else "qr")
name = sys.argv[3] if len(sys.argv) > 3 else "gau-qr"
out.mkdir(parents=True, exist_ok=True)


def build(**kw):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=4, **kw)
    qr.add_data(url)
    qr.make(fit=True)
    return qr


png = build(box_size=40)
png.make_image(fill_color="black", back_color="white").save(out / f"{name}.png")

svg = build(box_size=10, image_factory=qrcode.image.svg.SvgPathImage)
svg.make_image().save(out / f"{name}.svg")

print(f"QR for {url}")
print(f"  version {png.version} ({png.modules_count}x{png.modules_count} modules)")
print(f"  saved to {out}/{name}.png and {out}/{name}.svg")
