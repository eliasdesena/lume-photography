import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

const BASE_PRICE = 9700; // $97.00 in cents

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2026-02-25.clover" as any });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { code } = body as { code?: string };

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { valid: false, error: "Please enter a coupon code" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Look up the promotion code, expanding the nested coupon object
    const promotionCodes = await stripe.promotionCodes.list({
      code: code.trim().toUpperCase(),
      active: true,
      limit: 1,
      expand: ["data.promotion.coupon"],
    });

    if (promotionCodes.data.length === 0) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired coupon code" },
        { status: 404 }
      );
    }

    const promoCode = promotionCodes.data[0];
    const coupon = promoCode.promotion?.coupon;

    // coupon can be a string (ID) or expanded Coupon object
    if (!coupon || typeof coupon === "string") {
      return NextResponse.json(
        { valid: false, error: "Coupon data unavailable" },
        { status: 500 }
      );
    }

    // Calculate the discounted amount
    let discountedAmount = BASE_PRICE;
    let discountLabel = "";

    if (coupon.percent_off) {
      discountedAmount = Math.round(BASE_PRICE * (1 - coupon.percent_off / 100));
      discountLabel = `${coupon.percent_off}% off`;
    } else if (coupon.amount_off) {
      discountedAmount = Math.max(0, BASE_PRICE - coupon.amount_off);
      discountLabel = `$${(coupon.amount_off / 100).toFixed(2)} off`;
    }

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discountLabel,
      discountedAmount,
      originalAmount: BASE_PRICE,
      percentOff: coupon.percent_off || null,
      amountOff: coupon.amount_off || null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to validate coupon";
    return NextResponse.json({ valid: false, error: message }, { status: 500 });
  }
}
