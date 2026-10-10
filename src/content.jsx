/* ============================================================
   CONTENT — everything on the site is driven from this file.

   ⚠ PLACEHOLDERS: the copy below is written to read as a visual
   motion designer's portfolio, but the name, credits, dates and
   links are PLACEHOLDERS. Search for "TODO" and replace before
   publishing. Nothing here was invented about a real person.

   The case-study exports at the bottom are each headed with the page
   that consumes them, and keep the exact shape that page reads —
   editing their values is safe, renaming their keys is not.
   `phoneApp` is the exception: nothing renders it since the table
   replaced the plant-app page, and it is kept only as the closest
   thing to a written-down design for that screen.

   Every route string in the app comes from `routes`, just below.
   ============================================================ */

/* ============================================================
   ROUTES — the one home of every route string.

   Every site that needs a route reads it from here: App.jsx builds
   the CASES keys as `'#/' + routes.<key>`, the rail cards' `route`
   fields and the table's objects point at these values, and each
   case component passes the same identifier to usePickFlight and to
   its back link.

   That is not tidiness for its own sake. A route string is written
   in four places per case — the CASES key, the card or object that
   links there, the destination's `usePickFlight(route, …)` and its
   back link — and a mismatch is SILENT: `takePick()` returns null,
   the pick-up flight quietly degrades to the plain entry, and the
   click opens the wrong page with nothing in the console. One
   identifier per route is what makes that drift impossible rather
   than merely unlikely.

   The values are BARE — no `#/` prefix — because WorkCard.jsx and
   ImBesharamCase.jsx compose the href themselves as `'#/' + route`.

   Renaming a value renames the public URL. There are no aliases: an
   alias is just one more route string that can drift.
   ============================================================ */
export const routes = {
  myFitness: 'myFitness',
  imBesharam: 'imBesharam',
  imBesharamPhone: 'imBesharamPhone',
  imBesharamTablet: 'imBesharamTablet',
  imBesharamBooklet: 'imBesharamBooklet',
  jaigarh: 'jaigarhHeritageFestival',
  millimetre: 'millimetre',
};

/* Featured thumbnails. Natively 1920×1200 (16:10), which is exactly the
   ratio the rail cards render at — so they display uncropped. */
import thumbInstagram from './public/Artboard-2.jpg';
import thumbLinkedIn from './public/Artboard-3.jpg';
import thumbApp from './public/Artboard-4.jpg';
import thumbBooklet from './public/Artboard-5.jpg';
import hpoLanding from './public/HPO_landingpage.png';

export const person = {
  name: 'Richa Sinha', // TODO: real name
  role: 'Visual and Motion Designer',
  email: 'richasinhawork12@gmail.com', // TODO: real email
  location: 'Bangalore, India', // TODO
};

/* One resume link, three places that offer it: the nav, the hero and
   the contact card. Kept here so the label and the target can never be
   updated in one of them and missed in the others. */
export const resume = {
  /* TODO: real resume URL — this is still the placeholder. */
  link: 'https://drive.google.com/file/d/1DSh6bRbrMaOm7-4a_xgKlxfc4w11lEWD/view?usp=sharing',
  resumeLabel: 'Download Resume',
};

/* Fixed top navigation. `id` must match a chapter's DOM id. */
export const nav = [
  { id: 'work', label: 'Work', index: '01' },
  { id: 'craft', label: 'Craft', index: '02' },
  { id: 'stills', label: 'Stills', index: '03' },
  { id: 'contact', label: 'Contact', index: '04' },
];

/* ============================================================
   01 · HERO — two beats, per the brief.
   The `question` types out character by character; then `answer`
   arrives as a grand masked reveal.
   ============================================================ */
export const hero = {
  question: 'Do you know 90% of life is mundane?',
  /* Split into lines — each line gets its own mask, so keep this
     short. `accent` is the line that carries the gold gradient. */
  answer: [
    { text: 'But design', accent: false },
    { text: 'should not be', accent: true },
  ],
  meta: [
    { label: 'Based in', value: person.location },
    { label: 'Open to', value: 'Freelance & full-time' },
  ],
  scrollCue: 'Scroll',
};

/* ============================================================
   02 · ABOUT — the statement under the chapter title.
   ============================================================ */
