# ApexSnap

A responsive image gallery built with plain **HTML, CSS and JavaScript** — no framework, no build step. It started as a CodeAlpha internship task and grew into a full gallery with a motion layer focused on the photos themselves.

> **Status:** static front-end demo. Images are loaded from Picsum and Unsplash at runtime. Nothing is uploaded or stored.

## What works now vs. simulated vs. planned

| Area | Status |
| --- | --- |
| Hero slider (auto-play, arrows, indicators, Ken Burns zoom) | ✅ Works |
| 150-image masonry grid (Nature, Architecture, Technology, Travel, Animals) | ✅ Works — generated in `script.js`, loaded from Picsum |
| Category filters + live search by title or category | ✅ Works |
| Lightbox (next/prev, ← → Esc, click-to-zoom, zoom-from-thumbnail) | ✅ Works |
| Gallery motion (scroll reveals, 3D hover tilt, light-sweep, filter transitions, progress bar, intro curtain) | ✅ Works — `animations.css` / `animations.js` |
| `prefers-reduced-motion` | ✅ Honoured |
| Local image hosting / CMS / user uploads | 🗓 Not in scope for this demo |

## Setup

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or: python -m http.server 8080
```

No `npm install` required. Network access is needed for the Picsum / Unsplash image URLs.

## Project structure

```
index.html       page structure
styles.css       layout and base styling
script.js        gallery data, slider, filters, search, lightbox
animations.css   ApexSnap motion layer styles
animations.js    scroll reveals, tilt, curtain, progress bar
favicon.svg      brand icon
```

## Known limitations

- Gallery tiles depend on third-party image CDNs; offline use will show broken images.
- Titles are generated (`ApexSnap Nature Collection N`); they are not real photo captions.
- There is no build pipeline, tests, or deploy config in this repo.

## Roadmap

1. Optional local/static image set so the demo works offline
2. Real captions and credit links per photo
3. Lightweight build step only if a host requires it

## Security

No secrets, env files or backend. Static files only.

## Author

Muhammad Arham · [GitHub Arham518](https://github.com/Arham518)
