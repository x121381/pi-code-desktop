import type { NextConfig } from "next";


  // ZCode bridge: '#src/*' package-imports emitted by the vendored web-host
  // resolve to the compiled @zcode/services dist tree.
  const zcodeBridgeAlias = {
    '#src': './vendor/services/dist',
    '#src/': './vendor/services/dist/',
  };

const isDesktopBuild = process.env.PI_WEB_DESKTOP_BUILD === "1";

const nextConfig: NextConfig = {
  turbopack: { resolveAlias: zcodeBridgeAlias },
  webpack: (config) => { config.resolve.alias = { ...config.resolve.alias, ...zcodeBridgeAlias }; return config; },
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
    "@lydell/node-pty",
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
