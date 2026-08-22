/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/sdk"],
  allowedDevOrigins: ["192.168.100.9"],

  // The provider pages moved from /doctors to /providers, which is also the more
  // accurate word for a nurse-practitioner-led practice. Permanent redirects keep
  // any existing inbound links and shared URLs working.
  async redirects() {
    return [
      { source: "/doctors", destination: "/providers", permanent: true },
      {
        source: "/doctors/:slug",
        destination: "/providers/:slug",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
