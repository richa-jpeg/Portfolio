/* ============================================================
   VELOCITY MARQUEE — a text strip whose position is driven by PAGE
   scroll progress, not by a timer.

   That distinction is the whole point: a timer-driven marquee runs
   at a fixed speed no matter what you do, so it reads as a widget.
   Tying it to scroll means it accelerates when you scroll faster and
   stops dead when you stop — it feels like the page has momentum.

   The strip is duplicated so the row never runs out of content as it
   travels.
   ============================================================ */
import { useRef } from 'react';
import { marqueeWords } from '../../content.jsx';
import { gsap } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';

export default function VelocityMarquee() {
  const rootRef = useRef(null);

  useGsapContext(rootRef, (el) => {
    const strip = el.querySelector('.marquee-strip');
    gsap.fromTo(
      strip,
      { xPercent: 2 },
      {
        xPercent: -32,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1 },
      }
    );
  }, []);

  const row = (
    <span className="marquee-row">
      {marqueeWords.map((w) => (
        <span className="marquee-item" key={w}>
          {w}
          <span className="marquee-dot" aria-hidden="true" />
        </span>
      ))}
    </span>
  );

  return (
    <div className="marquee" aria-hidden="true" ref={rootRef}>
      <div className="marquee-strip">
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