export const about = {
  kicker: 'Chapter 02',
  title: ['THE', 'CRAFT'],
  lead: `I design motion systems — the kind that make a product feel alive
    before anyone reads a word of it. Timing, weight and transition are the
    material; the interface is just where it lands.`,
  pillars: [
    {
      index: '01',
      title: 'Motion systems',
      text: 'Easing curves, duration scales and transition rules documented as tokens — so motion survives handoff instead of dying in a spec.',
    },
    {
      index: '02',
      title: 'Brand in motion',
      text: 'Logos that resolve, type that assembles, idents that hold a room. The identity, translated into time.',
    },
    {
      index: '03',
      title: 'Product craft',
      text: 'Micro-interactions, state changes, loading and empty states — the unglamorous moments where products are actually judged.',
    },
  ],
};

/* ============================================================
   03 · EXPERIENCE — credits, as peel-up panels.
   TODO: placeholder credits. Replace with real roles.
   ============================================================ */
// export const experience = [
//   {
//     id: 'x1',
//     year: '2024 — now',
//     role: 'Lead Motion Designer',
//     company: 'Studio Placeholder', // TODO
//     text: 'Own the motion language across product and brand. Built the easing and duration token set now used in every shipped surface.',
//     tags: ['Design systems', 'Motion tokens', 'Direction'],
//   },
//   {
//     id: 'x2',
//     year: '2022 — 2024',
//     role: 'Senior Motion Designer',
//     company: 'Agency Placeholder', // TODO
//     text: 'Led motion on launch films and interactive campaigns, from storyboard through to the final render and the shipped interface.',
//     tags: ['Campaign', '3D', 'Interaction'],
//   },
//   {
//     id: 'x3',
//     year: '2020 — 2022',
//     role: 'Motion & Interaction Designer',
//     company: 'Product Placeholder', // TODO
//     text: 'Prototyped and shipped interface motion for a multi-platform product, then wrote the guidelines that kept it consistent.',
//     tags: ['Prototyping', 'UI motion', 'Guidelines'],
//   },
// ];

export const experience = [
  {
    id: 'x1',
    year: 'August 2025- Present',
    role: 'Visual Designer',
    company: 'Mensa Brands', // TODO
    text: 'Owned end-to-end D2C design, delivering performance creatives, motion, AI videos, banners, and landing pages that supported ROAS growth from ~0–3 to ~5–9 with improved CTR. Streamlined creative workflows through D2C templatization, AI asset optimization, and a funnel-first, intent-led design approach. Collaborated across marketing, product, app, social, marketplace, and offline initiatives while mentoring the design team on AI workflows and visual storytelling.',
    tags: ['D2C Design', 'AI Workflows', 'Performance Creative'],
  },
  {
    id: 'x2',
    year: 'Oct 2024 - May 2025',
    role: 'Jr. Graphic Designer',
    company: 'Hassle Bae (Creative Agency)', // TODO
    text: 'Created social and motion content for large-scale cultural events including Jaipur Music Stage, Jaigarh Heritage Festival, Sacred Amritsar, and India by the Bay. Led Instagram branding and multi-platform campaigns for diverse clients, delivering 2D animation reels that strengthened content reach and engagement.',
    tags: ['Motion Graphics', 'Cultural Branding', 'Social Design'],
  },
  {
    id: 'x3',
    year: 'Jan 2024 - April 2024',
    role: 'Communication Designer',
    company: 'Epistle Communications', // TODO
    text: 'Developed brand identities, launch assets, 2D animations, print collaterals, and digital creatives for brands across architecture, interiors, and luxury design. Created company profiles, emailers, signatures, and logo animations while adapting visual storytelling to distinct brand languages and communication needs.',
    tags: ['Brand Identity', 'Visual Storytelling', '2D Animation'],
  },
];

/* ============================================================
   04 · FEATURED — the four rail cards.

   `poster` should be 16:10 (as the Artboard files are) — the card
   renders at that ratio and `object-fit: cover` will crop anything
   that isn't, rather than distort it.
   `route` opens the matching case study at #/<route>, and is one of
   the `routes` values above rather than a literal — a card cannot
   point at a name no page answers to, and the pick-up flight cannot
   silently stop matching.
   `url`, when present, WINS for the rail card: it becomes a plain
   outbound link that opens in a new tab and routes nowhere, which is
   the whole mechanism for an off-site project — see WorkCard.jsx.
   No card uses it now; the Millimetre card linked out to Drive until
   there was a #/millimetre to open.
   ============================================================ */
