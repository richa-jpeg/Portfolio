/* ============================================================
   IMBESHARAM BOOKLET — #/imBesharamBooklet

   The booklet that stands on ImBesharam's table. The device itself lives
   in components/ui/Booklet.jsx now, because #/imBesharam stands the same
   booklet on its second scroll view; this page keeps the design notes, the
   back link and the pick-up flight.

   Content: `booklet.leaves` in content.jsx — each leaf has a printed
   `front` and `back`.
   ============================================================ */
import { useRef } from 'react';
import { booklet, routes } from './content.jsx';
import { usePickFlight } from './lib/usePickFlight.js';
import BookletDevice from './components/ui/Booklet.jsx';
import Annotation from './components/ui/Annotation.jsx';

export default function ImBesharamBookletCase() {
  const deviceRef = useRef(null);

  /* Either the plain entry, or the flight in from the booklet picked up off the
     table at #/imBesharam. The route string is the one the table records the
     pick against, and a mismatch fails silently — hence a `routes` value. */
  const { entered, picked } = usePickFlight(routes.imBesharamBooklet, deviceRef);

  const { notes } = booklet;

  return (
    <main className="case-page case-table">
      {/* Back goes to the table when the visitor got here by picking the
          booklet up, so they land where they left off rather than at the top of
          the board. A deep link has no table behind it. */}
      <a className="case-back" href={picked ? `#/${routes.imBesharam}` : '#/'}>
        {picked ? '← Back to the table' : '← Back to work'}
      </a>

      <div className={`case-layout${picked ? ' picked' : ''}${entered ? ' in' : ''}`}>
        {/* ---------- notes · left ---------- */}
        <aside className="case-notes case-notes-left" aria-label="Design notes">
          <span className="case-notes-label">{notes.leftLabel}</span>
          {notes.left.map((n, i) => (
            <Annotation
              key={n.title}
              color={n.color}
              rotate={n.rotate}
              className="case-note"
              style={{ transitionDelay: `${0.45 + i * 0.12}s` }}
            >
              {n.sticker ? <span className="case-note-emoji" aria-hidden="true">{n.sticker}</span> : null}
              <strong>{n.title}</strong>
              <p>{n.text}</p>
            </Annotation>
          ))}
        </aside>

        {/* ---------- the book on the table ---------- */}
        <BookletDevice deviceRef={deviceRef} />

        {/* ---------- notes · right ---------- */}
        <aside className="case-notes case-notes-right" aria-label="Results">
          <span className="case-notes-label">{notes.rightLabel}</span>
          {notes.right.map((n, i) => (
            <Annotation
              key={n.title}
              color={n.color}
              rotate={n.rotate}
              className="case-note"
              style={{ transitionDelay: `${0.55 + i * 0.12}s` }}
            >
              {n.sticker ? <span className="case-note-emoji" aria-hidden="true">{n.sticker}</span> : null}
              <strong>{n.title}</strong>
              <p>{n.text}</p>
            </Annotation>
          ))}
        </aside>
      </div>
    </main>
  );
}
