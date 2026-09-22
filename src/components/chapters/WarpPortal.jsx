/* ============================================================
   WARP PORTAL — a tunnel of wireframes flying past the camera.

   The frames are NOT a chain of staggered tweens. A single proxy
   { p: 0 } is tweened 0→1 with ease 'none', and an onUpdate maps `p`
   onto each frame's scale/opacity through explicit keyframe bands.
   That matters for a scrubbed timeline: with a chained-animation
   approach, scrubbing backwards has to unwind every link in order
   and visibly stutters. Deriving every frame from one scalar is
   stateless, so reversing is exactly as smooth as playing forward.

   The tunnel is also staggered by depth for free: each frame's scale
   targets shift by its index `i`, so the rings separate into a
   corridor without any per-frame delay.
   ============================================================ */
import { useRef } from 'react';
import { gsap } from '../../lib/gsapSetup.js';
import { useGsapContext } from '../../lib/useGsap.js';
import { useReducedMotion } from '../../lib/useReducedMotion.js';

const FRAMES = 7;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t) => t * t * t;

/** Scale + opacity for frame `i` at progress `p`, as explicit bands. */
function frameState(p, i) {
  const s0 = 0.12;
  const s1 = 0.55 + i * 0.32;
  const s2 = 0.7 + i * 0.36;
  const s3 = 2.6 + i * 0.7;
  const o1 = 0.95 - i * 0.11;

  if (p <= 0.05) return { scale: s0, opacity: 0 };
  if (p < 0.45) {
    const t = easeOut((p - 0.05) / 0.4);
    return { scale: s0 + (s1 - s0) * t, opacity: o1 * t };
  }
  if (p < 0.5) return { scale: s1, opacity: o1 };
  if (p < 0.78) {
    const t = easeInOut((p - 0.5) / 0.28);
    return { scale: s1 + (s2 - s1) * t, opacity: o1 };
  }
  if (p < 0.95) {
    const t = easeIn((p - 0.78) / 0.17);
    return { scale: s2 + (s3 - s2) * t, opacity: o1 * (1 - t) };
  }
  return { scale: s3, opacity: 0 };
}

export default function WarpPortal({
  index = '02',
  title = ['THE', 'CRAFT'],
  kicker = 'Chapter 02',
  runway = 1.5,
}) {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  useGsapContext(
    sectionRef,
    (el) => {
      const stage = el.querySelector('.warp-stage');
      const frames = gsap.utils.toArray('.warp-frame', el);
      const beams = gsap.utils.toArray('.warp-beam', el);
      const vignette = el.querySelector('.warp-vignette');
      const halo = el.querySelector('.warp-halo');
      const label = el.querySelector('.warp-label');
      const flash = el.querySelector('.warp-flash');

      gsap.set(label, { opacity: 0, scale: 0.7 });
      gsap.set(beams, { opacity: 0, scaleY: 0.2 });
      gsap.set(flash, { opacity: 0 });

      const proxy = { p: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
          start: 'top top',
          end: `+=${runway * 100}%`,
          scrub: 0.5,
        },
        defaults: { ease: 'none' },
        onUpdate: () => {
          frames.forEach((frame, i) => {
            const { scale, opacity } = frameState(proxy.p, i);
            gsap.set(frame, { scale, opacity, force3D: true });
          });
        },
      });

      tl.to(proxy, { p: 1, duration: 1 }, 0)
        .to(vignette, { opacity: 0.45, duration: 0.18, ease: 'sine.inOut' }, 0)
        .to(halo, { opacity: 0.7, scale: 1.4, duration: 0.35, ease: 'sine.out' }, 0)
        .to(beams, { opacity: 0.25, scaleY: 1, duration: 0.3, stagger: 0.04 }, 0.1)
        .to(label, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.2)
        /* The hand-off: a gold flash blows out, the label and halo
           punch past the camera, and the next chapter is left behind. */
        .to(flash, { opacity: 1, duration: 0.14, ease: 'power2.in' }, 0.78)
        .to(label, { opacity: 0, scale: 1.18, duration: 0.17 }, 0.78)
        .to(halo, { opacity: 0, scale: 2.8, duration: 0.17 }, 0.78)
        .to(beams, { opacity: 0, duration: 0.15 }, 0.78)
        .to(flash, { opacity: 0, duration: 0.08, ease: 'sine.inOut' }, 0.92);
    },
    [reduced]
  );

  return (
    <section className="chapter chapter-warp" ref={sectionRef}>
      <div className="stage warp-stage">
        <div className="warp-vignette" aria-hidden="true" />
        <div className="warp-halo" aria-hidden="true" />

        <div className="warp-beams" aria-hidden="true">
          {[20, 40, 60, 80].map((left) => (
            <span className="warp-beam" key={left} style={{ left: `${left}%` }} />
          ))}
        </div>

        <div className="warp-tunnel" aria-hidden="true">
          {Array.from({ length: FRAMES }, (_, i) => (
            <span
              className="warp-frame"
              key={i}
              style={{ zIndex: FRAMES - i }}
            />
          ))}
        </div>

        <div className="warp-label">
          <span className="text-label">{kicker}</span>
          <h2 className="text-chapter warp-title">
            {title.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </h2>
        </div>

        <div className="warp-flash" aria-hidden="true" />
      </div>
    </section>
  );
}
