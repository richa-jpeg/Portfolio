/* ============================================================
   ABOUT — the statement, revealed by scroll.

   The chapter wordmark uses the same per-character wave as the hero
   answer, so the two big type moments on the page share a
   vocabulary. The lead paragraph resolves word by word behind it.
   ============================================================ */
import { useRef } from 'react';
import { about } from '../../content.jsx';
import { gsap, EASE } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { charWave } from '../../lib/textFx.js';
import { toWords } from '../../lib/split.js';
import MaskLines from '../effects/MaskLines.jsx';

export default function About() {
  const rootRef = useRef(null);

  useGsapContext(rootRef, (el) => {
    const chars = el.querySelectorAll('.mask-inner .char');
    const words = el.querySelectorAll('.about-word');
    const pillars = el.querySelectorAll('.pillar');

    gsap.set(chars, { yPercent: 120, opacity: 0, scaleY: 2.3, scaleX: 0.7 });
    gsap.set(words, { opacity: 0, y: 18 });
    gsap.set(pillars, { opacity: 0, y: 44 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 72%' },
    });

    charWave(chars, tl, 0, { total: 1 });
    tl.to(words, { opacity: 1, y: 0, duration: 0.6, stagger: 0.025, ease: EASE.soft }, 0.35)
      .to(pillars, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: EASE.soft }, 0.7);
  }, []);

  const words = toWords(about.lead);

  return (
    <section className="chapter chapter-about" id="craft" ref={rootRef}>
      <div className="about-inner">
        <header className="about-head">
          <span className="text-label">{about.kicker}</span>
          <h2 className="text-chapter about-title">
            <MaskLines lines={about.title} />
          </h2>
        </header>

        <p className="about-lead">
          {words.map((w, i) => (
            <span className="about-word" key={`${w}-${i}`}>
              {w}{' '}
            </span>
          ))}
        </p>

        <div className="about-pillars">
          {about.pillars.map((p) => (
            <article className="pillar" key={p.index}>
              <span className="pillar-index text-mono">{p.index}</span>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-text">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
