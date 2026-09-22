/* ============================================================
   NAV — fixed, mono, chapter-numbered.

   Active-section tracking uses ScrollTrigger rather than an
   IntersectionObserver: the chapters are pinned, so their
   intersection ratios are measured against a `position: fixed`
   element and IO reports nonsense.
   ============================================================ */
import { useEffect, useRef, useState } from 'react';
import { nav, site } from '../../content.jsx';
import { gsap, ScrollTrigger } from '../../lib/gsapSetup.js';
import { scrollTo } from '../../lib/useLenis.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';

export default function Nav() {
  const [active, setActive] = useState(nav[0]?.id);
  const reduced = useReducedMotion();
  const ref = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;
    const triggers = nav
      .map((l) => {
        const el = document.getElementById(l.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActive(l.id);
          },
        });
      })
      .filter(Boolean);
    return () => triggers.forEach((t) => t.kill());
  }, [reduced]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) scrollTo(el, { duration: 1.1 });
  };

  return (
    <nav className="nav" ref={ref} aria-label="Chapters">
      <button className="nav-brand hover-line" onClick={() => scrollTo(0, { duration: 1.1 })}>
        Richa<span className="nav-brand-dot">.</span>
      </button>

      <ul className="nav-list">
        {nav.map((l) => (
          <li key={l.id}>
            <button
              className={`nav-link hover-line${active === l.id ? ' is-active' : ''}`}
              onClick={() => go(l.id)}
            >
              <span className="nav-index text-mono">{l.index}</span>
              <span>{l.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <a className="nav-reel" href={site.reel} target="_blank" rel="noopener noreferrer">
        <span className="nav-reel-dot" aria-hidden="true" />
        {site.showreelLabel}
      </a>
    </nav>
  );
}
