"use client";

import { Emitter, type Event, type IDisposable } from "@zcode/rpc";
import {
  createHomeOnlyWebRemoteControlServices,
  createWebPlatform,
} from "@zcode/web-host";
import type { ITerminalService } from "@zcode/services";

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

export function createPiServices() {
  const services = createHomeOnlyWebRemoteControlServices();
  // Real implementations over the Pi backend. The conversation/session agent
  // service lands in the next increment; terminal works end-to-end today.
  (services as Record<string, unknown>).terminalService = createPiTerminalService();
  return services;
}

export function createPiPlatform() {
  return createWebPlatform();
}

export type { IDisposable };
