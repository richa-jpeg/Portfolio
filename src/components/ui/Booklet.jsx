/* ============================================================
   BOOKLET DEVICE — the flipbook itself, without the case page around it.

   Extracted from ImBesharamBookletCase (#/imBesharamBooklet) so the
   showcase at #/imBesharam can stand the same booklet on its second scroll
   view. The page keeps the notes, the back link and the pick-up flight;
   this file owns the book, its turn controls and their state.

   `deviceRef`, when passed, is attached to `.booklet` — the element the
   pick flight measures in lib/usePickFlight.js — NOT to `.booklet-column`,
   whose height includes the controls.

   Powered by the react-pageflip npm package (wrapper around the MIT
   "page-flip" library). Each open frame shows a two-page spread, every
   leaf is printed on both sides and the library animates the turn.

   Content comes from one of two places:
   - by default, `booklet.leaves` in content.jsx — text pages built from a
     leaf's `front` and `back` (used by #/imBesharamBooklet);
   - a `pages` prop — a flat list of printed faces, including pages that are
     a single piece of artwork (`{ image, alt }`). #/imBesharam passes the
     zine's real pages here, with `showCover` so the cover opens closed.
   ============================================================ */
import { forwardRef, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { booklet } from '../../content.jsx';

/* One printed side rendered as a flipbook page. forwardRef is required:
   react-pageflip collects the page DOM nodes through refs. */
const PageFace = forwardRef(function PageFace({ item, num }, ref) {
  const fly = !!item.fly;
  const classes = ['fb-page'];
  if (fly) classes.push('fly');
  if (item.titlePage) classes.push('bk-titlepage');
  if (item.image) classes.push('bk-imagepage');

  return (
    <div ref={ref} className={classes.join(' ')}>
      {item.image ? (
        /* A printed page that is a single piece of artwork. It fills the
           sheet edge to edge — the page carries its own margins and folios. */
        <img src={item.image} alt={item.alt || ''} draggable="false" />
      ) : fly ? (
        <>
          <span className="bf-fly-emoji" aria-hidden="true">{item.emoji}</span>
          <span className="bf-fly-brand">{item.label}</span>
          <small className="bf-fly-note">{item.note}</small>
        </>
      ) : (
        <>
          {num ? <span className="bf-page-num" aria-hidden="true">{num}</span> : null}
          <span className="bf-emoji" aria-hidden="true">{item.emoji}</span>
          <h2 className="bf-title">{item.title}</h2>
          {item.subtitle ? <p className="bf-subtitle">{item.subtitle}</p> : null}
          {item.lines ? (
            <div className="bf-lines">
              {item.lines.map((l) => <p key={l}>{l}</p>)}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
});

export default function BookletDevice({
  deviceRef,
  portrait = false,
  pages: customPages,
  showCover = false,
  pageWidth = 300,
  pageHeight = 400,
}) {
  const [cur, setCur] = useState(0);      // current page (from the onFlip event)
  const bookRef = useRef(null);

  const { leaves } = booklet;

  /* Build the flat printed pages when no custom list is supplied: front
     endpaper, then each leaf's front + back print, then the back endpaper.
     Children must keep a stable identity so react-pageflip never
     re-initialises. A custom list is its own flat list already. */
  const bookPages = useMemo(() => {
    if (customPages) return customPages;

    const list = [{ fly: true, emoji: '🌿', label: booklet.brand, note: 'brand booklet' }];
    leaves.forEach((leaf, li) => {
      list.push({ ...leaf.front, titlePage: li === 0 || leaf.front.titlePage });
      list.push({ ...leaf.back });
    });
    list.push({ fly: true, emoji: '🖐️', label: 'The end', note: 'thanks for reading — back to the board' });
    return list;
  }, [customPages, leaves]);

  /* Stable JSX children — react-pageflip compares props.children and would
     rebuild the book if we recreated them on every state change. Artwork
     pages print their own folios, so they carry no generated number. */
  const pageEls = useMemo(
    () => bookPages.map((p, i) => (
      <PageFace key={i} item={p} num={p.fly || p.image ? null : i} />
    )),
    [bookPages]
  );

  const flip = (dir) => {
    const api = bookRef.current && bookRef.current.pageFlip ? bookRef.current.pageFlip() : null;
    if (!api) return;
    try {
      if (dir === 'next') api.flipNext();
      else api.flipPrev();
    } catch (e) { /* already at the edge of the book — ignore */ }
  };

  const maxPage = bookPages.length - 1;
  const spreadCount = Math.max(1, Math.ceil(bookPages.length / 2));
  const curSpread = Math.min(Math.floor(cur / 2) + 1, spreadCount);

  /* The library always lays the book out two pages wide. A lone hard sheet —
     the closed front cover, the back cover — therefore sits in one half of
     that block, and the book reads as off-centre. Nudging the shell by half a
     page (a quarter of the block) puts the lone sheet back on the midline; an
     open spread uses the full block, so it stays at 0. Portrait shows one page
     per frame at full width and needs no correction. */
  const loneSheet = showCover && !portrait && (cur === 0 || cur === maxPage);
  const shellShift = loneSheet ? (cur === 0 ? -25 : 25) : 0;

  return (
    <div className="booklet-column">
      <div className="booklet" ref={deviceRef}>
        {/* `data-lenis-prevent-touch` tells Lenis to ignore touch
            events that start here. Without it, dragging a page to
            turn it scrolls the page instead — the flipbook and the
            smooth-scroll layer both claim the same gesture. */}
        <div
          className="fb-shell"
          style={shellShift ? { translate: `${shellShift}% 0` } : undefined}
          data-lenis-prevent-touch
          data-lenis-prevent
        >
          <HTMLFlipBook
            ref={bookRef}
            width={pageWidth}
            height={pageHeight}
            size="stretch"
            minWidth={260}
            maxWidth={880}
            minHeight={340}
            maxHeight={660}
            className="fb-book"
            flippingTime={950}
            drawShadow
            mobileScrollSupport
            showCover={showCover}
            usePortrait={portrait}
            onFlip={(e) => {
              if (typeof e.data === 'number') {
                setCur(Math.max(0, Math.min(e.data, maxPage)));
              }
            }}
          >
            {pageEls}
          </HTMLFlipBook>
        </div>
      </div>

      {/* ---------- page-turn controls ---------- */}
      <div className="booklet-controls">
        <button onClick={() => flip('prev')} disabled={cur <= 0} aria-label="Previous page">←</button>
        <span className="booklet-count">{curSpread} / {spreadCount}</span>
        <button onClick={() => flip('next')} disabled={cur >= maxPage} aria-label="Next page">→</button>
      </div>
    </div>
  );
}