export const featured = [
    {
    id: 'f1',
    index: '01',
    title: 'My Fitness',
    category: 'FMCG',
    year: 'Present',
    desc: 'MYFITNESS is India’s leading health-focused food brand crafting protein-focused nutrition. Holding 40% market share of peanut butter category in India, MYFITNESS runs an omnichannel D2C business. Care to see In\'s and Out\'s of a consumer brand?',
    route: routes.myFitness,
    poster: thumbLinkedIn,
  },
  {
    id: 'f2',
    index: '02',
    title: 'ImBesharam',
    category: 'Adult wellness',
    year: '2024',
    desc: 'ImBesharam is a D2C adult wellness brand operating through online channels and their social media handles. Come let’s take your “kinky” side for a spin :P',
    route: routes.imBesharam,
    poster: thumbApp,
  },
  {
    id: 'f3',
    index: '03',
    title: 'Jaigarh Heritage Festival',
    category: 'Cultural Event',
    year: '2024',
    desc: 'The Jaigarh Heritage Festival is an annual cultural celebration held at the historic Jaigarh Fort in Jaipur, Rajasthan. It is produced by Teamwork Arts in partnership with the royal family of Jaipur.',
    route: routes.jaigarh,
    poster: thumbInstagram,
  },
  {
    id: 'f4',
    index: '04',
    title: 'Millimetre',
    category: 'Luxury Space design',
    year: '2024',
    desc: 'Millimetre is an Indian brand specializing in high-pressure decorative laminates, matching edge bands, and curated interior surface solutions',
    route: routes.millimetre,
    poster: thumbBooklet,
  },
];

/* ============================================================
   05 · STILLS — the tilt-grid wall of smaller work.
   `image` is optional: omit it and the tile renders as a
   generated gradient plate carrying its own index.
   ============================================================ */
export const stills = [
  { id: 's1', title: 'Kinetic type', year: '2026', hue: 32 },
  { id: 's2', title: 'Logo resolve', year: '2026', hue: 14 },
  { id: 's3', title: 'Product walkthrough', year: '2025', hue: 44 },
  { id: 's4', title: 'Title sequence', year: '2025', hue: 6 },
  { id: 's5', title: 'Data in motion', year: '2025', hue: 28 },
  { id: 's6', title: 'Sound & vision', year: '2024', hue: 18 },
  { id: 's7', title: 'Interface study', year: '2024', hue: 38 },
  { id: 's8', title: 'Loop series', year: '2024', hue: 22 },
];

/* Marquee text, driven by page scroll rather than a timer. */
export const marqueeWords = [
  'Motion design',
  'Brand in motion',
  '3D',
  'Kinetic type',
  'Interaction',
  'Art direction',
];

/* ============================================================
   06 · CONTACT
   ============================================================ */
export const contact = {
  kicker: 'Chapter 04',
  title: ['GET IN', 'TOUCH'],
  lead: 'Got a project that needs to move? Tell me what you are building.',
  cta: 'Start a conversation',
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/richa-sinha-73881a277/' },
    { label: 'Behance', url: 'https://www.behance.net/richasinha4' },
  ],
  footerNote: 'Designed & built from scratch',
};

/* ============================================================
   CASE STUDIES — shapes are frozen; values are yours to edit.
   Each export is headed with the page that renders it.
   ============================================================ */

/* ---------- Instagram phone — ImBesharamPhoneCase (#/imBesharamPhone) ---------- */
const ph = (c1, c2, emoji = '') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>` +
      `</linearGradient></defs>` +
      `<rect width="640" height="640" fill="url(#g)"/>` +
      `<text x="50%" y="55%" font-size="160" text-anchor="middle" dominant-baseline="middle">${emoji}</text>` +
      `</svg>`
  )}`;

