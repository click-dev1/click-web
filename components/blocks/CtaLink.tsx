import ContactButton from "@/components/contact/ContactButton";
import type { Cta } from "@/lib/sanity/types";

/**
 * One editor-configured call to action.
 *
 * "Open the contact form" is a destination an editor picks, not a URL
 * they have to know, because the contact form is a modal rather than a
 * page — see the `cta` schema.
 */
export default function CtaLink({ cta }: { cta: Cta }) {
  const className = cta.style === "ghost" ? "btn-ghost" : "btn-primary";
  const label = (
    <>
      {cta.label} <span className="btn-arrow">→</span>
    </>
  );

  if (cta.destination === "modal") {
    return <ContactButton className={className}>{label}</ContactButton>;
  }

  return (
    <a
      href={cta.href}
      className={className}
      {...(cta.destination === "external"
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {label}
    </a>
  );
}
