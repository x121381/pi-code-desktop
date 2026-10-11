"use client";

import dynamic from "next/dynamic";

// Browser-only: the vendored ZCode UI touches window/self at module scope.
const ZCodeApp = dynamic(() => import("./ZCodeApp").then((m) => m.ZCodeRootPage), { ssr: false });

export default function Page() {
  return <ZCodeApp />;
}
