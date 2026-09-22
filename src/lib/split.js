/* ============================================================
   SPLIT — turn a string into words for the word-by-word reveal.

   Hand-rolled rather than pulling in GSAP's SplitText, so there is no
   plugin-licence question and no extra weight.
   ============================================================ */

/** Split into words, dropping empty entries. */
export function toWords(text) {
  return String(text)
    .split(/\s+/)
    .filter(Boolean);
}

export default toWords;
