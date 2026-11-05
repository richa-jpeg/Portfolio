/* ============================================================
   IG PHONE — one phone interior: chrome, profile, grid, lightbox.

   Three places render this with different content —
   ImBesharamPhoneCase (#/imBesharamPhone), JaigarhCase
   (#/jaigarhHeritageFestival) and the ImBesharam showcase (#/imBesharam) —
   which is the point of extracting it: the lightbox is a real interaction
   (open state, an Escape listener, a fixed-position overlay styled in
   cases.css) and copies of it would drift the first time one was touched.
   The pages stay separate components on separate routes; only the screen is
   shared.

   The showcase passes `onOpenPost`, because its posts are carousels and open
   in the shared focus dialog (components/ui/IgPost.jsx) instead of this
   file's single-image lightbox. Without the prop the phone behaves exactly
   as before.

   Nothing here is module-scoped: the only state is which post is open, it is
   per instance, and App.jsx keys the case overlay by route, so one page can
   never inherit another's open lightbox.

   `deviceRef` is attached to `.phone`, NOT to `.phone-screen`. `.phone` is
   the element carrying the device's pre-hidden entry state and the transform
   the pick-up flight writes (see cases.css), and it is the element
   ImBesharamPhoneCase hands to usePickFlight to measure the flight home.
   This file owns the phone's position in the layout too (`.phone-zoom`, the
   centred cell of `.case-layout`) so both pages centre it the same way; the
   showcase's own column simply wraps that cell.
   ============================================================ */
import { useEffect, useState } from 'react';
import { IgIcon } from './igIcons.jsx';

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
      {posts.map((p) => {
        /* A post can be a single image, a video, or a carousel. Carousels
           carry `slides`; their cover is the first slide, so the grid and the
           focus view agree without a second source of truth. */
        const cover = p.cover || p.poster || p.src || (p.slides && p.slides[0]);
        const slideCount = p.slides ? p.slides.length : 0;
        return (
          <button key={p.id} className="ig-tile" onClick={() => onOpen(p)} aria-label={`Open post: ${p.caption}`}>
            {p.type === 'video' ? (
              <span className="ig-tile-media" style={{ backgroundImage: `url(${cover})` }}>
                <span className="ig-tile-play" aria-hidden="true">▶</span>
              </span>
            ) : (
              <img src={cover} alt={p.caption} loading="lazy" decoding="async" />
            )}
            {slideCount > 1 ? (
              <span className="ig-tile-count" aria-hidden="true">
                <IgIcon name="carousel" size={12} />
                {slideCount}
              </span>
            ) : null}
          </button>
        );
      })}
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
export default function IgPhone({ account, posts, deviceRef, onOpenPost }) {
  const [active, setActive] = useState(null);

  /* The showcase page supplies `onOpenPost` because its posts open in the
     shared carousel focus view, not in this single-image lightbox. When it
     is supplied the internal lightbox is never mounted. */
  const open = onOpenPost || setActive;

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
            <IgGrid posts={posts} onOpen={open} />
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
