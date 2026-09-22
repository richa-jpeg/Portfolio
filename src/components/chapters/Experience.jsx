/* ============================================================
   EXPERIENCE — credits as peeling panels.

   Each panel is pinned to the viewport (with `pinSpacing: false`, so
   the next one scrolls straight over it) while its inner content
   rotates up from a bottom-left hinge. `zIndex: i + 1` is what makes
   later panels land on top rather than behind — without it the stack
   would be in DOM order and the newest credit would hide behind the
   oldest.

   `pinSpacing: false` is also why this needs no runway maths: the
   panels genuinely overlap in the document, they don't push each
   other down.
   ============================================================ */
import { useRef } from 'react';
import { experience } from '../../content.jsx';
import { gsap, ScrollTrigger } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';

const HINGE = 18; // degrees the incoming panel starts rotated by

export default function Experience() {
  const reduced = useReducedMotion();

  const rootRef = useRef(null);

  useGsapContext(
    rootRef,
    (el) => {
      if (reduced) return;
      const panels = gsap.utils.toArray('.credit', el);
      if (!panels.length) return;

      panels.forEach((panel, i) => {
        gsap.set(panel, { zIndex: i + 1 });

        const inner = panel.querySelector('.credit-inner');
        if (i > 0 && inner) {
          gsap.set(inner, { rotation: HINGE, transformOrigin: 'bottom left' });
          gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
        }

        /* The last panel has nothing scrolling over it, so it is not
           pinned — pinning it would just freeze the end of the page. */
        if (i < panels.length - 1) {
          ScrollTrigger.create({
            trigger: panel,
            start: 'bottom bottom',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
          });
        }
      });
    },
    [reduced]
  );

  return (
    <section className="credits" ref={rootRef} aria-label="Experience">
      {experience.map((job) => (
        <article className="credit" key={job.id}>
          <div className="credit-inner">
            <span className="credit-year text-label">{job.year}</span>
            <h3 className="credit-role">{job.role}</h3>
            <p className="credit-co">{job.company}</p>
            <p className="credit-text">{job.text}</p>
            <ul className="credit-tags">
              {job.tags.map((t) => (
                <li key={t} className="text-label">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}
