/**
 * LEGAL PAGES — privacy policy, cookie policy, terms of use.
 *
 * Kept apart from manifest.ts and site.ts because this text carries legal
 * weight: it is edited by CLICK's legal reviewer, not by whoever is
 * polishing marketing copy. Same truth discipline as the rest of the
 * content, though — each document carries a VerificationStatus. It is
 * internal (nothing on the page shows it): until a document is
 * `client-confirmed` its route is noindex and it stays out of the sitemap.
 *
 * Provenance: drafted 2026-08-29 from the site's actual data flows (the
 * HubSpot enquiry form, the Creator Network and its audience-intelligence
 * snapshot, the talent directory, the analytics in lib/consent.ts) and the
 * structure of the sister site's policies (hatchet-web, lib/config/legal.ts).
 * The controller details below were supplied by CLICK on 2026-08-29.
 * Everything else is a draft for counsel to confirm, correct or replace.
 *
 * What counsel still has to settle — search "TO CONFIRM" below:
 *   - the ABN
 *   - whether a dedicated privacy mailbox replaces info@
 *   - the retention periods
 *   - EU/UK representative details, if any are required
 *   - the age floor for the Creator Network
 *
 * The cookie table and the processor list in the Cookie Policy are
 * generated from lib/consent.ts. Do not hand-write cookie names here.
 */

import {
  CONSENT_MAX_AGE_DAYS,
  SITE_DOMAIN,
  consentCategories,
  cookieInventory,
  cookieVendors,
  cookiesForCategory,
} from "@/lib/consent";
import { contact, type VerificationStatus } from "./manifest";

export type LegalBlock =
  | { type: "text"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; columns?: string[]; rows: string[][] };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalPageContent {
  slug: string;
  title: string;
  description: string;
  /** Rendered verbatim under the document. */
  updated: string;
  status: VerificationStatus;
  intro?: LegalBlock[];
  sections: LegalSection[];
}

/* ============ THE CONTROLLER ============ */

export const controller = {
  name: "Click Management Pty. Ltd.",
  tradingAs: "CLICK",
  abn: "ABN TO CONFIRM", // TO CONFIRM — supplied by CLICK
  address:
    "Level 5, 69–75 Reservoir Street, Surry Hills NSW 2010, New South Wales, Australia",
  /** TO CONFIRM — counsel may prefer a dedicated privacy@ mailbox. */
  privacyEmail: contact.email,
  parent: "GameSquare Holdings, Inc.",
  site: `www.${SITE_DOMAIN}`,
};

const t = (text: string): LegalBlock => ({ type: "text", text });
const h = (text: string): LegalBlock => ({ type: "subheading", text });
const list = (items: string[]): LegalBlock => ({ type: "list", items });

/* ============ PRIVACY POLICY ============ */

