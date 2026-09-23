/* ============================================================
   CURTAIN REVEAL — the Chapter 01 gate.

   This used to be a wipe: a gold panel climbed over a dark backdrop while an
   outlined wordmark on that backdrop dimmed away underneath it. The dark half
   is gone. What is left is the gold chapter card the wipe was revealing — so
   there is now nothing to wipe over, nothing to dim, and nothing to pin. The
   section is a plain full-height gold card, and the only motion left is the
   wordmark landing on it as you reach it.

   `index` and `runway` went with the pin: a runway only means something when
   the section holds the viewport for a distance, and it no longer does.
   ============================================================ */
import { useRef } from 'react';
import { gsap, EASE } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';

export default function CurtainReveal({
  title = ['SELECTED', 'WORK'],
  kicker = 'Chapter 01',
}) {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  useGsapContext(
    sectionRef,
    (el) => {
      const label = el.querySelector('.curtain-label');
      if (!label) return;

      /* `from`, never a CSS resting state that JS has to release: under
         reduced motion useGsapContext skips this block entirely, and the
         wordmark is then simply sitting there legible rather than stranded at
         opacity 0 with nothing left to reveal it. */
      gsap.from(label, {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 1.1,
        ease: EASE.cinematic,
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      });
    },
    [reduced]
  );

  return (
    <section className="chapter chapter-curtain" ref={sectionRef}>
      <div className="stage curtain-stage">
        <div className="curtain-label">
          <span className="text-label curtain-kicker">{kicker}</span>
          <h2 className="text-chapter curtain-title">
            {title.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
