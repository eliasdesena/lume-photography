import { redirect } from "next/navigation";
import Stripe from "stripe";
import SuccessContent from "./SuccessContent";

export const metadata = {
  title: "Welcome to LUMÉ",
  description: "You're in. Your LUMÉ access is on its way.",
};

interface SuccessPageProps {
  searchParams: Promise<{ payment_intent?: string; payment_intent_client_secret?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent;

  if (!paymentIntentId) {
    redirect("/checkout");
  }

  // Verify payment server-side
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    redirect("/checkout?error=configuration_error");
  }
  const stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      redirect("/checkout?error=payment_incomplete");
    }
  } catch {
    redirect("/checkout?error=verification_failed");
  }

  return <SuccessContent />;
}
