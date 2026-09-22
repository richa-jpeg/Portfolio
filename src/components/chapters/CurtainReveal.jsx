/* ============================================================
   CURTAIN REVEAL — the chapter gate.

   A gold panel wipes up over a receding backdrop while the backdrop
   dims, then the chapter wordmark lands on the gold. Because the
   stage is pinned, scrolling further carries the curtain up and off
   the top of the viewport — which is what actually reveals the next
   chapter underneath. The wipe and the hand-off are the same motion.

   The reference repo leaves a dead `shard` element in this component
   that is created and never animated. Ours is not carried over.
   ============================================================ */
import { useRef } from 'react';
import { gsap, EASE } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';

export default function CurtainReveal({
  index = '01',
  title = ['SELECTED', 'WORK'],
  kicker = 'Chapter 01',
  runway = 1.2,
}) {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  useGsapContext(
    sectionRef,
    (el) => {
      const stage = el.querySelector('.curtain-stage');
      const beneath = el.querySelector('.curtain-beneath');
      const dim = el.querySelector('.curtain-dim');
      const curtain = el.querySelector('.curtain-panel');
      const label = el.querySelector('.curtain-label');

      gsap.set(curtain, { yPercent: 100 });
      gsap.set(label, { opacity: 0, y: 40, scale: 0.96 });
      gsap.set(dim, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
          start: 'top top',
          end: `+=${runway * 100}%`,
          scrub: 0.4,
        },
        defaults: { ease: EASE.cinematic },
      });

      /* 0 → 0.75: the backdrop recedes and dims as the curtain climbs.
         The curtain reaches full cover at ~0.75 and HOLDS, so the rest
         of the scroll is what lifts it off to reveal the next chapter. */
      tl.to(beneath, { scale: 0.92, duration: 0.75 }, 0)
        .to(dim, { opacity: 0.65, duration: 0.75 }, 0)
        .to(curtain, { yPercent: 0, duration: 0.75 }, 0);

      /* 0.5 → 0.9: the wordmark lands on the gold. */
      tl.to(label, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: EASE.soft }, 0.5);
    },
    [reduced]
  );

  return (
    <section className="chapter chapter-curtain" ref={sectionRef}>
      <div className="stage curtain-stage">
        <div className="curtain-beneath" aria-hidden="true">
          <div className="curtain-ghost">
            {title.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="curtain-dim" aria-hidden="true" />

        <div className="curtain-panel">
          <div className="curtain-label">
            <span className="text-label curtain-kicker">{kicker}</span>
            <h2 className="text-chapter curtain-title">
              {title.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
