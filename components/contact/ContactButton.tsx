"use client";

import { useContactModal, type Segment } from "./ContactModalProvider";

/**
 * The trigger. Kept as its own client component so the sections that use it
 * (Sections.tsx, Footer.tsx) stay server components — only the button ships
 * JavaScript, not the page around it.
 *
 * A real <button> rather than a link: it opens a dialog, it doesn't
 * navigate. Screen readers announce the difference, and it means no
 * dead /contact route to maintain.
 */
export default function ContactButton({
  segment,
  className = "btn-primary",
  children,
}: {
  segment?: Segment;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useContactModal();

  return (
    <button type="button" className={className} onClick={() => open(segment)}>
      {children}
    </button>
  );
}
