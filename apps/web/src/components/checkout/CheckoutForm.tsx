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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="font-display text-2xl text-cream mb-6">
        Complete your enrollment
      </h2>

      {/* Email — custom field styled to match brand */}
      <div>
        <label
          htmlFor="email"
          className="block font-body text-[10px] text-muted uppercase tracking-[0.15em] font-medium mb-2"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={[
            "w-full bg-surface-2 border rounded-[3px] px-[14px] py-3",
            "text-cream font-body font-light text-sm",
            "placeholder:text-muted/45",
            "focus:outline-none focus:ring-[3px] focus:ring-gold/10 focus:border-gold/40",
            "transition-colors",
            errors.email ? "border-error/50" : "border-hairline",
          ].join(" ")}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-error text-[12px] font-body mt-1.5">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Stripe PaymentElement — fonts injected via StripeProvider fonts[] */}
      <div className="pt-1">
        <PaymentElement
          options={{
            layout: {
              type: "tabs",
              defaultCollapsed: false,
            },
            fields: {
              billingDetails: {
                email: "never", // collected above in our branded field
              },
            },
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-[3px] px-4 py-3">
          <p className="text-error text-sm font-body">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="pt-1">
        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!stripe || !elements}
        >
          Pay $47.00 →
        </Button>
      </div>

      {/* Trust line */}
      <div className="flex items-center justify-center gap-2 text-muted/50 pt-1">
        <Lock size={11} />
        <span className="text-[11px] font-body tracking-wide">
          256-bit SSL · Secured by Stripe
        </span>
      </div>
    </form>
  );
}
