/* ============================================================
   JAIGARH HERITAGE FESTIVAL — #/jaigarhHeritageFestival

   The festival's phone. Same device shell and screen implementation as
   ImBesharam's phone (components/ui/IgPhone.jsx), but its own content —
   `jaigarh` in content.jsx: the festival's account header, its own posts.
   Two projects, two pages, two routes; sharing the screen code is deliberate
   and sharing the content is not.

   A deep link is the only way in — no object on the table picks this one up —
   so there is no pick to fly and `picked` is never true. The hook is used for
   the `entered` latch alone, which is what releases the device's pre-hidden
   entry state (`.case-layout.in .phone` in cases.css). Hence no `picked ?`
   ternaries below: nothing here can be reached by pick-up.
   ============================================================ */
import { useRef } from 'react';
import { jaigarh, routes } from './content.jsx';
import { usePickFlight } from './lib/usePickFlight.js';
import IgPhone from './components/ui/IgPhone.jsx';

export default function JaigarhCase() {
  const deviceRef = useRef(null);
  const { entered } = usePickFlight(routes.jaigarh, deviceRef);

  const { account, posts } = jaigarh;

  return (
    <main className="case-page">
      <a className="case-back" href="#/">← Back to work</a>

      {/* `case-layout` stays because the device's release rule is written
          against it; `case-layout-solo` is the modifier that drops the two
          annotation columns this page has no copy for. */}
      <div className={`case-layout case-layout-solo${entered ? ' in' : ''}`}>
        <IgPhone account={account} posts={posts} deviceRef={deviceRef} />
      </div>
    </main>
  );
}
