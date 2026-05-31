import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "better-auth",
    "better-sqlite3",
    "@better-auth/kysely-adapter",
    "kysely",
  ],
};

export default nextConfig;
