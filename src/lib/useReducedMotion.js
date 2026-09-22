/* ============================================================
   useReducedMotion — reactive `prefers-reduced-motion`.

   Reactive rather than a one-shot read, because the setting can be
   toggled (and DevTools emulation flips it live) — components need
   to tear their animations down when it turns on, not just skip
   them at mount.
   ============================================================ */
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const read = () =>
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(read);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    setReduced(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export default useReducedMotion;
