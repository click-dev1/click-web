import CtaLink from "./CtaLink";
import type { CtaBannerBlock as Block } from "@/lib/sanity/types";

/* The closing call to action — same markup as the hand-built FinalCta in
   components/Sections.tsx, with the copy and the button under editorial
   control. */
export default function CtaBanner({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const headingId = `s-${block._key}`;
  return (
    <section
      data-signal={signal}
      className="hairline-t relative z-10 px-5 py-28 md:px-8"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 id={headingId} data-split className="font-display text-h2">
          {block.heading}
        </h2>
        {block.body && (
          <p
            data-reveal
            className="mx-auto mt-6 max-w-xl text-lg"
            style={{ color: "var(--ink-muted)" }}
          >
            {block.body}
          </p>
        )}
        {/* The wrapping row only appears when there IS a second button —
            a single CTA keeps exactly the markup the hand-built closers
            use. */}
        {block.secondaryCta ? (
          <div data-reveal className="mt-9 flex flex-wrap justify-center gap-4">
            <CtaLink cta={block.cta} />
            <CtaLink
              cta={{
                ...block.secondaryCta,
                style: block.secondaryCta.style ?? "ghost",
              }}
            />
          </div>
        ) : (
          <div data-reveal className="mt-9">
            <CtaLink cta={block.cta} />
          </div>
        )}
      </div>
    </section>
  );
}
