# Connecting the contact questionnaire to HubSpot

The modal already works — it validates, submits and shows a success state.
Until the two values below are set it runs in **preview mode**: nothing is
stored, and the success screen says so.

Wiring it up is four steps in HubSpot and two environment variables here.
About fifteen minutes, no developer needed on the HubSpot side.

---

## Step 1 — Create two custom contact properties

The form sends five answers. Three map to properties HubSpot already has
(`firstname`, `lastname`, `email`). Two need creating.

Go to **Settings ⚙ → Data Management → Properties → Create property**, and
create both of these against the **Contact** object:

| Label          | Internal name        | Field type            | Options                        |
| -------------- | -------------------- | --------------------- | ------------------------------ |
| Enquiry type   | `click_enquiry_type` | Dropdown select       | `brand` — Brand · `creator` — Creator |
| Social tag     | `click_social_tag`   | Single-line text      | —                              |

⚠️ **The internal name has to match exactly.** HubSpot generates it from the
label, so open "Create property → the `</>` icon next to the name" and set it
by hand. Internal names cannot be changed after saving; the label can.

For the dropdown, the **internal value** of each option must be lowercase
`brand` and `creator` — the label shown to your team can be anything.

## Step 2 — Create the form

**Marketing → Forms → Create form → Embedded form → Blank template.**

Add exactly these five fields, all as-is from the property list:

- First name
- Last name
- Email
- Enquiry type
- Social tag

Nothing needs styling — this form is never displayed. The website renders its
own; HubSpot only receives the answers. Set follow-up email / notification /
workflow options as you like, then **Publish**.

## Step 3 — Copy the two IDs

Open the published form and click **Share → Embed code**. In the snippet:

```js
hbspt.forms.create({
  portalId: "12345678",                                  // ← HUBSPOT_PORTAL_ID
  formId: "0a1b2c3d-4e5f-6789-abcd-ef0123456789",        // ← HUBSPOT_FORM_GUID
});
```

Neither value is a secret — they appear in the page source of every embedded
HubSpot form. There is no API key to create and nothing to rotate.

## Step 4 — Set the environment variables

Locally, create `.env.local` in the project root:

```
HUBSPOT_PORTAL_ID=12345678
HUBSPOT_FORM_GUID=0a1b2c3d-4e5f-6789-abcd-ef0123456789
```

In production, add the same two variables in the hosting dashboard
(Vercel: **Project → Settings → Environment Variables**) and redeploy.

That's it. Submissions now appear under **Marketing → Forms → [your form] →
Submissions**, and each one creates or updates a contact.

---

## Checking it worked

1. Submit the modal with a real address.
2. The success screen should **not** show the "Preview mode" line.
3. The submission appears in the form's Submissions tab within seconds.

If it doesn't, the server log holds HubSpot's own error message, prefixed
`[hubspot]`. The two common ones:

| Message contains          | Cause                                                          |
| ------------------------- | -------------------------------------------------------------- |
| `Field "…" doesn't exist` | The property internal name in step 1 doesn't match, or the field wasn't added to the form in step 2. |
| `404`                     | Portal ID or form GUID is wrong, or the form isn't published.  |

---

## Optional: attribution tracking

If you install the HubSpot tracking script site-wide, submissions get joined
to that visitor's browsing history (which pages, which campaign, first touch).
The server already reads HubSpot's `hubspotutk` cookie and forwards it — no
code change needed, just add the script.

Note it is a third-party tracker, so it needs a cookie banner and a line in
the privacy policy. Without it, everything still works; you just lose the
"how did they get here" trail.

---

## Adding a question later

Everything is driven by one file: **`content/questionnaire.ts`**.

```ts
{
  name: "budget",              // key in the JSON payload
  hubspot: "click_budget",     // internal property name in HubSpot
  label: "Rough budget",
  type: "text",
  required: false,
  maxLength: 60,
}
```

Add the entry, then create the matching property in HubSpot (step 1) and add
it to the form (step 2). The modal renders it, validates it and maps it
automatically — there is no form markup to edit.

---

## How it fits together

```
ContactButton  ──opens──▶  ContactModal
(any CTA)                  renders + validates from content/questionnaire.ts
                                │
                                │  POST /api/contact  (same-origin JSON)
                                ▼
                          app/api/contact/route.ts
                          honeypot · rate limit · re-validates server-side
                                │
                                ▼
                            lib/hubspot.ts
                          maps answers → HubSpot property names
                                │
                                ▼
                    api.hsforms.com  /submissions/v3/…
```

The browser never talks to HubSpot directly. That keeps any future
credential server-side, means validation can't be bypassed, and makes
switching CRM a change to `lib/hubspot.ts` alone — the modal doesn't know
HubSpot exists.
