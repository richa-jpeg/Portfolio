/* ============================================================
   IMBESHARAM — #/imBesharam

   The page the ImBesharam card opens: two scroll views, each pairing one
   of the brand's pieces with the social work around it.

   View 1 stands the Instagram phone on the left and floats three of the
   brand's carousels on the right. The cards start behind the phone and fly
   out to their places when the view enters — the posts should read as
   coming off the feed, not as a grid that simply loaded. Clicking a card
   (or a tile on the phone) opens that post in the focus dialog.

   View 2 centres the zine booklet under its heading — no floating cards
   around it. Its pages are the designed artwork from src/public/IMB/Zine,
   opened as a closed cover the visitor can flip through.

   WHY THE DEVICES ENTER WITH `.is-in`: `.phone` and `.booklet` are already
   pre-hidden in cases.css for the standalone case pages, and that state is
   released by `.case-layout.in`. This page has no `.case-layout`, so it
   gives each view its own release class. The cards are hidden by GSAP in a
   layout effect instead of CSS, so reduced-motion users (for whom this
   effect never hides anything) still see them.

   The scroll container is `.case-page` itself, so the IntersectionObserver
   below is rooted there rather than on the viewport.
   ============================================================ */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { imBesharamShowcase } from './content.jsx';
import { gsap } from './lib/gsapSetup.js';
import { useReducedMotion } from './lib/useReducedMotion.js';
import IgPhone from './components/ui/IgPhone.jsx';
import BookletDevice from './components/ui/Booklet.jsx';
import { IgPostCard, IgPostFocus } from './components/ui/IgPost.jsx';

const { account, feed, zine } = imBesharamShowcase;

