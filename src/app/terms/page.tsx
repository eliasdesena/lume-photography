import Footer from "@/components/sections/Footer";
import { course } from "@/config/course";

export const metadata = {
  title: "Terms of Service — LUMÉ",
};

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen px-6 py-20">
        <div className="max-w-narrow mx-auto">
          <a
            href="/"
            className="font-display text-2xl text-cream tracking-wide inline-block mb-12"
          >
            LUMÉ
          </a>
          <h1 className="font-display text-4xl text-cream mb-8">
            Terms of Service
          </h1>
          <div className="font-body font-light text-muted text-base leading-relaxed space-y-4">
            <p>{course.termsOfService}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
