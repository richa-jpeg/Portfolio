/* ============================================================
   WORK CARD — one project on the Featured rail.

   A 16:10 thumbnail with its caption. The poster is authored at that
   ratio (the Artboard files are 1920×1200), so it displays uncropped;
   `object-fit: cover` is the safety net for anything that isn't, so a
   differently-shaped image crops rather than distorts.

   The card is a plain thumbnail rather than a device mock-up: a 16:10
   frame cannot hold a phone or tablet silhouette without heavy
   cropping. The interactive device is one click away at `#/<route>`.
   ============================================================ */

export default function WorkCard({ project }) {
  const { poster, title, index, category, year, desc, route } = project;

  return (
    <a
      className="rail-card"
      href={`#/${route}`}
      aria-label={`Open case study: ${title}`}
      data-cursor
    >
      <div className="rail-thumb">
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          width="1920"
          height="1200"
        />
        <span className="rail-thumb-sheen" aria-hidden="true" />
      </div>

      <div className="rail-caption">
        <span className="rail-index text-mono">{index}</span>
        <h3 className="rail-title">{title}</h3>
        <p className="rail-desc">{desc}</p>
        <span className="rail-meta text-label">
          {category} · {year}
        </span>
        <span className="rail-open text-label">
          Open case <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}
