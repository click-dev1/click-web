import {
  consentCategories,
  cookieInventory,
  cookieVendors,
  cookiesForCategory,
} from "@/lib/consent";

/**
 * The parts of the Cookie Policy that are GENERATED, not written: the
 * cookie table, the category descriptions and the list of processors.
 * They come from lib/consent.ts — the same list that drives the cookie
 * notice — so the policy and the banner cannot disagree. In the CMS they
 * are placed as a "Cookie inventory" insert inside the policy's text.
 */

export function cookieTableData() {
  return {
    columns: ["Cookie", "Set by", "Category", "Lasts", "Purpose"],
    rows: cookieInventory.map((c) => [
      c.name,
      c.vendor,
      consentCategories.find((k) => k.id === c.category)?.label ?? c.category,
      c.duration,
      c.purpose,
    ]),
  };
}

export function cookieCategoryData() {
  return consentCategories
    .filter((k) => k.required || cookiesForCategory(k.id).length > 0)
    .map((k) => {
      const names = cookiesForCategory(k.id).map((c) => c.name);
      return {
        heading: `${k.label} cookies`,
        text: `${k.description}${names.length ? ` Cookies in this category: ${names.join(", ")}.` : ""}`,
      };
    });
}

export function processorsSentence(): string {
  const vendors = cookieVendors();
  if (vendors.length === 0) return "No third party sets cookies on the Site.";
  const named = vendors.map((v) => {
    if (v.startsWith("Google")) return "Google LLC (Google Analytics)";
    if (v === "HubSpot") return "HubSpot, Inc.";
    if (v === "Cloudflare") return "Cloudflare, Inc. (which protects HubSpot's servers)";
    return v;
  });
  const unique = [...new Set(named)];
  return `The third parties that may process information through cookies on the Site are ${unique.join(" and ")}. Each processes it as our service provider, under contract, and in the United States; their own privacy notices explain what they do with data they hold as a controller.`;
}