const privacy: LegalPageContent = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  description: `How ${controller.name}, trading as CLICK, collects, uses, shares and protects personal information through this website.`,
  updated: "Last updated: 29 August 2026",
  status: "awaiting-confirmation",
  intro: [
    t(
      `This policy explains how ${controller.name} (trading as ${controller.tradingAs}, "CLICK", "we", "us" or "our") handles personal information collected through ${controller.site} (the "Site") and through the enquiries, applications and conversations that begin here. We are an Australian company and part of the ${controller.parent} group. We handle personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles, and — for people in the United Kingdom, the European Economic Area and California — in accordance with the UK GDPR, the EU GDPR and the California Consumer Privacy Act respectively.`,
    ),
  ],
  sections: [
    {
      heading: "Who we are",
      blocks: [
        t(
          `The organisation responsible for your personal information (the "controller") is ${controller.name} (${controller.abn}), with its registered office at ${controller.address}.`,
        ),
        t(
          `${controller.name} is part of a group of companies whose parent company is ${controller.parent}. Where this policy refers to "the GameSquare group", it means ${controller.parent} and its subsidiaries, which include Stream Hatchet, Sideqik and FaZe Clan.`,
        ),
        t(
          `Questions about this policy, or about how we handle your information, can be sent to ${controller.privacyEmail} or by post to the address above, marked for the attention of the Privacy Officer.`,
        ),
      ],
    },
    {
      heading: "What this policy covers",
      blocks: [
        t(
          "It covers personal information we collect through the Site: when you send us an enquiry, apply to the Creator Network, ask for an audience intelligence snapshot, or simply browse. It also explains how we handle the profiles of the creators we represent, which are published in our Talent Directory.",
        ),
        t(
          "It does not cover information we handle under a written agreement with a client or a creator we represent — those relationships have their own terms — or the practices of other websites and platforms this Site links to.",
        ),
      ],
    },
    {
      heading: "The personal information we collect",
      blocks: [
        h("When you contact us"),
        t(
          "Our enquiry form asks for your name, your email address, the organisation you represent and what you would like to talk about. Emails you send to us are kept with any reply. We do not ask for budgets, timelines or job titles.",
        ),
        h("When you join the Creator Network or apply for representation"),
        t(
          "Your name, email address, the platforms you create on and your channel or profile names, your content category, where you are based, and anything you choose to tell us about your audience and your work. We may also look at your public profiles on those platforms to understand your content.",
        ),
        h("The audience intelligence snapshot"),
        t(
          "If you opt in to receive a complimentary audience intelligence snapshot, we analyse publicly available information about your channels — audience size, engagement, content categories, the platforms and regions your audience is on, and how it overlaps with other communities — using tools operated within the GameSquare group, including Stream Hatchet. See “The audience intelligence snapshot” below.",
        ),
        h("Creators we represent"),
        t(
          "For the creators CLICK Talent manages, we publish a professional profile in the Talent Directory: name or creator name, category, platforms, region, an audience figure and a short biography, together with the brand partnerships and ventures the creator has agreed to show. This is done under each creator's representation agreement with us.",
        ),
        h("When you browse the Site"),
        t(
          "With your consent, analytics tools collect information about your visit: the pages you view, how you arrived, the type of device and browser you use, an approximate location derived from your IP address, and identifiers stored in cookies. Without your consent, only the cookie that records your choice is set. Our hosting provider also keeps standard server logs — IP address, request time, page requested — for security and to keep the Site running.",
        ),
        h("From other sources"),
        t(
          "Clients, agencies and platforms sometimes introduce creators or contacts to us. Group companies may share business contact details with us where that is consistent with this policy. We may also use publicly available professional information, such as a LinkedIn profile, to understand who we are talking to.",
        ),
      ],
    },
    {
      heading: "Why we use it, and on what basis",
      blocks: [
        t(
          "Australian law asks us to tell you the purposes for which we collect personal information. UK and EU law also asks us to name a lawful basis for each. Both are set out here.",
        ),
        list([
          "To respond to your enquiry and to talk with you about working together. Basis: our legitimate interest in running our business and responding to people who contact us; steps taken at your request before entering into a contract.",
          "To assess a creator's application for representation or membership of the Creator Network, and to match creators with brand opportunities. Basis: steps taken at your request before entering into a contract; our legitimate interest in building our roster; your consent where you ask to be considered for specific opportunities.",
          "To prepare and send you an audience intelligence snapshot. Basis: your consent, which you may withdraw at any time.",
          "To keep in touch about CLICK's work, creator opportunities and industry news, where you have agreed to hear from us. Basis: your consent. Every message includes a way to unsubscribe.",
          "To publish and maintain the profiles of the creators we represent. Basis: performance of the representation agreement with the creator.",
          "To understand how the Site is used and improve it. Basis: your consent to analytics cookies.",
          "To keep the Site and our systems secure, and to prevent spam and abuse. Basis: our legitimate interest in the security of our services.",
          "To keep our records accurate and to meet legal, accounting and regulatory obligations. Basis: compliance with a legal obligation; our legitimate interest in accurate records.",
        ]),
        t(
          "Where we rely on legitimate interests we have considered the effect on you and concluded that it is not outweighed by your rights. You can ask us for more about that assessment at any time.",
        ),
      ],
    },
    {
      heading: "The audience intelligence snapshot",
      blocks: [
        t(
          "The snapshot is optional. It is offered to creators who join the Creator Network and is prepared only if you tick the box asking for it. It is an analysis of publicly available data about your channels and audience; it is not a decision about you and has no legal or similarly significant effect on you. Nobody is accepted or declined for representation by an automated system.",
        ),
        t(
          "The analysis is performed using audience-intelligence tools operated within the GameSquare group, including Stream Hatchet. The information used to prepare it may therefore be processed by a group company on our behalf, in the United States or Spain. You can withdraw your consent to the snapshot at any time by emailing us; we will stop preparing it and delete the working data, though we may keep a record that you asked for it and later withdrew.",
        ),
      ],
    },
    {
      heading: "Cookies and analytics",
      blocks: [
        t(
          "The Site sets only essential cookies unless you allow more. Our [Cookie Policy](/cookie-policy) lists every cookie the Site can set, who sets it, why and for how long. You can change your choice at any time using “Cookie Preferences” in the footer of every page. We also honour the Global Privacy Control signal sent by some browsers: if your browser sends it, optional cookies stay off until you turn them on yourself.",
        ),
      ],
    },
    {
      heading: "Who we share it with",
      blocks: [
        t("We share personal information only where this policy describes and only with:"),
        list([
          "Companies in the GameSquare group, where a group company provides a service to us (such as audience-intelligence tooling or shared IT and business systems) or where it is otherwise consistent with the purposes above. CLICK and the GameSquare group use a shared HubSpot customer-relationship system: an enquiry you send to CLICK and an enquiry you send to another group company may be held in the same record.",
          "Service providers who process information for us under contract: HubSpot, Inc. (enquiry forms and customer-relationship management, United States); Google LLC (Google Analytics, United States); our web hosting and content-delivery providers; email, document and productivity providers.",
          "Clients and prospective clients, for creators who have asked to be considered for brand opportunities — limited to what is needed to describe the creator professionally, and only with the creator's agreement.",
          "Professional advisers, insurers, auditors and — where required — courts, regulators and law-enforcement bodies.",
          "A buyer or successor, if CLICK or part of its business is sold or reorganised, on terms that keep this policy's protections.",
        ]),
        t("We do not sell personal information, and we do not share it with third parties for their own marketing."),
      ],
    },
    {
      heading: "International transfers",
      blocks: [
        t(
          "We are based in Australia, and the GameSquare group and our service providers operate in the United States, Canada, the United Kingdom and the European Union. Information about you may be stored or processed in any of those countries. Where information leaves Australia we take reasonable steps to ensure the recipient handles it in line with the Australian Privacy Principles. Where information leaves the United Kingdom or the European Economic Area we rely on an adequacy decision or on standard contractual clauses (the UK International Data Transfer Addendum, where relevant), and on the EU-US Data Privacy Framework for providers certified under it. You can ask us for a copy of the safeguards that apply.",
        ),
      ],
    },
    {
      heading: "How long we keep it",
      blocks: [
        t("We keep personal information for as long as it is needed for the purpose it was collected for, and then delete or de-identify it. As a guide (TO CONFIRM):"),
        list([
          "Enquiries and business contacts: for the duration of our relationship and up to 24 months after our last contact.",
          "Creator Network applications and snapshot working data: 24 months from the application, unless we enter into a representation agreement, in which case for the duration of that agreement and the period our legal obligations require afterwards.",
          "Marketing preferences: until you unsubscribe, plus a record of the unsubscribe so we honour it.",
          "Analytics data: 14 months in Google Analytics; HubSpot analytics for the life of the contact record.",
          `Your cookie choice: ${CONSENT_MAX_AGE_DAYS === 365 ? "12 months" : `${CONSENT_MAX_AGE_DAYS} days`}, after which we ask again.`,
          "Server logs: 30 days.",
        ]),
      ],
    },
    {
      heading: "How we protect it",
      blocks: [
        t(
          "We use reasonable technical and organisational measures to protect personal information from misuse, interference, loss and unauthorised access: encrypted connections, access controls on our systems, and contracts with our service providers that require the same. No transfer over the internet is completely secure, so we cannot guarantee the security of information you send us.",
        ),
      ],
    },
    {
      heading: "Your rights and choices",
      blocks: [
        t("Wherever you are, you can ask us to:"),
        list([
          "tell you what personal information we hold about you and give you a copy of it;",
          "correct information that is inaccurate or out of date;",
          "delete information, where we no longer need it or you withdraw consent we relied on;",
          "stop, or restrict, a particular use of your information, including any use for direct marketing;",
          "withdraw a consent you have given — including consent to analytics cookies, to marketing messages and to the audience intelligence snapshot — without affecting what was done before you withdrew it.",
        ]),
        h("If you are in the United Kingdom or the European Economic Area"),
        t(
          "You also have the right to receive the information you gave us in a portable format, to object to processing based on legitimate interests, and not to be subject to a decision based solely on automated processing that has legal or similarly significant effects on you (we make none).",
        ),
        h("If you are a California resident"),
        t(
          "You have the right to know what personal information we collect, use and disclose; to delete it; to correct it; and to opt out of the “sale” or “sharing” of personal information. We do not sell personal information. Analytics cookies may count as “sharing” under California law: you can opt out using “Cookie Preferences” or the “Do Not Sell or Share My Personal Information” link in the footer, and we honour the Global Privacy Control signal. We will not treat you differently for exercising these rights.",
        ),
        h("How to exercise them"),
        t(
          `Email ${controller.privacyEmail} or write to the address above. We may ask for enough information to confirm you are who you say you are. We respond within 30 days, or tell you if we need longer and why. There is no charge, unless a request is clearly unfounded or excessive.`,
        ),
      ],
    },
    {
      heading: "Children",
      blocks: [
        t(
          "The Site is intended for adults. Many creators are under 18, and we know that: if you are under 18 and want to join the Creator Network or be considered for representation, a parent or guardian must contact us on your behalf (TO CONFIRM the age floor with counsel). We do not knowingly collect personal information from anyone under 16 without a parent's or guardian's involvement; if you think we have, tell us and we will delete it.",
        ),
      ],
    },
    {
      heading: "Complaints",
      blocks: [
        t(
          `If you think we have handled your information badly, please tell us first at ${controller.privacyEmail}. We take complaints seriously and will respond within 30 days. If you are not satisfied with our response you can complain to the Office of the Australian Information Commissioner at www.oaic.gov.au. People in the United Kingdom can complain to the Information Commissioner's Office at www.ico.org.uk; people in the European Economic Area can complain to the supervisory authority where they live; California residents can contact the California Privacy Protection Agency.`,
        ),
      ],
    },
    {
      heading: "Changes to this policy",
      blocks: [
        t(
          "We update this policy when our practices change or the law requires it. The date at the foot of the page tells you when. If a change materially affects how we use information you have already given us, we will tell you directly where we can.",
        ),
      ],
    },
  ],
};

