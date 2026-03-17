import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import SocialProofMarquee from "@/components/sections/SocialProofMarquee";
import StickyNav from "@/components/sections/StickyNav";

// Below-fold: code-split and lazy-loaded
const Transformation = dynamic(() => import("@/components/sections/Transformation"));
const Modules = dynamic(() => import("@/components/sections/Modules"));
const Instructor = dynamic(() => import("@/components/sections/Instructor"));
const Pricing = dynamic(() => import("@/components/sections/Pricing"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const Footer = dynamic(() => import("@/components/sections/Footer"));

// Floating overlays: code-split (browser APIs used inside useEffect)
const EmailCapture = dynamic(() => import("@/components/sections/EmailCapture"));
const MobileStickyFooter = dynamic(() => import("@/components/sections/MobileStickyFooter"));

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
