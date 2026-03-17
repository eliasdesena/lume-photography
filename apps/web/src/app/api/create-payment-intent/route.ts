import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

const BASE_PRICE = 9700; // $97.00 in cents

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2025-11-17.clover" as any });
}

export async function POST(request: NextRequest) {
  console.log("[create-payment-intent] POST received");
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, couponCode } = body as {
      name?: string;
      email?: string;
      couponCode?: string;
    };
    console.log("[create-payment-intent] name=%s email=%s coupon=%s", name, email, couponCode ?? "none");

    const stripe = getStripe();

    // Calculate amount — apply coupon if provided
    let amount = BASE_PRICE;
    let appliedCouponCode: string | undefined;
    let discountAmount: number | undefined;

    if (couponCode && couponCode.trim().length > 0) {
      const promotionCodes = await stripe.promotionCodes.list({
        code: couponCode.trim().toUpperCase(),
        active: true,
        limit: 1,
        expand: ["data.promotion.coupon"],
      });

      if (promotionCodes.data.length > 0) {
        const promo = promotionCodes.data[0];
        const coupon = promo.promotion?.coupon;
        appliedCouponCode = promo.code;
        console.log("[create-payment-intent] coupon found: %s", appliedCouponCode);

        if (coupon && typeof coupon !== "string") {
          if (coupon.percent_off) {
            amount = Math.round(BASE_PRICE * (1 - coupon.percent_off / 100));
          } else if (coupon.amount_off) {
            amount = Math.max(0, BASE_PRICE - coupon.amount_off);
          }
        }

        discountAmount = BASE_PRICE - amount;
      }
      // If coupon not found, silently charge full price
      // (validation already happened in /api/validate-coupon)
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        product: "lume-iphone-photography-course",
        product_id: "lume-core",
        ...(name && { customer_name: name }),
        ...(email && { customer_email: email }),
        ...(appliedCouponCode && { coupon_code: appliedCouponCode }),
        ...(discountAmount && { discount_amount: String(discountAmount) }),
        original_amount: String(BASE_PRICE),
      },
      ...(email && { receipt_email: email }),
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log("[create-payment-intent] ✓ created pi=%s amount=%d", paymentIntent.id, amount);
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (err) {
    console.error("[create-payment-intent] ERROR:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create payment intent";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
