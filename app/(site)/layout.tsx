import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SignalCanvas from "@/components/SignalCanvas";
import FxRouter from "@/components/FxRouter";
import StructuredData from "@/components/StructuredData";

/* Chrome for the main concept site: persistent signal canvas, full nav,
   footer. The /concept microsite deliberately lives outside this group.
   The contact modal is provided by the root layout, above all of these. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <StructuredData />
      <SignalCanvas />
      <FxRouter />
      <Nav />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
