/* ============================================================
   FEATURED — the carousel.

   The rail used to be pinned while the page's vertical scroll scrubbed
   it sideways, so the section ate a full screen of scrolling before the
   page moved on. It is a real carousel now: the page scrolls past it
   normally and the cards are moved directly — drag, swipe, the arrows,
   the dots, or the arrow keys once focus is inside the rail.

   ONE SCALAR DRIVES EVERYTHING. `state.x` is the track's translation,
   and each card's focus (scale / opacity / blur) is DERIVED from it
   rather than tweened per card. A drag frame and a tween frame are
   therefore the same frame: there is no per-card animation state that
   could drift out of step with the track's position, so moving the rail
   back and forth looks identical in both directions.

   Three things here are load-bearing and easy to get wrong:

   • `offsetLeft`, not getBoundingClientRect. Each card carries a
     scale, and a rect reports the SCALED width, so the travel distance
     would shrink as cards fell out of focus. offsetLeft is a pure
     layout value and ignores transforms.

   • The geometry is re-read on every move and on every resize rather
     than cached. Card width and gap are `vw` clamps, so a number
     measured at mount leaves the rail stopping short of — or
     overshooting — the last card after any resize.

   • `touch-action: pan-y` on the viewport (see chapters.css). Without
     it the browser claims a horizontal touch drag as a pan, fires
     `pointercancel`, and the swipe dies halfway through.

   Below 900px the whole thing is off: the rail is a plain vertical
   column, the controls are hidden, and `state.on` is false so none of
   the handlers do anything.
   ============================================================ */
import { useLayoutEffect, useRef, useState } from 'react';
import { featured } from '../../content.jsx';
import { gsap } from '../../lib/gsapSetup.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';
import { clamp } from '../../lib/math.js';
import WorkCard from '../ui/WorkCard.jsx';

/* Must match the breakpoint in chapters.css that collapses the rail
   into a column. Two sources for one number, but the alternative —
   driving the layout from JS — would mean the rail reflows a frame
   after the rest of the page. */
const LAYOUT_QUERY = '(min-width: 900px)';

/* How far a drag has to travel, as a fraction of one card step, before
   releasing commits to the next card instead of settling back. */
const COMMIT = 0.18;

/* A flick faster than this (px/ms) commits even when it barely moved —
   the short, sharp swipe that would otherwise never leave its card. */
const FLICK = 0.4;

/* Pointer travel below this is a click on a card, not a drag. */
const SLOP = 4;

