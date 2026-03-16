import Image from "next/image";
import { CheckCircle, Shield, Star } from "lucide-react";
import { includes } from "@/data/includes";
import StripeProvider from "@/components/checkout/StripeProvider";

export const metadata = {
  title: "Checkout — LUMÉ",
  description: "Complete your enrollment in LUMÉ iPhone Photography Mastery.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:py-20">
      <div className="max-w-content mx-auto lg:flex lg:gap-16">
        {/* Order Summary */}
        <div className="lg:w-[45%] mb-12 lg:mb-0">
          <a
            href="/"
            className="inline-block mb-10"
            aria-label="LUMÉ home"
          >
            <Image
              src="/images/wordmark-gradient.svg"
              alt="LUMÉ"
              width={180}
              height={44}
              className="h-12 w-auto"
            />
          </a>

          <h1 className="font-display text-3xl sm:text-4xl text-cream mb-2">
            iPhone Photography Mastery
          </h1>
          <p className="font-display text-5xl text-cream mb-8">$97</p>

          <ul className="space-y-3 mb-10">
            {includes.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <CheckCircle
                  size={16}
                  className="text-gold shrink-0 mt-0.5"
                />
                <span className="font-body text-muted text-sm">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Guarantee badge */}
          <div className="bg-surface rounded border border-hairline p-5 flex items-start gap-4 mb-6">
            <Shield size={24} className="text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-body font-medium text-cream text-sm mb-1">
                30-Day Money-Back Guarantee
              </p>
              <p className="font-body font-light text-muted text-xs leading-relaxed">
                Not for you? No problem. Full refund within 30 days — no
                questions, no hoops.
              </p>
            </div>
          </div>

          {/* Checkout testimonial */}
          <div className="bg-surface rounded border border-hairline p-5">
            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="text-gold fill-gold"
                />
              ))}
            </div>
            <p className="font-display italic text-sm text-cream/80 mb-3 leading-relaxed">
              &ldquo;Sold three stock photos in my first month. The course paid
              for itself before I finished module four.&rdquo;
            </p>
            <p className="text-xs text-muted font-body">
              Elena V. <span className="text-muted/60">@elenav.studio</span>
            </p>
          </div>

          <p className="font-body font-light text-muted text-sm mt-8 leading-relaxed">
            You&apos;ll receive instant access the moment your payment clears.
            No waiting. No approval process.
          </p>
        </div>

        {/* Payment Form */}
        <div className="lg:w-[55%]">
          <StripeProvider />
        </div>
      </div>
    </main>
  );
}
