/* ============================================================
   PRELOADER — a count to 100 behind a growing gold hairline, then
   the whole panel lifts away.

   It signals `onDone` from the timeline's onComplete rather than a
   timer, so the hero's typing can never start while the panel is
   still on screen — and more importantly, the hand-off point is
   exactly when the scroll runway is settled.
   ============================================================ */
import { useRef } from 'react';
import { gsap, EASE } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';

export default function Preloader({ onDone, brand = 'Portfolio' }) {
  const numRef = useRef(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const rootRef = useRef(null);

  useGsapContext(rootRef, (el) => {
    const counter = { v: 0 };
    const num = numRef.current;
    const bar = el.querySelector('.preloader-bar');
    const inner = el.querySelector('.preloader-inner');

    const tl = gsap.timeline({
      onComplete: () => doneRef.current?.(),
    });

    tl.to(
      counter,
      {
        v: 100,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (num) num.textContent = String(Math.round(counter.v)).padStart(3, '0');
        },
      },
      0
    )
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0)
      .to(inner, { opacity: 0, y: -18, duration: 0.35, ease: EASE.soft }, '+=0.05')
      .to(el, { yPercent: -100, duration: 0.75, ease: 'power3.inOut' }, '-=0.1');

    return () => tl.kill();
  }, []);

  return (
    <div className="preloader" ref={rootRef}>
      <div className="preloader-track">
        <span className="preloader-bar" />
      </div>
      <div className="preloader-inner">
        <span className="preloader-brand text-label">{brand}</span>
        <span className="preloader-num" ref={numRef}>
          000
        </span>
      </div>
    </div>
  );
}
