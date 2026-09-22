/* ============================================================
   HERO — two beats, then scroll takes over.

   Act 1 (time): the question types itself out, mono, with a caret.
   Act 2 (time): the question dims and blurs back, and the answer
                 arrives as a per-character wave — each glyph rising
                 out of its mask, un-squashing as it lands — with a
                 gold bloom opening behind it.
   Act 3 (scroll): the pinned stage scales back and fades, and the
                 gold rule draws across.

   The reveal timeline is built once, paused, and played from
   TypeWriter's onDone — so the answer can never start before the
   question has finished, and a fast reload can't desync them.
   ============================================================ */
import { useRef } from 'react';
import { hero, person } from '../../content.jsx';
import { gsap, EASE } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';
import { charWave } from '../../lib/textFx.js';
import TypeWriter from '../effects/TypeWriter.jsx';
import MaskLines from '../effects/MaskLines.jsx';

export default function Hero({ active = true }) {
  const sectionRef = useRef(null);
  const tlRef = useRef(null);
  const reduced = useReducedMotion();

  /* Build the answer-reveal timeline on mount, paused. */
  useGsapContext(sectionRef, (el) => {
    const question = el.querySelector('.hero-question');
    const chars = el.querySelectorAll('.hero-answer .char');
    const glow = el.querySelector('.hero-glow');
    const rest = el.querySelectorAll('.hero-fade');

    gsap.set(rest, { opacity: 0, y: 24 });
    gsap.set(glow, { opacity: 0, scale: 0.55 });
    gsap.set(chars, { yPercent: 120, opacity: 0, scaleY: 2.3, scaleX: 0.7 });

    const tl = gsap.timeline({ paused: true });

    /* Beat after the last character lands, so the finished sentence can
       actually be read before anything else moves. Everything else in
       the timeline is offset from here. */
    const HOLD = 1.15;
    /* The answer starts just after the question begins to recede, so the
       two overlap rather than reading as two separate beats. */
    const RISE = HOLD + 0.45;

    /* The question STAYS SHARP and stays put. It only loses a quarter of
       its opacity, so it remains fully readable as the answer arrives —
       the hierarchy comes from the answer being three times the size and
       gold, not from hiding the setup line. No blur: the sentence is the
       whole point of the first beat and blurring it threw it away. */
    tl.to(question, { opacity: 0.75, duration: 1.1, ease: EASE.soft }, HOLD);

    charWave(chars, tl, RISE, { total: 1.6, stagger: 0.65 });
    tl.to(glow, { opacity: 1, scale: 1, duration: 2.2, ease: EASE.soft }, RISE + 0.1);
    tl.to(
      rest,
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: EASE.soft },
      RISE + 2
    );

    tlRef.current = tl;
    return () => {
      tlRef.current = null;
    };
  }, []);

  /* Scroll phase — pinned. */
  useGsapContext(
    sectionRef,
    (el) => {
      const stage = el.querySelector('.hero-stage');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
          start: 'top top',
          end: '+=110%',
          scrub: 1,
        },
      });
      tl.to('.hero-inner', { scale: 0.92, opacity: 0, y: -50, ease: 'none' }, 0)
        .to('.hero-glow', { opacity: 0, scale: 1.3, ease: 'none' }, 0)
        .to('.hero-rule', { scaleX: 1, ease: 'none' }, 0);
    },
    [reduced]
  );

  const play = () => tlRef.current?.play();

  /* Reduced motion: no typing, no pin — just the composed end state. */
  if (reduced) {
    return (
      <section className="chapter chapter-hero" id="hero" ref={sectionRef}>
        <div className="stage hero-stage">
          <div className="hero-inner">
            <p className="hero-question">{hero.question}</p>
            <h1 className="hero-answer">
              <MaskLines lines={hero.answer} />
            </h1>
            <HeroRest />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="chapter chapter-hero" id="hero" ref={sectionRef}>
      <div className="stage hero-stage">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-rule" aria-hidden="true" />

        <div className="hero-inner">
          <p className="hero-question">
            {active ? (
              /* 62ms/char ≈ 2.5s for this sentence — slow enough to
                 follow the words as they land rather than watching a
                 line snap into place. */
              <TypeWriter text={hero.question} speed={62} startDelay={480} onDone={play} />
            ) : (
              /* Deliberately empty while the preloader is up: the
                 sentence must not be readable before it has been typed.
                 The paragraph's min-height holds the layout open, and
                 the hidden copy keeps it announced to screen readers. */
              <span className="visually-hidden">{hero.question}</span>
            )}
          </p>

          <h1 className="hero-answer">
            <MaskLines lines={hero.answer} />
          </h1>

          <HeroRest />
        </div>
      </div>
    </section>
  );
}

/* Meta row + scroll cue. Kept in a child so the reduced-motion branch
   renders exactly the same markup as the animated one. */
function HeroRest() {
  return (
    <>
      <dl className="hero-meta hero-fade">
        {hero.meta.map((m) => (
          <div className="hero-meta-item" key={m.label}>
            <dt className="text-label">{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
      <div className="hero-cue hero-fade">
        <span className="text-label">{hero.scrollCue}</span>
        <span className="hero-cue-line" aria-hidden="true" />
      </div>
      <p className="visually-hidden">
        {person.name}, {person.role}
      </p>
    </>
  );
}
