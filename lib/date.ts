/** "26 September 2026". Fixed locale and UTC, so the server's own timezone
    never shifts a date by a day. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
