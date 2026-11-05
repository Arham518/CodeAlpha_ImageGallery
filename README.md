# ApexSnap

ApexSnap is a responsive image gallery built with plain HTML, CSS and JavaScript — no framework, no build step. It started as my CodeAlpha internship task and grew into a full gallery with a motion layer focused on the photos themselves.

## Features
- **Hero slider** with auto-play, arrows, indicators and a slow Ken Burns zoom on each slide
- **150-image masonry grid** across five categories (Nature, Architecture, Technology, Travel, Animals)
- **Category filters + live search** by title or category
- **Lightbox** with next/previous, keyboard controls (← → Esc), click-to-zoom, and a zoom-from-thumbnail opening
- **Gallery motion:** staggered blur-to-sharp scroll reveals, 3D hover tilt with inner image parallax, light-sweep on hover, smooth filter transitions, ripple filter buttons, scroll progress bar, shrinking navbar, hero parallax and an intro curtain
- Respects `prefers-reduced-motion`

## Run it
Open `index.html` in a browser, or serve the folder:
```bash
npx serve .
```

## Files
| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | Layout and base styling |
| `script.js` | Data, slider, filters, search, lightbox |
| `animations.css` / `animations.js` | ApexSnap motion layer |
| `favicon.svg` | Brand icon |

Images are loaded from Picsum and Unsplash.

## Author
Muhammad Arham
