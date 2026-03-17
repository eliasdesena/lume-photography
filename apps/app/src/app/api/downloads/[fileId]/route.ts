import { createClient } from "@lume/supabase/server";
import { downloadableAssets } from "@/data/course";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
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

  // Find the asset
  const asset = downloadableAssets.find((a) => a.id === fileId);
  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Generate signed URL (60s expiry)
  const { data, error } = await supabase.storage
    .from("downloads")
    .createSignedUrl(asset.storagePath, 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: "Failed to generate download link" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(data.signedUrl);
}
