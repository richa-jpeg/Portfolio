/* ============================================================
   THE TABLE — #/phone

   This route is the one the third Featured card opens. Rather than a device,
   it shows three objects on the lit studio surface every case page uses — a
   phone, a tablet and a booklet — with a prompt to pick one up. Picking one
   opens that project's case study and flies the object to the centre of the
   screen (lib/pickTransition.js + lib/usePickFlight.js). The back link there
   returns HERE, not to the board, so you can put one down and take another.

   The Leafy app's own phone mock-up is not shown: this page is the table.

   WHY MINIATURES RATHER THAN THE LIVE CASE UIs: the real interiors (IgGrid,
   the LinkedIn feed) live inside their case components bound to their own
   state, and at this size they would be illegible anyway. These faces reuse
   the device shell and palette instead, so the object you pick up and the
   device you land on read as the same thing.

   WHERE THE OBJECTS COME FROM: the phone and the tablet are the Instagram and
   LinkedIn projects, read from `featured`, so renaming either card renames the
   object here too. The booklet is its own entry (`table.booklet`) so that it
   and the fourth card can be renamed independently. See content.jsx for both.
   ============================================================ */
import { useRef } from 'react';
import { featured, table } from './content.jsx';
import { gsap, EASE } from './lib/gsapSetup.js';
import { useGsapContext } from './lib/useGsap.js';
import { setPick } from './lib/pickTransition.js';

/* Which rail projects appear on the table, and what each becomes.

   The booklet is absent on purpose. It is NOT the fourth Featured card — that
   card is a different piece linking off-site — so deriving it from `featured`
   meant renaming one silently renamed the other. It comes from its own entry,
   `table.booklet` in content.jsx, which is also where its cover text lives. */
const RAIL_KINDS = {
  instagram: 'phone',
  linkedin: 'tablet',
};

/* Spoken name of each object, for the link's accessible name. */
const NOUN = { phone: 'phone', tablet: 'tablet', book: 'booklet' };

/* Tile gradients mirror the post colours in content.jsx's `instagram.posts`
   (the `ph()` helper there builds the same pairs), so the miniature reads as
   the feed that opens when you pick it up. */
const IG_TILES = [
  'linear-gradient(135deg, #f6d365, #fda085)',
  'linear-gradient(135deg, #d62976, #962fbf)',
  'linear-gradient(135deg, #7c5cff, #4cc9f0)',
  'linear-gradient(135deg, #4cc9f0, #7c5cff)',
  'linear-gradient(135deg, #c3f0c3, #7bd88f)',
  'linear-gradient(135deg, #ffc9a3, #ffb8c6)',
  'linear-gradient(135deg, #feda75, #fa7e1e)',
  'linear-gradient(135deg, #bfe3ff, #e4d5ff)',
  'linear-gradient(135deg, #9747ff, #ff5ca8)',
];

/* ---------- the phone: an Instagram grid ---------- */
function PhoneFace() {
  return (
    <span className="obj-screen obj-screen-phone" aria-hidden="true">
      <span className="obj-ig-top">
        <span className="obj-ig-mark" />
        <span className="obj-ig-dots" />
      </span>
      <span className="obj-ig-profile">
        <span className="obj-ig-avatar" />
        <span className="obj-ig-bars">
          <span />
          <span />
        </span>
      </span>
      <span className="obj-ig-grid">
        {IG_TILES.map((bg, i) => (
          <span key={i} className="obj-ig-tile" style={{ background: bg }} />
        ))}
      </span>
      <span className="obj-ig-tabbar">
        <span /><span /><span /><span /><span />
      </span>
    </span>
  );
}

/* ---------- the tablet: a feed of posts ---------- */
function TabletFace() {
  return (
    <span className="obj-screen obj-screen-tablet" aria-hidden="true">
      <span className="obj-li-top">
        <span className="obj-li-in">in</span>
        <span className="obj-li-bars"><span /><span /></span>
      </span>
      {[0, 1, 2].map((i) => (
        <span key={i} className="obj-li-post">
          <span className="obj-li-head">
            <span className="obj-li-avatar" />
            <span className="obj-li-bars">
              <span />
              <span />
            </span>
          </span>
          <span className="obj-li-lines"><span /><span /><span /></span>
        </span>
      ))}
    </span>
  );
}

