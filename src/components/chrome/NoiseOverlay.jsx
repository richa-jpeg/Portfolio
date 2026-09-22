/* Film grain over the entire page. Purely decorative — the SVG
   turbulence is inlined as a data URI in tokens.css so it costs no
   request, and `pointer-events: none` keeps it from eating clicks. */
export default function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}
