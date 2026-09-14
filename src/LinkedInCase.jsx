/* ============================================================
   LINKEDIN TABLET CASE STUDY — #/linkedin
   • A tablet starts small on the table and zooms in to the
     centre so you can interact with it.
   • Inside is a LinkedIn-style feed: profile card with a
     working Follow button, and posts whose Like buttons
     toggle and update the counts.
   Everything shown is driven by `linkedin` in content.jsx.
   ============================================================ */
import { useEffect, useState } from 'react';
import { linkedin } from './content.jsx';
import { FigNote } from './components.jsx';

/* ---------- small stroke icons (LinkedIn-ish) ---------- */
const LI_PATHS = {
  like: 'M7 10v12M3 22V10h4m0 12 4.2-9.3a2 2 0 0 1 3.8 1L14 15h5.2a2 2 0 0 1 1.9 2.5l-1.2 5A2 2 0 0 1 18 24H7',
  comment: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  repost: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  home: 'M3 10.5L12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  briefcase: 'M4 8h16v12H4zM9 8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3',
};

function LiIcon({ name, size = 18, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={LI_PATHS[name]} />
    </svg>
  );
}

export default function LinkedInCase() {
  const [entered, setEntered] = useState(false);
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(() => new Set());

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { profile, posts, notes } = linkedin;

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

        {/* ---------- the tablet on the table ---------- */}
        <div className="tablet-zoom">
          <div className="tablet">
            <div className="tablet-screen">
              <header className="li-top">
                <span className="li-logo" aria-hidden="true">in</span>
                <span className="li-search">Search</span>
                <span className="li-icons">
                  <button aria-label="Home"><LiIcon name="home" size={20} /></button>
                  <button aria-label="Jobs"><LiIcon name="briefcase" size={20} /></button>
                </span>
              </header>

              <div className="li-feed">
                {/* profile card with a working Follow button */}
                <section className="li-profile">
                  <span className="li-avatar li-avatar-lg" style={{ background: profile.color }} aria-hidden="true">
                    {profile.initials}
                  </span>
                  <div className="li-who">
                    <strong className="li-name">{profile.name}</strong>
                    <span className="li-role">{profile.headline}</span>
                  </div>
                  <button
                    className={`li-follow${following ? ' following' : ''}`}
                    onClick={() => setFollowing((f) => !f)}
                  >
                    {following ? '✓ Following' : '+ Follow'}
                  </button>
                </section>

                {/* posts — Like toggles and updates the count */}
                {posts.map((p) => {
                  const isLiked = liked.has(p.id);
                  return (
                    <article className="li-post" key={p.id}>
                      <div className="li-post-head">
                        <span className="li-avatar" style={{ background: p.color }} aria-hidden="true">
                          {p.avatar}
                        </span>
                        <div className="li-who">
                          <strong className="li-name">{p.author}</strong>
                          <span className="li-role">{p.headline}</span>
                        </div>
                        <span className="li-time">{p.time}</span>
                      </div>
                      <p className="li-text">{p.text}</p>
                      {p.image ? (
                        <img className="li-post-img" src={p.image} alt="" loading="lazy" decoding="async" />
                      ) : null}
                      <div className="li-actions">
                        <button className={isLiked ? 'liked' : ''} onClick={() => toggleLike(p.id)} aria-pressed={isLiked}>
                          <LiIcon name="like" /> {p.likes + (isLiked ? 1 : 0)}
                        </button>
                        <button aria-label="Comment"><LiIcon name="comment" /> {p.comments}</button>
                        <button aria-label="Repost"><LiIcon name="repost" /> Repost</button>
                        <button aria-label="Send" className="li-send"><LiIcon name="send" /> Send</button>
                      </div>
                    </article>
                  );
                })}
              </div>
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
