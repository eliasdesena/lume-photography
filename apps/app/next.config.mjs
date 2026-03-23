import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  // Allow Serwist's webpack config alongside Turbopack
  turbopack: {},
  transpilePackages: ["@lume/ui", "@lume/config", "@lume/types", "@lume/supabase"],
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
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.mux.com",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self' data:",
            "img-src 'self' data: https://image.mux.com https://*.mux.com",
            "media-src 'self' https://stream.mux.com https://*.mux.com blob:",
            "frame-src 'self'",
            "worker-src 'self' blob:",
            "connect-src 'self' https://*.supabase.co https://*.mux.com https://*.push.services.mozilla.com https://fcm.googleapis.com https://*.notify.windows.com",
          ].join("; "),
        },
      ],
    },
  ],
};

export default withSerwist(nextConfig);
