# Richa — Visual Motion Designer

A cinematic, scroll-driven portfolio. Near-black canvas, tight display
type, gold accent, and chapters that pin and scrub as you move through
them.

Built with **React + Vite**, **GSAP + ScrollTrigger** for the scroll
choreography, and **Lenis** for inertial scrolling. Hand-written CSS — no
UI framework.

## The page

| Chapter | What happens |
|---|---|
| **Hero** | A question types itself out in mono, dims back — then the answer arrives as a per-character wave, each glyph rising out of its mask and un-squashing as it lands, with a gold bloom opening behind it. |
| **01 · Selected Work** | A gold curtain wipes up over a receding backdrop, carries the chapter wordmark, then lifts away to reveal the rail. |
| **Featured rail** | A carousel: the page scrolls past it normally and the cards move left and right by drag, swipe, the arrows, the dots or the arrow keys, snapping card to card. The card you're looking at sharpens and lifts; its neighbours fall back on scale, blur and opacity. Each opens its case study. |
| **02 · The Craft** | A tunnel of gold wireframes flies past the camera and blows out into a flash that hands off to the next chapter. |
| **About** | Statement type, resolved word by word behind a mask. |
| **Experience** | Credits as panels that peel up from a bottom-left hinge, each pinning while the next scrolls over it. |
| **03 · Field of Stills** | A wall of stills that blows out of focus on the way in, snaps sharp at the midline, and blows back out. Below it, a marquee driven by page scroll rather than a timer. |
| **04 · Contact** | A pointer-tracked 3D tilt card with a gold sheen, then a giant ghosted wordmark in the footer. |

Plus fixed chrome throughout: a scroll progress rule, a custom cursor, a
film-grain overlay, and a chapter-numbered nav that tracks the active
section.

## Case studies

One page per project, each on its own route. Every route string lives in
`routes` in `src/content.jsx` — the rail card, the routing table, the
pick-up flight and the back links all read from there, because a route
string written twice is one that can silently disagree with itself.

| Route | Project | What it is |
|---|---|---|
| `#/myFitness` | My Fitness | Two blocks of campaign artwork: the landing board, then the Meta Ads row. |
| `#/imBesharam` | ImBesharam | The table: a phone, a tablet and a booklet on a lit surface with a prompt to pick one up. |
| `#/imBesharamPhone` | ImBesharam | The Instagram-style phone off that table; tap a post for a lightbox. |
| `#/imBesharamTablet` | ImBesharam | The tablet off that table, running a feed with working Like and Follow. |
| `#/imBesharamBooklet` | ImBesharam | The booklet off that table, with a real 3D page-turn. |
| `#/jaigarhHeritageFestival` | Jaigarh Heritage Festival | The festival's own phone — the same shell, its own feed. |
| `#/millimetre` | Millimetre | Empty on purpose; the route and the card are in place for the work. |

The three ImBesharam objects are picked up and flown into their case page
(`lib/pickTransition.js` + `lib/usePickFlight.js`), and the back link on
those pages returns to the table rather than to the board.

Routing is hash-based (no router dependency), so it works on GitHub Pages
with no server config.

## Quick start

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Where to edit things

- **All copy** → `src/content.jsx`. Name, role, reel, chapters, credits,
  stills, socials, the routes, and the four case studies. Placeholders are
  marked `TODO` — replace them before publishing.
- **Palette and type scale** → `src/styles/tokens.css` (`:root`).
- **Chapters** → `src/components/chapters/`.
- **Scroll/tilt/marquee effects** → `src/components/effects/`.

The case-study exports in `content.jsx` are each headed with the page that
reads them, and keep a fixed shape — edit their values freely, but renaming
their keys will break those components. `phoneApp` is unused.

## How the scroll architecture works

The **document** is the scroller; Lenis drives it from the GSAP ticker, so
scroll and animation share one clock.

Every pinned chapter follows one skeleton: a `100svh` stage is the pin
target, `end: '+=N%'` supplies the runway, and all animation hangs off a
single 0→1 progress. Two rules matter more than they look:

- **Nothing is pre-hidden in CSS.** Initial states are set by GSAP. That
  way `prefers-reduced-motion` can skip GSAP entirely (see
  `useGsapContext`) and the page renders in its natural, final state
  rather than leaving elements invisible.
- **No transformed ancestor above a pinned section.** ScrollTrigger pins
  with `position: fixed` when the viewport is the scroller, and a
  transformed ancestor becomes that element's containing block — every
  pin would land in the wrong place.

The Selected Work rail is the one chapter that does **not** pin. It used
to scrub horizontally off the page's vertical scroll, which cost a full
screen of scrolling before the page moved on; it is a carousel now, moved
directly by drag, swipe, the arrows, the dots and the arrow keys. Its
per-card focus is derived from the track's single translation value rather
than tweened per card, so a drag frame and an animation frame are the same
frame and moving the rail either way looks identical.

## Performance notes

- Fonts are self-hosted via `@fontsource-variable` (Inter Tight +
  JetBrains Mono) — no third-party requests, and only the needed
  unicode-range subsets download.
- Images lazy-load; the case-study UIs are pure CSS, no screenshots.
- `prefers-reduced-motion` disables Lenis, all pinning, the hero typing
  and the custom cursor in one place.
- The custom cursor and 3D tilt write to transforms/ CSS variables
  directly rather than through React state, so pointer movement never
  re-renders the tree.

## Deploy

`vite.config.js` sets `base: './'`, so relative asset paths work from any
GitHub Pages URL (`username.github.io/repo/`) with no extra config.

`dist/` is committed to this repository and is the deployed artifact —
**run `npm run build` and commit the result** after changing anything
under `src/`.

> Note: this README previously described a `.github/workflows/deploy.yml`
> that does not exist in the repo. The committed `dist/` is the actual
> deploy path.
