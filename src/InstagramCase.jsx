/* ============================================================
   INSTAGRAM CASE STUDY — #/instagram
   • A phone frame starts small on the dotted board and zooms in
     to fill the screen (animation on entry).
   • The UI inside the phone mirrors the Instagram profile grid:
     account header, stats, highlights and the 3-up post grid.
   • Sticky notes on the left/right explain the design decisions.
   • Click a post to open a lightbox (images and videos).
   Everything shown is driven by `instagram` in content.jsx.
   ============================================================ */
import { useEffect, useState } from 'react';
import { instagram } from './content.jsx';
import { FigNote } from './components.jsx';

/* ---------- small stroke icons (Instagram-ish) ---------- */
const ICON_PATHS = {
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
  comment: 'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1.1-4.1A8.4 8.4 0 1 1 21 11.5z',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  home: 'M3 10.5L12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  reels: 'M3.5 5.5h17v13h-17zM3.5 10h17M7.5 5.5l3.5 4.5M11.5 5.5l3.5 4.5M15.5 5.5l3.5 4.5',
  bookmark: 'M6 4h12v16l-6-4-6 4z',
};

function IgIcon({ name, size = 20, filled = false, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'dots' ? (
        <>
          <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" />
        </>
      ) : (
        <path d={ICON_PATHS[name]} />
      )}
    </svg>
  );
}

/* ---------- app chrome pieces ---------- */
function IgTopBar() {
  return (
    <header className="ig-topbar">
      <strong className="ig-logo">Instagram</strong>
      <div className="ig-topbar-actions">
        <button aria-label="Notifications"><IgIcon name="heart" size={21} /></button>
        <button aria-label="Messages"><IgIcon name="send" size={21} /></button>
      </div>
    </header>
  );
}

function IgProfile({ account }) {
  return (
    <div className="ig-profile">
      <div className="ig-profile-row">
        <div
          className="ig-avatar"
          style={{ background: `linear-gradient(135deg, ${account.avatarGradient[0]}, ${account.avatarGradient[1]})` }}
          aria-hidden="true"
        >
          <span>{account.avatarEmoji}</span>
        </div>
        <div className="ig-profile-main">
          <div className="ig-name-row">
            <strong className="ig-handle">{account.handle}</strong>
            <button className="ig-btn ig-btn-primary">Edit profile</button>
            <button className="ig-btn ig-btn-icon" aria-label="Options"><IgIcon name="dots" size={16} /></button>
          </div>
          <div className="ig-stats">
            <span><b>{account.stats.posts}</b> posts</span>
            <span><b>{account.stats.followers}</b> followers</span>
            <span><b>{account.stats.following}</b> following</span>
          </div>
        </div>
      </div>

      <div className="ig-bio">
        <strong>{account.name}</strong>
        {account.bio.map((line) => <span key={line}>{line}</span>)}
      </div>

      <div className="ig-highlights">
        {account.highlights.map((h) => (
          <div className="ig-highlight" key={h.label}>
            <span className="ig-highlight-ring"><span className="ig-highlight-inner">{h.emoji}</span></span>
            <small>{h.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function IgGrid({ posts, onOpen }) {
  return (
    <div className="ig-grid">
      {posts.map((p) => (
        <button key={p.id} className="ig-tile" onClick={() => onOpen(p)} aria-label={`Open post: ${p.caption}`}>
          {p.type === 'video' ? (
            <span className="ig-tile-media" style={{ backgroundImage: `url(${p.poster || p.src})` }}>
              <span className="ig-tile-play" aria-hidden="true">▶</span>
            </span>
          ) : (
            <img src={p.src} alt={p.caption} loading="lazy" decoding="async" />
          )}
        </button>
      ))}
    </div>
  );
}

function IgTabBar({ account }) {
  return (
    <nav className="ig-tabbar" aria-label="Instagram tabs">
      <button aria-label="Feed"><IgIcon name="home" size={22} filled /></button>
      <button aria-label="Search"><IgIcon name="search" size={22} /></button>
      <button aria-label="Create"><IgIcon name="plus" size={22} /></button>
      <button aria-label="Reels"><IgIcon name="reels" size={22} /></button>
      <span
        className="ig-tab-avatar"
        style={{ background: `linear-gradient(135deg, ${account.avatarGradient[0]}, ${account.avatarGradient[1]})` }}
        aria-hidden="true"
      >
        {account.avatarEmoji}
      </span>
    </nav>
  );
}

/* ---------- post lightbox ---------- */
function IgLightbox({ post, account, onClose }) {
  return (
    <div className="ig-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Post details">
      <button className="ig-lightbox-close" onClick={onClose} aria-label="Close post">✕</button>
      <div className="ig-lightbox-card" onClick={(e) => e.stopPropagation()}>
        {post.type === 'video' ? (
          <video
            className="ig-lightbox-media"
            src={post.src}
            poster={post.poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
          />
        ) : (
          <img className="ig-lightbox-media" src={post.src} alt={post.caption} />
        )}
        <div className="ig-lightbox-meta">
          <div className="ig-lightbox-head">
            <span
              className="ig-mini-avatar"
              style={{ background: `linear-gradient(135deg, ${account.avatarGradient[0]}, ${account.avatarGradient[1]})` }}
              aria-hidden="true"
            >
              {account.avatarEmoji}
            </span>
            <strong>{account.handle}</strong>
          </div>
          <div className="ig-lightbox-actions">
            <button aria-label="Like"><IgIcon name="heart" size={22} /></button>
            <button aria-label="Comment"><IgIcon name="comment" size={22} /></button>
            <button aria-label="Share"><IgIcon name="send" size={22} /></button>
            <button className="ig-lightbox-save" aria-label="Save"><IgIcon name="bookmark" size={22} /></button>
          </div>
          <p className="ig-lightbox-likes"><b>{post.likes}</b></p>
          <p className="ig-lightbox-caption"><strong>{account.handle}</strong> {post.caption}</p>
          <p className="ig-lightbox-comments">View all {post.comments} comments</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- the case-study page ---------- */
export default function InstagramCase() {
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(null);

  /* Kick the entry animation on the next frame. */
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const { account, posts, notes } = instagram;

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

        {/* ---------- the phone (zooms in to fit the screen) ---------- */}
        <div className="phone-zoom">
          <div className="phone">
            <div className="phone-screen">
              <IgTopBar />
              <IgProfile account={account} />
              <IgGrid posts={posts} onOpen={setActive} />
              <IgTabBar account={account} />
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

      {active ? <IgLightbox post={active} account={account} onClose={() => setActive(null)} /> : null}
    </main>
  );
}
