import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@lume/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if user exists with this email
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    // Check if they have an entitlement (purchased the course)
    const { data: entitlement } = await supabase
      .from("entitlements")
      .select("id, granted_at")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!entitlement) {
      return NextResponse.json({ exists: true, hasEntitlement: false });
    }

    // Check if they have a password set
    const hasPassword = user.identities?.some(
      (i) => i.provider === "email"
    );

    // If user has entitlement but no password, send them a magic link
    // so the "check your inbox" message is actually true.
    // admin.generateLink doesn't send email — call Supabase OTP endpoint directly.
    let magicLinkSent = false;
    if (!hasPassword) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://app.lumephoto.co";

      if (supabaseUrl && supabaseAnonKey) {
        const otpRes = await fetch(`${supabaseUrl}/auth/v1/otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseAnonKey,
          },
          body: JSON.stringify({
            email,
            create_user: false,
          }),
        });
        magicLinkSent = otpRes.ok;
      }
    }

    return NextResponse.json({
      exists: true,
      hasEntitlement: true,
      hasPassword: !!hasPassword,
      magicLinkSent,
    });
  } catch (err) {
    console.error("[check-account] ERROR:", err);
    return NextResponse.json(
      { error: "Failed to check account" },
      { status: 500 }
    );
  }
}
