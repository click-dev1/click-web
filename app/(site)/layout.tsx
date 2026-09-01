import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SignalCanvas from "@/components/SignalCanvas";
import FxRouter from "@/components/FxRouter";
import SmoothScroll from "@/components/SmoothScroll";
import StructuredData from "@/components/StructuredData";

/* Chrome for the main site: persistent signal canvas, full nav, footer.
   The contact modal is provided by the root layout, above all of these. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <StructuredData />
      <SignalCanvas />
      {/* above the router: one Lenis for the life of the app, so a route
          change cannot leave the next page scrolled where the last one was */}
      <SmoothScroll />
      <FxRouter />
      <Nav />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
