import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh", // For UploadThing's older domain
      },
      {
        protocol: "https",
        hostname: "utfs.io", // Add this for UploadThing's primary domain
      },
      // For more flexibility, you can also add:
      {
        protocol: "https",
        hostname: "**.utfs.io", // Allows all subdomains of utfs.io
      },
    ],
  },
};

export default nextConfig;