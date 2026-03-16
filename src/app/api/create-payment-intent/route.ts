import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

export async function POST() {
  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 9700,
      currency: "usd",
      metadata: {
        product: "lume-iphone-photography-course",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create payment intent";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
