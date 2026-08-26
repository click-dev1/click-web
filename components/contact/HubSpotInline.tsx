"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { contact } from "@/content/manifest";
import { HUBSPOT_EMBED_SRC, HUBSPOT_FORM } from "./hubspot";

/**
 * The same HubSpot form the modal shows, embedded in the page (/contact).
 *
 * Nothing about the form changes: identical portal / form ids from
 * ./hubspot.ts, HubSpot's own loader, HubSpot's own styling. This only
 * places the `.hs-form-frame` in the document instead of in a <dialog>.
 * The loader is already on every page via the modal; <Script> dedupes by
 * src, so declaring it here just makes this component self-sufficient.
 */
const LOAD_TIMEOUT_MS = 10_000;

export default function HubSpotInline() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const timer = window.setTimeout(() => {
      if (!frameRef.current?.querySelector("iframe")) setFailed(true);
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [failed]);

  return (
    <>
      <Script
        src={HUBSPOT_EMBED_SRC}
        strategy="afterInteractive"
        onError={() => setFailed(true)}
      />
      <div className="contact-inline">
        {failed ? (
          <div role="status" className="contact-fallback">
            <p className="eyebrow">
              <span className="tick">●</span> Start the conversation
            </p>
            <h3 className="font-display text-h3 mt-3">
              The form didn&apos;t load.
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-body opacity-80">
              Something is blocking it — a content blocker, most likely.
              Email us instead and a strategist will pick it up.
            </p>
            <a href={`mailto:${contact.email}`} className="btn-primary mt-8">
              {contact.email} <span className="btn-arrow">→</span>
            </a>
          </div>
        ) : (
          <div
            ref={frameRef}
            className="hs-form-frame"
            data-region={HUBSPOT_FORM.region}
            data-form-id={HUBSPOT_FORM.formId}
            data-portal-id={HUBSPOT_FORM.portalId}
          />
        )}
      </div>
    </>
  );
}
