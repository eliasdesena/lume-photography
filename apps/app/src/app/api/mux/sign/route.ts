import { createClient } from "@lume/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check entitlement
  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", "lume-core")
    .single();

  if (!entitlement) {
    return NextResponse.json({ error: "No access" }, { status: 403 });
  }

  const { playbackId } = await request.json();

  if (!playbackId) {
    return NextResponse.json(
      { error: "Missing playbackId" },
      { status: 400 }
    );
  }

  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
  const signingKeyPrivate = process.env.MUX_SIGNING_KEY_PRIVATE;

  if (!signingKeyId || !signingKeyPrivate) {
    return NextResponse.json(
      { error: "Mux signing not configured" },
      { status: 500 }
    );
  }

  // Create signed JWT for Mux playback
  const token = jwt.sign(
    {
      sub: playbackId,
      aud: "v",
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      kid: signingKeyId,
    },
    Buffer.from(signingKeyPrivate, "base64"),
    { algorithm: "RS256" }
  );

  return NextResponse.json({ token });
}
