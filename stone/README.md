# Stone QR: engraver pack

> ⚠️ **SAMPLE until the address is confirmed.** These files encode `https://tour.gau.ac.ke/s`.
> Do **not** engrave until the university's ICT office has set up that address **and** it opens the tour.
> Then regenerate with `FINAL=1 python tools/make_engraving.py <final-url>`.

## Files (all real size, millimetres)

| File | For |
|---|---|
| `qr-stone.svg` | Laser engraving, vinyl/sandblast stencil, most design software |
| `qr-stone.dxf` | CNC routers and CAD (layer `QR_CUT` = cut, `QUIET_ZONE_BORDER` = guide only) |
| `qr-stone-template.pdf` | A3 print at 100%: check the size and test-scan on paper first |
| `qr-stone.png` | Preview only, not for cutting |
| `specs.txt` | All measurements |

## Why this code is easier to carve

- **Short address** (`/s`), so the code is only **29 × 29 squares** (the long address needs 41 × 41). Each square is about **6.2 mm** at 180 mm width.
- **Merged shapes:** touching dark squares are joined into **66 outlines**, not hundreds of tiny squares.
- **Error correction H:** about 30% of the code can be chipped, dusty or worn and it still scans.

## Rules for the engraver

1. **Dark = engraved.** Cut the black shapes into the stone and fill them with a **dark, matte** infill (paint or epoxy). Leave the light areas as the polished/natural stone. High contrast is everything.
2. **Keep the quiet zone.** At least **24.8 mm** of plain, flat stone around the code on every side. No text, edges or decoration inside it.
3. **Flat and matte.** Put it on a **flat face**, not a curved or rough one. Avoid glossy finishes, because glare in the sun stops phones reading it.
4. **Sharp corners.** Keep square corners square. Rounded corners from a router bit are fine if small, but ask for the smallest bit that cuts cleanly.
5. **Never mirror or stretch it.** Use the files at exactly the given size (you can scale both directions equally, but recheck the module size).
6. **Light stone works best.** On dark stone, consider an inset plate instead (below).

## Options, from most to least forgiving

| Method | Notes |
|---|---|
| **Etched metal or ceramic plate set into the stone** | Sharpest result and easiest to replace if damaged. Ask about stainless steel or aluminium etching. |
| **Sandblast through a stencil + dark infill** | Clean edges on granite or marble; use `qr-stone.svg` to cut the stencil. |
| **CNC routing + dark infill** | Use `qr-stone.dxf`. |
| **Hand carving** | Hardest to keep accurate; only with the A3 template fixed to the stone as a guide. |

## Before and after carving: test

- [ ] Print `qr-stone-template.pdf` at 100%, check the ruler = 100 mm, and scan it with 3+ phones
- [ ] If possible, do a small test piece on scrap stone first and scan that
- [ ] After carving: scan from about 1–2 m, in sun and shade, with Android and iPhone
