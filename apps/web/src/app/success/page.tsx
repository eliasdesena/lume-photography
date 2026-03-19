import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createAdminClient } from "@lume/supabase/admin";
import SuccessContent from "./SuccessContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Welcome to LUMÉ",
  description: "You're in. Your LUMÉ access is ready.",
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

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    redirect("/checkout?error=configuration_error");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" as any });

  let customerEmail: string | null = null;
  let customerName: string | null = null;
  let productId: string = "prod_U9zCzd0tuKoOuU";

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      redirect("/checkout?error=payment_incomplete");
    }
    customerEmail = paymentIntent.metadata?.customer_email ?? null;
    customerName = paymentIntent.metadata?.customer_name ?? null;
    productId = paymentIntent.metadata?.product_id || productId;
  } catch {
    redirect("/checkout?error=verification_failed");
  }

  let accessLink: string | null = null;

  if (customerEmail) {
    const supabase = createAdminClient();
    const name = customerName || customerEmail.split("@")[0];

    // Ensure user exists (idempotent — webhook may not have fired yet)
    let userId: string | null = null;

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: customerEmail,
      email_confirm: true,
      user_metadata: { display_name: name },
    });

    if (newUser?.user) {
      userId = newUser.user.id;
    } else if (createError?.message?.includes("already been registered")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", customerEmail)
        .single();
      if (profile) userId = profile.id;
    }

    // Grant entitlement immediately
    if (userId) {
      await supabase.from("entitlements").upsert(
        {
          user_id: userId,
          product_id: productId,
          stripe_payment_intent_id: paymentIntentId,
        },
        { onConflict: "user_id,product_id" }
      );
    }

    // Generate magic link for instant access (clickable link on page)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.lumephoto.co";
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: customerEmail,
      options: { redirectTo: `${appUrl}/auth/callback` },
    });

    accessLink = linkData?.properties?.action_link ?? null;

    // Also send a magic link email so the user has it in their inbox
    // (admin.generateLink only generates the URL, doesn't send email)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      await fetch(`${supabaseUrl}/auth/v1/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          email: customerEmail,
          create_user: false,
        }),
      });
    }
  }

  return <SuccessContent accessLink={accessLink} />;
}
