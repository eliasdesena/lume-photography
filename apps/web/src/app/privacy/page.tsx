import Image from "next/image";
import Footer from "@/components/sections/Footer";
import PrivacyContent from "@/content/privacy.mdx";

export const metadata = {
  title: "Privacy Policy — LUMÉ",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen px-6 py-16 sm:py-20">
        <div className="max-w-narrow mx-auto">
          <a href="/" aria-label="LUMÉ home" className="inline-block mb-14 opacity-70 hover:opacity-100 transition-opacity">
            <Image
              src="/images/wordmark-gradient.svg"
              alt="LUMÉ"
              width={100}
              height={26}
              className="h-7 w-auto"
            />
          </a>
          <h1 className="font-display text-4xl text-cream mb-10">Privacy Policy</h1>
          <div className="prose-lume">
            <PrivacyContent />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
