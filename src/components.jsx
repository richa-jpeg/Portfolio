/* ============================================================
   FIGJAM COMPONENT PRIMITIVES
   Note · Sticker · Tape · Arrow · Doodle · ProjectCard · UI bits
   ============================================================ */

/* ---------- Sticky note ---------- */
export function FigNote({ color = 'yellow', rotate = 0, className = '', style, children }) {
  return (
    <div
      className={`fig-note fig-${color} ${className}`}
      style={{ '--rot': `${rotate}deg`, ...style }}
    >
      {children}
    </div>
  );
}

/* ---------- Emoji sticker ---------- */
export function Sticker({ emoji, label, size = 92, rotate = 0, className = '' }) {
  return (
    <div
      className={`sticker ${className}`}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
    >
      <span className="sticker-emoji" style={{ fontSize: Math.round(size * 0.46) }}>
        {emoji}
      </span>
      {label ? (
        <span className="sticker-label" style={{ fontSize: Math.max(10, Math.round(size * 0.115)) }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/* ---------- Tape piece ---------- */
export function Tape({ rotate = -7, style }) {
  return (
    <span
      className="tape"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    />
  );
}

/* ---------- Hand-drawn connector arrow ---------- */
export function Arrow({ color = '#ff9f43', height = 110, flip = false, className = '' }) {
  return (
    <svg
      className={`arrow ${className}`}
      width="60"
      height={height}
      viewBox={`0 0 60 ${height}`}
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path
        d={`M30 6 C 22 26, 40 44, 28 64 C 20 78, 34 ${height - 36}, 30 ${height - 20}`}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d={`M19 ${height - 26} L30 ${height - 8} L41 ${height - 26}`}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Pen doodles (inline SVG, zero requests) ---------- */
const DOODLE_PATHS = {
  star: (
    <path d="M50 8 L61 38 L93 39 L67 59 L76 91 L50 72 L24 91 L33 59 L7 39 L39 38 Z" />
  ),
  squiggle: (
    <path d="M4 12 Q 14 2 24 12 T 44 12 T 64 12 T 84 12 T 104 12 T 118 12" />
  ),
  smiley: (
    <>
      <circle cx="50" cy="50" r="40" />
      <circle cx="36" cy="42" r="3" fill="currentColor" stroke="none" />
      <circle cx="64" cy="42" r="3" fill="currentColor" stroke="none" />
      <path d="M32 60 Q 50 74 68 60" />
    </>
  ),
  spark: (
    <path
      d="M50 6 L58 42 L94 50 L58 58 L50 94 L42 58 L6 50 L42 42 Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  heart: (
    <path
      d="M50 88 C 22 62 22 36 36 36 C 44 36 50 42 50 48 C 50 42 56 36 64 36 C 78 36 78 62 50 88 Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  arrowCurve: (
    <>
      <path d="M10 90 C 40 10 70 90 92 20" />
      <path d="M80 12 L93 20 L82 34" />
    </>
  ),
};

const DOODLE_VIEWBOX = {
  star: '0 0 100 100',
  squiggle: '0 0 120 24',
  smiley: '0 0 100 100',
  spark: '0 0 100 100',
  heart: '0 0 100 100',
  arrowCurve: '0 0 100 100',
};

export function Doodle({ kind = 'star', size = 80, className = '', style }) {
  return (
    <svg
      className={`doodle doodle-${kind} ${className}`}
      style={{ width: size, height: 'auto', ...style }}
      viewBox={DOODLE_VIEWBOX[kind] || '0 0 100 100'}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {DOODLE_PATHS[kind] || null}
    </svg>
  );
}

/* ---------- Taped project card (image + note, clickable) ---------- */
export function ProjectCard({ project, featured = false }) {
  const internal = !!project.route;
  const href = internal ? `#/${project.route}` : project.url;
  const externalProps = internal ? {} : { target: '_blank', rel: 'noopener noreferrer' };
  return (
    <a
      className={`project-card${featured ? ' project-featured' : ''}${internal ? ' project-internal' : ''}`}
      href={href}
      {...externalProps}
      aria-label={`Open ${internal ? 'case study' : 'project'}: ${project.title}`}
    >
      <div className="project-media">
        <Tape rotate={12} style={{ right: 24, top: -10 }} />
        {internal && <span className="project-badge">Case study</span>}
        {/* The rounded photo lives in its own overflow-hidden clip, so the
            tapes (siblings, hanging above the top edge) are never cut off. */}
        <span className="project-media-clip">
          {project.video ? (
            <span
              className="project-thumb"
              style={{ backgroundImage: `url(${project.image})` }}
              role="img"
              aria-label={project.title}
            >
              <span className="play-dot">▶</span>
            </span>
          ) : (
            <img src={project.image} alt={project.title} loading="lazy" decoding="async" width="640" height="400" />
          )}
        </span>
      </div>
      <div className="project-meta">
        <FigNote color={project.color || 'blue'} rotate={project.rotate || 0} className="project-note">
          <strong>{project.title}</strong>
          <span>{project.desc}</span>
        </FigNote>
        <span className="project-open" aria-hidden="true">{internal ? '→' : '↗'}</span>
      </div>
    </a>
  );
}

/* ---------- Section wrapper with marker-highlighted title ---------- */
export function Section({ id, kicker, title, highlight, className = '', children }) {
  return (
    <section id={id} className={`section reveal ${className}`}>
      <header className="section-head">
        {kicker ? <span className="section-kicker">{kicker}</span> : null}
        <h2 className="section-title">
          {title} <mark>{highlight}</mark>
        </h2>
      </header>
      {children}
    </section>
  );
}

/* ---------- Top navigation (fixed, outside the zoomed board) ---------- */
export function Nav({ links }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <nav className="topnav" aria-label="Sections">
      <span className="topnav-brand" aria-hidden="true">📌 Portfolio Board</span>
      {links.map((l) => (
        <button key={l.id} onClick={() => go(l.id)}>
          {l.label}
        </button>
      ))}
    </nav>
  );
}

/* ---------- Zoom controls (bottom-left, like FigJam) ---------- */
export function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="zoom-controls" role="group" aria-label="Zoom controls">
      <button onClick={onZoomOut} aria-label="Zoom out" title="Zoom out">−</button>
      <button className="zoom-level" onClick={onReset} title="Reset to 100%">
        {Math.round(zoom * 100)}%
      </button>
      <button onClick={onZoomIn} aria-label="Zoom in" title="Zoom in">+</button>
    </div>
  );
}