export const instagram = {
  account: {
    handle: '@richa.motion',
    name: person.name,
    avatarEmoji: '🎨',
    avatarGradient: ['#feda75', '#d62976'],
    stats: { posts: 128, followers: '2,340', following: 412 },
    bio: ['Visual motion designer', 'Making pixels move 🚀', 'Reel ↓'],
    highlights: [
      { emoji: '🎬', label: 'Reels' },
      { emoji: '🎨', label: 'Type' },
      { emoji: '📷', label: 'Stills' },
      { emoji: '✏️', label: 'BOARDS' },
    ],
  },
  posts: [
    { id: 'ig1', type: 'image', src: ph('#f6d365', '#fda085', '☕'), caption: 'Morning light study for the launch campaign.', likes: '1,204 likes', comments: 38 },
    { id: 'ig2', type: 'image', src: ph('#d62976', '#962fbf', '🌇'), caption: 'Sunset palette, locked in.', likes: '2,118 likes', comments: 61 },
    { id: 'ig3', type: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: ph('#7c5cff', '#4cc9f0', '🎬'), caption: 'Pour-over, 60fps. Process content converts.', likes: '3,402 likes', comments: 97 },
    { id: 'ig4', type: 'image', src: ph('#4cc9f0', '#7c5cff', '🧊'), caption: 'Cool product still — no props, just light.', likes: '986 likes', comments: 22 },
    { id: 'ig5', type: 'image', src: ph('#c3f0c3', '#7bd88f', '🌿'), caption: 'Behind the scenes at the roastery.', likes: '1,521 likes', comments: 45 },
    { id: 'ig6', type: 'image', src: ph('#ffc9a3', '#ffb8c6', '🥐'), caption: 'The pastry flat-lay that out-performed everything.', likes: '4,006 likes', comments: 128 },
    { id: 'ig7', type: 'image', src: ph('#feda75', '#fa7e1e', '📦'), caption: 'Packaging reveal — three crops, one post.', likes: '2,745 likes', comments: 84 },
    { id: 'ig8', type: 'image', src: ph('#bfe3ff', '#e4d5ff', '☁️'), caption: 'Airy product window for the spring drop.', likes: '1,108 likes', comments: 29 },
    { id: 'ig9', type: 'image', src: ph('#9747ff', '#ff5ca8', '✨'), caption: 'Grid finale — full brand palette in one tile.', likes: '1,899 likes', comments: 52 },
  ],
  notes: {
    leftLabel: 'The approach',
    left: [
      { color: 'yellow', rotate: -1.5, sticker: '🎯', title: 'The brief', text: 'Design a twelve-post grid for a specialty coffee brand — warm, film-like and unmistakably theirs.' },
      { color: 'blue', rotate: 1, sticker: '🧩', title: 'Grid strategy', text: 'Each row of three tells a mini story: product, process, people. The feed reads like a magazine when you scroll.' },
      { color: 'lilac', rotate: -1, sticker: '🎨', title: 'Palette & type', text: 'Cream, espresso and sky blue. No text in the feed — captions carry the voice.' },
    ],
    rightLabel: 'Results',
    right: [
      { color: 'green', rotate: 1.2, sticker: '📈', title: 'The numbers', text: 'Engagement up 38% in six weeks, 2× saves per post, and the brand reused the system for stories.' },
      { color: 'pink', rotate: -1.2, sticker: '🛠️', title: 'How it was built', text: 'Every post was composed on a shared grid before touching a camera — approvals dropped from days to hours.' },
      { color: 'orange', rotate: 1, sticker: '💡', title: 'What I would do next', text: 'Loop each still into a two-second motion tile, so the grid animates as one surface.' },
    ],
  },
};

/* ---------- Instagram phone — JaigarhCase (#/jaigarhHeritageFestival) ----------
   Same shape as `instagram` above, because the same phone shell renders both.
   Every value is the festival's own, and that is the point: the Jaigarh phone
   and ImBesharam's phone are two pages with two feeds, and editing one cannot
   change the other.

   TODO: placeholder content. The account facts come from the card copy in
   `featured`; the posts are illustrative and name no real artist or sponsor
   from the festival — replace them with the real campaign before publishing. */
