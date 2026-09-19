import type { NextConfig } from "next";

const isDesktopBuild = process.env.PI_WEB_DESKTOP_BUILD === "1";

const nextConfig: NextConfig = {
  // Pin file tracing to this package for every build. Otherwise a parent
  // lockfile can make Next scan protected Windows profile directories.
  outputFileTracingRoot: __dirname,
  // Desktop packaging gets an isolated standalone build. Keeping it outside
  // `.next` prevents a Tauri release build from disrupting `npm run dev`.
  ...(isDesktopBuild
    ? { output: "standalone" as const, distDir: ".next-desktop" }
    : {}),
  serverExternalPackages: [
    "undici",
    "@earendil-works/pi-coding-agent",
    "@earendil-works/pi-agent-core",
    "@earendil-works/pi-ai",
    "@earendil-works/pi-tui",
  ],
  experimental: {
    optimizePackageImports: ["@lobehub/icons", "react-syntax-highlighter"],
  },
  allowedDevOrigins: ['192.168.*.*'],
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
