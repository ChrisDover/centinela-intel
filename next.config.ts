import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/centinela-weekly-brief-001",
        destination: "/briefs/2026-02-10",
        permanent: true,
      },
      {
        source: "/briefs/001",
        destination: "/briefs/2026-02-10",
        permanent: true,
      },
      {
        source: "/centinela-landing",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
