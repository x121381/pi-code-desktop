"use client";

import { useEffect, useRef, useState } from "react";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useI18n } from "@/hooks/useI18n";
import {
  createTerminal,
  killTerminal,
  resizeTerminal,
  writeTerminal,
} from "@/lib/desktop-native";

type TerminalPanelProps = {
  cwd: string | null;
  onClose: () => void;
};

type TerminalOutputEvent = { id: string; data: string };
type TerminalExitEvent = { id: string };
type TauriEventApi = typeof import("@tauri-apps/api/event");

const MAX_PENDING_OUTPUT_CHARS = 64 * 1024;

export function TerminalPanel({ cwd, onClose }: TerminalPanelProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const [restartKey, setRestartKey] = useState(0);
  const [status, setStatus] = useState<"starting" | "ready" | "exited" | "error">("starting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cwd || !containerRef.current) {
      setStatus("error");
      setError(t("terminal.selectWorkspace"));
      return;
    }

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let unlistenOutput: (() => void) | null = null;
    let unlistenExit: (() => void) | null = null;
    let dataDisposable: { dispose(): void } | null = null;
    let terminal: Terminal | null = null;
    const pendingOutput = new Map<string, string>();
    const pendingExit = new Set<string>();

    setStatus("starting");
    setError(null);

    const start = async () => {
      try {
        const { listen } = await import("@tauri-apps/api/event") as TauriEventApi;
        if (disposed || !containerRef.current) return;

        terminal = new Terminal({
          cursorBlink: true,
          fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, Consolas, monospace",
          fontSize: 13,
          scrollback: 5000,
          theme: {
            background: "#171719",
            foreground: "#f5f5f7",
            cursor: "#f5f5f7",
            selectionBackground: "rgba(245, 245, 247, 0.24)",
          },
        });
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(containerRef.current);
        fitAddon.fit();
        terminalRef.current = terminal;

        unlistenOutput = await listen<TerminalOutputEvent>("terminal-output", (event) => {
          const activeId = sessionIdRef.current;
          if (event.payload.id === activeId) {
            terminal?.write(event.payload.data);
            return;
          }
          if (!activeId) {
            const buffered = `${pendingOutput.get(event.payload.id) ?? ""}${event.payload.data}`;
            pendingOutput.set(event.payload.id, buffered.slice(-MAX_PENDING_OUTPUT_CHARS));
          }
        });
        unlistenExit = await listen<TerminalExitEvent>("terminal-exit", (event) => {
          if (event.payload.id === sessionIdRef.current) {
            setStatus("exited");
          } else if (!sessionIdRef.current) {
            pendingExit.add(event.payload.id);
          }
        });

        const id = await createTerminal(cwd, { rows: terminal.rows, cols: terminal.cols });
        if (disposed) {
          await killTerminal(id).catch(() => {});
          return;
        }
        sessionIdRef.current = id;
        const initialOutput = pendingOutput.get(id);
        if (initialOutput) terminal.write(initialOutput);
        pendingOutput.clear();
        if (pendingExit.has(id)) {
          setStatus("exited");
          return;
        }

        setStatus("ready");
        dataDisposable = terminal.onData((data) => {
          void writeTerminal(id, data).catch((cause: unknown) => {
            if (!disposed) {
              setStatus("error");
              setError(cause instanceof Error ? cause.message : String(cause));
            }
          });
        });

        const resize = () => {
          if (!terminal || !sessionIdRef.current) return;
          fitAddon.fit();
          void resizeTerminal(sessionIdRef.current, {
            rows: terminal.rows,
            cols: terminal.cols,
          }).catch(() => {});
        };
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(containerRef.current);
        resize();
        terminal.focus();
      } catch (cause: unknown) {
        if (!disposed) {
          setStatus("error");
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      }
    };

    void start();
    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      unlistenOutput?.();
      unlistenExit?.();
      dataDisposable?.dispose();
      terminal?.dispose();
      terminalRef.current = null;
      const id = sessionIdRef.current;
      sessionIdRef.current = null;
      if (id) void killTerminal(id).catch(() => {});
    };
  }, [cwd, restartKey, t]);

  const title = cwd ? `${t("terminal.title")} - ${cwd}` : t("terminal.title");
  const canRestart = status === "exited" || status === "error";

  return (
    <section className="terminal-panel" aria-label={t("terminal.panelLabel")}>
      <header className="terminal-panel-toolbar">
        <div className="terminal-panel-heading">
          <strong>{t("terminal.title")}</strong>
          <span title={title}>{cwd ?? t("terminal.noWorkspace")}</span>
        </div>
        <div className="terminal-panel-actions">
          <span className={`terminal-panel-status${status === "error" ? " terminal-panel-status-error" : ""}`}>
            {t(`terminal.status.${status}`)}
          </span>
          {canRestart && (
            <button
              type="button"
              className="file-workbench-icon-button"
              onClick={() => setRestartKey((key) => key + 1)}
              title={t("terminal.restart")}
              aria-label={t("terminal.restart")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 11a8.1 8.1 0 1 0 1.2 5" />
                <path d="M20 4v7h-7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            className="file-workbench-icon-button"
            onClick={onClose}
            title={t("terminal.close")}
            aria-label={t("terminal.close")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </header>
      <div ref={containerRef} className="terminal-panel-screen" />
      {error && <div className="terminal-panel-error" role="alert">{error}</div>}
    </section>
  );
}
