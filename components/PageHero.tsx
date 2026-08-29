import type { ReactNode } from "react";
import ContactButton from "@/components/contact/ContactButton";

export type HeroCta = {
  label: string;
  primary?: boolean;
  /** Route or anchor. Omit and set `modal` to open the contact dialog. */
  href?: string;
  modal?: boolean;
};

/**
 * Shared sub-page hero: eyebrow pill, display headline, lede, optional CTAs
 * and an optional right-column slot (award mark, insight frame, media).
 * Same gutter/container order as every section: px on the section,
 * max-w-7xl inside.
 */
export default function PageHero({
  eyebrow,
  title,
  kicker,
  lede,
  ctas,
  aside,
  signal = "overlap",
  outline = false,
}: {
  eyebrow: string;
  title: string;
  /** Short display line above the lede (e.g. the page's thesis). */
  kicker?: string;
  lede?: string;
  ctas?: HeroCta[];
  aside?: ReactNode;
  signal?: string;
  outline?: boolean;
}) {
  return (
    <section
      data-signal={signal}
      className="relative flex min-h-[72svh] flex-col justify-end overflow-hidden px-5 pt-36 pb-16 md:px-8"
      aria-labelledby="page-hero-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow pill anim-fade-up mb-6">
            <span className="tick">●</span> {eyebrow}
          </p>
          <h1
            id="page-hero-heading"
            data-split
            className={`font-display text-hero max-w-4xl ${outline ? "display-outline" : ""}`}
          >
            {title}
          </h1>
          {kicker && (
            <p
              className="anim-fade-up font-display text-h3 mt-6 max-w-2xl"
              style={{ animationDelay: "0.2s" }}
            >
              {kicker}
            </p>
          )}
          {lede && (
            <p
              className="anim-fade-up mt-6 max-w-xl text-lg leading-body"
              style={{ color: "var(--ink-muted)", animationDelay: "0.3s" }}
            >
              {lede}
            </p>
          )}
          {ctas && ctas.length > 0 && (
            <div
              className="anim-fade-up mt-9 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "0.45s" }}
            >
              {ctas.map((c) => {
                const cls = c.primary ? "btn-primary" : "btn-ghost";
                return c.modal ? (
                  <ContactButton key={c.label} className={cls}>
                    {c.label} <span className="btn-arrow">→</span>
                  </ContactButton>
                ) : (
                  <a key={c.label} href={c.href} className={cls}>
                    {c.label} <span className="btn-arrow">→</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
        {aside && (
          <div className="anim-fade-up" style={{ animationDelay: "0.6s" }}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
