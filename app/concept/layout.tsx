import Link from "next/link";

/* Self-contained microsite shell. The only chrome shared with the main
   site — pixel for pixel — is the CLICK logo + "· concept" pair in the
   top-left. No nav links, no theme switcher, no footer. */
export default function ConceptLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="logo-mark h-6 md:h-8" aria-hidden="true" />
            <span className="visually-hidden">CLICK — home</span>
          </Link>
          <span className="eyebrow" style={{ color: "var(--signal)" }}>
            <span className="tick">·</span> concept
          </span>
        </div>
      </header>
      <main id="main" className="relative">
        {children}
      </main>
    </>
  );
}
