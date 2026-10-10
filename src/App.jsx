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
import { person, routes, featured, table } from './content.jsx';
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

import MyFitnessCase from './MyFitnessCase.jsx';
import ImBesharamCase from './ImBesharamCase.jsx';
import ImBesharamPhoneCase from './ImBesharamPhoneCase.jsx';
import ImBesharamTabletCase from './ImBesharamTabletCase.jsx';
import ImBesharamBookletCase from './ImBesharamBookletCase.jsx';
import JaigarhCase from './JaigarhCase.jsx';
import MillimetreCase from './MillimetreCase.jsx';

/* The case pages, keyed by the route that opens them.

   Every key is `'#/' + routes.<key>` — the route strings themselves live in
   content.jsx, so the rail card that links here, the table object that flies
   here, the destination's own usePickFlight argument and its back link are all
   reading the same values. A route string written twice is a route string that
   can disagree with itself, and that failure is silent (see `routes` in
   content.jsx).

   The `title` is what the document title and the screen-reader announcement
   use while the case is open. */
const CASES = {
  [`#/${routes.myFitness}`]: { title: `My Fitness — ${person.name}`, Component: MyFitnessCase },
  [`#/${routes.imBesharam}`]: { title: `ImBesharam — ${person.name}`, Component: ImBesharamCase },
  [`#/${routes.imBesharamPhone}`]: { title: `ImBesharam phone — ${person.name}`, Component: ImBesharamPhoneCase },
  [`#/${routes.imBesharamTablet}`]: { title: `ImBesharam tablet — ${person.name}`, Component: ImBesharamTabletCase },
  [`#/${routes.imBesharamBooklet}`]: { title: `ImBesharam booklet — ${person.name}`, Component: ImBesharamBookletCase },
  [`#/${routes.jaigarh}`]: { title: `Jaigarh Heritage Festival — ${person.name}`, Component: JaigarhCase },
  [`#/${routes.millimetre}`]: { title: `Millimetre — ${person.name}`, Component: MillimetreCase },
};

/* Dev-only: every link into a case page is checked against the table above
   once, at load. A typo'd `routes.<key>` is `undefined`, which renders as
   href="#/undefined" and simply does nothing when clicked — the wrong page
   opening quietly is the bug this whole routing shape exists to prevent, so in
   development it says so out loud instead. */
if (import.meta.env.DEV) {
  const declared = new Set(Object.values(routes));
  const pages = new Set(Object.keys(CASES).map((k) => k.slice(2)));

  declared.forEach((r) => {
    if (!pages.has(r)) console.error(`[routes] "${r}" is declared in content.jsx but no case page answers to it.`);
  });
  [...featured, ...table.objects].forEach((p) => {
    if (!declared.has(p.route)) console.error(`[routes] "${p.title}" links to "${p.route}", which is not a declared route.`);
  });
}

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
     scroll trigger re-measures on refresh, and function-based start/end
     values make that refresh self-correcting. (The Featured rail is no
     longer one of them — it carries no ScrollTrigger now, and watches
     its own track with a ResizeObserver instead.) */
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

      {/* Keyed by route: two routes that ever resolved to the same component
          type would otherwise reuse one instance, carrying the open lightbox,
          the flipbook's page and the pick flight across the navigation. */}
      {active ? <active.Component key={route} /> : null}

      {showPreloader ? <Preloader onDone={onPreloaderDone} brand={`${person.name} — Portfolio`} /> : null}

      {/* Announce the overlay for screen readers, since it appears
          without a navigation event. */}
      <span className="visually-hidden" aria-live="polite">
        {active ? `${active.title} case study opened` : ''}
      </span>
    </>
  );
}
