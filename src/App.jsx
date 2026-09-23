/* ============================================================
   APP — the board, the chrome, and the case-study overlay router.

   The document is the scroller (Lenis drives it). The old
   `.board-viewport` fixed scroller and its `transform: scale(zoom)`
   are gone, and that is not cosmetic: ScrollTrigger pins with
   `position: fixed` when the viewport is the scroller, and ANY
   transformed ancestor becomes that element's containing block. The
   old zoom transform sat on the ancestor of every chapter, so every
   pin would have been positioned against the wrong box.

   Routing is hash-based (no dependency, works on GitHub Pages).
   Case studies render as fixed overlays; the board stays mounted
   behind them so its scroll position and pins survive the trip.
   ============================================================ */
import { useEffect, useState } from 'react';
import { person } from './content.jsx';
import { ScrollTrigger } from './lib/gsapSetup.js';
import { useLenis, getLenis } from './lib/useLenis.js';
import { useReducedMotion } from './lib/useReducedMotion.js';

import Nav from './components/chrome/Nav.jsx';
import Cursor from './components/chrome/Cursor.jsx';
import ScrollProgress from './components/chrome/ScrollProgress.jsx';
import NoiseOverlay from './components/chrome/NoiseOverlay.jsx';
import Preloader from './components/chrome/Preloader.jsx';

import Hero from './components/chapters/Hero.jsx';
import Featured from './components/chapters/Featured.jsx';
import CurtainReveal from './components/chapters/CurtainReveal.jsx';
import WarpPortal from './components/chapters/WarpPortal.jsx';
import About from './components/chapters/About.jsx';
import Experience from './components/chapters/Experience.jsx';
import MoreWork from './components/chapters/MoreWork.jsx';
import Contact from './components/chapters/Contact.jsx';
import Footer from './components/chapters/Footer.jsx';

import InstagramCase from './InstagramCase.jsx';
import PhoneAppCase from './PhoneAppCase.jsx';
import LinkedInCase from './LinkedInCase.jsx';
import BookletCase from './BookletCase.jsx';

const CASES = {
  '#/instagram': { title: 'Instagram grid — Richa', Component: InstagramCase },
  '#/phone': { title: 'Leafy app — Richa', Component: PhoneAppCase },
  '#/linkedin': { title: 'LinkedIn campaign — Richa', Component: LinkedInCase },
  '#/booklet': { title: 'Brand booklet — Richa', Component: BookletCase },
};

function Board({ heroActive }) {
  return (
    <main className="board">
      <Hero active={heroActive} />

      {/* The Chapter 01 gate is now just the gold card: the dark backdrop it
          used to wipe over is gone, so it takes no runway and no index. */}
      <CurtainReveal kicker="Chapter 01" title={['SELECTED', 'WORK']} />

      <Featured />

      <WarpPortal index="02" kicker="Chapter 02" title={['THE', 'CRAFT']} runway={1.5} />

      <About />

      <Experience />

      <MoreWork />

      <Contact />

      <Footer />
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const reduced = useReducedMotion();

  useLenis();

  /* ---------- hash routing ---------- */
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const active = CASES[route];
  const isHome = route === '' || route === '#/' || route === '#';
  const showPreloader = !preloaderDone && isHome && !reduced;

  /* ---------- scroll locking ----------
     One derived flag, so the preloader and the case overlay can never
     fight over who owns the scroll lock. */
  const locked = showPreloader || Boolean(active);
  useEffect(() => {
    const lenis = getLenis();
    if (locked) lenis?.stop();
    else lenis?.start();
  }, [locked]);

  /* ---------- leaving / returning from a case study ----------
     Hiding the board with `display: none` would collapse the document
     height, clamp scrollY to 0, and dump you at the top of the page on
     return — silently. `visibility: hidden` keeps layout intact, so
     the scroll position and every pin geometry survive untouched. */
  useEffect(() => {
    if (!active) return undefined;
    const y = window.scrollY;
    return () => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };
  }, [active]);

  /* ---------- document title ---------- */
  useEffect(() => {
    document.title = active ? active.title : `${person.name} — ${person.role}`;
  }, [active]);

  /* ---------- measure once text and images have settled ----------
     @fontsource ships `font-display: swap`, so at first paint the page
     is still laid out in the fallback face. Every width-dependent
     trigger (the Featured rail especially) re-measures on refresh, and
     function-based start/end values make that refresh self-correcting. */
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh, { once: true });
    return () => {
      cancelled = true;
    };
  }, []);

  const onPreloaderDone = () => {
    setPreloaderDone(true);
    /* The runway was locked while the preloader ran; re-measure now
       that the page is about to be interactive. */
    ScrollTrigger.refresh();
  };

  return (
    <>
      <NoiseOverlay />
      <Cursor />
      <ScrollProgress />
      <Nav />

      <div className={`board-ui${active ? ' board-ui-hidden' : ''}`} aria-hidden={active ? 'true' : undefined}>
        {/* Hold the hero typing until the preloader has lifted AND no
            case overlay is covering the page. Starting at mount would
            spend the first ~1.5s of the animation hidden behind the
            preloader; deep-linking to a case study would spend all of it
            behind the overlay. */}
        <Board heroActive={!showPreloader && !active} />
      </div>

      {active ? <active.Component /> : null}

      {showPreloader ? <Preloader onDone={onPreloaderDone} brand={`${person.name} — Reel`} /> : null}

      {/* Announce the overlay for screen readers, since it appears
          without a navigation event. */}
      <span className="visually-hidden" aria-live="polite">
        {active ? `${active.title} case study opened` : ''}
      </span>
    </>
  );
}
