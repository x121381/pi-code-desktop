"use client";

import { Emitter, type Event, type IDisposable } from "@zcode/rpc";
import {
  createHomeOnlyWebRemoteControlServices,
  createWebPlatform,
} from "../../vendor/web-host/dist/host.js";
import type { IZCodeAgentService, ITerminalService } from "@zcode/services";
import { createPiAgentService } from "./pi-agent-service";

/**
 * Bridges ZCode's real UI (vendored @zcode/ui Root) to the Pi backend:
 * the official home-only degraded service set boots the full interface, and
 * the terminal channel is wired to our existing /api/terminal pty backend
 * (SSE output, POST input/resize).
 */

interface TerminalOutputEvent {
  type: string;
  data?: string;
  exitCode?: number;
}

interface PtySessionHandle {
  id: string;
  source: EventSource;
  data: Emitter<string>;
  exit: Emitter<number>;
}

function createPiTerminalService(): ITerminalService {
  const sessions = new Map<string, PtySessionHandle>();

  const connectEvents = (handle: PtySessionHandle) => {
    handle.source.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as TerminalOutputEvent;
        if (event.type === "data" && event.data) handle.data.fire(event.data);
        if (event.type === "exit") handle.exit.fire(event.exitCode ?? 0);
      } catch {
        // ignore malformed frames
      }
    };
  };

  return {
    async create(options: { cols: number; rows: number; cwd?: string }) {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cwd: options.cwd, cols: options.cols, rows: options.rows }),
      });
      if (!res.ok) throw new Error(`terminal create failed: HTTP ${res.status}`);
      const created = (await res.json()) as { id: string; cwd: string };
      const handle: PtySessionHandle = {
        id: created.id,
        source: new EventSource(`/api/terminal/${encodeURIComponent(created.id)}`),
        data: new Emitter<string>(),
        exit: new Emitter<number>(),
      };
      connectEvents(handle);
      sessions.set(created.id, handle);
      return {
        id: created.id,
        shell: process.platform === "win32" ? "PowerShell" : "bash",
        fontFamily: "var(--font-mono)",
        fontFamilySource: undefined,
      } as unknown as Awaited<ReturnType<ITerminalService["create"]>>;
    },
    async write(arg: { id: string; data: string }) {
      const handle = sessions.get(arg.id);
      if (!handle) return;
      await fetch(`/api/terminal/${encodeURIComponent(arg.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: arg.data }),
      }).catch(() => {});
    },
    async resize(arg: { id: string; cols: number; rows: number }) {
      const handle = sessions.get(arg.id);
      if (!handle) return;
      await fetch(`/api/terminal/${encodeURIComponent(arg.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resize: { cols: arg.cols, rows: arg.rows } }),
      }).catch(() => {});
    },
    async dispose(arg: { id: string }) {
      const handle = sessions.get(arg.id);
      if (!handle) return;
      sessions.delete(arg.id);
      handle.source.close();
      handle.data.dispose();
      handle.exit.dispose();
      await fetch(`/api/terminal?id=${encodeURIComponent(arg.id)}`, { method: "DELETE" }).catch(() => {});
    },
    onDynamicData(id: string): Event<string> {
      return (listener) => (sessions.get(id)?.data ?? new Emitter<string>()).event(listener);
    },
    onDynamicExit(id: string): Event<number> {
      return (listener) => (sessions.get(id)?.exit ?? new Emitter<number>()).event(listener);
    },
  } as ITerminalService;
}

export function createPiServices(cwd = "~") {
  const services = createHomeOnlyWebRemoteControlServices();
  // Real implementations over the Pi backend: terminal end-to-end today; the
  // V4 conversation adapter streams snapshots/deltas from Pi session APIs.
  (services as Record<string, unknown>).terminalService = createPiTerminalService();
  const agent = createPiAgentService({ cwd });
  (services as Record<string, unknown>).zcodeAgentService = agent as unknown as IZCodeAgentService;
  // Skip ZCode's first-run login screen: report a configured provider family so
  // the startup login-entry guard treats the workspace as ready. Pi's own model
  // configuration (already automatic) stands in for ZCode's account login.
  // Report a signed-in local user so Root's login-entry guard closes and the
  // workspace renders directly (Pi holds its own auth in ~/.pi/agent).
  const oauthService = services.oauthService as {
    restoreCachedSessionState: () => Promise<unknown>;
    restoreCachedSession: () => Promise<unknown>;
    [key: string]: unknown;
  };
  oauthService.restoreCachedSessionState = async () => ({
    status: 'authenticated',
    userInfo: { id: 'pi-local', username: 'pi', displayName: 'Pi Code' },
  });
  oauthService.restoreCachedSession = async () => null;
  const settingsService = services.settingService as {
    get: () => Promise<Record<string, unknown>>;
    update: (patch: Record<string, unknown>) => Promise<void>;
    [key: string]: unknown;
  };
  const originalSettingsGet = settingsService.get.bind(settingsService);
  settingsService.get = async () => ({
    ...(await originalSettingsGet()),
    providerFamilyDomain: "pi",
  });
  // Never re-show the occupation onboarding wizard: Pi hosts configure this
  // on first run already.
  (services as Record<string, unknown>).onboardingRecordService = {
    appendRecord: async () => {},
    shouldOnboard: async () => false,
    dismissOnboarding: async () => {},
    claimAnonymousRecord: async () => {},
    syncSettingsFromRecord: async () => null,
    getLatestEntry: async () => null,
    updateRecordPreferences: async () => {},
    getRecords: async () => null,
    clearRecords: async () => {},
  };
  (services as Record<string, unknown>).zcodeSessionService = {
    ...((services as Record<string, unknown>).zcodeSessionService as Record<string, unknown>),
    initializeWorkspace: async (params: { workspacePath: string; workspaceIdentity?: string }) => ({
      available: true as const,
      workspaceKey: params.workspaceIdentity?.trim() || params.workspacePath,
    }),
  };
  return services;
}

export function createPiPlatform() {
  return createWebPlatform();
}

export type { IDisposable };
