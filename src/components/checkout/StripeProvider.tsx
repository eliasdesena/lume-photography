"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const appearance: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: {
    colorPrimary: "#C8A45A",
    colorBackground: "#252220",
    colorText: "#F2E8CC",
    colorDanger: "#E05A5A",
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "4px",
    colorTextPlaceholder: "rgba(110, 100, 85, 0.5)",
  },
  rules: {
    ".Input": {
      backgroundColor: "#252220",
      border: "1px solid #2E2A24",
      color: "#F2E8CC",
      fontSize: "14px",
      padding: "12px 16px",
    },
    ".Input:focus": {
      borderColor: "rgba(200, 164, 90, 0.3)",
      boxShadow: "0 0 0 2px rgba(200, 164, 90, 0.15)",
    },
    ".Label": {
      color: "#6E6455",
      fontSize: "11px",
      fontWeight: "500",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    ".Tab": {
      backgroundColor: "#1C1A16",
      border: "1px solid #2E2A24",
      color: "#6E6455",
    },
    ".Tab--selected": {
      backgroundColor: "#252220",
      borderColor: "#C8A45A",
      color: "#F2E8CC",
    },
    ".Tab:hover": {
      color: "#F2E8CC",
    },
  },
};

export default function StripeProvider() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/create-payment-intent", { method: "POST" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to create payment intent");
        const data = await res.json();
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        setError("Unable to initialize payment. Please try again.");
      });
  }, []);

  if (error) {
    return (
      <div className="bg-surface rounded border border-hairline p-8 text-center">
        <p className="text-error font-body text-sm">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="bg-surface rounded border border-hairline p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-surface-2 rounded w-1/3" />
          <div className="h-12 bg-surface-2 rounded" />
          <div className="h-12 bg-surface-2 rounded" />
          <div className="h-12 bg-surface-2 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance }}
    >
      <div className="bg-surface rounded border border-hairline p-6 sm:p-8">
        <CheckoutForm />
      </div>
    </Elements>
  );
}
