"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "@/components/ui/Button";
import { Lock } from "lucide-react";

interface FormData {
  email: string;
}

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
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
        receipt_email: data.email,
      },
    });

    if (confirmError) {
      setError(confirmError.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="font-display text-2xl text-cream mb-6">
        Complete your enrollment
      </h2>

      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs text-muted font-body mb-2 uppercase tracking-wider"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full bg-surface-2 border border-hairline rounded px-4 py-3 text-cream font-body text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/30 transition-colors"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-error text-xs mt-1 font-body">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Stripe PaymentElement */}
      <div>
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded px-4 py-3">
          <p className="text-error text-sm font-body">{error}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={!stripe || !elements}
      >
        Pay $97.00 →
      </Button>

      {/* Trust line */}
      <div className="flex items-center justify-center gap-2 text-muted/60">
        <Lock size={12} />
        <span className="text-xs font-body">256-bit SSL · Powered by Stripe</span>
      </div>
    </form>
  );
}
