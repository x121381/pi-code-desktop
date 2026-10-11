"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";

/**
 * Embedded interactive terminal pane (xterm.js + server-side node-pty),
 * mirroring ZCode's TerminalSession. Output streams over SSE from
 * `/api/terminal/[id]`; input and resize are POSTed back. If the pty backend
 * is unavailable (native module failed to load on this platform), the pane
 * degrades to a notice instead of crashing.
 */

interface TerminalPaneProps {
  cwd?: string;
  /** Bump to spawn a fresh shell (e.g. after the project changes). */
  restartKey?: number;
}

interface XtermTheme {
  background: string;
  foreground: string;
  cursor: string;
  cursorAccent: string;
  selectionBackground: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

function readTerminalTheme(isDark: boolean): XtermTheme {
  if (typeof window === "undefined") throw new Error("no dom");
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string): string =>
    style.getPropertyValue(name).trim() || fallback;
  const fb = isDark
    ? { bg: "#161616", fg: "#d4d4d4" }
    : { bg: "#f8f8f8", fg: "#262626" };
  return {
    background: read("--color-terminal-bg", fb.bg),
    foreground: read("--color-terminal-fg", fb.fg),
    cursor: read("--color-terminal-cursor", isDark ? "#f8f8f8" : "#0d0d0d"),
    cursorAccent: read("--color-terminal-cursor-accent", fb.bg),
    selectionBackground: read("--color-terminal-selection", "rgba(64,153,255,0.28)"),
    black: read("--color-terminal-black", "#363636"),
    red: read("--color-terminal-red", "#ff5c5c"),
    green: read("--color-terminal-green", "#46bf72"),
    yellow: read("--color-terminal-yellow", "#ff8a30"),
    blue: read("--color-terminal-blue", "#4099ff"),
    magenta: read("--color-terminal-magenta", "#7b5ce5"),
    cyan: read("--color-terminal-cyan", "#42c8c8"),
    white: read("--color-terminal-white", "#adadad"),
    brightBlack: read("--color-terminal-bright-black", "#747474"),
    brightRed: read("--color-terminal-bright-red", "#ff9999"),
    brightGreen: read("--color-terminal-bright-green", "#87d9a4"),
    brightYellow: read("--color-terminal-bright-yellow", "#ffb26b"),
    brightBlue: read("--color-terminal-bright-blue", "#80beff"),
    brightMagenta: read("--color-terminal-bright-magenta", "#a888f2"),
    brightCyan: read("--color-terminal-bright-cyan", "#8ee5e5"),
    brightWhite: read("--color-terminal-bright-white", "#f8f8f8"),
  };
}

export function TerminalPane({ cwd, restartKey = 0 }: TerminalPaneProps) {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<{ term: import("@xterm/xterm").Terminal; fit: import("@xterm/addon-fit").FitAddon } | null>(null);
  const sessionRef = useRef<{ id: string; es: EventSource } | null>(null);
  const inputQueueRef = useRef<string[]>([]);
  const flushTimerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<"starting" | "ready" | "unavailable" | "exited">("starting");
  const [detail, setDetail] = useState<string | null>(null);

  const flushInput = useCallback((id: string) => {
    flushTimerRef.current = null;
    const chunks = inputQueueRef.current;
    inputQueueRef.current = [];
    if (!chunks.length) return;
    void fetch(`/api/terminal/${encodeURIComponent(id)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: chunks.join("") }),
    }).catch(() => { /* transient input loss is acceptable */ });
  }, []);

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    setStatus("starting");
    setDetail(null);

    void (async () => {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
      ]);
      if (disposed || !hostRef.current) return;

      const term = new Terminal({
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        cursorBlink: true,
        allowProposedApi: true,
        scrollback: 5000,
        theme: readTerminalTheme(isDark),
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(hostRef.current);
      termRef.current = { term, fit };

      const safeFit = () => {
        try {
          fit.fit();
        } catch {
          // container not measurable yet
        }
      };
      safeFit();

      resizeObserver = new ResizeObserver(() => {
        safeFit();
        const session = sessionRef.current;
        if (session) {
          void fetch(`/api/terminal/${encodeURIComponent(session.id)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resize: { cols: term.cols, rows: term.rows } }),
          }).catch(() => {});
        }
      });
      resizeObserver.observe(hostRef.current);

      term.onData((data) => {
        const session = sessionRef.current;
        if (!session) return;
        inputQueueRef.current.push(data);
        if (flushTimerRef.current == null) {
          flushTimerRef.current = window.setTimeout(() => flushInput(session.id), 8);
        }
      });

      try {
        const res = await fetch("/api/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cwd, cols: term.cols, rows: term.rows }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({})) as { error?: string; detail?: string };
          if (!disposed) {
            setStatus("unavailable");
            setDetail(data.error ?? `HTTP ${res.status}`);
          }
          return;
        }
        const created = await res.json() as { id: string };
        if (disposed) {
          void fetch(`/api/terminal?id=${encodeURIComponent(created.id)}`, { method: "DELETE" }).catch(() => {});
          return;
        }

        const es = new EventSource(`/api/terminal/${encodeURIComponent(created.id)}`);
        sessionRef.current = { id: created.id, es };
        es.onmessage = (e) => {
          try {
            const event = JSON.parse(e.data) as { type: string; data?: string; exitCode?: number };
            if (event.type === "data" && event.data) term.write(event.data);
            if (event.type === "exit") {
              setStatus("exited");
              term.write(`\r\n[${t("terminal.exited", { code: event.exitCode ?? 0 })}]\r\n`);
            }
          } catch { /* ignore malformed frames */ }
        };
        es.onerror = () => { /* EventSource auto-reconnects while the session lives */ };
        setStatus("ready");
      } catch (e) {
        if (!disposed) {
          setStatus("unavailable");
          setDetail(String(e));
        }
      }
    })();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      if (flushTimerRef.current != null) window.clearTimeout(flushTimerRef.current);
      const session = sessionRef.current;
      sessionRef.current = null;
      if (session) {
        session.es.close();
        void fetch(`/api/terminal?id=${encodeURIComponent(session.id)}`, { method: "DELETE" }).catch(() => {});
      }
      termRef.current?.term.dispose();
      termRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cwd, restartKey]);

  return (
    <div className="terminal-pane" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, background: "var(--color-terminal-bg)" }}>
      {status === "starting" && (
        <div style={{ padding: 14, fontSize: 12, color: "var(--text-muted)" }}>{t("terminal.starting")}</div>
      )}
      {status === "unavailable" && (
        <div style={{ padding: 14, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>{t("terminal.unavailable")}</strong>
          <div style={{ marginTop: 4, overflowWrap: "anywhere" }}>{detail}</div>
        </div>
      )}
      <div ref={hostRef} style={{ flex: 1, minHeight: 0, padding: "4px 8px" }} />
    </div>
  );
}
