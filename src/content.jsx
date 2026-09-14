/* ============================================================
   CONTENT — edit everything about the portfolio here.
   The rest of the app renders whatever you put in this file.

   To use real photos: replace the ph(...) placeholder strings with
   a URL or import an image, e.g.
     import workImg from './images/work.png';
     image: workImg
   (drop the file in src/images/ — Vite bundles it and hashes it
   for caching, which is great for GitHub Pages).

   PINNED SECTION THUMBNAILS (featured-1..4.jpg):
   The four cards in the "Pinned to the board" section currently
   use random 1280×800 (16:10) template JPEGs kept in src/public/.
   To use your own thumbnails, simply drop your images over those
   four files (keep the same file names) or import new files below
   and point image: at them. The cards are fluid: the thumbnail
   always fills the card width and keeps the 16:10 ratio at any
   screen size, so any image with that ratio will fit perfectly.
   ============================================================ */

import thumb1 from './public/Artboard-2.jpg';
import thumb2 from './public/Artboard-3.jpg';
import thumb3 from './public/Artboard-5.jpg';
import thumb4 from './public/Artboard-4.jpg';

export const person = {
  name: 'Richa',
  role: 'Designer',
  tagline: 'I build delightful, fast web experiences.',
  email: 'hello@richa.dev',
  photoInitials: 'RS',
};

/* Tiny inline-SVG placeholder art (gradient + optional label/emoji).
   Zero network requests — swap for real images when you have them. */
