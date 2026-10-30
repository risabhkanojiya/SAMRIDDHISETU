import type { NextConfig } from "next";

// Generate a random ID every time the server starts
const bootId = Math.random().toString(36).substring(2, 15);

const nextConfig: NextConfig = {
  env: {
    BOOT_ID: bootId,
    NEXT_PUBLIC_BOOT_ID: bootId,
  }
};

export default nextConfig;
