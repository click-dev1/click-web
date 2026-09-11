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
        <div data-reveal className="mt-9">
          <CtaLink cta={block.cta} />
        </div>
      </div>
    </section>
  );
}
