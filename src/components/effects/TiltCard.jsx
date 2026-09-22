/* ============================================================
   TILT CARD — pointer-tracked 3D tilt with holo-style sheen.

   The smoothing is the interesting part. A naive
   `current += (target - current) * 0.1` per frame is frame-rate
   dependent: at 120 Hz the card settles twice as fast as at 60 Hz,
   so the feel of the interaction changes with the display. The
   exponential-decay form

       k = 1 - exp(-dt / tau)

   solves for the fraction of the remaining distance to cover in the
   elapsed time `dt`, which makes the settle take the same WALL-CLOCK
   time on any refresh rate.

   Everything is written to CSS custom properties rather than through
   React state — same reason as the cursor: a pointermove → setState
   loop would re-render the tree on every mouse event.
   ============================================================ */
import { useEffect, useRef } from 'react';
import { clamp } from '../../lib/math.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';

const TAU = 0.14; // seconds to cover ~63% of the remaining distance

export default function TiltCard({
  children,
  className = '',
  /* Divisors ARE the max tilt: ±10° horizontally, ±12.5° vertically. */
  tiltX = 4,
  tiltY = 5,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    let tgtRX = 0;
    let tgtRY = 0;
    let tgtPX = 50;
    let tgtPY = 50;
    let rx = 0;
    let ry = 0;
    let px = 50;
    let py = 50;

    let raf = 0;
    let last = performance.now();
    let inside = false;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
      const ny = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100);
      tgtPX = nx;
      tgtPY = ny;
      tgtRY = (nx - 50) / tiltY; // note the deliberate X/Y swap
      tgtRX = -(ny - 50) / tiltX;
    };

    const onEnter = () => {
      inside = true;
      el.classList.add('is-active');
    };

    const onLeave = () => {
      inside = false;
      el.classList.remove('is-active');
      tgtRX = 0;
      tgtRY = 0;
      tgtPX = 50;
      tgtPY = 50;
    };

    const loop = (now) => {
      const dt = Math.min(64, now - last); // clamp so a stalled tab can't jump
      last = now;
      const k = 1 - Math.exp(-(dt / 1000) / TAU);

      rx += (tgtRX - rx) * k;
      ry += (tgtRY - ry) * k;
      px += (tgtPX - px) * k;
      py += (tgtPY - py) * k;

      el.style.setProperty('--rx', `${rx.toFixed(3)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(3)}deg`);
      el.style.setProperty('--px', `${px.toFixed(2)}%`);
      el.style.setProperty('--py', `${py.toFixed(2)}%`);

      /* Idle once settled and the pointer has left — no reason to keep
         a compositor layer awake behind a static card. */
      const settled = Math.abs(rx - tgtRX) < 0.01 && Math.abs(ry - tgtRY) < 0.01;
      if (!inside && settled) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointermove', start);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointermove', start);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, tiltX, tiltY]);

  return (
    <div className={`tilt ${className}`.trim()} ref={ref}>
      <div className="tilt-card">{children}</div>
    </div>
  );
}
