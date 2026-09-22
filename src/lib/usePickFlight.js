/* ============================================================
   USE PICK FLIGHT — the zoom from a picked-up object into the case page.

   A case study normally enters with its own CSS animation: the device rises,
   unblurs and settles. When it was reached by picking an object up off the
   table at #/phone, that entry is the wrong animation — it says nothing about
   where the object was. Instead the device is placed exactly over the object's
   last screen position and flown home, so the object appears to grow and come
   to the centre of the screen.

   The flight is a CSS transition on `transform` alone, driven from here. The
   case entry is already CSS, and keeping a single transform writer means there
   is nothing to reconcile — `.case-layout.picked` in cases.css releases every
   other channel instantly (see the comment there for why that is
   load-bearing).

   Returns `entered` (drives the notes' reveal) and `picked` (flight running).
   `picked` is a latch: it is set once and never cleared, because removing it
   would re-apply the device's pre-hidden state and blank it.
   ============================================================ */
import { useLayoutEffect, useState } from 'react';
import { takePick } from './pickTransition.js';
import { useReducedMotion } from './useReducedMotion.js';

/* Must match the `transform` duration on `.case-layout.picked` in cases.css. */
const FLIGHT_MS = 950;

export function usePickFlight(route, deviceRef) {
  const [entered, setEntered] = useState(false);
  const [picked, setPicked] = useState(false);
  const reduced = useReducedMotion();

  /* useLayoutEffect, not useEffect: the start transform has to be written
     before the browser paints, or the device flashes at its final position for
     a frame and then jumps back to the object. */
  useLayoutEffect(() => {
    /* Reduced motion gets the destination, not the journey. The plain entry
       below is already instantaneous under the global kill switch, so there is
       nothing else to do. */
    if (reduced) {
      setEntered(true);
      return undefined;
    }

    const pick = takePick(route);
    const device = deviceRef.current;

    if (!pick || !device) {
      /* Nothing to fly from — a deep link, a refresh, or a ⌘-click into a new
         tab. Keep the original entry: two frames, so the browser paints the
         un-entered state before the class flip starts the transition. */
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
      return () => cancelAnimationFrame(raf);
    }

    /* Measure with the pre-hidden transform neutralised. Until `.picked` lands
       the device still carries `scale: 0.87; translate: 0 44px`, and a rect
       taken in that state reports a box 13% small and 44px low — the flight
       would start undersized and off-centre, and nothing would report it.
       `.picked` sets these two properties to exactly these values a moment
       from now, so writing them here is the same release, just early enough to
       measure against. They compose with `transform`, and at 1/0 they are the
       identity, so the flight's transform is unaffected. */
    device.style.scale = '1';
    device.style.translate = '0';
    const target = device.getBoundingClientRect();
    if (!target.width) {
      setEntered(true);
      return undefined;
    }

    /* Scale by width. A table object and its case device share an aspect
       ratio, so matching the width matches the height too. */
    const scale = pick.width / target.width;
    const dx = pick.left + pick.width / 2 - (target.left + target.width / 2);
    const dy = pick.top + pick.height / 2 - (target.top + target.height / 2);

    device.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    setPicked(true);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setEntered(true);
    };
    const onEnd = (e) => {
      if (e.target === device && e.propertyName === 'transform') finish();
    };
    device.addEventListener('transitionend', onEnd);

    /* Failsafe. A transition that never fires its end event — interrupted, or
       zeroed by a setting the media query did not catch — must not strand the
       design notes at opacity 0 forever. */
    const failsafe = setTimeout(finish, FLIGHT_MS + 300);

    /* The next frame, not this one: the transition needs a painted "before"
       value to interpolate from. */
    const raf = requestAnimationFrame(() => {
      device.style.transform = 'translate(0px, 0px) scale(1)';
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
      device.removeEventListener('transitionend', onEnd);
    };
  }, [route, reduced, deviceRef]);

  return { entered, picked };
}
