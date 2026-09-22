/* ============================================================
   LENIS — smooth inertial scroll, driven by the GSAP ticker.

   Why the ticker and not our own rAF: lenis@1.3 defaults
   `autoRaf` to false, so nothing else is driving it. Running it
   off gsap.ticker means one clock for scroll and animation, and
   Lenis's scroll write is ordered deterministically relative to
   ScrollTrigger's own update. (The "you must drive rAF yourself"
   advice floating around is for lenis <= 1.0.x, before autoRaf
   existed.)

   Two details that are easy to get wrong and fail silently:
   • gsap.ticker passes SECONDS; lenis.raf wants MILLISECONDS.
   • gsap.ticker.remove matches by function identity, so the
     callback has to be a stable reference.
   ============================================================ */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsapSetup.js';

/* Module-scoped: React Fast Refresh re-runs effects on every HMR
   edit, and StrictMode double-invokes them. Sharing one instance
   means neither can leave a second Lenis alive — two live instances
   both listen for wheel and both write scrollTop each frame, which
   scrolls the page at roughly double speed with visible jitter. */
let instance = null;
let tickerFn = null;

const onScroll = () => ScrollTrigger.update();

export const getLenis = () => instance;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function create() {
  const lenis = new Lenis({
    duration: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenis.on('scroll', onScroll);

  tickerFn = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  /* lagSmoothing is global, not per-instance, so we set it once and
     do NOT restore the default on cleanup — that would stomp any
     other consumer. */
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function destroy() {
  if (!instance) return;
  instance.off('scroll', onScroll);
  if (tickerFn) gsap.ticker.remove(tickerFn);
  instance.destroy();
  instance = null;
  tickerFn = null;
}

/**
 * Mount smooth scrolling, unless the user asked for reduced motion —
 * in which case we never create Lenis and the document just scrolls
 * natively. Pinning is also disabled in that case (see useChapterPin).
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    if (!instance) instance = create();
    return destroy;
  }, []);
}

/**
 * Scroll to a target. Falls back to the native API when Lenis is off
 * (reduced motion), so callers never have to branch.
 */
export function scrollTo(target, opts = {}) {
  if (instance) instance.scrollTo(target, opts);
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'auto' });
}
