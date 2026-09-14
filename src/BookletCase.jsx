/* ============================================================
   BOOKLET CASE STUDY — #/booklet
   Powered by the react-pageflip npm package (wrapper around the
   MIT "page-flip" library) instead of custom flip code. It works
   like a real book: each open frame shows a two-page spread
   (left + right), every leaf is printed on both sides and the
   library animates the page turn (drag / click / arrows).
   Content: `booklet.leaves` in content.jsx — each leaf has a
   printed `front` and `back`.
   ============================================================ */
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { booklet } from './content.jsx';
import { FigNote } from './components.jsx';

/* One printed side rendered as a flipbook page. forwardRef is required:
   react-pageflip collects the page DOM nodes through refs. */
const PageFace = forwardRef(function PageFace({ item, num }, ref) {
  const fly = !!item.fly;
  return (
    <div ref={ref} className={`fb-page${fly ? ' fly' : ''}${item.titlePage ? ' bk-titlepage' : ''}`}>
      {fly ? (
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

export default function BookletCase() {
  const [entered, setEntered] = useState(false);
  const [cur, setCur] = useState(0);      // current page (from the onFlip event)
  const bookRef = useRef(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const { leaves, notes } = booklet;

  /* Build the flat printed pages: front endpaper, then each leaf's
     front + back print, then the back endpaper. Children must keep a
     stable identity so react-pageflip never re-initialises. */
  const pages = useMemo(() => {
    const list = [{ fly: true, emoji: '🌿', label: booklet.brand, note: 'brand booklet' }];
    leaves.forEach((leaf, li) => {
      list.push({ ...leaf.front, titlePage: li === 0 || leaf.front.titlePage });
      list.push({ ...leaf.back });
    });
    list.push({ fly: true, emoji: '🖐️', label: 'The end', note: 'thanks for reading — back to the board' });
    return list;
  }, [leaves]);

  /* Stable JSX children — react-pageflip compares props.children and would
     rebuild the book if we recreated them on every state change. */
  const pageEls = useMemo(
    () => pages.map((p, i) => <PageFace key={i} item={p} num={p.fly ? null : i} />),
    [pages]
  );

  const flip = (dir) => {
    const api = bookRef.current && bookRef.current.pageFlip ? bookRef.current.pageFlip() : null;
    if (!api) return;
    try {
      if (dir === 'next') api.flipNext();
      else api.flipPrev();
    } catch (e) { /* already at the edge of the book — ignore */ }
  };

  const maxPage = pages.length - 1;
  const spreadCount = Math.max(1, Math.ceil(pages.length / 2));
  const curSpread = Math.min(Math.floor(cur / 2) + 1, spreadCount);

  return (
    <main className="case-page case-table">
      <a className="case-back" href="#/">← Back to the board</a>

      <div className={`case-layout${entered ? ' in' : ''}`}>
        {/* ---------- notes · left ---------- */}
        <aside className="case-notes case-notes-left" aria-label="Design notes">
          <span className="case-notes-label">{notes.leftLabel}</span>
          {notes.left.map((n, i) => (
            <FigNote
              key={n.title}
              color={n.color}
              rotate={n.rotate}
              className="case-note"
              style={{ transitionDelay: `${0.45 + i * 0.12}s` }}
            >
              {n.sticker ? <span className="case-note-emoji" aria-hidden="true">{n.sticker}</span> : null}
              <strong>{n.title}</strong>
              <p>{n.text}</p>
            </FigNote>
          ))}
        </aside>

        {/* ---------- the book on the table ---------- */}
        <div className="booklet-column">
          <div className="booklet">
            <div className="fb-shell">
              <HTMLFlipBook
                ref={bookRef}
                width={300}
                height={400}
                size="stretch"
                minWidth={260}
                maxWidth={880}
                minHeight={340}
                maxHeight={660}
                className="fb-book"
                flippingTime={950}
                drawShadow
                mobileScrollSupport
                showCover={false}
                usePortrait={false}
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

        {/* ---------- notes · right ---------- */}
        <aside className="case-notes case-notes-right" aria-label="Results">
          <span className="case-notes-label">{notes.rightLabel}</span>
          {notes.right.map((n, i) => (
            <FigNote
              key={n.title}
              color={n.color}
              rotate={n.rotate}
              className="case-note"
              style={{ transitionDelay: `${0.55 + i * 0.12}s` }}
            >
              {n.sticker ? <span className="case-note-emoji" aria-hidden="true">{n.sticker}</span> : null}
              <strong>{n.title}</strong>
              <p>{n.text}</p>
            </FigNote>
          ))}
        </aside>
      </div>
    </main>
  );
}
