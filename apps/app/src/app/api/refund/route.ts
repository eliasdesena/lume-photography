import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@lume/supabase/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2026-02-25.clover" as any });
}

const REFUND_WINDOW_DAYS = 30;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason } = (await request.json()) as { reason?: string };
    if (!reason) {
      return NextResponse.json(
        { error: "Please provide a reason" },
        { status: 400 }
      );
    }

    // Get the user's entitlement with stripe payment intent
    const { data: entitlement } = await supabase
      .from("entitlements")
      .select("id, stripe_payment_intent_id, granted_at")
      .eq("user_id", user.id)
      .order("granted_at", { ascending: false })
      .limit(1)
      .single();

    if (!entitlement) {
      return NextResponse.json(
        { error: "No purchase found" },
        { status: 404 }
      );
    }

    // Check 30-day window
    const grantedAt = new Date(entitlement.granted_at);
    const daysSince = Math.floor(
      (Date.now() - grantedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince > REFUND_WINDOW_DAYS) {
      return NextResponse.json(
        {
          error: `Refund window has expired. Refunds are available within ${REFUND_WINDOW_DAYS} days of purchase.`,
          daysElapsed: daysSince,
        },
        { status: 400 }
      );
    }

    if (!entitlement.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: "No payment record found for this purchase" },
        { status: 400 }
      );
    }

    // Process the Stripe refund
    const stripe = getStripe();
    const refund = await stripe.refunds.create({
      payment_intent: entitlement.stripe_payment_intent_id,
      reason: "requested_by_customer",
      metadata: {
        user_id: user.id,
        user_email: user.email ?? "",
        refund_reason: reason,
      },
    });

    // Remove entitlement
    await supabase.from("entitlements").delete().eq("id", entitlement.id);

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount,
    });
  } catch (err) {
    console.error("[refund] ERROR:", err);
    const message =
      err instanceof Error ? err.message : "Failed to process refund";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