const ph = (c1, c2, label = '', emoji = '') => {
  const center = emoji
    ? `<text x="50%" y="55%" font-size="170" text-anchor="middle" dominant-baseline="middle">${emoji}</text>`
    : `<text x="50%" y="53%" fill="rgba(255,255,255,.92)" font-family="sans-serif" font-size="34" text-anchor="middle" dominant-baseline="middle">${label}</text>`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="640" height="400" fill="url(#g)"/>` +
    center +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const content = {
  nav: [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'featured', label: 'Featured' },
    { id: 'more', label: 'More projects' },
    { id: 'contact', label: 'Contact' },
  ],

  /* 1 · HERO — about me, drawn with FigJam pen + stickers + notes */
  hero: {
    note: `👋 Hi, I'm ${person.name} — ${person.role.toLowerCase()}. ${person.tagline} Currently crafting this very board, because why should a portfolio be boring?`,
    chips: [
      { label: 'About me', color: 'blue' },
      { label: 'Design', color: 'pink' },
      { label: 'Code', color: 'lilac' },
      { label: '📄 Resume', color: 'green', href: 'https://example.com/resume' },
    ],
    stickers: [
      { emoji: '🚀', label: "Let's build", size: 96, rotate: -6 },
      { emoji: '💡', label: 'Ideas', size: 80, rotate: 4 },
      { emoji: '✨', label: 'Ships fast', size: 88, rotate: -3 },
    ],
  },

  /* 2 · WORK EXPERIENCE — notes connected by FigJam arrows */
  experience: [
    {
      id: 'exp1',
      role: 'Senior Frontend Engineer',
      company: 'Acme Inc.',
      period: '2021 — now',
      color: 'blue',
      rotate: -1,
      points: [
        'Lead the design-system team shipping 40+ components used across 6 products.',
        'Cut page load times by 45% with code-splitting and edge caching.',
        'Mentor 4 engineers and host the weekly frontend guild.',
      ],
      sticker: { emoji: '🧑‍💻', label: 'Team lead', size: 76, rotate: 5 },
    },
    {
      id: 'exp2',
      role: 'Product Designer',
      company: 'Studio X',
      period: '2018 — 2021',
      color: 'pink',
      rotate: 1.2,
      points: [
        'Designed end-to-end flows for fintech and health clients.',
        'Ran 60+ usability sessions and built a FigJam-based workshop kit.',
      ],
      sticker: { emoji: '🎨', label: 'Design', size: 76, rotate: -5 },
    },
    {
      id: 'exp3',
      role: 'Freelance Web Developer',
      company: 'Self-employed',
      period: '2016 — 2018',
      color: 'green',
      rotate: -1.4,
      points: [
        'Shipped 20+ marketing sites and web apps for small businesses.',
        'Introduced versioned design handoff to every client.',
      ],
      sticker: { emoji: '🌱', label: 'Growth', size: 76, rotate: 4 },
    },
  ],

  /* 3 · PROJECTS I'M PROUD OF — four cards pinned to the board,
     images taped on, click to open */
  featured: [
    {
      id: 'p1',
      title: 'Brand booklet',
      desc: 'A tiny booklet kept on the table — tap it and flip through the pages.',
      route: 'booklet',
      color: 'blue',
      rotate: -1,
      image: thumb1,
    },
    {
      id: 'p2',
      title: 'LinkedIn posts',
      desc: 'A tablet case study replicating LinkedIn posts — tap to zoom in and interact.',
      route: 'linkedin',
      color: 'pink',
      rotate: 1.5,
      image: thumb2,
    },
    {
      id: 'p3',
      title: 'Instagram posts',
      desc: 'A case study: the 12-post grid I designed for a coffee brand. Tap to see it on the phone.',
      route: 'instagram',
      color: 'lilac',
      rotate: 1.2,
      image: thumb3,
    },
    {
      id: 'p4',
      title: 'Mobile app',
      desc: 'A phone-frame case study, same as Instagram — tap to zoom in and play with the app.',
      route: 'phone',
      color: 'green',
      rotate: -1.6,
      image: thumb4,
    },
  ],

  /* 4 · MORE PROJECTS — smaller taped cards */
  more: [
    {
      id: 'm1',
      title: 'Showreel',
      desc: 'A 2-minute highlight reel.',
      url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      color: 'yellow',
      rotate: -1.2,
      image: ph('#4cc9f0', '#7c5cff', 'Showreel'),
      video: true,
    },
    {
      id: 'm2',
      title: 'Weather app',
      desc: 'PWA with offline maps.',
      url: 'https://example.com/weather',
      color: 'green',
      rotate: 1,
      image: ph('#c3f0c3', '#7bd88f', 'Weather app'),
    },
    {
      id: 'm3',
      title: 'Recipe box',
      desc: 'A cozy CRUD app for cooks.',
      url: 'https://example.com/recipes',
      color: 'lilac',
      rotate: -1.4,
      image: ph('#e4d5ff', '#bfe3ff', 'Recipe box'),
    },
    {
      id: 'm4',
      title: 'Pixel garden',
      desc: 'A tiny canvas toy.',
      url: 'https://example.com/garden',
      color: 'blue',
      rotate: 1.6,
      image: ph('#ffc9a3', '#ffb8c6', 'Pixel garden'),
    },
  ],

  /* 5 · CONTACT ME */
  contact: {
    note: `Let's work together! Have a project in mind — or just want to trade FigJam tips? My inbox is always open.`,
    socials: [
      { label: 'GitHub', emoji: '🐙', url: 'https://github.com/yourname' },
      { label: 'LinkedIn', emoji: '💼', url: 'https://linkedin.com/in/yourname' },
      { label: 'Twitter / X', emoji: '🐦', url: 'https://x.com/yourname' },
      { label: 'Dribbble', emoji: '🏀', url: 'https://dribbble.com/yourname' },
    ],
  },
};

/* ============================================================
   INSTAGRAM CASE STUDY — the page at #/instagram
   A phone zooms in to fill the screen; the UI inside looks like
   the Instagram profile grid. Edit the account details and posts
   below; notes on the left/right explain the work.
   ============================================================ */
