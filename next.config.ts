import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Only serve/optimize Cloudinary images from this app's own account when the
// cloud name is known at build time (it is on Vercel whenever uploads work).
const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const cloudOk = !!cloudName && /^[A-Za-z0-9_-]+$/.test(cloudName);
const cloudinaryPath = cloudOk ? `/${cloudName}/**` : "/**";
const cloudinaryCsp = cloudOk ? `https://res.cloudinary.com/${cloudName}/` : "https://res.cloudinary.com";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-eval' is only needed by the development server, never in production.
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: https://images.unsplash.com ${cloudinaryCsp}`,
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Do not advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", port: "", pathname: cloudinaryPath, search: "" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
