"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { contact } from "@/content/manifest";
import { HUBSPOT_EMBED_SRC, HUBSPOT_FORM } from "./hubspot";

/**
 * The contact modal — a brand frame around the HubSpot form.
 *
 * Built on the native <dialog> element, which gives focus trapping, ESC,
 * inertness of the page behind it and top-layer stacking for free — all of
 * which a div-based modal has to reimplement and usually gets wrong.
 *
 * The form itself is HubSpot's embed (see ./hubspot.ts): their loader turns
 * the `.hs-form-frame` div into an iframe and sizes it to its content. It
 * arrives fully styled from the HubSpot editor — title, copy, fields,
 * submit and thank-you — so nothing here duplicates that; the panel only
 * supplies the chrome (border, corner brackets, close) and a loading /
 * failure state around it.
 */

/* Rough upper bound for the loader + iframe on a slow connection. Past it
   we assume the script is blocked (content blockers commonly stop
   js.hsforms.net) and offer email instead of an empty panel. */
const LOAD_TIMEOUT_MS = 10_000;

export default function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  /* The frame is rendered from the first open onwards and kept mounted
     after that: the iframe survives close/reopen, so half-filled answers
     (or the thank-you) are still there when someone comes back. Rendering
     it eagerly would load HubSpot's form — and count a form view — on
     every pageview. */
  const [hasOpened, setHasOpened] = useState(isOpen);
  if (isOpen && !hasOpened) setHasOpened(true);

  const [embedFailed, setEmbedFailed] = useState(false);

  /* open/close the real dialog in step with React state. showModal() is the
     only way into the top layer — setting `open` as an attribute renders a
     non-modal dialog with no focus trap and no ::backdrop. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      /* Lenis keeps scrolling <body> under the dialog on some browsers. */
      document.body.style.overflow = "hidden";
    } else if (!isOpen && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  /* If HubSpot hasn't put its iframe in the frame within the timeout, the
     loader most likely never ran — fall back rather than leave a blank. */
  useEffect(() => {
    if (!hasOpened || embedFailed) return;
    const timer = window.setTimeout(() => {
      if (!frameRef.current?.querySelector("iframe")) setEmbedFailed(true);
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [hasOpened, embedFailed]);

  return (
    <>
      {/* Loaded once the page is interactive so the form is ready by the
          time anyone clicks a CTA. Next dedupes by src. */}
      <Script
        src={HUBSPOT_EMBED_SRC}
        strategy="afterInteractive"
        onError={() => setEmbedFailed(true)}
      />

      <dialog
        ref={dialogRef}
        className="contact-dialog"
        aria-label="Start the conversation"
        onCancel={(e) => {
          /* ESC — let React own the state rather than the DOM closing behind
             its back, otherwise reopening needs two clicks. */
          e.preventDefault();
          onClose();
        }}
        onClick={(e) => {
          /* clicks land on <dialog> itself only when they hit the backdrop:
             the panel below stops anything inside it */
          if (e.target === dialogRef.current) onClose();
        }}
      >
        <div className="contact-panel" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onClose}
            className="contact-close"
            aria-label="Close"
          >
            <span aria-hidden="true">esc ✕</span>
          </button>

          {embedFailed ? (
            <Fallback />
          ) : (
            hasOpened && (
              /* Exactly the markup HubSpot's loader looks for. */
              <div
                ref={frameRef}
                className="hs-form-frame"
                data-region={HUBSPOT_FORM.region}
                data-form-id={HUBSPOT_FORM.formId}
                data-portal-id={HUBSPOT_FORM.portalId}
              />
            )
          )}
        </div>
      </dialog>
    </>
  );
}

/* Shown when the embed can't load. Same voice as the rest of the site, and
   an address that works with no scripts at all. */
function Fallback() {
  return (
    <div role="status" className="contact-fallback">
      <p className="eyebrow">
        <span className="tick">●</span> Start the conversation
      </p>
      <h2 className="font-display text-h3 mt-3">The form didn&apos;t load.</h2>
      <p className="mt-3 max-w-sm text-sm leading-body opacity-80">
        Something is blocking it — a content blocker, most likely. Email us
        instead and a strategist will pick it up.
      </p>
      <a href={`mailto:${contact.email}`} className="btn-primary mt-8">
        {contact.email} <span className="btn-arrow">→</span>
      </a>
    </div>
  );
}
