# FigJam Portfolio

A playful one-page portfolio that looks like a FigJam board — sticky notes, stickers, tape, pen doodles and arrows — built with **React + Vite**, plain CSS, and zero runtime dependencies beyond React.

## What's on the board

| # | Section | FigJam pieces |
|---|---------|---------------|
| 1 | **About me** | Pen doodles, stickers, a big sticky note, taped photo |
| 2 | **Work experience** | Sticky notes connected by hand-drawn arrows |
| 3 | **Projects I'm proud of** | Images taped to the board with a note — click to open the project. The **Instagram posts** card opens a full case-study page (`#/instagram`). |
| 4 | **More projects** | Smaller taped cards (4-up grid) |
| 5 | **Contact me** | Note with your email + sticker-style social links |

## Instagram case study (`#/instagram`)

Tap the **Instagram posts** card under *Projects I'm proud of*:

- A **phone zooms in to fit the screen** (FigJam-style pop animation) and shows a working Instagram-style profile UI: header, stats, bio, highlights and a 3-column post grid.
- **Click any post** for a lightbox — images and videos, with caption/likes.
- **Sticky notes on the left and right** of the phone explain the design decisions.
- Everything is editable in `src/content.jsx` under `export const instagram = { … }`:
  - `account` — handle, name, avatar emoji + gradient, stats, bio, highlights.
  - `posts` — add/replace with real photos or videos (URLs or imported files; videos get a ▶ badge and lazy-load nothing until opened).
  - `notes.left` / `notes.right` — the sticky notes around the phone.

Navigation uses a tiny hash router (no dependency): `#/` = board, `#/instagram` = case study. Works on GitHub Pages with no server config.

## Movement & zoom (FigJam-ish, but bounded)

- **Vertical scroll is the only movement** — content is laid out top-to-bottom and the page never scrolls past the content.
- **No infinite canvas.** Horizontal movement is disabled (`overflow-x: hidden`, `touch-action: pan-y`).
- **Bounded zoom (60%–150%)** with `⌘/Ctrl + scroll` or the bottom-left controls. Plain scrolling never zooms, so normal page reading stays natural.

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Where to edit things

- **Content (all of it)** → `src/content.jsx` — your name, notes, experience, projects, links, socials, and the Instagram case study.
- **Theme / colors / fonts** → CSS variables at the top of `src/styles.css`.
- **Component styles** → `src/components.jsx` + `src/styles.css`.

### Using real images

The project cards use tiny inline-SVG placeholders so the page makes zero network requests. To use real screenshots, drop files in `src/images/` and import them in `src/content.jsx`:

```jsx
import workImg from './images/work.png';
// then in the featured array:
image: workImg,
```

Vite bundles and content-hashes images automatically, which is ideal for caching on GitHub Pages.

## Deploy to GitHub Pages

The build uses `base: './'` (relative asset paths), so the site works at `username.github.io/repo/` with no extra config.

**Option A — GitHub Actions (recommended, already included):**
`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`.
1. Push this repo to GitHub.
2. In **Settings → Pages**, set *Source* to **GitHub Actions**.
3. Push to `main` — the site goes live at `https://<username>.github.io/<repo>/`.

**Option B — manual:**
```bash
npm run build
# push the contents of dist/ to the gh-pages branch:
npx gh-pages -d dist   # or: git subtree push --prefix dist origin gh-pages
```

## Performance notes (why it's fast on Pages)

- Single small React bundle (~50 KB gzipped); no UI libraries, no webfonts (system handwriting fonts).
- All doodles and placeholder art are inline SVG/data-URIs → zero extra requests.
- Project images lazy-load (`loading="lazy" decoding="async"`).
- Zoom runs on GPU `transform`; scroll area is resized to match so there's no jank or over-scroll.
- `prefers-reduced-motion` respected throughout.
