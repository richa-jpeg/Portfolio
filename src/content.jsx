/* ============================================================
   CONTENT — everything on the site is driven from this file.

   ⚠ PLACEHOLDERS: the copy below is written to read as a visual
   motion designer's portfolio, but the name, credits, dates and
   links are PLACEHOLDERS. Search for "TODO" and replace before
   publishing. Nothing here was invented about a real person.

   The four case-study exports at the bottom (`instagram`,
   `phoneApp`, `linkedin`, `booklet`) keep the exact shape the case
   components already consume — editing their values is safe,
   renaming their keys is not.
   ============================================================ */

/* Featured thumbnails. Natively 1920×1200 (16:10), which is exactly the
   ratio the rail cards render at — so they display uncropped. */
import thumbInstagram from './public/Artboard-2.jpg';
import thumbLinkedIn from './public/Artboard-3.jpg';
import thumbApp from './public/Artboard-4.jpg';
import thumbBooklet from './public/Artboard-5.jpg';

export const person = {
  name: 'Richa', // TODO: real name
  role: 'Visual Motion Designer',
  email: 'hello@richa.dev', // TODO: real email
  location: 'India', // TODO
};

export const site = {
  /* TODO: real showreel URL */
  reel: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  showreelLabel: 'Showreel — 2026',
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
    { label: 'Reel', value: '2026' },
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
export const experience = [
  {
    id: 'x1',
    year: '2024 — now',
    role: 'Lead Motion Designer',
    company: 'Studio Placeholder', // TODO
    text: 'Own the motion language across product and brand. Built the easing and duration token set now used in every shipped surface.',
    tags: ['Design systems', 'Motion tokens', 'Direction'],
  },
  {
    id: 'x2',
    year: '2022 — 2024',
    role: 'Senior Motion Designer',
    company: 'Agency Placeholder', // TODO
    text: 'Led motion on launch films and interactive campaigns, from storyboard through to the final render and the shipped interface.',
    tags: ['Campaign', '3D', 'Interaction'],
  },
  {
    id: 'x3',
    year: '2020 — 2022',
    role: 'Motion & Interaction Designer',
    company: 'Product Placeholder', // TODO
    text: 'Prototyped and shipped interface motion for a multi-platform product, then wrote the guidelines that kept it consistent.',
    tags: ['Prototyping', 'UI motion', 'Guidelines'],
  },
];

/* ============================================================
   04 · FEATURED — the four rail cards.

   `poster` should be 16:10 (as the Artboard files are) — the card
   renders at that ratio and `object-fit: cover` will crop anything
   that isn't, rather than distort it.
   `route` opens the matching case study at #/<route>.
   ============================================================ */
export const featured = [
  {
    id: 'f1',
    index: '01',
    title: 'Instagram grid',
    category: 'Social system',
    year: '2026',
    desc: 'A twelve-post grid built as a motion-ready template — tap through to scroll the feed and open a post.',
    route: 'instagram',
    poster: thumbInstagram,
  },
  {
    id: 'f2',
    index: '02',
    title: 'LinkedIn campaign',
    category: 'Editorial motion',
    year: '2025',
    desc: 'A post series designed to move in the feed — tap through to the tablet and use the real interactions.',
    route: 'linkedin',
    poster: thumbLinkedIn,
  },
  {
    id: 'f3',
    index: '03',
    title: 'Leafy app',
    category: 'Product UI',
    year: '2025',
    desc: 'A plant-care app where the transitions carry the calm — tap through and switch the tabs yourself.',
    route: 'phone',
    poster: thumbApp,
  },
  {
    id: 'f4',
    index: '04',
    title: 'Brand booklet',
    category: 'Print & identity',
    year: '2024',
    desc: 'An identity system bound as a booklet — tap through and turn the pages.',
    route: 'booklet',
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
    { label: 'LinkedIn', url: 'https://linkedin.com/in/yourname' }, // TODO
    { label: 'Dribbble', url: 'https://dribbble.com/yourname' }, // TODO
    { label: 'Vimeo', url: 'https://vimeo.com/yourname' }, // TODO
    { label: 'Instagram', url: 'https://instagram.com/yourname' }, // TODO
  ],
  footerNote: 'Designed & built from scratch',
};

/* ============================================================
   CASE STUDIES — shapes are frozen; values are yours to edit.
   ============================================================ */

/* ---------- Instagram phone (#/instagram) ---------- */
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

/* ---------- Leafy app (#/phone) ---------- */
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

/* ---------- LinkedIn tablet (#/linkedin) ---------- */
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

/* ---------- Brand booklet (#/booklet) ---------- */
export const booklet = {
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
   THE TABLE (#/phone) — copy for the three objects you can pick up.

   This is the page the Leafy app card opens. It shows the phone, the tablet
   and the booklet on a lit table rather than the Leafy app itself, and this
   is the only copy on it. Which projects appear, and which object each one
   becomes, is decided in PhoneAppCase.jsx.
   ============================================================ */
export const table = {
  prompt: 'Pick one up to interact',
  hint: 'Put it back to try another',
};
