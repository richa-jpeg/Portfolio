/* ============================================================
   IG POST — the floating Instagram cards and their focus view.

   Used by ImBesharamCase (#/imBesharam). A card is a compressed post:
   header, first slide, action row, like count and caption. Only the header
   and media sit inside the big open button — the action row is outside it,
   so the heart and bookmark are real toggles rather than buttons nested in
   a button.

   The focus view is a dialog. The on-media arrows and the left/right arrow
   keys walk the carousel, Escape closes it, Tab is trapped inside it, and
   focus returns to whatever opened it. The media is the only thing that
   loads in full resolution; the cards show the first slide.

   Like and save state is owned by the page, not by this file: the same post
   can be showing on a floating card, in the focus view and on the phone's
   grid, and all three have to agree.
   ============================================================ */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IgIcon } from './igIcons.jsx';

const handleOf = (account) => account.handle.replace(/^@/, '');
const formatCount = (n) => n.toLocaleString('en-US');

/* ---------- shared action row ---------- */
function IgActions({ liked, saved, onLike, onSave, size = 22 }) {
  return (
    <div className="igactions">
      <button
        type="button"
        className={liked ? 'on' : ''}
        onClick={onLike}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <IgIcon name="heart" size={size} filled={liked} />
      </button>
      <button type="button" aria-label="Comment">
        <IgIcon name="comment" size={size} />
      </button>
      <button type="button" aria-label="Share">
        <IgIcon name="send" size={size} />
      </button>
      <button
        type="button"
        className={`save${saved ? ' on' : ''}`}
        onClick={onSave}
        aria-pressed={saved}
        aria-label={saved ? 'Unsave' : 'Save'}
      >
        <IgIcon name="bookmark" size={size} filled={saved} />
      </button>
    </div>
  );
}

/* ---------- the card that floats beside the device ---------- */
export function IgPostCard({ post, account, onOpen, liked, saved, onLike, onSave }) {
  const handle = handleOf(account);
  const cover = post.cover || (post.slides && post.slides[0]) || post.poster || post.src;
  const slideCount = post.slides ? post.slides.length : 0;

  return (
    <article className="igcard">
      <button
        type="button"
        className="igcard-hit"
        onClick={() => onOpen(post)}
        aria-label={`Open post: ${post.caption}`}
      >
        <span className="igcard-head">
          <span
            className="igcard-avatar"
            style={{ background: `linear-gradient(135deg, ${account.avatarGradient[0]}, ${account.avatarGradient[1]})` }}
            aria-hidden="true"
          >
            {account.avatarEmoji}
          </span>
          <span className="igcard-id">
            <strong>{handle}</strong>
            <small>{post.audio || 'Original audio'}</small>
          </span>
          <span className="igcard-more" aria-hidden="true"><IgIcon name="dots" size={17} /></span>
        </span>

        <span className="igcard-media">
          <img src={cover} alt="" loading="lazy" decoding="async" draggable="false" />
          {post.type === 'video' ? <span className="igcard-play" aria-hidden="true">▶</span> : null}
          {slideCount > 1 ? (
            <span className="igcard-badge" aria-hidden="true">
              <IgIcon name="carousel" size={12} />
              1/{slideCount}
            </span>
          ) : null}
        </span>
      </button>

      <div className="igcard-body">
        <IgActions liked={liked} saved={saved} onLike={onLike} onSave={onSave} />
        <p className="igcard-likes">{formatCount(post.likes + (liked ? 1 : 0))} likes</p>
        <p className="igcard-caption"><strong>{handle}</strong> {post.caption}</p>
        {post.comments ? (
          <button type="button" className="igcard-comments" onClick={() => onOpen(post)}>
            View all {post.comments} comments
          </button>
        ) : null}
      </div>
    </article>
  );
}

