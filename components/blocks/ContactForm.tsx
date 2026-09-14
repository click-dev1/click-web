import HubSpotInline from "@/components/contact/HubSpotInline";
import type { ContactFormBlock as Block, SiteSettings } from "@/lib/sanity/types";

/**
 * Copy on the left, the HubSpot form on the right.
 *
 * The form itself is not configurable from Sanity on purpose: its fields,
 * labels, validation and thank-you live in HubSpot, where the people who
 * read the submissions can change them without a deploy. Mirroring any of
 * that here would give one form two sources of truth.
 *
 * The enquiries address comes from site settings rather than from this
 * block, so the nav, the footer, the structured data and this line can
 * never disagree about how to reach CLICK.
 */
export default function ContactForm({
  block,
  signal,
  settings,
}: {
  block: Block;
  signal: string;
  settings: SiteSettings;
}) {
  const headingId = `s-${block._key}`;

  return (
    <section
      data-signal={signal}
      {...(block.anchor ? { id: block.anchor } : {})}
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      aria-labelledby={headingId}
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          {block.eyebrow && (
            <p className="eyebrow pill mb-4">
              <span className="tick">●</span> {block.eyebrow}
            </p>
          )}
          <h2 id={headingId} data-split className="font-display text-h2">
            {block.heading}
          </h2>
          {block.body && (
            <p
              className="mt-5 max-w-md text-lg leading-body"
              style={{ color: "var(--ink-muted)" }}
            >
              {block.body}
            </p>
          )}
          {block.emailPrompt && (
            <p className="mt-6 text-sm">
              {block.emailPrompt}{" "}
              <a
                href={`mailto:${settings.email}`}
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {settings.email}
              </a>
            </p>
          )}
        </div>
        <HubSpotInline />
      </div>
    </section>
  );
}