export const instagram = {
  /* Account details shown on the profile header */
  account: {
    handle: '@richa.designs',
    name: 'Richa',
    avatarEmoji: '🎨',
    avatarGradient: ['#feda75', '#d62976'],
    stats: { posts: 128, followers: '2,340', following: 412 },
    bio: [
      'Designer & developer',
      'Making pixels move 🚀',
      'Portfolio ↓',
    ],
    highlights: [
      { emoji: '📦', label: 'Brands' },
      { emoji: '🎨', label: 'UI' },
      { emoji: '📷', label: 'Photo' },
      { emoji: '✏️', label: 'Doodle' },
    ],
  },

  /* Posts: type 'image' | 'video'. Swap src for your real photos
     (URLs or imported files). Videos get a ▶ badge and open in a
     player; nothing heavy loads until a post is opened. */
  posts: [
    { id: 'ig1', type: 'image', src: ph('#f6d365', '#fda085', '', '☕'), caption: 'Morning light study for the launch campaign.', likes: '1,204 likes', comments: 38 },
    { id: 'ig2', type: 'image', src: ph('#d62976', '#962fbf', '', '🌇'), caption: 'Sunset palette, locked in.', likes: '2,118 likes', comments: 61 },
    { id: 'ig3', type: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: ph('#7c5cff', '#4cc9f0', '', '🎬'), caption: 'Pour-over, 60fps. Process content converts.', likes: '3,402 likes', comments: 97 },
    { id: 'ig4', type: 'image', src: ph('#4cc9f0', '#7c5cff', '', '🧊'), caption: 'Cool product still — no props, just light.', likes: '986 likes', comments: 22 },
    { id: 'ig5', type: 'image', src: ph('#c3f0c3', '#7bd88f', '', '🌿'), caption: 'Behind the scenes at the roastery.', likes: '1,521 likes', comments: 45 },
    { id: 'ig6', type: 'image', src: ph('#ffc9a3', '#ffb8c6', '', '🥐'), caption: 'The pastry flat-lay that out-performed everything.', likes: '4,006 likes', comments: 128 },
    { id: 'ig7', type: 'image', src: ph('#feda75', '#fa7e1e', '', '📦'), caption: 'Packaging reveal — three crops, one post.', likes: '2,745 likes', comments: 84 },
    { id: 'ig8', type: 'image', src: ph('#bfe3ff', '#e4d5ff', '', '☁️'), caption: 'Airy product window for the spring drop.', likes: '1,108 likes', comments: 29 },
    { id: 'ig9', type: 'image', src: ph('#9747ff', '#ff5ca8', '', '✨'), caption: 'Grid finale — full brand palette in one tile.', likes: '1,899 likes', comments: 52 },
  ],

  /* Sticky notes around the phone — the explanation of the work */
  notes: {
    leftLabel: 'Why this design',
    left: [
      {
        color: 'yellow',
        rotate: -1.5,
        sticker: '🎯',
        title: 'The brief',
        text: 'Design a 12-post Instagram grid for a specialty coffee brand — warm, film-like and unmistakably theirs.',
      },
      {
        color: 'blue',
        rotate: 1,
        sticker: '🧩',
        title: 'Grid strategy',
        text: 'Each row of three tells a mini story: product, process, people. The feed reads like a magazine when you scroll.',
      },
      {
        color: 'lilac',
        rotate: -1,
        sticker: '🎨',
        title: 'Palette & type',
        text: 'Cream, espresso and sky blue. No text in the feed — captions carry the voice.',
      },
    ],
    rightLabel: 'Results',
    right: [
      {
        color: 'green',
        rotate: 1.2,
        sticker: '📈',
        title: 'The numbers',
        text: 'Engagement up 38% in six weeks, 2× saves per post, and the brand reused the system for stories.',
      },
      {
        color: 'pink',
        rotate: -1.2,
        sticker: '🛠️',
        title: 'How it was built',
        text: 'Every post was composed on a shared grid in FigJam before touching a camera — approvals dropped from days to hours.',
      },
      {
        color: 'orange',
        rotate: 1,
        sticker: '💡',
        title: 'What I would do next',
        text: 'Animated reels cut from the same stills, plus a saved highlight to archive the campaign.',
      },
    ],
  },
};

