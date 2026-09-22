/* ============================================================
   MATH — small numeric helpers shared by the scroll effects.
   ============================================================ */

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default clamp;
