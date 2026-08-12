"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fields,
  questionnaire,
  validate,
  type Answers,
  type Field,
} from "@/content/questionnaire";
import type { Segment } from "./ContactModalProvider";

/**
 * The questionnaire modal.
 *
 * Built on the native <dialog> element, which gives focus trapping, ESC,
 * inertness of the page behind it and top-layer stacking for free — all of
 * which a div-based modal has to reimplement and usually gets wrong.
 *
 * The form renders itself from content/questionnaire.ts. Adding a question
 * there adds it here; there is no field markup to keep in sync.
 */

type Status = "idle" | "submitting" | "success" | "error";

interface ApiResponse {
  ok: boolean;
  mode?: "hubspot" | "preview";
  errors?: Record<string, string>;
  message?: string;
}

const initialAnswers = (segment?: Segment): Answers => ({
  ...Object.fromEntries(fields.map((f) => [f.name, ""])),
  ...(segment ? { segment } : {}),
});

export default function ContactModal({
  isOpen,
  onClose,
  presetSegment,
}: {
  isOpen: boolean;
  onClose: () => void;
  presetSegment?: Segment;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  /* The provider remounts this component on every open (keyed on its open
     count), so initialising here is the whole reset story — see
     ContactModalProvider. */
  const [answers, setAnswers] = useState<Answers>(() =>
    initialAnswers(presetSegment),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  /* Honeypot. Real people never see it, so anything in it is a bot. */
  const trapRef = useRef<HTMLInputElement>(null);

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

  const setValue = useCallback((name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
    /* clear the error as soon as they start fixing it, not on blur */
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;

    const found = validate(answers);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setNotice(null);
      /* move the user to the first problem rather than making them hunt */
      const first = fields.find((f) => found[f.name]);
      if (first) {
        dialogRef.current
          ?.querySelector<HTMLElement>(`[data-field="${first.name}"] input`)
          ?.focus();
      }
      return;
    }

    setStatus("submitting");
    setNotice(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, company: trapRef.current?.value ?? "" }),
      });
      const data: ApiResponse = await response.json().catch(() => ({ ok: false }));

      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setNotice(data.message ?? questionnaire.errorFallback);
        setStatus("error");
        return;
      }

      setIsPreview(data.mode === "preview");
      setStatus("success");
    } catch {
      setNotice(questionnaire.errorFallback);
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <dialog
      ref={dialogRef}
      className="contact-dialog"
      aria-labelledby="contact-modal-title"
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

        {status === "success" ? (
          <SuccessState isPreview={isPreview} onClose={onClose} />
        ) : (
          <>
            <p className="eyebrow mb-4">
              <span className="tick">●</span> {questionnaire.eyebrow}
            </p>
            <h2
              id="contact-modal-title"
              className="font-display text-h3 max-w-sm"
            >
              {questionnaire.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed opacity-80">
              {questionnaire.intro}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8">
              {/* honeypot — off-screen, not display:none, so bots that skip
                  hidden inputs still fill it */}
              <input
                ref={trapRef}
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="contact-trap"
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <FieldRow
                    key={field.name}
                    field={field}
                    value={answers[field.name] ?? ""}
                    error={errors[field.name]}
                    disabled={submitting}
                    onChange={setValue}
                  />
                ))}
              </div>

              {notice && (
                <p role="alert" className="contact-notice mt-6">
                  {notice}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  data-loading={submitting || undefined}
                >
                  {submitting
                    ? questionnaire.submittingLabel
                    : questionnaire.submitLabel}
                  <span className="btn-arrow">{submitting ? "…" : "→"}</span>
                </button>
                <p className="max-w-[19rem] text-[0.7rem] leading-relaxed opacity-60">
                  {questionnaire.consent}
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}

/* ---------- field rendering ---------- */

function FieldRow({
  field,
  value,
  error,
  disabled,
  onChange,
}: {
  field: Field;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (name: string, value: string) => void;
}) {
  const id = `contact-${field.name}`;
  const describedBy =
    [error && `${id}-error`, field.help && `${id}-help`]
      .filter(Boolean)
      .join(" ") || undefined;

  if (field.type === "choice") {
    return (
      <fieldset
        data-field={field.name}
        className="col-span-full"
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <legend className="contact-label mb-3">
          {field.label}
          {field.required && <span className="contact-req"> *</span>}
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {field.options?.map((option) => (
            <label
              key={option.value}
              className="choice-card"
              data-selected={value === option.value || undefined}
            >
              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={value === option.value}
                disabled={disabled}
                onChange={() => onChange(field.name, option.value)}
                className="visually-hidden"
              />
              <span className="choice-mark" aria-hidden="true" />
              <span>
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="mt-0.5 block text-xs leading-snug opacity-70">
                  {option.blurb}
                </span>
              </span>
            </label>
          ))}
        </div>
        {error && (
          <p id={`${id}-error`} className="contact-error">
            {error}
          </p>
        )}
      </fieldset>
    );
  }

  return (
    <div data-field={field.name} className={field.half ? "" : "col-span-full"}>
      <label htmlFor={id} className="contact-label">
        {field.label}
        {field.required && <span className="contact-req"> *</span>}
      </label>
      <div className="contact-input-wrap" data-invalid={error ? "true" : undefined}>
        {field.prefix && (
          <span className="contact-prefix" aria-hidden="true">
            {field.prefix}
          </span>
        )}
        <input
          id={id}
          name={field.name}
          type={field.type === "email" ? "email" : "text"}
          value={value}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete ?? "off"}
          maxLength={field.maxLength}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="contact-input"
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="contact-error">
          {error}
        </p>
      ) : (
        field.help && (
          <p id={`${id}-help`} className="contact-help">
            {field.help}
          </p>
        )
      )}
    </div>
  );
}

/* ---------- success ---------- */

function SuccessState({
  isPreview,
  onClose,
}: {
  isPreview: boolean;
  onClose: () => void;
}) {
  return (
    <div role="status" className="py-6">
      <span className="contact-tick" aria-hidden="true">
        ●
      </span>
      <p className="eyebrow mt-5">
        <span className="tick">◉</span> {questionnaire.success.eyebrow}
      </p>
      <h2 id="contact-modal-title" className="font-display text-h3 mt-3">
        {questionnaire.success.title}
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-80">
        {questionnaire.success.body}
      </p>
      {isPreview && (
        <p className="font-mono-data mt-4 text-[0.58rem] leading-relaxed opacity-60">
          {questionnaire.previewNote}
        </p>
      )}
      <button type="button" onClick={onClose} className="btn-ghost mt-8">
        {questionnaire.success.dismissLabel}
      </button>
    </div>
  );
}
