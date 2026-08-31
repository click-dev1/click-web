"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import {
  visibleConsentCategories,
  type ConsentChoices,
  type OptionalConsentCategory,
} from "@/lib/consent";
import { updateConsent } from "@/lib/analytics";
import {
  CONSENT_SERVER_SNAPSHOT,
  clearCookiesForCategory,
  deniedConsent,
  getConsentServerSnapshot,
  getConsentSnapshot,
  hasGlobalPrivacyControl,
  parseConsent,
  subscribeConsent,
  writeConsent,
} from "./consent-cookie";
import ConsentBanner from "./ConsentBanner";
import ConsentPreferences from "./ConsentPreferences";

/**
 * One consent state for the whole site, read from anywhere.
 *
 * Mounted once in app/layout.tsx — above the (site) group, so the 404 and
 * anything else outside it still gets the banner and the preferences
 * dialog. The contact modal provider sits inside this one because its
 * HubSpot form is one of the things consent is about.
 */

interface ConsentApi {
  /** null until hydrated, and null when no valid decision is stored. */
  choices: ConsentChoices | null;
  hasDecided: boolean;
  isPreferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choices: ConsentChoices) => void;
}

const Ctx = createContext<ConsentApi | null>(null);

/**
 * Returns denied-everything when called outside the provider rather than
 * throwing. A missing provider must never be the reason a tracker loads, so
 * anything guarding on this fails closed.
 */
export function useConsent(): ConsentApi {
  const api = useContext(Ctx);
  if (api) return api;
  return {
    choices: null,
    hasDecided: false,
    isPreferencesOpen: false,
    openPreferences: () => {},
    closePreferences: () => {},
    acceptAll: () => {},
    rejectAll: () => {},
    save: () => {},
  };
}

export default function ConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  const snapshot = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  const isHydrated = snapshot !== CONSENT_SERVER_SNAPSHOT;

  const current = useMemo<ConsentChoices | null>(() => {
    if (!isHydrated) return null;
    const record = parseConsent(snapshot);
    return record
      ? { analytics: record.analytics, marketing: record.marketing }
      : null;
  }, [isHydrated, snapshot]);

  const apply = useCallback(
    (choices: ConsentChoices, previous: ConsentChoices | null) => {
      writeConsent(choices);
      updateConsent(choices);
      for (const category of Object.keys(choices) as OptionalConsentCategory[]) {
        const wasOn = previous?.[category] === true;
        if (wasOn && !choices[category]) clearCookiesForCategory(category);
      }
      setPreferencesOpen(false);
    },
    [],
  );

  /* Global Privacy Control: a browser that sends it has already said no.
     Record that refusal so the banner never asks them to say it again; the
     footer's Cookie Preferences remains the way to opt in. Writing the
     cookie notifies the external store, which is what re-renders — no
     React state is set here. */
  useEffect(() => {
    if (isHydrated && current === null && hasGlobalPrivacyControl()) {
      const denied = deniedConsent();
      writeConsent(denied);
      updateConsent(denied);
    }
  }, [isHydrated, current]);

  const api = useMemo<ConsentApi>(
    () => ({
      choices: current,
      hasDecided: current !== null,
      isPreferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      acceptAll: () => apply(grantedConsent(), current),
      rejectAll: () => apply(deniedConsent(), current),
      save: (choices) => apply(choices, current),
    }),
    [apply, current, isPreferencesOpen],
  );

  /* The Studio (/studio) is an editing tool for CLICK staff, not a page
     for visitors: no notice, no preferences panel. Consent state still
     exists there, so nothing else changes. */
  const isStudio = usePathname()?.startsWith("/studio") ?? false;

  return (
    <Ctx.Provider value={api}>
      {children}
      {isHydrated && !isStudio && !api.hasDecided && !isPreferencesOpen && <ConsentBanner />}
      {isHydrated && !isStudio && <ConsentPreferences />}
    </Ctx.Provider>
  );
}

/**
 * "Accept All" means every category the visitor was shown — not every
 * category the schema knows about. Marketing is hidden while it has no
 * cookie; granting it anyway would let gtag set `_gcl_au` and call
 * DoubleClick for a category the notice never mentioned (seen in testing).
 */
function grantedConsent(): ConsentChoices {
  const shown = new Set(visibleConsentCategories().map((c) => c.id));
  return {
    analytics: shown.has("analytics"),
    marketing: shown.has("marketing"),
  };
}