export const jaigarh = {
  account: {
    handle: '@jaigarhfest', // TODO: real handle
    name: 'Jaigarh Heritage Festival',
    avatarEmoji: '🏰',
    avatarGradient: ['#e0a45c', '#8c3b2f'],
    stats: { posts: 86, followers: '12.4k', following: 214 },
    bio: ['Annual cultural festival', 'Jaigarh Fort · Jaipur', 'Produced by Teamwork Arts'],
    highlights: [
      { emoji: '🎶', label: 'Lineup' },
      { emoji: '🏰', label: 'The fort' },
      { emoji: '🧵', label: 'Craft' },
      { emoji: '🎟️', label: 'Tickets' },
    ],
  },
  posts: [
    { id: 'jh1', type: 'image', src: ph('#e8c07d', '#c1663f', '🏰'), caption: 'The fort at first light, before the gates open.', likes: '1,842 likes', comments: 41 },
    { id: 'jh2', type: 'image', src: ph('#d97b4a', '#7d2f2a', '🎶'), caption: 'Soundcheck on the ramparts — the evening stage going up.', likes: '2,310 likes', comments: 66 },
    { id: 'jh3', type: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: ph('#f0b95c', '#b8542f', '🥁'), caption: 'Folk percussion, courtyard session.', likes: '4,517 likes', comments: 148 },
    { id: 'jh4', type: 'image', src: ph('#c9a227', '#8a5a2b', '🧵'), caption: 'Craft bazaar, day one — block print and blue pottery.', likes: '1,206 likes', comments: 33 },
    { id: 'jh5', type: 'image', src: ph('#8c3b2f', '#3f4a7a', '🪔'), caption: 'The walls lit for the closing night.', likes: '6,092 likes', comments: 214 },
    { id: 'jh6', type: 'image', src: ph('#e0a45c', '#8c3b2f', '🎨'), caption: 'Identity system: sandstone, indigo and marigold.', likes: '997 likes', comments: 27 },
    { id: 'jh7', type: 'image', src: ph('#7d8f5a', '#4a5a35', '🚶'), caption: 'The morning heritage walk, fort gate to the lake.', likes: '1,455 likes', comments: 38 },
    { id: 'jh8', type: 'image', src: ph('#3f4a7a', '#20263f', '✨'), caption: 'Night finale — lights over the old wall.', likes: '5,244 likes', comments: 176 },
    { id: 'jh9', type: 'image', src: ph('#f0d9a8', '#e0a45c', '📸'), caption: 'Grid finale — the festival in nine frames.', likes: '2,918 likes', comments: 91 },
  ],
};

/* ---------- Leafy app — UNUSED (#/imBesharam is the table now) ----------
   Nothing imports this since the plant-app page gave way to the table at
   #/imBesharam. Kept as the written-down design for that screen; delete it and
   the `.pa-*` block in cases.css together, or give it a page again. */
export const phoneApp = {
  app: { name: 'Leafy', emoji: '🌿', avatar: '🍀' },
  hero: {
    greeting: `Good morning, ${person.name} 🌤️`,
    title: 'Your plants are thriving',
    subtitle: 'Watering day for 3 little friends',
    progress: '72%',
    emoji: '🪴',
  },
  items: [
    { emoji: '🌱', title: 'Monstera', sub: 'Water today · 240 ml' },
    { emoji: '🪴', title: 'Snake plant', sub: 'Healthy · water in 3 days' },
    { emoji: '🌵', title: 'Cactus trio', sub: 'Soak next week' },
    { emoji: '🍃', title: 'Fern corner', sub: 'Mist twice a day' },
  ],
  tabs: [
    { label: 'Home', emoji: '🏠' },
    { label: 'Explore', emoji: '🔍' },
    { label: 'Add', emoji: '➕' },
    { label: 'Care', emoji: '💧' },
    { label: 'Profile', emoji: '👤' },
  ],
  notes: {
    leftLabel: 'The approach',
    left: [
      { color: 'green', rotate: -1.5, sticker: '🌿', title: 'The brief', text: 'A plant-care app that feels like a warm morning — glanceable, calm and a little playful.' },
      { color: 'blue', rotate: 1, sticker: '🧩', title: 'Motion first', text: 'Every state change has a transition, not a cut. The watering card eases in; the progress bar fills on load.' },
      { color: 'lilac', rotate: -1, sticker: '🎯', title: 'Interaction', text: 'Tap the bottom tabs to switch modes — the app is fully tappable, not just a mockup.' },
    ],
    rightLabel: 'Results',
    right: [
      { color: 'yellow', rotate: 1.2, sticker: '📈', title: 'Habit loop', text: 'Daily care cards keep watering streaks front-and-center; 86% of testers returned the next day.' },
      { color: 'pink', rotate: -1.2, sticker: '🛠️', title: 'How it was built', text: 'Prototyped as motion first, then rebuilt in React with the same phone frame this portfolio reuses.' },
    ],
  },
};

