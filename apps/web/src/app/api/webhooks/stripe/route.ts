import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@lume/supabase/admin";
import { sendTransactionalEmail, addContact } from "@/lib/brevo";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { customer_name, customer_email, product_id, coupon_code, discount_amount, original_amount } =
      paymentIntent.metadata;

    if (!customer_email) {
      console.error("No customer_email in payment metadata");
      return NextResponse.json({ received: true });
    }

    const name = customer_name || customer_email.split("@")[0];
    const productId = product_id || "lume-core";

    const supabase = createAdminClient();

    try {
      // 1. Create or find user
      let userId: string;

      // Try to create user — if they already exist, Supabase returns an error
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email: customer_email,
          email_confirm: true,
          user_metadata: { display_name: name },
        });

      if (newUser?.user) {
        userId = newUser.user.id;
      } else if (createError?.message?.includes("already been registered")) {
        // User exists — look them up via the profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", customer_email)
          .single();

        if (!profile) {
          console.error("User exists in auth but not in profiles for:", customer_email);
          return NextResponse.json(
            { error: "User lookup failed" },
            { status: 500 }
          );
        }
        userId = profile.id;
      } else {
        console.error("Failed to create user:", createError);
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }

      // 2. Grant entitlement
      await supabase.from("entitlements").upsert(
        {
          user_id: userId,
          product_id: productId,
          stripe_payment_intent_id: paymentIntent.id,
        },
        { onConflict: "user_id,product_id" }
      );

      // 3. Update lead as converted
      await supabase
        .from("leads")
        .update({
          converted: true,
          stripe_payment_intent_id: paymentIntent.id,
        })
        .eq("email", customer_email);

      // 4. Generate magic link for welcome email
      const { data: linkData } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: customer_email,
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_APP_URL
              ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
              : "https://app.lumephotos.co/auth/callback",
        },
      });

      const magicLink =
        linkData?.properties?.action_link || "https://app.lumephotos.co/login";

      // 5. Send welcome email via Brevo
      await sendTransactionalEmail({
        to: [{ email: customer_email, name }],
        templateId: Number(process.env.BREVO_WELCOME_TEMPLATE_ID || 1),
        params: {
          name,
          magic_link: magicLink,
          app_url: process.env.NEXT_PUBLIC_APP_URL || "https://app.lumephotos.co",
        },
      });

      // 6. Add to Brevo "Students" list
      await addContact(
        customer_email,
        name,
        [Number(process.env.BREVO_STUDENTS_LIST_ID || 2)]
      );

      const couponInfo = coupon_code
        ? ` (coupon: ${coupon_code}, saved: $${(Number(discount_amount || 0) / 100).toFixed(2)}, original: $${(Number(original_amount || 9700) / 100).toFixed(2)})`
        : "";
      console.log(`✓ Payment processed for ${customer_email} — user ${userId}${couponInfo}`);
    } catch (err) {
      console.error("Webhook processing error:", err);
      return NextResponse.json(
        { error: "Processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
