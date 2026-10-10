/* ============================================================
   MILLIMETRE — #/millimetre

   Empty on purpose. The route, the rail card that opens it and the back link
   are in place; the page is a placeholder until the work is ready to show.

   TODO: the content goes in here. The page to copy is MyFitnessCase — blocks
   of artwork in a `gsap.from` — and its layout styles live in the MYFITNESS
   block of cases.css.

   The back link is the one thing that must stay. The board behind is hidden
   while a case is open (`visibility`, not `display`, so the scroll position
   survives), which without it would leave this page a dead end.
   ============================================================ */

export default function MillimetreCase() {
  return (
    <main className="case-page">
      <a className="case-back" href="#/">← Back to work</a>
    </main>
  );
}
