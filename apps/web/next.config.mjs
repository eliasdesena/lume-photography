import createMDX from "@next/mdx";

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  transpilePackages: ["@lume/ui", "@lume/config", "@lume/types", "@lume/supabase"],
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "img-src 'self' data: https://*.stripe.com",
            "frame-src https://js.stripe.com https://hooks.stripe.com",
            "connect-src 'self' https://api.stripe.com https://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com",
          ].join("; "),
        },
      ],
    },
  ],
};

export default withMDX(nextConfig);
