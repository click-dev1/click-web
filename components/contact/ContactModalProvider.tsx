"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ContactModal from "./ContactModal";

/**
 * One modal instance for the whole site, opened from anywhere.
 *
 * Mounted once in app/(site)/layout.tsx so the dialog element is a single
 * top-layer node — several mounted dialogs stack unpredictably and each
 * would carry its own form state.
 *
 * `open("creator")` preselects the first question, which is how the
 * creator-side CTAs skip a step.
 */

export type Segment = "brand" | "creator";

interface ContactModalApi {
  open: (segment?: Segment) => void;
  close: () => void;
  isOpen: boolean;
}

const Ctx = createContext<ContactModalApi | null>(null);

export function useContactModal(): ContactModalApi {
  const api = useContext(Ctx);
  if (!api) {
    throw new Error("useContactModal must be used inside <ContactModalProvider>");
  }
  return api;
}

interface OpenState {
  /** bumped on every open — used as the modal's key */
  session: number;
  isOpen: boolean;
  segment?: Segment;
}

export default function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OpenState>({ session: 0, isOpen: false });

  /* Keying the modal on `session` remounts it on every open, so its form
     state is initialised from the preset rather than synced to it after the
     fact — no reset effect, and no stale answers from the last visit. The
     remount only ever happens while the dialog is closed. */
  const open = useCallback((segment?: Segment) => {
    setState((prev) => ({
      session: prev.session + 1,
      isOpen: true,
      segment,
    }));
  }, []);

  const close = useCallback(
    () => setState((prev) => ({ ...prev, isOpen: false })),
    [],
  );

  const api = useMemo(
    () => ({ open, close, isOpen: state.isOpen }),
    [open, close, state.isOpen],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <ContactModal
        key={state.session}
        isOpen={state.isOpen}
        onClose={close}
        presetSegment={state.segment}
      />
    </Ctx.Provider>
  );
}