/* ---------- the booklet: a closed cover ---------- */
function BookFace({ cover }) {
  return (
    <span className="obj-cover" aria-hidden="true">
      <span className="obj-spine" />
      <span className="obj-cover-title">{cover.title}</span>
      <span className="obj-cover-sub">{cover.sub}</span>
      <span className="obj-pages" />
    </span>
  );
}

const FACES = { phone: PhoneFace, tablet: TabletFace, book: BookFace };

export default function PhoneAppCase() {
  const rootRef = useRef(null);

  /* The objects arrive the way the devices do on the other case pages: from
     below, out of focus, then settling, walked left to right so the table
     assembles rather than appearing. GSAP writes `transform`, while the tilt
     and the hover lift are the separate `rotate`/`translate`/`scale`
     properties — so the three compose instead of overwriting each other, and
     `transform` stays clean for the flight on the far side of a pick. */
  useGsapContext(rootRef, (el) => {
    const objects = gsap.utils.toArray('.obj', el);
    const labels = gsap.utils.toArray('.table-label', el);
    if (!objects.length) return;

    const tl = gsap.timeline({ defaults: { ease: EASE.soft } });
    tl.from(objects, { y: 40, opacity: 0, filter: 'blur(12px)', duration: 0.9, stagger: 0.12 }, 0)
      .from(labels, { y: 16, opacity: 0, duration: 0.7, stagger: 0.12 }, 0.18);
  }, []);

  /* The two rail projects, then the booklet from its own entry. */
  const objects = [
    ...featured
      .filter((p) => RAIL_KINDS[p.route])
      .map((p) => ({ ...p, kind: RAIL_KINDS[p.route] })),
    table.booklet,
  ];

  /* Record where the object is on screen on the way out. Modifier-clicks open
     a new tab, where this module's state does not exist anyway, so there is
     nothing to measure for them. */
  const pick = (route) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const el = e.currentTarget;
    const box = el.getBoundingClientRect();

    /* Every object is tilted, so its client rect is the bounding box of the
       ROTATED box — wider than the object by w·cos θ + h·sin θ. The flight
       would start visibly oversized. The tilt is about the centre, so the
       box's centre is still the object's true centre: rebuild the rect around
       it from the untransformed layout size. */
    setPick(
      {
        left: box.left + (box.width - el.offsetWidth) / 2,
        top: box.top + (box.height - el.offsetHeight) / 2,
        width: el.offsetWidth,
        height: el.offsetHeight,
      },
      route
    );
  };

  return (
    <main className="case-page case-table" ref={rootRef}>
      <a className="case-back" href="#/">← Back to work</a>

      <div className="case-tabletop">
        <p className="table-prompt text-label">{table.prompt}</p>

        <ul className="table-objects">
          {objects.map((p, i) => {
            const { kind } = p;
            const Face = FACES[kind];
            return (
              <li key={p.id} className="table-item">
                <a
                  className={`obj obj-${kind}`}
                  href={`#/${p.route}`}
                  /* `url` is deliberately ignored here, and this is the ONE
                     place it is. An off-site project links out from its rail
                     card (WorkCard.jsx), but the table exists to be picked up
                     and interacted with — an object that quietly left the site
                     would break the single thing this page is for. So every
                     object on the table opens its case study, flight included. */
                  onClick={pick(p.route)}
                  aria-label={`Pick up the ${NOUN[kind]} — ${p.title} case study`}
                  data-cursor
                >
                  <Face cover={p.cover} />
                </a>

                <span className="table-label">
                  {/* Numbered by position on the table, not by the rail's own
                      01–04: this is a different set of three objects, and the
                      Featured section keeps its numbering untouched. */}
                  <span className="table-index text-mono">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="table-title">{p.title}</span>
                  <span className="table-meta text-label">
                    {p.category} · {p.year}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <p className="table-hint text-label">{table.hint}</p>
      </div>
    </main>
  );
}
