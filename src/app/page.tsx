import Hero from "@/components/sections/Hero";
import SocialProofMarquee from "@/components/sections/SocialProofMarquee";
import Transformation from "@/components/sections/Transformation";
import Modules from "@/components/sections/Modules";
import Instructor from "@/components/sections/Instructor";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import StickyNav from "@/components/sections/StickyNav";
import EmailCapture from "@/components/sections/EmailCapture";
import MobileStickyFooter from "@/components/sections/MobileStickyFooter";

export default function Home() {
  return (
    <main>
      <StickyNav />
      <EmailCapture />
      <MobileStickyFooter />
      <Hero />
      <SocialProofMarquee />
      <Transformation />
      <div className="section-rule mx-6" />
      <Modules />
      <div className="section-rule mx-6" />
      <Instructor />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