/* ---------- LinkedIn tablet — ImBesharamTabletCase (#/imBesharamTablet) ----------
   A placeholder feed about the designer, not about ImBesharam; it is the
   tablet that stands on the ImBesharam table, and the copy is content debt
   rather than a routing decision. */
export const linkedin = {
  profile: {
    name: person.name,
    headline: 'Visual motion designer · Making pixels move',
    initials: 'RS',
    color: '#c8a882',
  },
  posts: [
    { id: 'li1', author: person.name, headline: 'Visual motion designer', time: '1w', avatar: 'RS', color: '#c8a882', text: 'Just shipped the new onboarding motion for Leafy 🌿 — five cuts became one continuous transition, and signups are up 31%. Motion is not decoration.', likes: 248, comments: 14, image: ph('#7c5cff', '#4cc9f0', '🌿') },
    { id: 'li2', author: person.name, headline: 'Visual motion designer', time: '2w', avatar: 'RS', color: '#c8a882', text: 'A little portfolio secret: this whole page is one React app pretending to be a film. Scroll down, the chapters scrub as you move 📌' },
    { id: 'li3', author: person.name, headline: 'Visual motion designer', time: '1mo', avatar: 'RS', color: '#c8a882', text: 'Three rules for motion that ships: 1) pick a duration scale and never break it, 2) ease everything, 3) if you can cut instead, cut.', likes: 561, comments: 47, image: ph('#f6d365', '#fda085', '📊') },
    { id: 'li4', author: person.name, headline: 'Visual motion designer', time: '2mo', avatar: 'RS', color: '#c8a882', text: 'Documented the easing tokens before lunch ☕ — one curve family, four durations, zero arguments in code review.', likes: 173, comments: 9, image: ph('#d62976', '#962fbf', '☕') },
  ],
  notes: {
    leftLabel: 'The approach',
    left: [
      { color: 'blue', rotate: -1.5, sticker: '📱', title: 'The brief', text: 'Recreate LinkedIn posts inside a tablet frame so the work can be scrolled and reacted to without leaving the page.' },
      { color: 'pink', rotate: 1, sticker: '🧩', title: 'On the table', text: 'The tablet sits on a dark studio surface with a gold key light — the object is the hero, not the chrome.' },
      { color: 'lilac', rotate: -1, sticker: '🎯', title: 'Interaction', text: 'Like and follow buttons really work — tap them to update the counts, just like the real app.' },
    ],
    rightLabel: 'Results',
    right: [
      { color: 'green', rotate: 1.2, sticker: '📈', title: 'The numbers', text: 'A like on the tablet increments the counter instantly — small details make the mockup feel alive.' },
      { color: 'yellow', rotate: -1.2, sticker: '🛠️', title: 'How it was built', text: 'A CSS device frame with a tiny React feed on local state. Nothing heavy, works offline.' },
    ],
  },
};

/* ---------- MYFITNESS — MyFitnessCase (#/myFitness) ----------
   Two pieces of campaign work, in the order the page shows them.

   The ads are read straight off the folder — every .png in
   src/public/metaAds, ordered by the number in its filename. A plain glob
   sorts as strings, which would file "MF meta 10" before "MF meta 2", hence
   the numeric sort. Drop a new file in that folder and it joins the carousel.

   `width`/`height` are the files' real pixel sizes, kept beside the paths so a
   swapped image carries its own dimensions: the browser reserves the right box
   before the bytes arrive, and a stale pair shows up as layout shift rather
   than as an error. */
const adNumber = (path) => parseInt(path.match(/(\d+)\.png$/)?.[1] ?? '0', 10);

const metaAds = Object.entries(
  import.meta.glob('./public/metaAds/*.png', { eager: true, import: 'default' })
)
  .sort(([a], [b]) => adNumber(a) - adNumber(b))
  .map(([, src]) => src);

export const myfitness = {
  landing: {
    title: 'Landing page design',
    image: hpoLanding,
    width: 11133,
    height: 4905,
  },
  ads: {
    title: 'Meta Ads design',
    images: metaAds,
    width: 1080,
    height: 1350,
  },
};

