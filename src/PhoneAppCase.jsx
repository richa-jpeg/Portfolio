/* ============================================================
   PHONE APP CASE STUDY — #/phone
   • Same phone frame as the Instagram case: the phone starts
     small on the table and zooms in to fill the screen.
   • Inside is a small plant-care app (Leafy) — the bottom tabs
     are tappable, so the mockup is interactive.
   • The device rests on the wooden tabletop with a soft shadow.
   Everything shown is driven by `phoneApp` in content.jsx.
   ============================================================ */
import { useEffect, useState } from 'react';
import { phoneApp } from './content.jsx';
import { FigNote } from './components.jsx';

const PA_ICONS = {
  home: 'M3 10.5L12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  drop: 'M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
};

function PaIcon({ name, size = 21 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PA_ICONS[name]} />
    </svg>
  );
}

export default function PhoneAppCase() {
  const [entered, setEntered] = useState(false);
  const [tab, setTab] = useState('Home');

  /* Kick the entry animation on the next frame (same as Instagram case). */
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const { app, hero, items, tabs, notes } = phoneApp;

  return (
    <main className="case-page case-table">
      <a className="case-back" href="#/">← Back to the board</a>

      <div className={`case-layout${entered ? ' in' : ''}`}>
        {/* ---------- notes · left ---------- */}
        <aside className="case-notes case-notes-left" aria-label="Design notes">
          <span className="case-notes-label">{notes.leftLabel}</span>
          {notes.left.map((n, i) => (
            <FigNote
              key={n.title}
              color={n.color}
              rotate={n.rotate}
              className="case-note"
              style={{ transitionDelay: `${0.45 + i * 0.12}s` }}
            >
              {n.sticker ? <span className="case-note-emoji" aria-hidden="true">{n.sticker}</span> : null}
              <strong>{n.title}</strong>
              <p>{n.text}</p>
            </FigNote>
          ))}
        </aside>

        {/* ---------- the phone on the table ---------- */}
        <div className="phone-zoom">
          <div className="phone">
            <div className="phone-screen">
              <header className="pa-top">
                <strong className="pa-logo">{app.emoji} {app.name}</strong>
                <span className="pa-avatar" aria-hidden="true">{app.avatar}</span>
              </header>

              <div className="pa-body">
                <div className="pa-hero">
                  <p className="pa-greet">{hero.greeting}</p>
                  <h3>{hero.title}</h3>
                  <p className="pa-sub">{hero.subtitle}</p>
                  <div className="pa-progress" aria-hidden="true">
                    <span style={{ width: hero.progress }} />
                  </div>
                  <span className="pa-hero-emoji" aria-hidden="true">{hero.emoji}</span>
                </div>

                <ul className="pa-list">
                  {items.map((it) => (
                    <li key={it.title} className="pa-row">
                      <span className="pa-row-emoji" aria-hidden="true">{it.emoji}</span>
                      <span className="pa-row-text">
                        <strong>{it.title}</strong>
                        <small>{it.sub}</small>
                      </span>
                      <span className="pa-row-arrow" aria-hidden="true">›</span>
                    </li>
                  ))}
                </ul>
              </div>

              <nav className="pa-tab" aria-label="App tabs">
                {tabs.map((t) => (
                  <button
                    key={t.label}
                    className={tab === t.label ? 'on' : ''}
                    onClick={() => setTab(t.label)}
                    aria-label={t.label}
                  >
                    <span aria-hidden="true">{t.emoji}</span>
                    <small>{t.label}</small>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* ---------- notes · right ---------- */}
        <aside className="case-notes case-notes-right" aria-label="Results">
          <span className="case-notes-label">{notes.rightLabel}</span>
          {notes.right.map((n, i) => (
            <FigNote
              key={n.title}
              color={n.color}
              rotate={n.rotate}
              className="case-note"
              style={{ transitionDelay: `${0.55 + i * 0.12}s` }}
            >
              {n.sticker ? <span className="case-note-emoji" aria-hidden="true">{n.sticker}</span> : null}
              <strong>{n.title}</strong>
              <p>{n.text}</p>
            </FigNote>
          ))}
        </aside>
      </div>
    </main>
  );
}
