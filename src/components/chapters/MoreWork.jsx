/* ============================================================
   MORE WORK — the stills wall plus the scroll-driven marquee.
   ============================================================ */
import { useRef } from 'react';
import { gsap, EASE } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { charWave } from '../../lib/textFx.js';
import MaskLines from '../effects/MaskLines.jsx';
import TiltedGrid from '../effects/TiltedGrid.jsx';
import VelocityMarquee from '../effects/VelocityMarquee.jsx';

export default function MoreWork() {
  const rootRef = useRef(null);

  useGsapContext(rootRef, (el) => {
    const chars = el.querySelectorAll('.stills-head .char');
    gsap.set(chars, { yPercent: 120, opacity: 0, scaleY: 2.3, scaleX: 0.7 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 75%' },
    });
    charWave(chars, tl, 0, { total: 0.9 });
    tl.fromTo(
      '.stills-sub',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: EASE.soft },
      0.3
    );
  }, []);

  return (
    <section className="chapter chapter-stills" id="stills" ref={rootRef}>
      <header className="stills-head">
        <span className="text-label">Section 03 — Field of stills</span>
        <h2 className="text-chapter stills-title">
          <MaskLines lines={['MORE', 'WORK']} />
        </h2>
        <p className="stills-sub text-lead">
          Frames, loops and title work that never made it into a full case study.
        </p>
      </header>

      <TiltedGrid />
      <VelocityMarquee />
    </section>
  );
}
