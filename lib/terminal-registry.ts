import { spawn, type IPty } from "@lydell/node-pty";

/**
 * Server-side registry of interactive PTY sessions backing the embedded
 * terminal pane. Sessions live in the Next.js server process (same process
 * model as lib/rpc-manager.ts); the browser talks to them over
 * `/api/terminal/*` (SSE output + POST input). node-pty is a native module —
 * if its prebuilt binary cannot load on this platform, creation fails and the
 * API surfaces a 503 so the UI can degrade gracefully.
 */

export interface TerminalSession {
  id: string;
  cwd: string;
  pty: IPty;
  listeners: Set<(event: TerminalEvent) => void>;
  exited: boolean;
  exitCode: number | null;
}

export type TerminalEvent =
  | { type: "data"; data: string }
  | { type: "exit"; exitCode: number };

const sessions = new Map<string, TerminalSession>();
const MAX_SESSIONS = 8;
const MAX_BUFFERED_OUTPUT = 200_000;

function defaultShell(): string {
  if (process.platform === "win32") return process.env.COMSPEC || "powershell.exe";
  return process.env.SHELL || "/bin/bash";
}

function defaultArgs(shell: string): string[] {
  if (process.platform === "win32") return shell.toLowerCase().includes("powershell") ? ["-NoLogo"] : [];
  // Launch as a login shell so PATH/profile setup matches the user's terminal.
  return ["-l"];
}

export function getTerminalSession(id: string): TerminalSession | undefined {
  return sessions.get(id);
}

export function terminalSessionsForCwd(cwd: string): TerminalSession[] {
  return [...sessions.values()].filter((session) => session.cwd === cwd);
}

export function createTerminalSession(options: {
  cwd: string;
  cols?: number;
  rows?: number;
}): TerminalSession {
  // Lazy require: a missing/broken native binary should only fail terminal
  // creation, never the whole server module graph.
  let pty: IPty;
  try {
    const nodePty = require("@lydell/node-pty") as typeof import("@lydell/node-pty");
    const shell = defaultShell();
    pty = nodePty.spawn(shell, defaultArgs(shell), {
      cwd: options.cwd,
      cols: options.cols ?? 80,
      rows: options.rows ?? 24,
      env: process.env as Record<string, string>,
      ...(process.platform === "win32" ? {} : { name: "xterm-256color" }),
    });
  } catch (error) {
    throw new TerminalUnavailableError(String(error));
  }

  // Cap total sessions; the oldest is recycled so the pane keeps working.
  while (sessions.size >= MAX_SESSIONS) {
    const oldest = [...sessions.values()].sort(
      (a, b) => (a.pty.pid - b.pty.pid),
    )[0];
    if (!oldest) break;
    killTerminalSession(oldest.id);
  }

  const session: TerminalSession = {
    id: `term-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    cwd: options.cwd,
    pty,
    listeners: new Set(),
    exited: false,
    exitCode: null,
  };
  sessions.set(session.id, session);

  let buffered = 0;
  pty.onData((data) => {
    // Flood guard: a runaway command must not balloon server memory when no
    // SSE client is attached (or a slow one stalls). Tail of the output wins.
    buffered += data.length;
    if (buffered > MAX_BUFFERED_OUTPUT) return;
    for (const listener of session.listeners) {
      try {
        listener({ type: "data", data });
      } catch {
        // listener errors must not kill the pty pump
      }
    }
  });
  pty.onExit(({ exitCode }) => {
    session.exited = true;
    session.exitCode = exitCode;
    for (const listener of session.listeners) {
      try {
        listener({ type: "exit", exitCode });
      } catch {
        // ignore
      }
    }
    session.listeners.clear();
    setTimeout(() => sessions.delete(session.id), 60_000);
  });

  return session;
}

export function writeTerminalInput(id: string, input: string): boolean {
  const session = sessions.get(id);
  if (!session || session.exited) return false;
  session.pty.write(input);
  return true;
}

export function resizeTerminal(id: string, cols: number, rows: number): boolean {
  const session = sessions.get(id);
  if (!session || session.exited) return false;
  const safeCols = Math.max(2, Math.min(500, Math.floor(cols)));
  const safeRows = Math.max(2, Math.min(300, Math.floor(rows)));
  try {
    session.pty.resize(safeCols, safeRows);
    return true;
  } catch {
    return false;
  }
}

export function killTerminalSession(id: string): boolean {
  const session = sessions.get(id);
  if (!session) return false;
  sessions.delete(id);
  session.listeners.clear();
  try {
    session.pty.kill();
  } catch {
    // already dead
  }
  return true;
}

export class TerminalUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TerminalUnavailableError";
  }
}
