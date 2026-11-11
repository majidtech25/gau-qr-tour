# Campus map: "Find your way"

`map/` is a separate page: pick **You are at** + **Going to**, and it draws the shortest
walking route on the campus map with step-by-step directions ("Walk about 50 m, then turn right").

> ⚠️ **Demo layout.** Everything in `data.js` is made up for testing. It is **not** the real
> Garissa University campus. The page shows a yellow "Demo layout" banner and is **not linked**
> from the tour until real data replaces it.

## Files

| File | What |
|---|---|
| `data.js` | The campus: places, path junctions, paths, buildings (the only file to edit for the real map) |
| `map.js` | Route-finding (shortest path), drawing, directions. No changes needed for new data |
| `map.css` | Map styling |
| `index.html` | The page |

Text lives in `js/i18n.js` under `map.*`.

## Link presets

`map/?from=gate-a&to=admissions` opens with both choices filled in.
**Idea:** a small QR at each gate opening `map/?from=gate-a` means visitors only pick a destination.

## Replacing the demo with the real campus

1. **Get a base plan.** Ask the administration / estates office for the official campus plan.
   (Don't trace from Google Maps imagery; its terms don't allow it.)
2. **Walk it.** Walk every main path. Note each junction and roughly measure distances
   (a step count, or a phone GPS/fitness app). Agree on place names with the administration.
3. **Fill `data.js`** in metres (x = east, y = south, from the top-left corner of the plan):
   - `nodes`: each **place** (`kind: "place"` + `name`) and each **junction** (`kind: "junction"`).
     Put a place's dot at its **entrance**, on the path.
   - `edges`: one `["a", "b"]` per path segment between two nodes. Only paths people can really walk.
   - `blocks`: building outlines for drawing (leave `label` empty if a place dot already names it).
4. **Test on foot.** Pick at least 5 routes, follow the directions on a phone, and check every turn.
5. **Go live.** Set `demo: false`, ask Khadijun to add a "Find your way" button on the tour,
   and (optionally) print gate QRs with `?from=…`.
