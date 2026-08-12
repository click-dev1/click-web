import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SignalCanvas from "@/components/SignalCanvas";
import FxRouter from "@/components/FxRouter";

/* Global 404 renders inside the bare root layout (outside the (site)
   group), so it brings the main-site chrome with it explicitly. */
export default function NotFound() {
  return (
    <>
      <SignalCanvas />
      <FxRouter />
      <Nav />
      <main id="main" className="relative">
        <NotFoundBody />
      </main>
      <Footer />
    </>
  );
}

function NotFoundBody() {
  return (
    <section
      data-signal="dormant"
      className="relative z-10 flex min-h-[80svh] flex-col items-center justify-center px-5 text-center md:px-8"
    >
      <p className="eyebrow mb-6">
        <span className="tick">◉</span> Signal lost
      </p>
      <h1 className="font-display text-hero display-outline">404</h1>
      <p className="mt-6 max-w-md text-lg" style={{ color: "var(--ink-muted)" }}>
        This page doesn&apos;t exist — but the intelligence usually finds a
        better route anyway.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary">
          Back to Home <span className="btn-arrow">→</span>
        </Link>
        <Link href="/concept" className="btn-ghost">
          View the Concept <span className="btn-arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