/* ============================================================
   PHONE APP CASE STUDY — the page at #/phone
   Same phone frame as the Instagram case (zooms in to fill the
   screen, rests on the table) but with a different in-phone app.
   ============================================================ */
export const phoneApp = {
  app: { name: 'Leafy', emoji: '🌿', avatar: '🍀' },
  hero: {
    greeting: 'Good morning, Richa 🌤️',
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
    leftLabel: 'Why this design',
    left: [
      {
        color: 'green',
        rotate: -1.5,
        sticker: '🌿',
        title: 'The brief',
        text: 'A plant-care app that feels like a warm morning — glanceable, calm and a little playful.',
      },
      {
        color: 'blue',
        rotate: 1,
        sticker: '🧩',
        title: 'Phone frame',
        text: 'Same zoom-in phone frame as the Instagram case, resting on a table so the app feels like a real device.',
      },
      {
        color: 'lilac',
        rotate: -1,
        sticker: '🎯',
        title: 'Interaction',
        text: 'Tap the bottom tabs to switch modes — the app is fully tappable, not just a mockup.',
      },
    ],
    rightLabel: 'Results',
    right: [
      {
        color: 'yellow',
        rotate: 1.2,
        sticker: '📈',
        title: 'Habit loop',
        text: 'Daily care cards keep watering streaks front-and-center; 86% of testers returned the next day.',
      },
      {
        color: 'pink',
        rotate: -1.2,
        sticker: '🛠️',
        title: 'How it was built',
        text: 'Prototyped in FigJam, then rebuilt in React with the same phone frame the portfolio reuses.',
      },
    ],
  },
};

/* ============================================================
   LINKEDIN TABLET CASE STUDY — the page at #/linkedin
   A tablet zooms in from the board and shows a LinkedIn-style
   feed; you can like posts and follow the profile.
   ============================================================ */
export const linkedin = {
  profile: {
    name: 'Richa',
    headline: 'Designer & developer · Building the FigJam portfolio',
    initials: 'RS',
    color: '#0a66c2',
  },
  posts: [
    {
      id: 'li1',
      author: 'Richa',
      headline: 'Designer & developer',
      time: '1w',
      avatar: 'RS',
      color: '#0a66c2',
      text: 'Just shipped the new onboarding flow for Leafy 🌿 — five steps down to two, and signups are up 31%. Design is the product.',
      likes: 248,
      comments: 14,
      image: ph('#7c5cff', '#4cc9f0', '', '🌿'),
    },
    {
      id: 'li2',
      author: 'Richa',
      headline: 'Designer & developer',
      time: '2w',
      avatar: 'RS',
      color: '#0a66c2',
      text: 'A little portfolio secret: everything on this board is one React page pretending to be a desk full of FigJam bits. Zoom in, scroll, open the cases 📌',
      likes: 402,
      comments: 31,
    },
    {
      id: 'li3',
      author: 'Richa',
      headline: 'Designer & developer',
      time: '1mo',
      avatar: 'RS',
      color: '#0a66c2',
      text: 'Three tips for LinkedIn carousels that actually convert: 1) one idea per page, 2) number the pages, 3) end with a call to action. Swipe data never lies.',
      likes: 561,
      comments: 47,
      image: ph('#f6d365', '#fda085', '', '📊'),
    },
    {
      id: 'li4',
      author: 'Richa',
      headline: 'Designer & developer',
      time: '2mo',
      avatar: 'RS',
      color: '#0a66c2',
      text: 'Coffee fuels design systems. Documented the whole component library before lunch ☕ — tokens, variants, states and all.',
      likes: 173,
      comments: 9,
      image: ph('#d62976', '#962fbf', '', '☕'),
    },
  ],
  notes: {
    leftLabel: 'Why this design',
    left: [
      {
        color: 'blue',
        rotate: -1.5,
        sticker: '📱',
        title: 'The brief',
        text: 'Recreate LinkedIn posts inside a tablet frame so readers can scroll and react without leaving the board.',
      },
      {
        color: 'pink',
        rotate: 1,
        sticker: '🧩',
        title: 'On the table',
        text: 'The tablet sits on a wooden tabletop with a soft shadow — one of the objects kept on the desk.',
      },
      {
        color: 'lilac',
        rotate: -1,
        sticker: '🎯',
        title: 'Interaction',
        text: 'Like and follow buttons really work — tap them to update the counts, just like the real app.',
      },
    ],
    rightLabel: 'Results',
    right: [
      {
        color: 'green',
        rotate: 1.2,
        sticker: '📈',
        title: 'The numbers',
        text: 'A like on the tablet increments the counter instantly — small details make the mockup feel alive.',
      },
      {
        color: 'yellow',
        rotate: -1.2,
        sticker: '🛠️',
        title: 'How it was built',
        text: 'Plain CSS device frame + a tiny React feed with local state. Nothing heavy, works offline.',
      },
    ],
  },
};

