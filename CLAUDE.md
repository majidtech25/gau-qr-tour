# CLAUDE.md: project rules for GaU QR Tour (The Stonecoders)

Read this before changing anything. It applies to every contributor and every
coding session, human or Claude.

## What this project is

A one-page mobile site opened by a QR code on a stone sculpture beside the
**I ❤ GARISSA UNIVERSITY** board. It gives visitors a one-minute *feel* for life
at Garissa University (GaU), then hands them to the official site
[gau.ac.ke](https://gau.ac.ke) for anything official.

- **Mood:** Welcomed · Proud · Alive
- **Audience:** visitors, parents, new students, alumni, standing at the board on a phone, often on mobile data, often in bright sun.
- **Not a replacement for gau.ac.ke.** No admissions, fees, courses, portals or news here. Link out instead.

## Stack: keep it boring

- Plain **HTML + CSS + vanilla JS**. **No frameworks, no npm, no build step.**
- Hosted on **GitHub Pages** from `main` / root. Whatever is on `main` is live.
- Only external requests allowed: Google Fonts and **GoatCounter** (the cookieless scan counter, one script tag at the end of `index.html`). No other trackers, ads or third-party scripts.

## File map

| File | Owns |
|---|---|
| `index.html` | All page structure (6 sections, in order) |
| `css/style.css` | All styling. Colours, fonts, spacing live in `:root` |
| `js/i18n.js` | All visible text, keyed for EN / SW / SO |
| `js/main.js` | Behaviour: photo placeholders, language switch, share |
| `images/` | Photos. Names and sizes defined in `images/README.md` |
| `tools/make_qr.py` | QR generator (error correction H) |

## Coding conventions

- **Mobile-first.** Design at 390 px wide. The page is capped at `--max` (480 px) on large screens.
- **Colours and fonts only through CSS variables** in `:root`. Never hard-code a new hex in a component.
- **Class names:** simple BEM-ish (`.hero__photo`, `.btn--dark`). No IDs for styling.
- **Text goes through i18n.** Any visible sentence gets a `data-i18n="section.key"` attribute and an entry in `js/i18n.js` → `en`. Leave `sw` / `so` empty for native speakers. English is the automatic fallback.
- **Photos:** always `<figure class="photo" data-label="…"><img src="images/…" alt="…" loading="lazy"></figure>`. The `data-label` shows while the file is missing. Never use `loading="lazy"` on the hero image.
- **JS:** one IIFE in `main.js`, `"use strict"`, no globals except `window.I18N`. It must work with JS off: content first, JS only enhances.
- **Indent:** 2 spaces. Double quotes in HTML/JS.

## Content rules (non-negotiable)

1. **No invented facts.** Every number, date or claim must be verified (university source or official document). If unknown, leave a `[placeholder in brackets]`.
2. **Verified facts in use:** founded 2011 as a constituent college of Moi University (in the former Garissa Teachers Training College), charter awarded 2017. Anything else needs a source.
3. **Consent:** no recognisable person's photo or quote without their permission.
4. **Faith & culture:** every group gets equal space and care. Confirm names with the Dean of Students / student groups before publishing.
5. **Remembrance (2015):** do not add any content about it until the administration decides.
6. **Translations:** native speakers only. No machine translation shipped.
7. **Keep it short.** If a section makes the page longer, something else gets cut. The visitor should reach the gau.ac.ke button in a few swipes.

## Accessibility & performance budget

- Real `<button>` / `<a>` elements; tap targets ≥ 44 px; visible focus styles.
- Text contrast ≥ 4.5:1 (it's read in direct sunlight).
- Every content image has meaningful `alt`; decorative SVGs use `aria-hidden="true"`.
- Each photo ≤ 300 KB, about 1200 px on the long side. Whole page should stay under ~2 MB.

## QR code rules

- The stone QR must point to a **university-owned address** (e.g. `tour.gau.ac.ke`), never `github.io` and never a paid "dynamic QR" service.
- The `github.io` address is for the laminated **pilot only**.
- Never rename or move `index.html` or `s/index.html`. The stone QR encodes the short address `<domain>/s`, and `s/` forwards to `../?campaign=stone&ref=qr`.
- Every printed QR carries a tag so its scans can be counted: pilot = `?campaign=pilot&ref=qr`, stone = `?campaign=stone&ref=qr`. Links people share (the Share button) drop the tag, so shares aren't counted as scans.
- Stone engraving files live in `stone/`. Regenerate with `python tools/make_engraving.py <url>` (add `FINAL=1` once the address is live).
- Pilot files live in `pilot/`. Regenerate them with `python tools/make_qr.py <url>` and never edit the PNG/SVG by hand.

## Git workflow

**Each person owns their area and ships it themselves. Review happens after merging, not before.**

| Who | Area |
|---|---|
| Majid | `pilot/`, `stone/`, `s/`, `tools/`, `README.md`, the proposal |
| Khadijun | `index.html`, `css/`, `js/` (page sections, accessibility) |
| Photographer | `images/` |

1. Work on a branch per task: `feat/…`, `fix/…`, `content/…`, `photos/…`.
2. Open a pull request (it's the record and the place for comments), run the **self-check** below, then **merge it yourself**.
3. Afterwards, a teammate reviews the merged PR and leaves comments or suggestions on it.
4. The **author** makes the corrections in a follow-up PR (`fix/…`) and links it in the comment thread.
5. Changing a file outside your area? Mention its owner in the PR so they see it.

- `main` is live, so the self-check is not optional: a mistake goes straight to visitors.
- Commit messages: short imperative summary (`Add culture section chips`), body if needed.
- Photographer: uploading photos directly via GitHub's "Add file → Upload files" into `images/` is fine.

## Before every merge: self-check (the author does this)

- [ ] Page loads with no console errors (`python -m http.server 8000`)
- [ ] Looks right at 390 px wide and on a real phone
- [ ] Missing photos still show labelled placeholders
- [ ] Language switch still works (EN fallback for empty keys)
- [ ] No new unverified facts, no lorem ipsum
