"""
Build the engraver pack for the stone QR code.

    pip install "qrcode[pil]" shapely ezdxf
    python tools/make_engraving.py <url> [code_width_mm] [out_dir]

Example (default 180 mm wide code, files into stone/):
    python tools/make_engraving.py https://tour.gau.ac.ke/s
Once the address is confirmed live, drop the SAMPLE banner on the template:
    FINAL=1 python tools/make_engraving.py https://tour.gau.ac.ke/s

Outputs, all at REAL SIZE in millimetres:
    qr-stone.svg   one merged outline per dark area (for laser / CNC / sandblast stencil)
    qr-stone.dxf   the same outlines as closed polylines (for CNC / CAD software)
    qr-stone.png   high-res preview (not for cutting)
    specs.txt      version, module size, quiet zone, overall size

Why merged outlines: touching dark squares become ONE shape, so the engraver
cuts a few clean regions instead of hundreds of tiny squares.
"""
import os
import sys
from pathlib import Path

import ezdxf
import qrcode
from shapely.geometry import box
from shapely.ops import unary_union

if not 2 <= len(sys.argv) <= 4:
    sys.exit(__doc__)

url = sys.argv[1]
code_mm = float(sys.argv[2]) if len(sys.argv) > 2 else 180.0
out = Path(sys.argv[3] if len(sys.argv) > 3 else "stone")
out.mkdir(parents=True, exist_ok=True)
QUIET = 4  # modules of blank border required around the code

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0)
qr.add_data(url)
qr.make(fit=True)
matrix = qr.get_matrix()
n = len(matrix)
m = code_mm / n                      # module size in mm
total = code_mm + 2 * QUIET * m      # including quiet zone

# 1. Merge every dark module into outline polygons (y grows downward, like SVG).
#    Squares that only touch at a corner stay separate shapes (a corner point can't be carved).
squares = [box(QUIET * m + c * m, QUIET * m + r * m, QUIET * m + (c + 1) * m, QUIET * m + (r + 1) * m)
           for r, row in enumerate(matrix) for c, dark in enumerate(row) if dark]
shape = unary_union(squares)
polys = list(shape.geoms) if shape.geom_type == "MultiPolygon" else [shape]


def ring_to_path(coords):
    pts = list(coords)[:-1]
    return "M" + " L".join(f"{x:.3f},{y:.3f}" for x, y in pts) + " Z"


# 2. SVG in millimetres (evenodd keeps the holes of finder patterns open)
paths = []
for p in polys:
    d = ring_to_path(p.exterior.coords) + "".join(" " + ring_to_path(h.coords) for h in p.interiors)
    paths.append(d)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{total:.2f}mm" height="{total:.2f}mm" viewBox="0 0 {total:.3f} {total:.3f}">
  <title>Stone QR: {url}</title>
  <rect x="0.15" y="0.15" width="{total - 0.3:.3f}" height="{total - 0.3:.3f}" fill="#ffffff" stroke="#999999" stroke-width="0.3"/>
  <path fill="#000000" fill-rule="evenodd" d="{" ".join(paths)}"/>
</svg>
'''
(out / "qr-stone.svg").write_text(svg)

# 3. DXF (mm). Y flipped so the code is not mirrored in CAD (DXF y grows upward).
doc = ezdxf.new(units=ezdxf.units.MM)
msp = doc.modelspace()
doc.layers.add("QR_CUT", color=7)
doc.layers.add("QUIET_ZONE_BORDER", color=8)
flip = lambda pts: [(x, total - y) for x, y in pts]
for p in polys:
    msp.add_lwpolyline(flip(list(p.exterior.coords)[:-1]), close=True, dxfattribs={"layer": "QR_CUT"})
    for h in p.interiors:
        msp.add_lwpolyline(flip(list(h.coords)[:-1]), close=True, dxfattribs={"layer": "QR_CUT"})
msp.add_lwpolyline([(0, 0), (total, 0), (total, total), (0, total)], close=True,
                   dxfattribs={"layer": "QUIET_ZONE_BORDER"})
doc.saveas(out / "qr-stone.dxf")

# 4. Preview PNG
qr_png = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=QUIET, box_size=30)
qr_png.add_data(url)
qr_png.make(fit=True)
qr_png.make_image(fill_color="black", back_color="white").save(out / "qr-stone.png")

# 5. Specs
specs = f"""STONE QR: ENGRAVING SPECS
URL encoded ........ {url}
QR version ......... {qr.version} ({n} x {n} modules), error correction H (~30% damage tolerance)
Module (square) .... {m:.2f} mm
Code width ......... {code_mm:.1f} mm (without quiet zone)
Quiet zone ......... {QUIET} modules = {QUIET * m:.1f} mm on every side, must stay plain and flat
Overall size ....... {total:.1f} x {total:.1f} mm
Cut regions ........ {len(polys)} merged outlines (dark = engraved + dark infill)
"""
(out / "specs.txt").write_text(specs)
print(specs)

# 6. Real-size A3 print template (needs: pip install playwright && playwright install chromium)
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("(skipped template PDF: playwright not installed)")
    sys.exit(0)

svg_inline = svg.replace(f'width="{total:.2f}mm" height="{total:.2f}mm"', f'width="{total:.2f}mm" height="{total:.2f}mm" style="display:block"')
spec_html = specs.replace("\n", "<br>")
html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: A3; margin: 0; }}
body {{ margin: 0; width: 297mm; height: 420mm; font: 11pt Arial, sans-serif; color: #111;
       display: flex; flex-direction: column; align-items: center; padding-top: 18mm; box-sizing: border-box; }}
h1 {{ font-size: 20pt; margin: 0 0 2mm; }}
.warn {{ color: #9A3412; font-weight: bold; margin-bottom: 8mm; }}
.ruler {{ width: 100mm; border-top: 0.6mm solid #111; text-align: center; padding-top: 1.5mm; margin: 8mm 0 6mm; font-size: 9pt; }}
.specs {{ font: 9.5pt monospace; line-height: 1.5; width: 230mm; }}
</style></head><body>
<h1>Stone QR: real-size template</h1>
<div class="warn">{'' if os.environ.get('FINAL') == '1' else 'SAMPLE: do not engrave until the university confirms the address and it opens the tour. '}Print at 100% / "Actual size" (no "fit to page").</div>
{svg_inline}
<div class="ruler">this line must measure exactly 100 mm; if not, the print is scaled</div>
<div class="specs">{spec_html}</div>
</body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.set_content(html)
    pg.pdf(path=str(out / "qr-stone-template.pdf"), format="A3", print_background=True, prefer_css_page_size=True)
    b.close()
print(f"saved {out}/qr-stone-template.pdf (A3, 1:1)")
