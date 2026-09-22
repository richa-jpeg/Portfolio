/* ============================================================
   GSAP in React, the short way.

   `gsap.context` scopes every selector inside the callback to the
   given element, and `revert()` on cleanup undoes the tweens AND the
   inline styles they wrote — so a hot reload or a route change can
   never leave a chapter frozen halfway through a scrub.

   Runs in useLayoutEffect so the initial `gsap.set()` calls land
   before the browser paints. That matters because animated elements
   must NOT be pre-hidden in CSS: if reduced-motion skips this hook
   entirely, they need to be visible by default.

   The scope ref is a REQUIRED argument rather than something the hook
   invents and returns. An earlier version returned its own ref, which
   made `useGsapContext(fn)` look complete — but unless the caller also
   attached that ref to an element, `scope.current` was null and the
   entire setup was silently skipped. The page still rendered and
   nothing threw; the animations simply never happened. Requiring the
   ref makes that mistake impossible to write, and the dev warning
   below catches the remaining case (a ref that was never attached).
   ============================================================ */
import { useLayoutEffect } from 'react';
import { gsap } from './gsapSetup.js';
import { useReducedMotion } from './useReducedMotion.js';

export function useGsapContext(scopeRef, setup, deps = []) {
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    /* Reduced motion skips the setup ENTIRELY rather than animating to
       the same end state. That is why nothing is pre-hidden in CSS: with
       no GSAP running, every element simply renders in its natural,
       final position. Animating "instantly" would still create pins,
       scrubbed timelines and inline transforms for no reason. */
    if (reduced) return undefined;

    const el = scopeRef.current;
    if (!el) {
      if (import.meta.env.DEV) {
        console.warn(
          '[useGsapContext] scope ref is not attached to an element — ' +
            'this setup was skipped, so its animations will not run.',
          scopeRef
        );
      }
      return undefined;
    }
    const ctx = gsap.context(() => setup(el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}

export default useGsapContext;
