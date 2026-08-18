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
 * Mounted once in app/layout.tsx so the dialog element is a single
 * top-layer node — several mounted dialogs stack unpredictably and each
 * would carry its own HubSpot form.
 */

interface ContactModalApi {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const Ctx = createContext<ContactModalApi | null>(null);

export function useContactModal(): ContactModalApi {
  const api = useContext(Ctx);
  if (!api) {
    throw new Error(
      "useContactModal must be used inside <ContactModalProvider>",
    );
  }
  return api;
}

export default function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const api = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <ContactModal isOpen={isOpen} onClose={close} />
    </Ctx.Provider>
  );
}