/* ============ COOKIE POLICY ============ */

function cookieTable(): LegalBlock {
  return {
    type: "table",
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

function categoryBlocks(): LegalBlock[] {
  return consentCategories
    .filter((k) => k.required || cookiesForCategory(k.id).length > 0)
    .flatMap((k) => {
      const names = cookiesForCategory(k.id).map((c) => c.name);
      return [
        h(`${k.label} cookies`),
        t(
          `${k.description}${names.length ? ` Cookies in this category: ${names.join(", ")}.` : ""}`,
        ),
      ];
    });
}

function vendorSentence(): string {
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

const cookies: LegalPageContent = {
  slug: "cookie-policy",
  title: "Cookie Policy",
  description: "What cookies are, which ones this site uses, and how you can manage them.",
  updated: "Last updated: 29 August 2026",
  status: "awaiting-confirmation",
  intro: [
    t(
      `${controller.name}, trading as CLICK, has put together this policy to explain what a cookie is and what it does, which cookies we use on ${controller.site} (the "Site"), and how you can manage them.`,
    ),
    t(
      "When you first visit the Site a notice at the foot of the page lets you accept all cookies, reject all optional cookies, or choose category by category. Until you decide, only essential cookies are set. Your decision is stored for twelve months, and you can change it at any time from “Cookie Preferences” in the footer of every page.",
    ),
  ],
  sections: [
    {
      heading: "What cookies are",
      blocks: [
        t(
          "A cookie is a small text file that a website stores in your browser. Some are set by the site you are visiting (first-party cookies) and some by other organisations whose tools the site uses (third-party cookies). Cookies let a site remember you between pages and visits — that is what makes them useful, and also what makes some of them a privacy question. Similar technologies, such as local storage and pixels, are covered by this policy too.",
        ),
      ],
    },
    {
      heading: "The categories we use",
      blocks: [
        t(
          "Essential cookies are exempt from consent because the Site cannot work without them. Every other category stays off until you switch it on.",
        ),
        ...categoryBlocks(),
        t(
          "We do not currently place advertising pixels on the Site. If we add advertising technologies in future, they will be listed on this page and you will be asked for your consent again.",
        ),
      ],
    },
    {
      heading: `Cookies used on ${controller.site}`,
      blocks: [
        t("Every cookie the Site can set, generated from the same list that drives the cookie notice, so the two cannot disagree."),
        cookieTable(),
      ],
    },
    {
      heading: "Who processes the information",
      blocks: [
        t(vendorSentence()),
        t(
          "Information collected through analytics cookies may be transferred to and stored in the United States. The safeguards we rely on are described in our [Privacy Policy](/privacy-policy).",
        ),
      ],
    },
    {
      heading: "How to manage cookies",
      blocks: [
        t(
          "Use “Cookie Preferences” in the footer of any page to change your choice. Switching a category off removes the cookies in that category from your browser as well as recording your refusal. If your browser sends the Global Privacy Control signal, optional cookies are kept off unless you turn them on.",
        ),
        t("You can also control cookies in your browser, including deleting them and blocking them for particular sites:"),
        {
          type: "table",
          columns: ["Browser", "Help"],
          rows: [
            ["Google Chrome", "https://support.google.com/chrome/answer/95647"],
            ["Safari", "https://support.apple.com/en-au/guide/safari/sfri11471/mac"],
            ["Firefox", "https://support.mozilla.org/kb/enhanced-tracking-protection-firefox-desktop"],
            ["Microsoft Edge", "https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947fb1-0a2b-1d1c-b6f6-f5e4d3fde8a3"],
          ],
        },
        t("Blocking essential cookies may stop parts of the Site working — for example, the cookie notice would appear on every page."),
      ],
    },
    {
      heading: "How long the information is kept",
      blocks: [
        t(
          "Each cookie's own lifetime is in the table above. The data collected through analytics cookies is kept for 14 months in Google Analytics. Your recorded cookie choice is kept for twelve months, after which we ask again; it is also reset whenever this policy changes in a way that matters, so that a choice made about one set of cookies is never treated as a choice about a different one.",
        ),
      ],
    },
    {
      heading: "Updates to this policy",
      blocks: [
        t(
          "We update this policy when the cookies on the Site change. The date at the foot of the page tells you when. This policy is available at any time from the “Cookies” link in the footer of the Site.",
        ),
      ],
    },
  ],
};

/* ============ TERMS OF USE ============ */

const terms: LegalPageContent = {
  slug: "terms-of-use",
  title: "Terms of Use",
  description: "The terms on which this website is made available to you.",
  updated: "Last updated: 29 August 2026",
  status: "awaiting-confirmation",
  intro: [
    t(
      `These terms govern your use of ${controller.site} (the "Site"), which is operated by ${controller.name} (${controller.abn}), trading as CLICK, of ${controller.address} ("CLICK", "we", "us"). By using the Site you agree to them. If you do not agree, please do not use the Site.`,
    ),
  ],
  sections: [
    {
      heading: "What the Site is for",
      blocks: [
        t(
          "The Site describes CLICK's services — influencer marketing, experiential and talent management — shows examples of our work, introduces the creators we represent, and lets brands, creators and partners get in touch. It is a marketing site. It does not create accounts, take payments or provide a service beyond information and a way to contact us.",
        ),
      ],
    },
    {
      heading: "Enquiries are not offers",
      blocks: [
        t(
          "Sending us an enquiry, applying to the Creator Network or requesting an audience intelligence snapshot does not create a contract between you and CLICK. Representation, campaign work and partnerships are agreed in writing, separately, and on their own terms. We may decline any enquiry or application without giving a reason.",
        ),
      ],
    },
    {
      heading: "Using the Site",
      blocks: [
        t("You may browse the Site and share links to it. You must not:"),
        list([
          "copy, scrape or systematically extract content from the Site, including the Talent Directory, other than through a link or a search engine's ordinary indexing;",
          "use the Site, or any contact details on it, to send unsolicited commercial messages;",
          "attempt to gain unauthorised access to the Site, the systems behind it, or the enquiry forms, or to interfere with their operation;",
          "submit false, misleading or defamatory information through the Site, or information about another person without their permission;",
          "use the Site in any way that breaks the law where you are.",
        ]),
      ],
    },
    {
      heading: "Intellectual property",
      blocks: [
        t(
          "The Site and everything on it — text, design, graphics, photography, video, the CLICK name and logo — belong to CLICK or are used under licence, and are protected by copyright and trade mark law. Client names, campaign material and creator likenesses appear with the permission of the people and organisations concerned and remain theirs. Nothing on the Site grants you any licence to use them.",
        ),
      ],
    },
    {
      heading: "Information on the Site",
      blocks: [
        t(
          "We take care to keep the Site accurate, but it is general information, not advice, and it is not a promise of any particular result. Case-study figures are those confirmed by the client or published by CLICK at the time shown; audience figures for creators are as at the date shown on each profile and change constantly. Descriptions of the GameSquare group and its companies reflect the group's structure at the time of publication.",
        ),
      ],
    },
    {
      heading: "Other websites and platforms",
      blocks: [
        t(
          "The Site links to social platforms and to other organisations' websites, and creator profiles link to channels on YouTube, TikTok, Instagram, Twitch and elsewhere. Those sites are not ours: we do not control them and are not responsible for their content or their handling of your information. Their own terms and privacy policies apply.",
        ),
      ],
    },
    {
      heading: "Privacy",
      blocks: [
        t(
          "How we handle personal information collected through the Site is explained in our [Privacy Policy](/privacy-policy), and the cookies the Site uses in our [Cookie Policy](/cookie-policy). Both form part of these terms.",
        ),
      ],
    },
    {
      heading: "Liability",
      blocks: [
        t(
          "Nothing in these terms excludes, restricts or modifies any guarantee, right or remedy you have under the Australian Consumer Law or any other law that cannot be excluded. Subject to that, the Site is provided as is and as available; we do not promise that it will be uninterrupted or error-free; and to the extent the law allows, CLICK is not liable for any loss or damage — including indirect or consequential loss — arising from your use of, or inability to use, the Site or anything on it.",
        ),
      ],
    },
    {
      heading: "Governing law",
      blocks: [
        t(
          "These terms are governed by the laws of New South Wales, Australia. Any dispute about them, or about the Site, is subject to the non-exclusive jurisdiction of the courts of New South Wales and the courts entitled to hear appeals from them.",
        ),
      ],
    },
    {
      heading: "Changes",
      blocks: [
        t(
          "We may change these terms at any time by publishing the new version here. The date at the foot of the page tells you when they were last changed. Continuing to use the Site after a change means you accept the new terms.",
        ),
      ],
    },
    {
      heading: "Contact",
      blocks: [
        t(`Questions about these terms can be sent to ${contact.email} or by post to ${controller.address}.`),
      ],
    },
  ],
};

export const legalPages = { privacy, cookies, terms } as const;

/** Footer legal bar, in display order. */
export const legalNav = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/cookie-policy", label: "Cookies" },
  { href: "/terms-of-use", label: "Terms" },
] as const;

/** Indexable and in the sitemap only once counsel has signed off. */
export function isLegalPublishable(page: LegalPageContent): boolean {
  return page.status === "client-confirmed" || page.status === "verified-public";
}
