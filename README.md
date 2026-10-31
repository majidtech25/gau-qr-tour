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

## Workflow

- `main` = what's live. Work on a branch, open a pull request, and have one teammate review it.
- Photographer: upload photos straight into `images/` via GitHub's **Add file → Upload files**. File names must match `images/README.md`.

## Before going live: checklist

- [ ] All `[placeholders]` replaced with **verified** facts
- [ ] Faith & culture section reviewed with the Dean of Students / student groups
- [ ] Every recognisable person has given consent
- [ ] Kiswahili + Somali translated by native speakers
- [ ] Official GaU colours swapped into `css/style.css`
- [ ] Remembrance question decided with the administration
- [ ] Tested on at least 3 phones, on mobile data
