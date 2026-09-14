import type { LinkChipsBlock as Block, SiteSettings } from "@/lib/sanity/types";

/**
 * A row of chips that link out — the "stay connected" row on /contact.
 *
 * By default the links are the social profiles from site settings, so
 * this row and the footer cannot drift apart. An editor who needs a
 * different set turns that off and lists their own.
 *
 * Every chip opens in a new tab only when it actually leaves the site;
 * an internal path should not steal a tab.
 */
export default function LinkChips({
  block,
  signal,
  settings,
}: {
  block: Block;
  signal: string;
  settings: SiteSettings;
}) {
  const links =
    block.useSocials === false
      ? (block.links ?? []).map((l) => ({ label: l.label, href: l.href }))
      : (settings.socials ?? []).map((s) => ({
          label: s.platform,
          href: s.url,
        }));
  if (!links.length) return null;

  const headingId = `s-${block._key}`;

  return (
    <section
      data-signal={signal}
      {...(block.anchor ? { id: block.anchor } : {})}
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl">
        {block.eyebrow && (
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> {block.eyebrow}
          </p>
        )}
        <h2 id={headingId} data-split className="font-display text-h2 max-w-3xl">
          {block.heading}
        </h2>
        <div className="mt-7 flex flex-wrap gap-3">
          {links.map((l) => {
            const external = /^https?:\/\//.test(l.href);
            return (
              <a
                key={l.href}
                href={l.href}
                className="chip"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {l.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
