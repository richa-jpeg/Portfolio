/* ============================================================
   MYFITNESS CASE STUDY — #/linkedin

   Two pieces of campaign work, stacked and scrolled:
   • the landing page, shown whole
   • the Meta Ads set, as a carousel

   There is no device here any more. This page used to be an interactive tablet
   running a mock LinkedIn feed — working Like and Follow buttons — flanked by
   annotation cards. All of that is gone. The work being shown is the artwork,
   and a mock-up standing in front of it was in the way.

   Because there is no mock-up, there is nothing for a picked-up object to fly
   into, so `usePickFlight` is given no device: it still claims the pick, which
   is what sends the back link to the table rather than to the board.

   Every image is `loading="lazy"` except the first. That is not a nicety here:
   the landing board alone is a 11133×4905 PNG, and fifteen ads sit behind it.
   ============================================================ */
import { useRef, useState } from 'react';
import { myfitness } from './content.jsx';
import { gsap, EASE } from './lib/gsapSetup.js';
import { useGsapContext } from './lib/useGsap.js';
import { usePickFlight } from './lib/usePickFlight.js';

export default function LinkedInCase() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const [slide, setSlide] = useState(0);

  const { picked } = usePickFlight('linkedin', null);

  const { landing, ads } = myfitness;
  const count = ads.images.length;

  useGsapContext(
    rootRef,
    (el) => {
      const blocks = gsap.utils.toArray('.mf-block', el);
      if (!blocks.length) return;
      gsap.from(blocks, {
        y: 34,
        opacity: 0,
        duration: 0.9,
        ease: EASE.soft,
        stagger: 0.14,
      });
    },
    []
  );

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const cell = track.children[Math.max(0, Math.min(count - 1, i))];
    if (cell) track.scrollTo({ left: cell.offsetLeft, behavior: 'smooth' });
  };

  /* The row can also be swiped or scrolled with a trackpad, so the counter
     follows the scroll position rather than the last button pressed —
     otherwise the two disagree the moment anyone drags it. */
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const step = track.scrollWidth / count;
    if (!step) return;
    setSlide(Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / step))));
  };

  return (
    <main className="case-page case-table" ref={rootRef}>
      {/* Back goes to the table when the visitor got here by picking the tablet
          up, so they land where they left off rather than at the top of the
          board. A deep link has no table behind it. */}
      <a className="case-back" href={picked ? '#/phone' : '#/'}>
        {picked ? '← Back to the table' : '← Back to work'}
      </a>

      <div className="mf-page">
        <section className="mf-block">
          <h2 className="mf-title">{landing.title}</h2>
          <figure className="mf-figure">
            <img
              src={landing.image}
              alt="The breakfast range landing page, shown across a laptop, a tablet and a phone"
              width={landing.width}
              height={landing.height}
              decoding="async"
            />
          </figure>
        </section>

        <section className="mf-block">
          <h2 className="mf-title">{ads.title}</h2>

          <div className="mf-carousel">
            {/* Focusable, so the row can be stepped with the arrow keys — the
                documented way to keep a scroll region reachable by keyboard. */}
            <div
              className="mf-track"
              ref={trackRef}
              onScroll={onScroll}
              tabIndex={0}
              role="group"
              aria-label={`${ads.title}, ${count} creatives`}
            >
              {ads.images.map((src, i) => (
                <figure className="mf-ad" key={src}>
                  <img
                    src={src}
                    alt={`Meta ad creative ${i + 1} of ${count}`}
                    width={ads.width}
                    height={ads.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>

            <div className="mf-controls">
              <button
                onClick={() => goTo(slide - 1)}
                disabled={slide <= 0}
                aria-label="Previous creative"
              >
                ←
              </button>
              <span className="mf-count">
                {slide + 1} / {count}
              </span>
              <button
                onClick={() => goTo(slide + 1)}
                disabled={slide >= count - 1}
                aria-label="Next creative"
              >
                →
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
