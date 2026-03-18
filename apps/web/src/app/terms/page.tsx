import { WordmarkGradient } from "@lume/ui/logos";
import Footer from "@/components/sections/Footer";
import TermsContent from "@/content/terms.mdx";

export const metadata = {
  title: "Terms of Service — LUMÉ",
};

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen px-6 py-16 sm:py-20">
        <div className="max-w-narrow mx-auto">
          <a href="/" aria-label="LUMÉ home" className="inline-block mb-14 opacity-70 hover:opacity-100 transition-opacity">
            <WordmarkGradient className="h-7 w-auto" />
          </a>
          <h1 className="font-display text-4xl text-cream mb-10">Terms of Service</h1>
          <div className="prose-lume">
            <TermsContent />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
