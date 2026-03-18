import { createClient } from "@lume/supabase/server";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, email, created_at")
    .eq("id", user!.id)
    .single();

  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("id, product_id, stripe_payment_intent_id, granted_at")
    .eq("user_id", user!.id)
    .order("granted_at", { ascending: false });

  return (
    <SettingsClient
      userId={user!.id}
      email={user!.email ?? ""}
      displayName={profile?.display_name ?? "Student"}
      avatarUrl={profile?.avatar_url ?? null}
      createdAt={profile?.created_at ?? user!.created_at}
      entitlements={entitlements ?? []}
    />
  );
}
