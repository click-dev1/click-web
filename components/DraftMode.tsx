import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import DraftModeBar from "./DraftModeBar";

/**
 * Present only while an editor is previewing drafts (app/api/draft-mode).
 * For every other visitor it renders nothing and ships nothing.
 *
 * VisualEditing keeps the preview in step with the Studio: an edit to a
 * draft refreshes the page it is shown on, and navigation inside the
 * Presentation tool follows the site. Stega (click-to-edit overlays) is
 * deliberately off — it encodes invisible characters into every string,
 * which the site's split-text headings and JSON-LD would carry.
 */
export default async function DraftMode() {
  if (!(await draftMode()).isEnabled) return null;
  return (
    <>
      <VisualEditing />
      <DraftModeBar />
    </>
  );
}
