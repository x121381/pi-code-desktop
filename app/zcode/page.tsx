"use client";

import dynamic from "next/dynamic";

// Browser-only: the vendored ZCode UI touches window/self at module scope.
const ZCodeApp = dynamic(() => import("./ZCodeApp").then((m) => m.ZCodeRootPage), { ssr: false });

export default function Page() {
  return (
    <>
      {/* The vendored web-host calls createRoot(document.getElementById("root"))
          at module scope for its own boot helpers; give it a hidden container. */}
      <div id="root" style={{ display: "none" }} />
      <ZCodeApp />
    </>
  );
}
