"use client";

import { useContactModal } from "./ContactModalProvider";

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
  className = "btn-primary",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useContactModal();

  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}
