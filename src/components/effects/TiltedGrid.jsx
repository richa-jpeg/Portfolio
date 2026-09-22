/* ============================================================
   TILTED GRID — stills that are violently out of focus on the way
   in, snap sharp at the viewport midline, then blow back out.

   Implemented as a two-part scrubbed timeline (out-of-focus → sharp
   → out-of-focus) rather than a hand-computed symmetric progress
   with a custom cubic-bezier applied to each channel. The curve is
   slightly less art-directed, but the whole thing is one tween pair
   that GSAP can reverse and `invalidateOnRefresh` can re-measure —
   and it reuses the same focus vocabulary as the Featured rail, so
   the two sections read as one system.

   The left and right columns mirror each other via `sign`, which is
   what stops the grid reading as a single flat plane.
   ============================================================ */
import { useRef } from 'react';
import { stills } from '../../content.jsx';
import { gsap } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';

const BLUR = 9;
const TILT = 55;

function Tile({ item, sign }) {
  return (
    <figure className="tile" data-sign={sign}>
      <div
        className="tile-plate"
        style={{
          '--hue': `${item.hue}`,
          backgroundImage: `linear-gradient(150deg, hsl(${item.hue} 28% 22%), hsl(${
            item.hue + 18
          } 24% 9%))`,
        }}
      >
        <span className="tile-index text-mono">{item.id.replace('s', '0')}</span>
      </div>
      <figcaption className="tile-cap">
        <span className="tile-title">{item.title}</span>
        <span className="text-label">{item.year}</span>
      </figcaption>
    </figure>
  );
}

export default function TiltedGrid() {
  const rootRef = useRef(null);

  useGsapContext(
    rootRef,
    (el) => {
      const tiles = gsap.utils.toArray('.tile', el);

      tiles.forEach((tile) => {
        const sign = Number(tile.dataset.sign) || 1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: tile,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });

        tl.fromTo(
          tile,
          {
            filter: `blur(${BLUR}px) brightness(0.3) contrast(2.6)`,
            rotateX: TILT * sign,
            rotate: -5 * sign,
            yPercent: 34,
            scale: 0.9,
          },
          {
            filter: 'blur(0px) brightness(1) contrast(1)',
            rotateX: 0,
            rotate: 0,
            yPercent: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
          }
        ).to(tile, {
          filter: `blur(${BLUR}px) brightness(0.3) contrast(2.6)`,
          rotateX: -TILT * sign,
          rotate: 5 * sign,
          yPercent: -34,
          scale: 0.9,
          duration: 1,
          ease: 'power2.in',
        });
      });
    },
    []
  );

  return (
    <div className="tilt-grid" ref={rootRef}>
      <div className="tilt-col">
        {stills
          .filter((_, i) => i % 2 === 0)
          .map((s) => (
            <Tile key={s.id} item={s} sign={-1} />
          ))}
      </div>
      <div className="tilt-col tilt-col-offset">
        {stills
          .filter((_, i) => i % 2 === 1)
          .map((s) => (
            <Tile key={s.id} item={s} sign={1} />
          ))}
      </div>
    </div>
  );
}
