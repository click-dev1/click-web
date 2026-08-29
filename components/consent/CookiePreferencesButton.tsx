"use client";

import { useConsent } from "./ConsentProvider";

/**
 * The permanent way back into the preferences panel. Withdrawing consent
 * has to be as easy as giving it, so this sits in the footer of every page
 * and does not depend on the banner still being on screen.
 *
 * Kept as its own client component (like ContactButton) so the server
 * Footer stays a server component.
 */
export default function CookiePreferencesButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" className={className} onClick={openPreferences}>
      {children}
    </button>
  );
}