const toggleId = (set, id) => {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

/* The booklet switches to a single page on the same breakpoint the layout
   stacks at. In spread mode the library needs two 260px pages side by side,
   which this page's 420px-wide booklet cannot give it — the spread would be
   clipped on both sides. */
function useCompactLayout() {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1000px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1000px)');
    const onChange = (e) => setCompact(e.matches);
    mq.addEventListener('change', onChange);
    setCompact(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return compact;
}

function PostCluster({ posts, liked, saved, onOpen, onLike, onSave }) {
  return (
    <div className="imb-cards">
      {posts.map((post, i) => (
        <div className="igcard-anchor" key={post.id}>
          <div
            className="igcard-float"
            style={{ '--float-dur': `${6.4 + i * 0.9}s`, '--float-delay': `${-1.6 * i}s` }}
          >
            <IgPostCard
              post={post}
              account={account}
              onOpen={onOpen}
              liked={liked.has(post.id)}
              saved={saved.has(post.id)}
              onLike={() => onLike(post.id)}
              onSave={() => onSave(post.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ImBesharamCase() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  const compact = useCompactLayout();
  const [liked, setLiked] = useState(() => new Set());
  const [saved, setSaved] = useState(() => new Set());
  const [focused, setFocused] = useState(null);

  const openPost = useCallback((post) => setFocused(post), []);
  const closePost = useCallback(() => setFocused(null), []);
  const toggleLike = useCallback((id) => setLiked((prev) => toggleId(prev, id)), []);
  const toggleSave = useCallback((id) => setSaved((prev) => toggleId(prev, id)), []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const scenes = Array.from(root.querySelectorAll('.imb-scene'));
    const tweens = [];
    const hidden = [];

    /* Hide every not-yet-revealed card before the first paint. Measuring is
       deferred to `play`, because the booklet inside HTMLFlipBook does not
       have its final height yet at this point. */
    if (!reduced) {
      scenes.forEach((scene) => {
        if (scene.classList.contains('is-in')) return;
        const cards = gsap.utils.toArray('.igcard-anchor', scene);
        if (!cards.length) return;
        gsap.set(cards, { opacity: 0, scale: 0.92, filter: 'blur(10px)' });
        hidden.push(...cards);
      });
    }

    const play = (scene) => {
      if (scene.classList.contains('is-in')) return;
      scene.classList.add('is-in');
      if (reduced) return;

      const cards = gsap.utils.toArray('.igcard-anchor', scene);
      if (!cards.length) return;

      /* On a narrow screen the cards sit in a horizontal strip BELOW the
         device, so a flight from the device would be clipped by that strip's
         overflow. A short lift-and-fade reads as the same idea without
         fighting the layout. */
      if (window.matchMedia('(max-width: 1000px)').matches) {
        tweens.push(
          gsap.fromTo(
            cards,
            { opacity: 0, y: 24, scale: 1, filter: 'blur(6px)' },
            {
              opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
              duration: 0.85, ease: 'power3.out', stagger: 0.1, delay: 0.1, overwrite: 'auto',
            }
          )
        );
        return;
      }

      const device = scene.querySelector('.phone, .booklet');
      if (!device) return;

      /* Measure the device with its entry transform neutralised. Until the
         `.is-in` transition runs, `.phone`/`.booklet` still carry
         `scale: .87; translate: 0 44px`, and a rect taken in that state is
         smaller and lower than the place the cards should emerge from. */
      const prevScale = device.style.scale;
      const prevTranslate = device.style.translate;
      device.style.scale = '1';
      device.style.translate = '0';
      const box = device.getBoundingClientRect();
      device.style.scale = prevScale;
      device.style.translate = prevTranslate;

      cards.forEach((card) => {
        const c = card.getBoundingClientRect();
        gsap.set(card, {
          x: box.left + box.width / 2 - (c.left + c.width / 2),
          y: box.top + box.height / 2 - (c.top + c.height / 2),
          scale: 0.4,
        });
      });

      tweens.push(
        gsap.to(cards, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.35,
          ease: 'expo.out',
          stagger: 0.16,
          delay: 0.18,
          overwrite: 'auto',
          onComplete: () => gsap.set(cards, { clearProps: 'filter' }),
        })
      );
    };

    let io;

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            play(entry.target);
          });
        },
        { root, threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
      );
      scenes.forEach((scene) => io.observe(scene));
    } else {
      scenes.forEach(play);
    }

    return () => {
      if (io) io.disconnect();
      tweens.forEach((tween) => tween.kill());
      if (hidden.length) gsap.set(hidden, { clearProps: 'opacity,transform,filter' });
    };
  }, [reduced]);

  return (
    <main className="case-page imb-page" ref={rootRef}>
      <a className="case-back" href="#/">← Back to work</a>

      <p className="imb-page-tag text-label" aria-hidden="true">Imbesharam · social &amp; print</p>
      <h1 className="visually-hidden">ImBesharam — Instagram carousels and zine</h1>

      {/* ---------- view 1 · the feed ---------- */}
      <section className="imb-scene imb-view" aria-labelledby="imb-feed-title">
        <div className="imb-view-inner">
          <div className="imb-device-col">
            <div className="imb-device">
              <IgPhone account={account} posts={feed.posts} onOpenPost={openPost} />
            </div>

            <div className="imb-caption">
              <span className="imb-kicker">01 · {feed.kicker}</span>
              <h2 className="imb-caption-title" id="imb-feed-title">{feed.title}</h2>
              <p className="imb-caption-hint">{feed.hint}</p>
            </div>
          </div>

          <PostCluster
            posts={feed.posts}
            liked={liked}
            saved={saved}
            onOpen={openPost}
            onLike={toggleLike}
            onSave={toggleSave}
          />
        </div>

        <div className="imb-scroll-cue" aria-hidden="true">
          <span>Scroll for the zine</span>
          <span className="imb-scroll-arrow">↓</span>
        </div>
      </section>

      {/* ---------- view 2 · the zine ---------- */}
      <section className="imb-scene imb-view" aria-labelledby="imb-zine-title">
        <div className="imb-view-inner imb-view-inner-zine">
          <div className="imb-device-col">
            <div className="imb-device">
              {/* Re-mount when the layout flips between spread and portrait:
                  react-pageflip reads these settings once, at init. The pages
                  are 4:5, the zine artwork's own proportion, so the printed
                  image fills each sheet without a crop. */}
              <BookletDevice
                key={compact ? 'portrait' : 'spread'}
                portrait={compact}
                pages={zine.pages}
                showCover
                pageWidth={320}
                pageHeight={400}
              />
            </div>

            <div className="imb-caption">
              <span className="imb-kicker">02 · {zine.kicker}</span>
              <h2 className="imb-caption-title" id="imb-zine-title">{zine.title}</h2>
              <p className="imb-caption-hint">{zine.hint}</p>
            </div>
          </div>
        </div>
      </section>

      {focused ? (
        <IgPostFocus
          key={focused.id}
          post={focused}
          account={account}
          onClose={closePost}
          liked={liked.has(focused.id)}
          saved={saved.has(focused.id)}
          onLike={() => toggleLike(focused.id)}
          onSave={() => toggleSave(focused.id)}
        />
      ) : null}
    </main>
  );
}
