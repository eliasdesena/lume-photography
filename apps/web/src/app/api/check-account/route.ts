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

    return NextResponse.json({
      exists: true,
      hasEntitlement: true,
      hasPassword: !!hasPassword,
    });
  } catch (err) {
    console.error("[check-account] ERROR:", err);
    return NextResponse.json(
      { error: "Failed to check account" },
      { status: 500 }
    );
  }
}
