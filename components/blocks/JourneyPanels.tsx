import Link from "next/link";
import ContactButton from "@/components/contact/ContactButton";
import type { JourneyPanel, JourneyPanelsBlock as Block } from "@/lib/sanity/types";

/**
 * The full-bleed split panel — "two ways to work with us".
 *
 * A signature block: edge to edge, no max-width, the second panel drawn
 * as an outline so the pair reads as a choice rather than a ranking. The
 * 01 / 02 marks come from position, not from the editor.
 *
 * Each panel is one big link, so the whole surface is the target. That
 * rules out a nested button, which is why a panel whose destination is
 * the contact modal renders as a ContactButton wrapping the same markup
 * rather than a Link with a button inside it.
 */
function Panel({
  panel,
  index,
  className,
  outline,
}: {
  panel: JourneyPanel;
  index: number;
  className: string;
  outline: boolean;
}) {
  const inner = (
    <>
      <p className="mb-4">
        <span className="eyebrow pill">
          <span className="tick">{String(index + 1).padStart(2, "0")}</span>{" "}
          {panel.eyebrow}
        </span>
      </p>
      <h2 className={`font-display text-h2${outline ? " display-outline" : ""}`}>
        {panel.title}
      </h2>
      <p
        className="mt-4 max-w-md text-lg leading-body"
        style={{ color: "var(--ink-muted)" }}
      >
        {panel.body}
      </p>
      <span className="btn-ghost mt-8 inline-flex group-hover:border-[var(--signal)]">
        {panel.cta.label} <span className="btn-arrow">→</span>
      </span>
    </>
  );

  if (panel.cta.destination === "modal") {
    return (
      <ContactButton className={`${className} text-left`}>
        {inner}
      </ContactButton>
    );
  }

  return (
    <Link
      href={panel.cta.href ?? "#"}
      className={className}
      {...(panel.cta.destination === "external"
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {inner}
    </Link>
  );
}

export default function JourneyPanels({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  if (!block.first || !block.second) return null;

  return (
    <section
      data-signal={signal}
      {...(block.anchor ? { id: block.anchor } : {})}
      className="hairline-t relative z-10"
      aria-label="Two ways to work with us"
    >
      <div className="journeys">
        <Panel
          panel={block.first}
          index={0}
          outline={false}
          className="journey-a texture-grid group relative block px-5 py-16 md:px-10 md:py-24"
        />
        <Panel
          panel={block.second}
          index={1}
          outline
          className="journey-b group relative block border-t px-5 py-16 md:border-t-0 md:border-l md:px-10 md:py-24 [border-color:var(--hairline)]"
        />
      </div>
    </section>
  );
}
