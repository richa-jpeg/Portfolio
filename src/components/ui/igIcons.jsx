/* ============================================================
   IG ICONS — the small stroke icon set shared by the phone interior
   (components/ui/IgPhone.jsx) and the floating post cards
   (components/ui/IgPost.jsx).

   Extracted rather than duplicated: the heart on a floating card has to
   be the same heart as the one in the phone's tab bar, and both are filled
   by the same `filled` prop when a post is liked.
   ============================================================ */

const ICON_PATHS = {
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
  comment:
    'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1.1-4.1A8.4 8.4 0 1 1 21 11.5z',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  home: 'M3 10.5L12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  reels: 'M3.5 5.5h17v13h-17zM3.5 10h17M7.5 5.5l3.5 4.5M11.5 5.5l3.5 4.5M15.5 5.5l3.5 4.5',
  bookmark: 'M6 4h12v16l-6-4-6 4z',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 6l6 6-6 6',
  close: 'M18 6L6 18M6 6l12 12',
  /* Two stacked frames: the "this post has more slides" mark. */
  carousel: 'M7 3.5h12.5a1 1 0 0 1 1 1V17M4.5 6.5h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z',
};

export function IgIcon({ name, size = 20, filled = false, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'dots' ? (
        <>
          <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" />
        </>
      ) : (
        <path d={ICON_PATHS[name]} />
      )}
    </svg>
  );
}

export default IgIcon;
