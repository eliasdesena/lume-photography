import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@lume/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Upsert — if the email already exists, update the name
    const { error } = await supabase.from("leads").upsert(
      { name, email },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Failed to save lead:", error);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
