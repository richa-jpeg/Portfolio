/* ============================================================
   APP — hash router + the board
   • The board: vertical scroll is the only movement (content is
     laid out top-to-bottom); horizontal movement is not permitted.
   • "FigJam-like" zoom is bounded (60%–150%) via ⌘/Ctrl+scroll
     or the bottom-left controls. No infinite canvas.
   • Routes (no router dependency — works on GitHub Pages):
       #/            the board
       #/instagram   Instagram case study (phone zoom-in page)
   ============================================================ */
import { Fragment, useEffect, useRef, useState } from 'react';
import { content, person } from './content.jsx';
import avatar from './public/avatar.jpg';
import {
  FigNote, Sticker, Tape, Arrow, Doodle, ProjectCard, ZoomControls, Nav, Section,
} from './components.jsx';
import InstagramCase from './InstagramCase.jsx';

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.5;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const ARROW_COLORS = ['#ff9f43', '#9747ff', '#4cc9f0'];

/* ------------------------------------------------------------
   THE BOARD PAGE (kept mounted while on other routes so zoom
   and scroll position survive navigation)
   ------------------------------------------------------------ */
function Board() {
  const [zoom, setZoom] = useState(1);
  const [showHint, setShowHint] = useState(true);
  const [spaceH, setSpaceH] = useState(0);      // natural (unscaled) board height
  const viewportRef = useRef(null);
  const boardRef = useRef(null);
  const zoomRef = useRef(1);
  zoomRef.current = zoom;

  /* Measure the board's natural height so the scroll area matches the
     zoomed content exactly — scroll never goes past the content. */
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const measure = () => setSpaceH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ⌘/Ctrl + wheel = bounded zoom. Attached natively because
     preventDefault requires a non-passive listener. Plain scrolling
     (no modifier) stays untouched → vertical movement. */
  useEffect(() => {
    const vp = viewportRef.current;
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom((z) => clamp(z * Math.exp(-e.deltaY * 0.0022), MIN_ZOOM, MAX_ZOOM));
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, []);

  /* Reveal sections as they scroll into view. */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* First-visit hint fades away. */
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const zoomBy = (f) => setZoom((z) => clamp(z * f, MIN_ZOOM, MAX_ZOOM));

  return (
    <div className="board-viewport" ref={viewportRef}>
      <Nav links={content.nav} />

      <div className="zoom-space" style={{ height: spaceH ? spaceH * zoom : undefined }}>
        <div className="board" ref={boardRef} style={{ transform: `scale(${zoom})` }}>

          {/* ============ 1 · HERO — ABOUT ME ============ */}
          <Section id="about" kicker="01 · Hello there" title="About" highlight="me">
            <div className="hero">
              <div className="hero-left">
                <div className="hero-stickers">
                  {content.hero.stickers.map((s) => (
                    <Sticker key={s.emoji} emoji={s.emoji} label={s.label} size={s.size} rotate={s.rotate} />
                  ))}
                </div>

                <FigNote color="yellow" rotate={-1.5} className="hero-note">
                  {content.hero.note}
                </FigNote>
                <Doodle kind="squiggle" size={210} className="hero-squiggle" />

                <div className="hero-chips">
                  {content.hero.chips.map((c) =>
                    c.href ? (
                      <a key={c.label} className={`chip chip-${c.color}`} href={c.href} target="_blank" rel="noopener noreferrer">
                        {c.label}
                      </a>
                    ) : (
                      <span key={c.label} className={`chip chip-${c.color}`}>{c.label}</span>
                    )
                  )}
                </div>
              </div>

              <div className="hero-right">
                <div className="hero-photo-wrap">
                  <Tape rotate={-30} style={{ left: -16, top: 1, width: "5rem" }} />
                  <Tape rotate={12} style={{ right: -26, top: 52, width: "4rem" }} />
                  <div className="hero-photo">
                    <img
                      src={avatar}
                      alt={`${person.name} avatar`}
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                        event.currentTarget.nextElementSibling.hidden = false;
                      }}
                    />
                    <span hidden>{person.photoInitials}</span>
                  </div>
                </div>
                <div className="hero-doodles" aria-hidden="true">
                  <Doodle kind="star" size={64} className="d-anim" style={{ left: -14, top: -46, '--dur': '5.2s' }} />
                  <Doodle kind="smiley" size={56} className="d-anim" style={{ right: -30, top: 96, '--dur': '6.4s' }} />
                  <Doodle kind="arrowCurve" size={110} style={{ left: -96, bottom: -58, color: '#ff9f43' }} />
                  <Doodle kind="spark" size={46} className="d-anim" style={{ right: -8, top: -30, '--dur': '4.6s', color: '#ffb03a' }} />
                  <Doodle kind="heart" size={48} className="d-anim" style={{ left: 40, bottom: -44, '--dur': '5.8s', color: '#ff8fb3' }} />
                </div>
              </div>
            </div>
          </Section>

          {/* ============ 2 · WORK EXPERIENCE ============ */}
          <Section id="experience" kicker="02 · Experience" title="Where I've" highlight="worked">
            <div className="timeline">
              {content.experience.map((job, i) => (
                <Fragment key={job.id}>
                  {i > 0 && <Arrow color={ARROW_COLORS[i % ARROW_COLORS.length]} height={92} />}
                  <article className="job">
                    <FigNote color={job.color} rotate={job.rotate} className="job-note">
                      <header className="job-head">
                        <strong className="job-role">{job.role}</strong>
                        <span className="job-co">{job.company}</span>
                        <span className="job-period">{job.period}</span>
                      </header>
                      <ul className="job-points">
                        {job.points.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </FigNote>
                    {job.sticker ? (
                      <Sticker
                        emoji={job.sticker.emoji}
                        label={job.sticker.label}
                        size={job.sticker.size}
                        rotate={job.sticker.rotate}
                        className="job-sticker"
                      />
                    ) : null}
                  </article>
                </Fragment>
              ))}
            </div>
          </Section>

          {/* ============ 3 · PROJECTS I'M PROUD OF ============ */}
          <Section id="featured" kicker="03 · Projects I'm proud of" title="Pinned to" highlight="the board">
            <div className="featured-grid">
              {content.featured.map((p) => (
                <ProjectCard key={p.id} project={p} featured />
              ))}
            </div>
          </Section>

          {/* ============ 4 · MORE PROJECTS ============ */}
          <Section id="more" kicker="04 · More projects" title="More things" highlight="I made">
            <div className="more-grid">
              {content.more.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </Section>

          {/* ============ 5 · CONTACT ME ============ */}
          <Section id="contact" kicker="05 · Contact" title="Say" highlight="hello">
            <div className="contact-wrap">
              <div className="contact-top">
                <Sticker emoji="👋" label="Hi!" size={84} rotate={-8} className="contact-sticker" />
                <Sticker emoji="📮" label="Mail me" size={84} rotate={6} className="contact-sticker" />
              </div>
              <FigNote color="pink" rotate={0} className="contact-note">
                {content.contact.note}
                <a className="mail-link" href={`mailto:${person.email}`}>{person.email}</a>
              </FigNote>
              <div className="socials">
                {content.contact.socials.map((s) => (
                  <a key={s.label} className="social" href={s.url} target="_blank" rel="noopener noreferrer">
                    <span aria-hidden="true">{s.emoji}</span> {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Section>

          <footer className="board-footer">
            <FigNote color="yellow" rotate={-0.6}>
              Made with 💛 on a FigJam board · {new Date().getFullYear()}
            </FigNote>
          </footer>

        </div>
      </div>

      <ZoomControls
        zoom={zoom}
        onZoomIn={() => zoomBy(1.15)}
        onZoomOut={() => zoomBy(1 / 1.15)}
        onReset={() => setZoom(1)}
      />

      <div className={`zoom-hint${showHint ? '' : ' hide'}`} role="status">
        ⌘/Ctrl + scroll to zoom · scroll to move ↓
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   ROUTER SHELL — keeps the board mounted (state preserved)
   and overlays the case-study page when routed there.
   ------------------------------------------------------------ */
export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const isCase = route.startsWith('#/instagram');

  useEffect(() => {
    document.title = isCase ? 'Instagram case study — Richa' : 'Richa — Portfolio Board';
  }, [isCase]);

  return (
    <>
      <div className={`board-ui${isCase ? ' board-ui-hidden' : ''}`}>
        <Board />
      </div>
      {isCase && <InstagramCase />}
    </>
  );
}