/* ---------- the post in focus ---------- */
export function IgPostFocus({ post, account, onClose, liked, saved, onLike, onSave }) {
  const handle = handleOf(account);
  const slides = post.slides && post.slides.length
    ? post.slides
    : [post.cover || post.poster || post.src].filter(Boolean);
  const [idx, setIdx] = useState(0);
  const multiple = slides.length > 1;
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const mediaRef = useRef(null);

  /* The dialog is shaped by the slide, not by a fixed frame, so it has to
     know the slide's real proportions. They come from the media element
     itself; `--media-ratio` then lets the CSS size the media column. Until a
     slide reports its size (the very first paint, or a slow-loading slide)
     the CSS falls back to a portrait box. */
  const [ratio, setRatio] = useState(null);

  const readRatio = (el) => {
    if (!el) return;
    const w = el.naturalWidth || el.videoWidth;
    const h = el.naturalHeight || el.videoHeight;
    if (w && h) setRatio(w / h);
  };

  /* Cached images are already decoded when they mount, and they may never
     fire a load event we hear. Reading here catches them before the paint;
     the onLoad/onLoadedMetadata handlers catch the rest. */
  useLayoutEffect(() => {
    readRatio(mediaRef.current && mediaRef.current.querySelector('img, video'));
  }, [idx]);

  /* The case overlay — not the document — is the scroll container, so that
     is what has to be locked while the dialog is open. */
  useEffect(() => {
    const page = dialogRef.current && dialogRef.current.closest('.case-page');
    if (!page) return undefined;
    const previous = page.style.overflowY;
    page.style.overflowY = 'hidden';
    return () => { page.style.overflowY = previous; };
  }, []);

  useEffect(() => {
    const previous = document.activeElement;
    if (closeRef.current) closeRef.current.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (multiple && e.key === 'ArrowLeft') {
        e.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
        return;
      }
      if (multiple && e.key === 'ArrowRight') {
        e.preventDefault();
        setIdx((i) => Math.min(slides.length - 1, i + 1));
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusables = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [multiple, onClose, slides.length]);

  const current = slides[idx];

  return (
    <div
      className="igfocus"
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="igfocus-card"
        role="dialog"
        aria-modal="true"
        aria-label={`Post by ${handle}`}
        ref={dialogRef}
        style={ratio ? { '--media-ratio': ratio } : undefined}
      >
        <button type="button" className="igfocus-close" ref={closeRef} onClick={onClose} aria-label="Close post">
          <IgIcon name="close" size={19} />
        </button>

        <div className="igfocus-media" ref={mediaRef}>
          {post.type === 'video' ? (
            <video
              src={post.src}
              poster={post.poster}
              controls
              autoPlay
              playsInline
              onLoadedMetadata={(e) => readRatio(e.currentTarget)}
            />
          ) : (
            <img
              src={current}
              alt={`${handle} post, slide ${idx + 1}`}
              draggable="false"
              onLoad={(e) => readRatio(e.currentTarget)}
            />
          )}

          {multiple ? (
            <>
              <button
                type="button"
                className="igfocus-arrow prev"
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                aria-label="Previous slide"
              >
                <IgIcon name="chevron-left" size={20} />
              </button>
              <button
                type="button"
                className="igfocus-arrow next"
                onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))}
                disabled={idx === slides.length - 1}
                aria-label="Next slide"
              >
                <IgIcon name="chevron-right" size={20} />
              </button>
              <span className="igfocus-count">{idx + 1}/{slides.length}</span>
              <span className="igfocus-dots">
                {slides.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    className={`igfocus-dot${i === idx ? ' on' : ''}`}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === idx ? 'true' : undefined}
                  />
                ))}
              </span>
            </>
          ) : null}
        </div>

        <div className="igfocus-meta">
          <header className="igfocus-head">
            <span
              className="igcard-avatar"
              style={{ background: `linear-gradient(135deg, ${account.avatarGradient[0]}, ${account.avatarGradient[1]})` }}
              aria-hidden="true"
            >
              {account.avatarEmoji}
            </span>
            <span className="igcard-id">
              <strong>{handle}</strong>
              <small>{post.audio || 'Original audio'}</small>
            </span>
            <span className="igcard-more" aria-hidden="true"><IgIcon name="dots" size={18} /></span>
          </header>

          <div className="igfocus-scroll">
            <p className="igfocus-caption"><strong>{handle}</strong> {post.caption}</p>
            {post.comments ? <p className="igfocus-comments">View all {post.comments} comments</p> : null}
          </div>

          <div className="igfocus-foot">
            <IgActions liked={liked} saved={saved} onLike={onLike} onSave={onSave} size={24} />
            <p className="igfocus-likes">{formatCount(post.likes + (liked ? 1 : 0))} likes</p>
            {post.date ? <p className="igfocus-date">{post.date}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IgPostCard;
