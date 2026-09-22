/* ============================================================
   FEATURED — the pinned rail.

   Four device cards scrub horizontally past a fixed index while the
   section is pinned. Each card's focus (scale / blur / opacity) is
   derived from the rail's own scalar progress, NOT from a per-card
   tween — same reasoning as the warp tunnel: a value derived from one
   progress number is stateless, so scrubbing backwards looks exactly
   like scrubbing forwards.

   Two things here are load-bearing and easy to get wrong:

   • `end` and `x` are FUNCTIONS. The rail's width depends on text
     metrics, and @fontsource ships `font-display: swap`, so the width
     at mount is the width with the fallback face. A number computed
     once would freeze at that and the rail would stop short (or
     overshoot) the moment the real font swapped in.

   • The track must be `width: max-content`. With `width: 100%` and
     flexible children, scrollWidth === clientWidth, distance is 0,
     and the rail silently doesn't move at all.
   ============================================================ */
import { useRef } from 'react';
import { featured } from '../../content.jsx';
import { gsap } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { clamp } from '../../lib/math.js';
import WorkCard from '../ui/WorkCard.jsx';

export default function Featured() {
  const sectionRef = useRef(null);
  const countRef = useRef(null);

  useGsapContext(sectionRef, (el) => {
    const track = el.querySelector('.rail-track');
    const cards = gsap.utils.toArray('.rail-card', el);
    const fill = el.querySelector('.rail-fill');
    const total = cards.length;
    if (!track || !total) return;

    /* Travel = the gap between the first and last card's layout
       positions, which is exactly (N-1) × (card + gap) given the
       track's symmetric end padding.
       `offsetLeft`, not getBoundingClientRect: each card carries a
       GSAP `scale`, and a rect would report the scaled width, so the
       distance would shrink as cards fell out of focus. offsetLeft is
       a pure layout value and ignores transforms. */
    const distance = () =>
      Math.max(0, cards[total - 1].offsetLeft - cards[0].offsetLeft);

    const mm = gsap.matchMedia();

    mm.add(
      '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
      () => {
        /* Cached once: the blur goes on the device object only, not on
           the whole card. Blurring the card would take the title and
           description with it and make them unreadable at exactly the
           moment the reader is deciding which one to open. */
        const objects = cards.map((c) => c.querySelector('.rail-thumb'));

        const update = (progress) => {
          cards.forEach((card, i) => {
            /* How far this card is from the centre of the viewport,
               measured in "card steps" — 0 centred, 1 a full step away. */
            const centre = total > 1 ? i / (total - 1) : 0;
            const away = Math.abs(progress - centre) * (total - 1);
            const focus = clamp(1 - away, 0, 1);

            gsap.set(card, {
              scale: 0.9 + focus * 0.1,
              opacity: 0.45 + focus * 0.55,
              zIndex: Math.round(focus * 10),
            });
            if (objects[i]) {
              gsap.set(objects[i], {
                filter: `blur(${((1 - focus) * 6).toFixed(2)}px)`,
              });
            }
          });

          if (fill) gsap.set(fill, { scaleX: progress });
          if (countRef.current) {
            const n = Math.min(total, Math.round(progress * (total - 1)) + 1);
            countRef.current.textContent = String(n).padStart(2, '0');
          }
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            pin: el.querySelector('.rail-stage'),
            pinSpacing: true,
            anticipatePin: 1,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => update(tl.progress()),
        });

        tl.to(track, { x: () => -distance(), ease: 'none' }, 0);

        /* Cards start scattered toward the centre; the first paint
           should already be in the focused state, not the default. */
        update(0);

        return () => {
          /* matchMedia reverts anything created inside this scope,
             including the pin, when the query stops matching. */
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="chapter chapter-featured" id="work" ref={sectionRef}>
      <div className="stage rail-stage">
        <header className="rail-head">
          <span className="text-label">Section 01 — Selected work</span>
          <span className="rail-counter text-mono">
            <span ref={countRef}>01</span>
            <span className="rail-counter-sep">/</span>
            <span>{String(featured.length).padStart(2, '0')}</span>
          </span>
        </header>

        <div className="rail-viewport">
          <div className="rail-track">
            {featured.map((p) => (
              <WorkCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        <div className="rail-progress" aria-hidden="true">
          <span className="rail-fill" />
        </div>
      </div>
    </section>
  );
}
