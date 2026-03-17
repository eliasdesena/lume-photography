"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// ── Brand tokens ──────────────────────────────────────────────────────────────
const obsidian = "#0D0C0A";
const surface  = "#1C1A16";
const surface2 = "#252220";
const hairline = "#2E2A24";
const cream    = "#F2E8CC";
const gold     = "#C8A45A";
const muted    = "#6E6455";
const error    = "#E05A5A";

const appearance: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: {
    colorPrimary:         gold,
    colorBackground:      surface2,
    colorText:            cream,
    colorTextSecondary:   muted,
    colorTextPlaceholder: "rgba(110, 100, 85, 0.45)",
    colorDanger:          error,
    colorIconTab:         muted,
    colorIconTabSelected: cream,
    colorIconTabHover:    cream,

    // DM Sans is injected via fonts[] below
    fontFamily:       "DM Sans, sans-serif",
    fontSizeBase:     "14px",
    fontWeightNormal: "300",
    fontWeightMedium: "400",
    fontWeightBold:   "500",
    fontLineHeight:   "1.5",

    borderRadius:   "3px",
    spacingUnit:    "4px",
    spacingGridRow: "20px",
  },
  rules: {
    ".Input": {
      backgroundColor: surface2,
      border:          `1px solid ${hairline}`,
      color:           cream,
      fontSize:        "14px",
      fontWeight:      "300",
      padding:         "12px 14px",
      boxShadow:       "none",
    },
    ".Input:focus": {
      border:    `1px solid rgba(200, 164, 90, 0.4)`,
      boxShadow: "0 0 0 3px rgba(200, 164, 90, 0.1)",
    },
    ".Input--invalid": {
      border:    `1px solid rgba(224, 90, 90, 0.5)`,
      boxShadow: "none",
    },
    ".Label": {
      color:         muted,
      fontSize:      "10px",
      fontWeight:    "500",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      marginBottom:  "8px",
    },
    ".Tab": {
      backgroundColor: surface,
      border:          `1px solid ${hairline}`,
      color:           muted,
      fontWeight:      "400",
      boxShadow:       "none",
    },
    ".Tab:hover": {
      backgroundColor: surface2,
      color:           cream,
      boxShadow:       "none",
    },
    ".Tab--selected": {
      backgroundColor: surface2,
      border:          `1px solid rgba(200, 164, 90, 0.45)`,
      color:           cream,
      boxShadow:       "0 0 0 3px rgba(200, 164, 90, 0.08)",
    },
    ".Tab--selected:focus": {
      boxShadow: "0 0 0 3px rgba(200, 164, 90, 0.12)",
    },
    ".TabLabel--selected": {
      fontWeight: "500",
      color:      cream,
    },
    ".Error": {
      color:      error,
      fontSize:   "12px",
      fontWeight: "400",
    },
    ".Block": {
      backgroundColor: obsidian,
      border:          `1px solid ${hairline}`,
    },
    ".CheckboxInput": {
      backgroundColor: surface2,
      border:          `1px solid ${hairline}`,
    },
    ".CheckboxInput--checked": {
      backgroundColor: gold,
      border:          `1px solid ${gold}`,
    },
    ".RedirectText": {
      color:    muted,
      fontSize: "12px",
    },
  },
};

export default function StripeProvider() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/create-payment-intent", { method: "POST" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to create payment intent");
        const data = await res.json();
        setClientSecret(data.clientSecret);
      })
      .catch(() =>
        setFetchError("Unable to initialize payment. Please try again.")
      );
  }, []);

  if (fetchError) {
    return (
      <div className="bg-surface rounded border border-hairline p-8 text-center">
        <p className="text-error font-body text-sm">{fetchError}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="bg-surface rounded border border-hairline p-8">
        <div className="animate-pulse space-y-5">
          <div className="h-3 bg-surface-2 rounded w-1/3" />
          <div className="h-11 bg-surface-2 rounded" />
          <div className="h-3 bg-surface-2 rounded w-1/4 mt-6" />
          <div className="h-11 bg-surface-2 rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-11 bg-surface-2 rounded" />
            <div className="h-11 bg-surface-2 rounded" />
          </div>
          <div className="h-12 bg-surface-2 rounded mt-2" />
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
        // Inject DM Sans into Stripe's iframes — fonts are isolated per iframe
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap",
          },
        ],
      }}
    >
      <div className="bg-surface rounded border border-hairline p-6 sm:p-8">
        <CheckoutForm />
      </div>
    </Elements>
  );
}
