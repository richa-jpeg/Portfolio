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
      title: 'Featured work',
      desc: 'A FigJam-style canvas for creative teams — pan, zoom, sticky notes and live cursors.',
      url: 'https://example.com/featured-work',
      color: 'blue',
      rotate: -1,
      image: thumb1,
    },
    {
      id: 'p2',
      title: 'Design system',
      desc: '40+ accessible components, tokens and docs used by six product teams.',
      url: 'https://example.com/design-system',
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
      title: 'Brand identity',
      desc: 'A flexible identity kit — logo, type and palette that scale from favicon to billboard.',
      url: 'https://example.com/brand-identity',
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
