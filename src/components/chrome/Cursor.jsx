/* ============================================================
   CURSOR — a ring that trails the pointer, with a dot that tracks
   it almost exactly.

   Two rules this component exists to respect:

   1. Cursor position NEVER goes through React state. A mousemove →
      setState loop re-renders the whole tree — including whatever
      pinned, scrubbed section is on screen — at ~120 Hz on a
      trackpad. gsap.quickTo writes the transform directly instead.

   2. It only mounts for fine pointers. On touch there is no
      mousemove at all, so the element would sit frozen at 0,0.
   ============================================================ */
import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsapSetup.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';

const INTERACTIVE = 'a, button, [role="button"], [data-cursor]';

export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return undefined;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return undefined;

    /* Centre both on the pointer rather than hanging their top-left
       corner off it. GSAP composes xPercent with the x/y it writes. */
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });

    /* `visible` must be cleared when the pointer leaves, not just set on
       first move. An earlier version latched it true forever, so the
       leave handler faded the cursor out and nothing could ever fade it
       back in — moving back into the window left it invisible for good. */
    let visible = false;

    /* Set on re-entry so the next position update starts AT the entry
       point instead of gliding to it. */
    let snapNext = false;

    const show = () => {
      if (visible) return;
      visible = true;
      snapNext = true;
      gsap.to([ring, dot], { opacity: 1, duration: 0.25, ease: 'power2.out' });
    };

    const hide = () => {
      visible = false;
      gsap.to([ring, dot], { opacity: 0, duration: 0.2, overwrite: 'auto' });
    };

    const trackTo = (e) => {
      const snap = snapNext;
      snapNext = false;

      /* gsap.quickTo's returned function is
         `(value, start, startIsRelative) => tween.resetTo(...)`, and
         resetTo sets the tween's origin from `start` when given. Passing
         the pointer position as BOTH the target and the start therefore
         lands the cursor on the entry point immediately.
         Without it, resetTo continues from wherever the element currently
         is — so re-entering from the opposite corner would sweep the ring
         across the entire viewport instead of appearing under the
         pointer. (gsap.set is not enough: the in-flight position tween
         re-renders straight over it on the next frame.) */
      ringX(e.clientX, snap ? e.clientX : undefined);
      ringY(e.clientY, snap ? e.clientY : undefined);
      dotX(e.clientX, snap ? e.clientX : undefined);
      dotY(e.clientY, snap ? e.clientY : undefined);
    };

    const onMove = (e) => {
      show(e);
      trackTo(e);
    };

    const onEnter = (e) => {
      show(e);
      trackTo(e);
    };

    const onOver = (e) => {
      const hot = e.target instanceof Element && e.target.closest(INTERACTIVE);
      gsap.to(ring, {
        scale: hot ? 1.8 : 1,
        borderColor: hot ? 'rgba(200,168,130,0.9)' : 'rgba(240,236,228,0.45)',
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    /* `mouseleave` on the document is the primary signal, but it is not
       fired identically everywhere — a `mouseout` whose relatedTarget is
       null is the classic, universally reliable "pointer left the
       window" test, so both are wired. Re-entry is handled by mousemove
       as well as a deliberate enter listener. */
    const onOut = (e) => {
      if (!e.relatedTarget && !e.toElement) hide();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
