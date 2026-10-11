"use client";

import { useEffect, useMemo, useState } from "react";
import { AppErrorBoundary, Root, ZCodeIntlProvider } from "@zcode/ui";
import { createPiPlatform, createPiServices } from "@/lib/zcode-bridge/pi-services";

/**
 * The real ZCode open-source interface (vendored @zcode/ui Root) mounted on
 * the Pi backend through lib/zcode-bridge. This is the new primary shell;
 * the legacy Pi Web UI remains available at /classic.
 */
export function ZCodeRootPage() {
  const services = useMemo(() => createPiServices(), []);
  const platform = useMemo(() => createPiPlatform(), []);
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/no-project-cwd")
      .then((res) => res.json() as Promise<{ cwd?: string }>)
      .then((data) => {
        if (!cancelled && data.cwd) setWorkspacePath(data.cwd);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!workspacePath) {
    return null;
  }

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
          initialWorkspaceAbsPath={workspacePath}
        />
      </ZCodeIntlProvider>
    </AppErrorBoundary>
  );
}
