import { updateSession } from "@lume/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const publicPaths = ["/login", "/auth/callback", "/auth/setup", "/no-access"];

export async function middleware(request: NextRequest) {
  // Always refresh the session first
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Allow public paths through
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return response;
  }

  // Check auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check entitlement for dashboard routes
  if (pathname === "/" || pathname.startsWith("/lessons") || pathname.startsWith("/downloads")) {
    const { data: entitlement } = await supabase
      .from("entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", "prod_U9zCzd0tuKoOuU")
      .single();

    if (!entitlement) {
      return NextResponse.redirect(new URL("/no-access", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)",
  ],
};
