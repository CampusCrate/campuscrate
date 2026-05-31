import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is required for the Docker runner stage
  output: "standalone",

  // Allow images from S3 to render in <Image> components
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
