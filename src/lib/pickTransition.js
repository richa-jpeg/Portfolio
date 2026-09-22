/* ============================================================
   PICK TRANSITION — carries a table object's screen position across the
   route change that opens its case study.

   The object being picked up (the table at #/phone) and the device it becomes
   (the case overlay) live in different DOM trees, and the overlay does not
   exist until the hash changes. There is therefore never a moment when both
   are on screen for GSAP Flip to invert between — so instead the source rect
   is measured at click time, parked here, and claimed by the case component
   as it mounts.

   Module-scoped rather than React state, and deliberately so: the value has to
   outlive the navigation, and it is written by a component that is being
   unmounted by the one that reads it. Same shape as the Lenis instance in
   useLenis.js.
   ============================================================ */

let pending = null;

/* A pick only means anything for the navigation it was measured for. If that
   navigation never happens — the click was interrupted, or the visitor went
   Back before the overlay mounted — the rect goes stale, and claiming it later
   would fly a device in from wherever that object used to sit. */
const MAX_AGE_MS = 1200;

/** Park where an object was on screen, just before its route opens. */
export function setPick(rect, route) {
  if (!rect || !rect.width) return;
  pending = {
    route,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    at: performance.now(),
  };
}

/**
 * Claim the pick for `route`, if one is in flight.
 *
 * Returns null when there is nothing to claim — a deep link, a refresh, or a
 * ⌘-click into a new tab all arrive with an empty slot — and the caller then
 * falls back to its own entry animation. Clears as it reads, so a later
 * navigation cannot inherit a stale rect.
 */
export function takePick(route) {
  const pick = pending;
  pending = null;
  if (!pick || pick.route !== route) return null;
  if (performance.now() - pick.at > MAX_AGE_MS) return null;
  return pick;
}
