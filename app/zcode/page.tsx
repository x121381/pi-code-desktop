"use client";

import { useMemo } from "react";
import { AppErrorBoundary, Root, ZCodeIntlProvider } from "@zcode/ui";
import { createPiPlatform, createPiServices } from "@/lib/zcode-bridge/pi-services";

/**
 * The real ZCode open-source interface (vendored @zcode/ui Root) mounted on
 * the Pi backend through lib/zcode-bridge. This is the new primary shell;
 * the legacy Pi Web UI remains available at /classic.
 */
export default function ZCodeRootPage() {
  const services = useMemo(() => createPiServices(), []);
  const platform = useMemo(() => createPiPlatform(), []);

  return (
    <AppErrorBoundary>
      <ZCodeIntlProvider
        settingService={services.settingService}
        broadcastService={services.broadcastService}
      >
        <Root
          services={services}
          platform={platform}
          supportsSettings
          supportsEmbeddedBrowser={false}
          allowRemoteWorkspace={false}
          preferDirectoryBrowser
        />
      </ZCodeIntlProvider>
    </AppErrorBoundary>
  );
}