export default function Featured() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  /* The engine lives in a ref. pointermove fires at pointer rate and
     none of it belongs in React state — only the committed index does,
     because only that changes what the controls render. */
  const api = useRef({ goTo: () => {}, goBy: () => {} });

  /* Layout effect, not effect: the first paint must already be the
     focused state. Running after paint would flash all four cards
     equally sharp for a frame before the centre one took focus. */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return undefined;

    const cards = Array.from(track.querySelectorAll('.rail-card'));
    const thumbs = cards.map((card) => card.querySelector('.rail-thumb'));
    const count = cards.length;
    if (!count) return undefined;

    const mq = window.matchMedia(LAYOUT_QUERY);

    const state = {
      on: false, // carousel mode; false below the breakpoint
      index: 0,
      x: 0,
      tween: null,
      drag: null,
      /* A drag that ends on a card still fires a click. Left alone it
         would open whichever project the pointer happened to land on,
         so the click that follows a drag is swallowed. */
      eaten: false,
    };

    /* ---------- geometry ----------
       Card i sits dead centre at x = -(card i's offset from card 0),
       because the track's end padding is (50vw - card/2): at x = 0 the
       first card is already centred, and the last card's offset is the
       full travel distance. */
    const offsetFor = (i) => (i <= 0 ? 0 : cards[i].offsetLeft - cards[0].offsetLeft);
    const span = () => offsetFor(count - 1);

    /* ---------- the single write ---------- */
    const paint = () => {
      const distance = span();
      const progress = distance > 0 ? clamp(-state.x / distance, 0, 1) : 0;

      track.style.transform = `translate3d(${state.x.toFixed(2)}px, 0, 0)`;

      cards.forEach((card, i) => {
        const centre = count > 1 ? i / (count - 1) : 0;
        /* How far this card is from the centre of the viewport,
           measured in card steps — 0 centred, 1 a full step away. */
        const away = Math.abs(progress - centre) * (count - 1);
        const focus = clamp(1 - away, 0, 1);

        card.style.transform = `scale(${(0.9 + focus * 0.1).toFixed(4)})`;
        card.style.opacity = (0.45 + focus * 0.55).toFixed(3);
        card.style.zIndex = String(Math.round(focus * 10));

        /* The blur goes on the thumbnail only, never on the card: blur
           on the card would take the title and description with it and
           make them unreadable at exactly the moment the reader is
           deciding which one to open. `none` rather than blur(0px) so
           the focused card costs no filter pass at all. */
        const thumb = thumbs[i];
        if (thumb) {
          thumb.style.filter = focus > 0.99 ? 'none' : `blur(${((1 - focus) * 6).toFixed(2)}px)`;
        }
      });
    };

    /* ---------- motion ---------- */
    const glide = (target, duration = 0.75) => {
      state.tween?.kill();
      /* Reduced motion still gets the carousel — it just arrives
         instead of travelling. */
      if (reduced || duration <= 0) {
        state.x = target;
        paint();
        return;
      }
      const proxy = { x: state.x };
      state.tween = gsap.to(proxy, {
        x: target,
        duration,
        ease: 'power3.out',
        onUpdate: () => {
          state.x = proxy.x;
          paint();
        },
      });
    };

    const goTo = (i, duration) => {
      if (!state.on) return;
      const next = clamp(Math.round(i), 0, count - 1);
      state.index = next;
      setIndex(next);
      glide(-offsetFor(next), duration);
    };

    const goBy = (step) => goTo(state.index + step);

    api.current.goTo = goTo;
    api.current.goBy = goBy;

    /* ---------- drag ---------- */
    /* Tracked on the window rather than with setPointerCapture. Capture
       looks like the tidier tool, but it retargets the pointerup to the
       capture element — and the browser then fires the following
       `click` at the nearest common ancestor of the two, i.e. at the
       viewport instead of at the card. A plain click on a card would
       open nothing, silently. Window listeners keep the pointerup on
       the card it started on while still following the pointer out of
       the viewport. */
    const endDrag = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      state.drag = null;
      viewport.classList.remove('is-dragging');
    };

    const onDown = (e) => {
      if (!state.on || state.drag) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      /* Cleared here rather than on a timer: a click that reads this
         flag is always preceded by a pointerdown on the same target,
         while a timer would race the click it is meant to guard. */
      state.eaten = false;
      state.tween?.kill();

      state.drag = {
        id: e.pointerId,
        from: e.clientX,
        origin: state.x,
        dx: 0,
        at: e.timeStamp,
        moved: false,
      };

      /* Also what suppresses text selection mid-drag (see CSS). */
      viewport.classList.add('is-dragging');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onCancel);
    };

    const onMove = (e) => {
      const drag = state.drag;
      if (!drag || e.pointerId !== drag.id) return;

      drag.dx = e.clientX - drag.from;
      if (!drag.moved) {
        if (Math.abs(drag.dx) <= SLOP) return;
        drag.moved = true;
      }

      const distance = span();
      let x = drag.origin + drag.dx;

      /* Past either end the rail pulls and lets go rather than
         travelling as if there were a card there. */
      if (x > 0) x *= 0.35;
      else if (x < -distance) x = -distance + (x + distance) * 0.35;

      state.x = x;
      paint();
    };

    const nearestTo = (x) => {
      let best = 0;
      let bestGap = Infinity;
      for (let i = 0; i < count; i += 1) {
        const gap = Math.abs(offsetFor(i) + x);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      }
      return best;
    };

    const onUp = (e) => {
      const drag = state.drag;
      if (!drag || e.pointerId !== drag.id) return;

      endDrag();

      /* Never moved: a plain click on a card, which is allowed through. */
      if (!drag.moved) return;
      state.eaten = true;

      const distance = span();
      const step = count > 1 ? distance / (count - 1) : 0;
      const elapsed = Math.max(1, e.timeStamp - drag.at);

      /* The card nearest to where the rail was let go of… */
      let next = nearestTo(clamp(state.x, -distance, 0));

      /* …plus a nudge, so a short but decisive drag still changes card
         instead of settling back onto the one it started from. */
      const decisive =
        Math.abs(drag.dx) > step * COMMIT || Math.abs(drag.dx) / elapsed > FLICK;

      if (next === state.index && step > 0 && decisive) {
        next = clamp(state.index + (drag.dx < 0 ? 1 : -1), 0, count - 1);
      }

      goTo(next);
    };

    /* An interrupted gesture (a second finger, the browser taking over)
       has no velocity worth reading, so it just settles back. */
    const onCancel = (e) => {
      if (!state.drag || e.pointerId !== state.drag.id) return;
      endDrag();
      goTo(state.index);
    };

    const onClickCapture = (e) => {
      if (!state.eaten) return;
      state.eaten = false;
      e.preventDefault();
      e.stopPropagation();
    };

    /* The native image drag would otherwise start mid-swipe and strand
       the gesture on a ghost of the thumbnail. */
    const onDragStart = (e) => {
      if (state.on) e.preventDefault();
    };

    /* ---------- keyboard ----------
       Bound to the section so it fires while focus is inside the rail,
       and only then — a global arrow-key handler would fight the page. */
    const onKeyDown = (e) => {
      if (!state.on) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goBy(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBy(-1);
      }
    };

    /* Tabbing to a card that is parked off-screen should bring it into
       view, or the focus ring lands somewhere nobody can see it. */
    const onFocusIn = (e) => {
      if (!state.on || !(e.target instanceof Element)) return;
      const card = e.target.closest('.rail-card');
      const i = card ? cards.indexOf(card) : -1;
      if (i >= 0 && i !== state.index) goTo(i);
    };

    /* ---------- mode + resize ---------- */
    /* Everything written here is ours, not GSAP's — gsap.context cannot
       revert it — so the "off" state and the unmount cleanup both have
       to put the elements back by hand. */
    const reset = () => {
      track.style.transform = '';
      cards.forEach((card, i) => {
        card.style.transform = '';
        card.style.opacity = '';
        card.style.zIndex = '';
        if (thumbs[i]) thumbs[i].style.filter = '';
      });
    };

    const measure = () => {
      if (!state.on) return;
      endDrag();
      glide(-offsetFor(state.index), 0);
    };

    const applyMode = () => {
      state.on = mq.matches;

      if (!state.on) {
        state.tween?.kill();
        endDrag();
        state.x = 0;
        /* Back to 01. The counter stays on screen in column mode, and
           an index left over from a wider viewport would have it
           reporting a position in a list that has no positions. */
        state.index = 0;
        setIndex(0);
        reset();
        return;
      }
      goTo(clamp(state.index, 0, count - 1), 0);
    };

    const ro = new ResizeObserver(measure);

    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onCancel);
    viewport.addEventListener('click', onClickCapture, true);
    viewport.addEventListener('dragstart', onDragStart);
    viewport.addEventListener('focusin', onFocusIn);
    section.addEventListener('keydown', onKeyDown);
    mq.addEventListener('change', applyMode);
    ro.observe(track);

    applyMode();

    return () => {
      state.tween?.kill();
      /* Drops the window listeners too, in case unmount lands
         mid-gesture. */
      endDrag();
      mq.removeEventListener('change', applyMode);
      ro.disconnect();
      viewport.removeEventListener('pointerdown', onDown);
      viewport.removeEventListener('click', onClickCapture, true);
      viewport.removeEventListener('dragstart', onDragStart);
      viewport.removeEventListener('focusin', onFocusIn);
      section.removeEventListener('keydown', onKeyDown);
      reset();
    };
  }, [reduced]);

  const last = featured.length - 1;

  return (
    <section className="chapter chapter-featured" id="work" ref={sectionRef}>
      <div className="stage rail-stage">
        <header className="rail-head">
          <span className="text-label">Section 01 — Selected work</span>
          <span className="rail-counter text-mono">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span className="rail-counter-sep">/</span>
            <span>{String(featured.length).padStart(2, '0')}</span>
          </span>
        </header>

        <div
          className="rail-viewport"
          ref={viewportRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Selected work"
        >
          <div className="rail-track" ref={trackRef}>
            {featured.map((p) => (
              <WorkCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        {/* The dots are the position indicator, so the old scrub bar is
            gone rather than sitting above them saying the same thing. */}
        <div className="rail-controls">
          <button
            type="button"
            className="rail-arrow"
            onClick={() => api.current.goBy(-1)}
            disabled={index === 0}
            aria-label="Previous project"
          >
            <span aria-hidden="true">←</span>
          </button>

          <ol className="rail-dots">
            {featured.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`rail-dot${i === index ? ' is-active' : ''}`}
                  onClick={() => api.current.goTo(i)}
                  aria-label={`Show ${p.title}`}
                  aria-current={i === index ? 'true' : undefined}
                />
              </li>
            ))}
          </ol>

          <button
            type="button"
            className="rail-arrow"
            onClick={() => api.current.goBy(1)}
            disabled={index === last}
            aria-label="Next project"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* The rail moves without a navigation event, so the change is
            announced rather than left to be noticed. */}
        <p className="visually-hidden" aria-live="polite">
          {featured[index]?.title} — {index + 1} of {featured.length}
        </p>
      </div>
    </section>
  );
}