/* ============================================================
   BOOKLET CASE STUDY — the page at #/booklet
   A booklet kept on the table zooms in; pages turn with a 3D
   page-flip animation. Click the page or use the arrows.
   ============================================================ */
export const booklet = {
  brand: 'Leafy',
  /* A real little book now: every LEAF has TWO printed sides (front + back).
     Each open frame shows a two-page spread — the back print of the leaf
     you just turned sits on the LEFT, the front print of the open leaf on
     the RIGHT. Reading order: front pages are 1, 3, 5… (right), backs are
     2, 4, 6… (left after the turn). Add or remove leaves freely. */
  leaves: [
    {
      front: {
        titlePage: true,
        emoji: '🌿',
        title: 'Leafy',
        subtitle: 'Brand booklet',
        lines: ['A pocket guide to the identity system', 'Tap the right page or use the arrows to turn'],
      },
      back: {
        emoji: '🎨',
        title: 'Palette',
        lines: ['Warm greens and terracotta', 'Leaf #7aa56f · Soil #b06a45', 'Cream paper backgrounds'],
      },
    },
    {
      front: {
        emoji: '🔤',
        title: 'Type',
        lines: ['Headlines — a friendly serif', 'Body — humanist sans', 'One size up for small screens'],
      },
      back: {
        emoji: '📷',
        title: 'Imagery',
        lines: ['Morning-light product shots', 'Soft shadows, no hard edges', 'Always one plant per frame'],
      },
    },
    {
      front: {
        emoji: '✨',
        title: 'Principles',
        lines: ['Calm over loud', 'Care before conversion', 'Design the habit, not the hype'],
      },
      back: {
        emoji: '🙌',
        title: 'Thanks!',
        lines: ['Made with care and caffeine', 'The full brand kit lives on the board'],
      },
    },
  ],
  notes: {
    leftLabel: 'Why this design',
    left: [
      {
        color: 'yellow',
        rotate: -1.5,
        sticker: '📘',
        title: 'The brief',
        text: 'A small printed booklet for the Leafy brand, kept on the table and opened by tapping it.',
      },
      {
        color: 'blue',
        rotate: 1,
        sticker: '🧩',
        title: 'Page turning',
        text: 'Pages flip with a 3D page-turn — click the page (or the arrows) to leaf through cover to back.',
      },
    ],
    rightLabel: 'Results',
    right: [
      {
        color: 'green',
        rotate: 1.2,
        sticker: '📈',
        title: 'The effect',
        text: 'The spread reads like a real print piece: spine shadow, paper grain and a soft drop on the table.',
      },
      {
        color: 'pink',
        rotate: -1.2,
        sticker: '🛠️',
        title: 'How it was built',
        text: 'Two faces per sheet with backface-visibility hidden — the flip is pure CSS 3D, no library.',
      },
    ],
  },
};
