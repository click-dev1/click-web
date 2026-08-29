import Script from "next/script";
import { GA_ID } from "@/lib/analytics";
import { CONSENT_COOKIE_NAME, CONSENT_VERSION } from "@/lib/consent";

/**
 * GA4, loaded with Consent Mode v2 defaulting to denied.
 *
 * Ordering is the whole point of this component. `dataLayer` is a queue
 * that gtag.js replays in push order once it loads, so the consent
 * default only has to reach the page *before* the config call — not
 * before the library arrives. Both live in one inline block and the
 * library itself loads afterInteractive without racing it. Get the order
 * wrong and GA4 sets cookies for the first pageview of every session
 * before anyone has agreed to anything.
 *
 * ⚠️  The bootstrap is a raw <script> rendered by this server component,
 *     not `next/script beforeInteractive`. Nested inside a component,
 *     `beforeInteractive` is serialised into the RSC payload rather than
 *     emitted as a script tag (the sister site hit this; verified here by
 *     reading the built HTML). A raw inline script is emitted where it is
 *     written and runs as the parser reaches it. Check `view-source` of a
 *     production build, not the source, when changing anything here.
 *
 * The bootstrap reads the visitor's stored choice (components/consent) so
 * a returning visitor who granted analytics has it applied on the first
 * byte rather than a beat after hydration. Global Privacy Control is
 * treated as a refusal. Everything else starts denied and is raised only
 * by updateConsent() from the consent provider.
 *
 * Nothing renders when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset, so
 * development and preview deployments send nothing unless the ID is
 * deliberately set.
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <script id="ga-bootstrap" dangerouslySetInnerHTML={{ __html: bootstrap(GA_ID) }} />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}

/* security_storage is the one granted default: it covers fraud prevention
   and authentication, not tracking. send_page_view: false because
   PageViews.tsx owns pageviews — see the comment there. */
function bootstrap(id: string): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments)}
window.gtag = gtag;
var c = { analytics: false, marketing: false };
try {
  var m = document.cookie.match(/(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)/);
  if (m) {
    var r = JSON.parse(decodeURIComponent(m[1]));
    if (r && r.v === ${CONSENT_VERSION}) {
      c.analytics = r.analytics === true;
      c.marketing = r.marketing === true;
    }
  }
  if (navigator.globalPrivacyControl === true) { c.analytics = false; c.marketing = false; }
} catch (e) {}
gtag('consent', 'default', {
  ad_storage: c.marketing ? 'granted' : 'denied',
  ad_user_data: c.marketing ? 'granted' : 'denied',
  ad_personalization: c.marketing ? 'granted' : 'denied',
  analytics_storage: c.analytics ? 'granted' : 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${id}', { send_page_view: false });`.trim();
}
