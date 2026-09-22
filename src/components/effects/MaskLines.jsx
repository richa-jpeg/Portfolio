/* ============================================================
   MASK LINES — structural only.

   Renders each line as `.mask > .mask-inner` with one `.char` span
   per character. It deliberately does NOT animate anything: the
   parent chapter drives `.mask-inner` (the line slide) and `.char`
   (the per-character un-squash) through its own gsap.context, which
   keeps every timing decision in one timeline instead of split
   between a component and its caller.

   The mask is what makes the reveal read: overflow is clipped to the
   line box, so characters translated below the baseline are simply
   not there yet.
   ============================================================ */
import { Fragment } from 'react';

function Chars({ text }) {
  const chars = Array.from(String(text));
  return (
    <>
      {chars.map((c, i) => (
        /* A space is not a glyph to animate — emit it plainly, or the
           inline-block spans would collapse it to zero width. */
        <Fragment key={`${c}-${i}`}>
          {c === ' ' ? ' ' : <span className="char">{c}</span>}
        </Fragment>
      ))}
    </>
  );
}

/**
 * @param {Array<{text: string, accent?: boolean}|string>} lines
 * @param {string} className  appended to `.mask-lines`
 * @param {string} as         wrapper tag, defaults to a span
 */
export default function MaskLines({ lines, className = '', as: Tag = 'span' }) {
  return (
    <Tag className={`mask-lines ${className}`.trim()}>
      {lines.map((raw, i) => {
        const line = typeof raw === 'string' ? { text: raw } : raw;
        return (
          <span className="mask" key={line.text ?? i}>
            <span
              className={`mask-inner${line.accent ? ' is-accent' : ''}`}
              data-accent={line.accent ? 'true' : undefined}
            >
              <Chars text={line.text} />
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
