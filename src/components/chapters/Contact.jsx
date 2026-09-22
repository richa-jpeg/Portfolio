/* ============================================================
   CONTACT — the last chapter.
   ============================================================ */
import { useRef } from 'react';
import { contact, person } from '../../content.jsx';
import { gsap, EASE } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { charWave } from '../../lib/textFx.js';
import MaskLines from '../effects/MaskLines.jsx';
import TiltCard from '../effects/TiltCard.jsx';

export default function Contact() {
  const rootRef = useRef(null);

  useGsapContext(rootRef, (el) => {
    const chars = el.querySelectorAll('.contact-title .char');
    gsap.set(chars, { yPercent: 120, opacity: 0, scaleY: 2.3, scaleX: 0.7 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 72%' },
    });

    charWave(chars, tl, 0, { total: 0.9 });
    tl.fromTo(
      '.contact-reveal',
      { opacity: 0, y: 44 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: EASE.smooth },
      0.35
    );
  }, []);

  return (
    <section className="chapter chapter-contact" id="contact" ref={rootRef}>
      <div className="contact-inner">
        <header className="contact-head">
          <span className="text-label">{contact.kicker}</span>
          <h2 className="text-chapter contact-title">
            <MaskLines lines={contact.title} />
          </h2>
        </header>

        <p className="contact-lead text-lead contact-reveal">{contact.lead}</p>

        <TiltCard className="contact-card contact-reveal">
          <div className="pc-glow" aria-hidden="true" />
          <div className="pc-sheen" aria-hidden="true" />

          <div className="pc-body">
            <span className="pc-status">
              <span className="pc-status-dot" aria-hidden="true" />
              Available for work
            </span>

            <h3 className="pc-name">{person.name}</h3>
            <p className="pc-role">{person.role}</p>

            <a className="pc-mail" href={`mailto:${person.email}`}>
              {person.email}
            </a>

            <ul className="pc-socials">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </TiltCard>

        <a className="contact-cta contact-reveal" href={`mailto:${person.email}`}>
          <span>{contact.cta}</span>
          <span className="contact-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
