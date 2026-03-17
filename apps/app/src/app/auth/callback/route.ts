import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignored in Server Component context
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user needs to set a password (first login via magic link)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If the user has no password set yet, redirect to setup
      const hasPassword = user?.app_metadata?.providers?.includes("email");
      if (!hasPassword) {
        return NextResponse.redirect(new URL("/auth/setup", origin));
      }

      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // Auth code error — redirect to login
  return NextResponse.redirect(new URL("/login?error=auth", origin));
}