/* ---------- Brand booklet — ImBesharamBookletCase (#/imBesharamBooklet) ---------- */
export const booklet = {
  /* TODO: the table's cover reads "Zine / FAP techniques" while the printed
     pages are a Leafy brand booklet. One of the two is the placeholder. */
  brand: 'Leafy',
  leaves: [
    {
      front: { titlePage: true, emoji: '🌿', title: 'Leafy', subtitle: 'Brand booklet', lines: ['A pocket guide to the identity system', 'Turn the page →'] },
      back: { emoji: '🎨', title: 'Palette', lines: ['Warm greens and terracotta', 'Leaf #7aa56f · Soil #b06a45', 'Cream paper backgrounds'] },
    },
    {
      front: { emoji: '🔤', title: 'Type', lines: ['Headlines — a friendly serif', 'Body — humanist sans', 'One size up for small screens'] },
      back: { emoji: '📷', title: 'Imagery', lines: ['Morning-light product shots', 'Soft shadows, no hard edges', 'Always one plant per frame'] },
    },
    {
      front: { emoji: '✨', title: 'Motion', lines: ['One curve family, four durations', 'Nothing snaps — everything eases', 'The leaf unfurls on load'] },
      back: { emoji: '🙌', title: 'Thanks!', lines: ['Made with care and caffeine', 'The full brand kit lives on the board'] },
    },
  ],
  notes: {
    leftLabel: 'The approach',
    left: [
      { color: 'yellow', rotate: -1.5, sticker: '📘', title: 'The brief', text: 'A small printed booklet for the Leafy identity, opened by tapping it on the shelf.' },
      { color: 'blue', rotate: 1, sticker: '🧩', title: 'Page turning', text: 'Pages flip with a real 3D page-turn — click the page or drag it to leaf through cover to back.' },
    ],
    rightLabel: 'Results',
    right: [
      { color: 'green', rotate: 1.2, sticker: '📈', title: 'The effect', text: 'The spread reads like a print piece: spine shadow, paper grain and a soft drop on the surface.' },
      { color: 'pink', rotate: -1.2, sticker: '🛠️', title: 'How it was built', text: 'Two printed faces per sheet, animated by the page-flip library. No page images — it is all live text.' },
    ],
  },
};

/* ============================================================
   THE TABLE (#/imBesharam) — the three objects you can pick up.

   The page the ImBesharam card opens. It shows a phone, a tablet and a
   booklet on a lit table, with a prompt to pick one up; which object each one
   becomes is decided in ImBesharamCase.jsx.

   All three are ImBesharam's own pieces and are listed here in full. They used
   to be derived from `featured` instead — the phone and tablet were "whichever
   cards carry the instagram and linkedin routes" — and that is exactly what
   went wrong: after the rail was reordered, the objects on ImBesharam's table
   were labelled Jaigarh Heritage Festival and My Fitness, and picking one up
   opened a page belonging to a different project than the object named.
   Three explicit entries cost three blocks and remove the coupling: the object
   on the table, the page it opens and the caption under it are one entry.

   `route` must be the value the destination component passes to
   usePickFlight, or the pick-up flight silently does not happen — that is why
   it is a `routes` value rather than a literal. `kind` is the face: `FACES`
   and `NOUN` in ImBesharamCase.jsx are keyed on it, so `book` is the booklet's
   key and not `booklet`.
   ============================================================ */
export const table = {
  prompt: 'Pick one up to interact',
  hint: 'Put it back to try another',

  objects: [
    {
      /* TODO: placeholder names — these are the pieces, not the brand. */
      id: 't-phone',
      title: 'Instagram grid',
      category: 'Social media',
      year: '2024',
      kind: 'phone',
      route: routes.imBesharamPhone,
    },
    {
      id: 't-tablet',
      title: 'LinkedIn feed',
      category: 'Social media',
      year: '2024',
      kind: 'tablet',
      route: routes.imBesharamTablet,
    },
    {
      id: 't-book',
      title: 'Zine',
      category: 'Flipbook',
      year: '2024',
      kind: 'book',
      route: routes.imBesharamBooklet,
      /* Printed on the cover. It lives here rather than hardcoded in the
         component so the object and the caption under it cannot disagree. */
      cover: { title: 'Zine', sub: 'FAP techniques' },
    },
  ],
};
