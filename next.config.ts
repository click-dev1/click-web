import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Every editor-uploaded image is served from Sanity's CDN. */
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      /* The pre-launch privacy stub lived at /privacy; the published
         documents use the same slugs as the sister site. */
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
    ];
  },
};

export default nextConfig;
