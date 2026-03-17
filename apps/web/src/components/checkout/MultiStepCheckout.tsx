"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import Button from "@/components/ui/Button";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// ── Brand tokens for Stripe Elements ──
const surface2 = "#252220";
const surface = "#1C1A16";
const hairline = "#2E2A24";
const cream = "#F2E8CC";
const gold = "#C8A45A";
const muted = "#6E6455";
const errorColor = "#E05A5A";
const obsidian = "#0D0C0A";

const appearance: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: {
    colorPrimary: gold,
    colorBackground: surface2,
    colorText: cream,
    colorTextSecondary: muted,
    colorTextPlaceholder: "rgba(110, 100, 85, 0.45)",
    colorDanger: errorColor,
    colorIconTab: muted,
    colorIconTabSelected: cream,
    colorIconTabHover: cream,
    fontFamily: "DM Sans, sans-serif",
    fontSizeBase: "14px",
    fontWeightNormal: "300",
    fontWeightMedium: "400",
    fontWeightBold: "500",
    fontLineHeight: "1.5",
    borderRadius: "3px",
    spacingUnit: "4px",
    spacingGridRow: "20px",
  },
  rules: {
    ".Input": {
      backgroundColor: surface2,
      border: `1px solid ${hairline}`,
      color: cream,
      fontSize: "14px",
      fontWeight: "300",
      padding: "12px 14px",
      boxShadow: "none",
    },
    ".Input:focus": {
      border: `1px solid rgba(200, 164, 90, 0.4)`,
      boxShadow: "0 0 0 3px rgba(200, 164, 90, 0.1)",
    },
    ".Input--invalid": {
      border: `1px solid rgba(224, 90, 90, 0.5)`,
      boxShadow: "none",
    },
    ".Label": {
      color: muted,
      fontSize: "10px",
      fontWeight: "500",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      marginBottom: "8px",
    },
    ".Tab": {
      backgroundColor: surface,
      border: `1px solid ${hairline}`,
      color: muted,
      fontWeight: "400",
      boxShadow: "none",
    },
    ".Tab:hover": {
      backgroundColor: surface2,
      color: cream,
      boxShadow: "none",
    },
    ".Tab--selected": {
      backgroundColor: surface2,
      border: `1px solid rgba(200, 164, 90, 0.45)`,
      color: cream,
      boxShadow: "0 0 0 3px rgba(200, 164, 90, 0.08)",
    },
    ".Tab--selected:focus": {
      boxShadow: "0 0 0 3px rgba(200, 164, 90, 0.12)",
    },
    ".TabLabel--selected": { fontWeight: "500", color: cream },
    ".Error": { color: errorColor, fontSize: "12px", fontWeight: "400" },
    ".Block": { backgroundColor: obsidian, border: `1px solid ${hairline}` },
    ".CheckboxInput": { backgroundColor: surface2, border: `1px solid ${hairline}` },
    ".CheckboxInput--checked": { backgroundColor: gold, border: `1px solid ${gold}` },
    ".RedirectText": { color: muted, fontSize: "12px" },
  },
};

const fadeSlide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// ── Payment step (renders inside Elements) ──
function PaymentStep({
  name,
  email,
  error,
  setError,
}: {
  name: string;
  email: string;
  error: string | null;
  setError: (e: string | null) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "Something went wrong.");
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/success`,
        receipt_email: email,
      },
    });

    if (confirmError) {
      setError(confirmError.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className="text-[10px] text-muted/40 font-body uppercase tracking-wider">
          Step 3 of 3
        </div>
      </div>

      <h2 className="font-display text-2xl text-cream mb-1">Payment details</h2>
      <p className="font-body font-light text-muted/60 text-xs mb-4">
        Paying as {name} ({email})
      </p>

      <PaymentElement
        options={{
          layout: { type: "tabs", defaultCollapsed: false },
          fields: { billingDetails: { email: "never" } },
        }}
      />

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-[3px] px-4 py-3">
          <p className="text-error text-sm font-body">{error}</p>
        </div>
      )}

      <div className="pt-1">
        <Button type="submit" fullWidth loading={loading} disabled={!stripe || !elements}>
          Pay $97.00 →
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-muted/50 pt-1">
        <Lock size={11} />
        <span className="text-[11px] font-body tracking-wide">
          256-bit SSL · Secured by Stripe
        </span>
      </div>
    </form>
  );
}

// ── Main multi-step component ──
export default function MultiStepCheckout() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1 → 2: validate name
  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Please enter your name");
      return;
    }
    setError(null);
    setStep(2);
  }

  // Step 2 → 3: save lead + create PaymentIntent
  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Enter a valid email");
        return;
      }

      setError(null);
      setLoading(true);

      try {
        // Save lead (abandoned cart capture)
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });

        // Create PaymentIntent with metadata
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });

        if (!res.ok) throw new Error("Failed to create payment intent");
        const data = await res.json();
        setClientSecret(data.clientSecret);
        setStep(3);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [name, email]
  );

  return (
    <div className="bg-surface rounded border border-hairline p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {/* Step 1: Name */}
        {step === 1 && (
          <motion.div key="step-1" {...fadeSlide}>
            <form onSubmit={handleNameSubmit} className="space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[10px] text-muted/40 font-body uppercase tracking-wider">
                  Step 1 of 3
                </div>
              </div>

              <h2 className="font-display text-2xl text-cream">
                To get you started, what should we call you?
              </h2>

              <div>
                <label
                  htmlFor="checkout-name"
                  className="block font-body text-[10px] text-muted uppercase tracking-[0.15em] font-medium mb-2"
                >
                  Your name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  autoFocus
                  autoComplete="given-name"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-2 border border-hairline rounded-[3px] px-[14px] py-3 text-cream font-body font-light text-sm placeholder:text-muted/45 focus:outline-none focus:ring-[3px] focus:ring-gold/10 focus:border-gold/40 transition-colors"
                />
                {error && (
                  <p className="text-error text-[12px] font-body mt-1.5">{error}</p>
                )}
              </div>

              <Button type="submit" fullWidth>
                Continue →
              </Button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Email */}
        {step === 2 && (
          <motion.div key="step-2" {...fadeSlide}>
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[10px] text-muted/40 font-body uppercase tracking-wider">
                  Step 2 of 3
                </div>
              </div>

              <h2 className="font-display text-2xl text-cream">
                Where should we send your access?
              </h2>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="block font-body text-[10px] text-muted uppercase tracking-[0.15em] font-medium mb-2"
                >
                  Email address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-2 border border-hairline rounded-[3px] px-[14px] py-3 text-cream font-body font-light text-sm placeholder:text-muted/45 focus:outline-none focus:ring-[3px] focus:ring-gold/10 focus:border-gold/40 transition-colors"
                />
                {error && (
                  <p className="text-error text-[12px] font-body mt-1.5">{error}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep(1);
                  }}
                  className="text-muted hover:text-cream text-sm font-body transition-colors px-4 py-3"
                >
                  ← Back
                </button>
                <div className="flex-1">
                  <Button type="submit" fullWidth loading={loading}>
                    Continue →
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && clientSecret && (
          <motion.div key="step-3" {...fadeSlide}>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance,
                fonts: [
                  {
                    cssSrc:
                      "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap",
                  },
                ],
              }}
            >
              <PaymentStep
                name={name}
                email={email}
                error={error}
                setError={setError}
              />
            </Elements>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              s === step ? "bg-gold" : s < step ? "bg-gold/40" : "bg-hairline"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
