"use client";

import { useEffect, useRef, useState } from "react";
import {
  cookiesForCategory,
  visibleConsentCategories,
  type ConsentChoices,
  type OptionalConsentCategory,
} from "@/lib/consent";
import { deniedConsent } from "./consent-cookie";
import { useConsent } from "./ConsentProvider";

/**
 * The preferences panel — the same native <dialog> device as the contact
 * modal, so it inherits focus trapping, ESC and the top layer for free.
 *
 * Closing without saving (ESC, backdrop, ✕) records nothing: dismissal is
 * not consent. The draft lives in a child component that only mounts while
 * the dialog is open, so an abandoned edit is thrown away for free.
 */
export default function ConsentPreferences() {
  const { isPreferencesOpen, closePreferences } = useConsent();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isPreferencesOpen && !dialog.open) {
      dialog.showModal();
      /* Lenis keeps scrolling <body> under the dialog on some browsers. */
      document.body.style.overflow = "hidden";
    } else if (!isPreferencesOpen && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }
  }, [isPreferencesOpen]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  return (
    <dialog
      ref={dialogRef}
      className="contact-dialog consent-dialog"
      aria-labelledby="consent-prefs-heading"
      onCancel={(e) => {
        e.preventDefault();
        closePreferences();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) closePreferences();
      }}
    >
      <div className="contact-panel consent-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={closePreferences}
          className="contact-close"
          aria-label="Close"
        >
          <span aria-hidden="true">esc ✕</span>
        </button>
        {isPreferencesOpen && <PreferencesForm />}
      </div>
    </dialog>
  );
}

function PreferencesForm() {
  const { choices, rejectAll, save } = useConsent();
  const [draft, setDraft] = useState<ConsentChoices>(
    () => choices ?? deniedConsent(),
  );
  const categories = visibleConsentCategories();

  return (
    <form
      className="consent-form"
      onSubmit={(e) => {
        e.preventDefault();
        save(draft);
      }}
    >
      <p className="eyebrow mb-2">
        <span className="tick">◉</span> Cookie preferences
      </p>
      <h2 id="consent-prefs-heading" className="font-display text-h3">
        Choose what this site may set.
      </h2>
      <p className="mt-2 text-sm leading-body opacity-80">
        Essential cookies keep the site working and cannot be switched off.
        Everything else stays off until you turn it on.
      </p>

      <ul className="consent-categories">
        {categories.map((category) => {
          const names = cookiesForCategory(category.id).map((c) => c.name);
          const checked = category.required
            ? true
            : draft[category.id as OptionalConsentCategory];
          const inputId = `consent-${category.id}`;
          return (
            <li key={category.id} className="consent-category">
              <div className="consent-category-head">
                <label htmlFor={inputId} className="font-display text-lg">
                  {category.label}
                </label>
                <input
                  id={inputId}
                  type="checkbox"
                  className="consent-switch"
                  checked={checked}
                  disabled={category.required}
                  aria-describedby={`${inputId}-desc`}
                  onChange={(e) =>
                    !category.required &&
                    setDraft((d) => ({
                      ...d,
                      [category.id]: e.target.checked,
                    }))
                  }
                />
              </div>
              <p id={`${inputId}-desc`} className="mt-1 text-sm leading-body opacity-80">
                {category.description}
                {category.required && " Always on."}
              </p>
              {/* not .font-data: cookie names are case-sensitive */}
              {names.length > 0 && (
                <p className="mt-2 text-[0.7rem] tracking-wide opacity-70">
                  Cookies: {names.join(" · ")}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="consent-form-actions">
        <button type="button" className="btn-ghost consent-btn" onClick={rejectAll}>
          Reject All
        </button>
        <button type="submit" className="btn-primary consent-btn">
          Save Preferences
        </button>
      </div>
    </form>
  );
}
