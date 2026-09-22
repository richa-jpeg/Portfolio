/* ============================================================
   ANNOTATION — the cinematic replacement for the FigJam sticky note.

   It keeps the older `FigNote` prop signature (`color`, `rotate`,
   `className`, `style`, `children`) so the four case-study
   components could swap to it by changing one import. The sticky
   yellow is gone; `color` now tints a small marker dot instead,
   which keeps the data meaningful without bringing the stationery
   back. `rotate` survives as a whisper of the old hand-placed feel.
   ============================================================ */

/* Palette keys from content.jsx → accent hues. Deliberately muted;
   these sit on a near-black panel and should read as a tint, not a
   swatch. */
const TINTS = {
  yellow: '#c8a882',
  orange: '#c99a6a',
  pink: '#c08a90',
  green: '#8fae8b',
  blue: '#8ba3c0',
  lilac: '#a294c0',
};

export default function Annotation({
  color = 'gold',
  rotate = 0,
  className = '',
  style,
  title,
  marker,
  kicker,
  children,
}) {
  const tint = TINTS[color] || TINTS.yellow;

  return (
    <div
      className={`annotation ${className}`.trim()}
      style={{ '--tint': tint, '--rot': `${rotate * 0.25}deg`, ...style }}
    >
      {kicker ? <span className="annotation-kicker text-label">{kicker}</span> : null}
      {title || marker ? (
        <header className="annotation-head">
          <span className="annotation-dot" aria-hidden="true" />
          <strong className="annotation-title">{title}</strong>
          {marker ? (
            <span className="annotation-marker" aria-hidden="true">
              {marker}
            </span>
          ) : null}
        </header>
      ) : null}
      <div className="annotation-body">{children}</div>
    </div>
  );
}
