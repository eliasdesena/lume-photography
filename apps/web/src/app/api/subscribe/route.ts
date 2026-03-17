import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@lume/supabase/admin";
import { addContact } from "@/lib/brevo";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    // Derive a name from email prefix as fallback
    const name = email.split("@")[0].replace(/[._-]/g, " ");

    // 1. Add to Brevo newsletter list
    await addContact(
      email,
      name,
      [Number(process.env.BREVO_NEWSLETTER_LIST_ID || 1)]
    );

    // 2. Also upsert into leads table for CRM
    const supabase = createAdminClient();
    await supabase.from("leads").upsert(
      { name, email },
      { onConflict: "email" }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
