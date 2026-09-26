import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SignalCanvas from "@/components/SignalCanvas";
import FxRouter from "@/components/FxRouter";
import SmoothScroll from "@/components/SmoothScroll";
import StructuredData from "@/components/StructuredData";
import DraftMode from "@/components/DraftMode";
import { fetchNavigation, fetchSiteSettings } from "@/lib/sanity/settings";

/* Chrome for the main site: persistent signal canvas, full nav, footer.
   The contact modal is provided by the root layout, above all of these. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* Fetched once here rather than in each component: the nav is a client
     component and cannot read them, and the footer would otherwise repeat
     the same two queries on every page. Both reads are cached and tagged,
     so editing the menu rebuilds every page that shows it. */
  const [settings, navigation] = await Promise.all([
    fetchSiteSettings(),
    fetchNavigation(),
  ]);

  return (
    <>
      <StructuredData settings={settings} />
      <SignalCanvas />
      {/* above the router: one Lenis for the life of the app, so a route
          change cannot leave the next page scrolled where the last one was */}
      <SmoothScroll />
      <FxRouter />
      <Nav items={navigation.main} email={settings.email} />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer settings={settings} navigation={navigation} />
      <DraftMode />
    </>
  );
}
