"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * The "you are looking at drafts" bar, with a way out. Hidden inside the
 * Studio's Presentation tool, which has its own controls; shown when an
 * editor opens a preview in a tab of its own, so nobody mistakes a draft
 * for the live site.
 */
export default function DraftModeBar() {
  const pathname = usePathname();
  /* Framed = inside the Studio. The server snapshot says "framed" so the
     bar never flashes before hydration can check. */
  const inStudio = useSyncExternalStore(
    noSubscribe,
    () => window.self !== window.top,
    () => true,
  );
  if (inStudio) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-[200] flex items-center justify-center gap-4 px-4 py-2 text-sm"
      style={{ background: "var(--ink)", color: "var(--bg)" }}
    >
      <span>Previewing unpublished drafts — visitors do not see this.</span>
      <a
        href={`/api/draft-mode/disable?to=${encodeURIComponent(pathname)}`}
        className="underline underline-offset-4"
      >
        Exit preview
      </a>
    </div>
  );
}
