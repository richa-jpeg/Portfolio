/* ============================================================
   TYPEWRITER — types `text` one character at a time.

   A self-rescheduling timeout rather than setInterval: each tick
   schedules exactly the next one, so changing `speed` or unmounting
   can never leave a stray interval appending characters forever.

   Accessibility: the animated span is aria-hidden and a
   visually-hidden copy carries the full string, so a screen reader
   announces the sentence once instead of character by character.
   ============================================================ */
import { useEffect, useRef, useState } from 'react';

export default function TypeWriter({
  text,
  speed = 38,
  startDelay = 0,
  onDone,
  caret = true,
  className = '',
}) {
  const [count, setCount] = useState(0);

  /* Keep the latest callback without re-running the typing effect. */
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const firedRef = useRef(false);

  useEffect(() => {
    let timer;
    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) {
        if (!firedRef.current) {
          firedRef.current = true;
          onDoneRef.current?.();
        }
        return;
      }
      i += 1;
      setCount(i);
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, speed, startDelay]);

  const done = count >= text.length;

  return (
    <span className={`typewriter ${className}`}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span className="visually-hidden">{text}</span>
      {caret ? (
        <span
          className={`typewriter-caret${done ? ' is-idle' : ''}`}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}
