/* ============================================================
   FOOTER — a giant ghosted wordmark behind the bottom bar.

   The veil is what sells it: without a gradient fading the wordmark
   into the page background, the huge type just ends at a hard edge
   and reads as a layout mistake.
   ============================================================ */
import { contact, person } from '../../content.jsx';
import { scrollTo } from '../../lib/useLenis.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-top">
        <button className="footer-brand hover-line" onClick={() => scrollTo(0, { duration: 1.2 })}>
          {person.name}
          <span className="footer-brand-dot">.</span>
        </button>
        <p className="footer-note text-label">{contact.footerNote}</p>
      </div>

      <div className="footer-ghost-wrap" aria-hidden="true">
        <span className="footer-ghost">{person.name}</span>
        <span className="footer-veil" />
      </div>

      <div className="footer-bar">
        <span className="text-label">
          © {year} {person.name}
        </span>
        <ul className="footer-links">
          {contact.socials.map((s) => (
            <li key={s.label}>
              <a className="hover-line" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="footer-mail hover-line" href={`mailto:${person.email}`}>
          {person.email}
        </a>
      </div>
    </footer>
  );
}
