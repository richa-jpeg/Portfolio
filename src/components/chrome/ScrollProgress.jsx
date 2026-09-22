/* ============================================================
   SCROLL PROGRESS — a 2px gold rule across the top of the viewport.

   `transform-origin: left` is essential: the default origin is the
   centre, so scaling would grow the bar outwards from the middle in
   both directions instead of filling left-to-right.
   ============================================================ */
import { useRef } from 'react';
import { gsap } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';

export default function ScrollProgress() {
  const barRef = useRef(null);
  const reduced = useReducedMotion();

  useGsapContext(
    barRef,
    (el) => {
      const bar = el.querySelector('.progress-bar');
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        }
      );
    },
    [reduced]
  );

  return (
    <div className="progress-track" ref={barRef} aria-hidden="true">
      <div className="progress-bar" />
    </div>
  );
}
