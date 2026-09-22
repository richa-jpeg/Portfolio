/* ============================================================
   GSAP — single registration point.

   One animation driver for the whole site: GSAP + ScrollTrigger.
   (The reference repo mixes GSAP, Framer Motion and Lenis, which is
   why it needs `ScrollTrigger.refresh()` sprinkled around to paper
   over the two libraries disagreeing about document height. We
   deliberately do not repeat that.)
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* iOS Safari's toolbar changes innerHeight mid-scroll, which makes
   `100svh`/`100vh` stages resize and pinned sections visibly jump.
   This tells ScrollTrigger to ignore height-only changes. */
ScrollTrigger.config({ ignoreMobileResize: true });

/** Shared easings — keep scroll work on a small, consistent set. */
export const EASE = {
  smooth: 'power3.out',
  snappy: 'power4.out',
  soft: 'power2.out',
  cinematic: 'power2.inOut',
  expo: 'expo.out',
  back: 'back.out(1.7)',
  none: 'none',
};

/* Pin runways are supplied per chapter as `end: '+=' + N*100%` against a
   plain `100svh` stage. Never also give the section its own extra height:
   ScrollTrigger adds pinSpacing on top of the section height, so doing
   both gives the chapter double the scroll it should have and a long
   dead stretch at the end of it. */

export { gsap, ScrollTrigger };
