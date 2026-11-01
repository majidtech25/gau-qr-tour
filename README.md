# GaU QR Tour 🪨❤️

> **Working title.** Rename once the team votes (Moyo wa GaU / The Heartstone / Fahari GaU).

A one-page mobile site opened by a **QR code on a stone sculpture** beside the
**I ❤ GARISSA UNIVERSITY** board. It gives visitors a one-minute *feel* for life
at Garissa University (GaU): a day on campus, our faiths and cultures, a real
student voice, and a photo spot. Then it hands them to the official site,
[gau.ac.ke](https://gau.ac.ke), for anything official.

**Design direction:** *Welcomed · Proud · Alive*

## Team

| Role | Name |
|---|---|
| Lead / developer | Majid |
| Developer | [Name] |
| Photographer | [Name] |

## Project structure

```
index.html          the whole page (6 sections)
css/style.css       all styling: colours live at the top in :root
js/i18n.js          text for EN / SW / SO (EN is the fallback)
js/main.js          photo placeholders, language switch, share button
images/             photos go here; see images/README.md for the shot list
tools/make_qr.py    generates the stone-ready QR code
```

No frameworks, no build step: plain HTML/CSS/JS, so it loads fast on mobile data
and anyone on the team can edit it.

## Run it locally

```bash
python -m http.server 8000
# open http://localhost:8000 (use your phone on the same Wi-Fi: http://<your-ip>:8000)
```

## Deploy (GitHub Pages, free)

1. Push to GitHub (public repo).
2. Repo **Settings → Pages → Source: Deploy from a branch → `main` / root → Save**.
3. Live at `https://<username>.github.io/gau-qr-tour/`.
4. Later: ICT points `tour.gau.ac.ke` at it (Settings → Pages → Custom domain).

## The QR code: rules

- The QR only holds an **address**. Edit the page anytime; the code never changes.
- **Pilot (laminated):** may point at the `github.io` address.
- **Stone (permanent):** must point at a **university-owned address** (e.g. `tour.gau.ac.ke`), never `github.io` or a paid "dynamic QR" service.
- Generate it: `pip install "qrcode[pil]"` then `python tools/make_qr.py https://tour.gau.ac.ke/?from=stone`

## Pilot QR

Ready-to-print files are in `pilot/`:

| File | Use |
|---|---|
| `pilot/pilot-sign.pdf` | A4 sign: print in colour, laminate, place beside the board (with permission) |
| `pilot/qr-pilot.png` | The QR alone, high resolution |
| `pilot/qr-pilot.svg` | The QR alone, vector (for any resizing) |

The pilot QR opens `https://majidtech25.github.io/gau-qr-tour/?campaign=pilot&ref=qr`.
Before printing many: scan the printed sign with at least 3 different phones, in sun and in shade, from about 1 m away.

## Scan counter (GoatCounter)

We count visits with [GoatCounter](https://www.goatcounter.com): open source, no cookies, no personal data, free for non-commercial use.

1. Sign up at goatcounter.com. Pick a code, e.g. `gau-qr-tour`, so your dashboard is `https://gau-qr-tour.goatcounter.com`.
2. In `index.html`, near the end, replace `YOUR-CODE` with that code and remove the `<!--` `-->` around the `<script>` line.
3. Merge. Then open the dashboard:
   - **Total visits**: everyone who opened the page.
   - **Campaigns → `pilot`**: visits that came from scanning the pilot QR. **This is the number for the proposal.**
4. Decide who on the team can log in to see the numbers. Note the date the pilot sign went up, so the count covers a known period.

## Workflow

- `main` = what's live. Everyone owns an area and ships it: branch → pull request → self-check → **merge it yourself**.
- Teammates review **after** the merge by commenting on the PR; the author fixes it in a follow-up PR. Full rules in `CLAUDE.md` → Git workflow.
- Photographer: upload photos straight into `images/` via GitHub's **Add file → Upload files**. File names must match `images/README.md`.

## Before going live: checklist

- [ ] All `[placeholders]` replaced with **verified** facts
- [ ] Faith & culture section reviewed with the Dean of Students / student groups
- [ ] Every recognisable person has given consent
- [ ] Kiswahili + Somali translated by native speakers
- [ ] Official GaU colours swapped into `css/style.css`
- [ ] Remembrance question decided with the administration
- [ ] Tested on at least 3 phones, on mobile data
