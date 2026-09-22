/* ============================================================
   WORK CARD — one project on the Featured rail.

   A 16:10 thumbnail with its caption. The poster is authored at that
   ratio (the Artboard files are 1920×1200), so it displays uncropped;
   `object-fit: cover` is the safety net for anything that isn't, so a
   differently-shaped image crops rather than distorts.

   The card is a plain thumbnail rather than a device mock-up: a 16:10
   frame cannot hold a phone or tablet silhouette without heavy
   cropping. The interactive device is one click away at `#/<route>`.

   A project carrying a `url` is off-site, and that wins over `route`:
   the card becomes a plain outbound link. Two things change with it,
   and both matter — the link opens in a NEW TAB, because a portfolio
   card that navigates away silently loses the visitor, and the label
   says "Visit" rather than "Open case", because a caption that promises
   an in-page case study and delivers someone else's website is a lie
   the visitor only discovers after the click.
   ============================================================ */

export default function WorkCard({ project }) {
  const { poster, title, index, category, year, desc, route, url } = project;

  const external = Boolean(url);
  const href = external ? url : `#/${route}`;

  return (
    <a
      className="rail-card"
      href={href}
      /* `noreferrer` implies `noopener`, so the new tab gets no handle back
         into this window. */
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-label={
        external
          ? `${title} — opens in a new tab`
          : `Open case study: ${title}`
      }
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
          {external ? 'Visit' : 'Open case'}{' '}
          <span aria-hidden="true">{external ? '↗' : '→'}</span>
        </span>
      </div>
    </a>
  );
}
