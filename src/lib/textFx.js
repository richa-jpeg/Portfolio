/* ============================================================
   TEXT FX — the per-character "melt up into place" reveal.

   Adapted from the reference repo's ScrollFloat overlap math. The
   interesting part is that each character owns a window of the
   whole progress bar and consecutive windows OVERLAP, so the word
   resolves as a wave instead of a metronome:

     charWindow = 1 / (n + (n-1) * stagger)
     step       = charWindow * (1 + stagger)

   With `stagger` = 0.6 (i.e. 60% overlap) the windows tile exactly
   across 0→1, so the first character starts as progress hits 0 and
   the last one finishes as it hits 1 — no dead time at either end.
   ============================================================ */
import { EASE } from './gsapSetup.js';

const FROM = { yPercent: 120, opacity: 0, scaleY: 2.3, scaleX: 0.7 };
const TO = { yPercent: 0, opacity: 1, scaleY: 1, scaleX: 1 };

/**
 * Add a per-character wave to an existing timeline.
 *
 * @param {Element[]} chars  the character spans, in reading order
 * @param {gsap.core.Timeline} tl
 * @param {number} position  where in the timeline the wave starts (seconds)
 * @param {object} opts      { total, stagger, ease }
 */
export function charWave(chars, tl, position = 0, opts = {}) {
  const { total = 1.1, stagger = 0.6, ease = EASE.smooth } = opts;
  const n = chars.length;
  if (!n) return;

  const charWindow = 1 / (n + (n - 1) * stagger);
  const step = charWindow * (1 + stagger);

  chars.forEach((el, i) => {
    const start = i * step;
    tl.fromTo(
      el,
      FROM,
      {
        ...TO,
        duration: charWindow * total,
        ease,
        /* Scaling from the top edge makes the glyph grow *down* out of
           the mask rather than ballooning around its centre. */
        transformOrigin: '50% 0%',
      },
      position + start * total
    );
  });
}

export default charWave;
