/* ============================================================
   IMBESHARAM PHONE — #/imBesharamPhone

   The phone that stands on ImBesharam's table. The screen inside it lives in
   components/ui/IgPhone.jsx: an Instagram-style profile grid and a lightbox,
   shared with the Jaigarh phone, which renders the same shell with the
   festival's own content. What belongs to this page and stays here is the
   copy around it — the design notes — and the pick-up flight.

   Reached two ways, and it has to handle both: a deep link, where the device
   rises, unblurs and settles (the plain entry), and a pick-up off the table at
   #/imBesharam, where `usePickFlight` flies it in from where that object sat
   and the back link returns to the table rather than to the board.

   Everything shown is driven by `instagram` in content.jsx.
   ============================================================ */
import { useRef } from 'react';
import { instagram, routes } from './content.jsx';
import { usePickFlight } from './lib/usePickFlight.js';
import IgPhone from './components/ui/IgPhone.jsx';
import Annotation from './components/ui/Annotation.jsx';

export default function ImBesharamPhoneCase() {
  const deviceRef = useRef(null);

  /* The route string is the one the table records the pick against — a
     mismatch is silent, so it is a `routes` value rather than a literal. */
  const { entered, picked } = usePickFlight(routes.imBesharamPhone, deviceRef);

  const { account, posts, notes } = instagram;

  return (
    <main className="case-page case-table">
      {/* Back goes to the table when the visitor got here by picking the phone
          up, so they land where they left off rather than at the top of the
          board. A deep link has no table behind it. */}
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

        {/* ---------- the phone (flown in from the table, or zooms in) ---------- */}
        <IgPhone account={account} posts={posts} deviceRef={deviceRef} />

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
