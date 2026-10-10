/* ============================================================
   IG PHONE — one phone interior: chrome, profile, grid, lightbox.

   Two case pages render this with different content —
   ImBesharamPhoneCase (#/imBesharamPhone) and JaigarhCase
   (#/jaigarhHeritageFestival) — which is the point of extracting it: the
   lightbox is a real interaction (open state, an Escape listener, a
   fixed-position overlay styled in cases.css) and two copies of it would
   drift the first time one was touched. The two pages stay separate
   components on separate routes; only the screen is shared.

   Nothing here is module-scoped: the only state is which post is open, it is
   per instance, and App.jsx keys the case overlay by route, so one page can
   never inherit the other's open lightbox.

   `deviceRef` is attached to `.phone`, NOT to `.phone-screen`. `.phone` is
   the element carrying the device's pre-hidden entry state and the transform
   the pick-up flight writes (see cases.css), and it is the element
   ImBesharamPhoneCase hands to usePickFlight to measure the flight home.
   This file owns the phone's position in the layout too (`.phone-zoom`, the
   centred cell of `.case-layout`) so both pages centre it the same way.
   ============================================================ */
import { useEffect, useState } from 'react';

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

/* ---------- the shell itself ---------- */
export default function IgPhone({ account, posts, deviceRef }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="phone-zoom">
        <div className="phone" ref={deviceRef}>
          <div className="phone-screen">
            <IgTopBar />
            <IgProfile account={account} />
            <IgGrid posts={posts} onOpen={setActive} />
            <IgTabBar account={account} />
          </div>
        </div>
      </div>

      {/* Fixed-position (cases.css), so it is out of the case grid's flow and
          stays a sibling of the phone rather than a cell in it. */}
      {active ? <IgLightbox post={active} account={account} onClose={() => setActive(null)} /> : null}
    </>
  );
}
