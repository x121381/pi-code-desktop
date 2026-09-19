"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/hooks/useI18n";
import { cloudChatErrorKey, safePublishedCloudUrl } from "@/lib/cloud-chat-ui";
import type { CloudChatStatus, CloudDestination } from "@/lib/cloud-chat-store";
import { CloudAccountPanel, emptyCloudStatus } from "./CloudAccountPanel";

interface Props {
  sessionId: string | null;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export function CloudChatDialog({ sessionId, onClose, onOpenSettings }: Props) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState<CloudChatStatus>(emptyCloudStatus);
  const [destination, setDestination] = useState<CloudDestination>("github");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const frame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(
        "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)",
      )?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex='-1'])",
      ) ?? []);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [busy, onClose]);

  const configured =
    destination === "github" ? status.github.configured
      : destination === "webdav" ? status.webdav.configured
        : status.feishu.configured;

  const publish = async () => {
    if (!sessionId) return;
    setBusy(true);
    setError(null);
    setResultUrl(null);
    setPublished(false);
    try {
      const response = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/cloud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination }),
      });
      const data = await response.json().catch(() => ({})) as { code?: string; url?: string };
      if (!response.ok) throw new Error(data.code || `HTTP_${response.status}`);
      setResultUrl(safePublishedCloudUrl(data.url));
      setPublished(true);
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : String(cause);
      setError(t(cloudChatErrorKey(code)));
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div
      className="native-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        background: "rgba(0,0,0,0.4)",
      }}
    >
      <section
        ref={dialogRef}
        className="native-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cloud-chat-title"
        tabIndex={-1}
        style={{
          width: "min(560px, 100%)",
          maxHeight: "min(720px, calc(100dvh - 36px))",
          overflow: "auto",
          padding: 18,
          background: "var(--bg-panel)",
          border: "1px solid var(--border)",
          borderRadius: 12,
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 id="cloud-chat-title" style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{t("cloud.shareTitle")}</h2>
          <button type="button" className="native-button" onClick={onClose} disabled={busy} aria-label={t("i18n.close")}>×</button>
        </div>
        <p style={{ margin: "8px 0 14px", color: "var(--text-muted)", fontSize: 12, lineHeight: 1.5 }}>{t("cloud.shareBody")}</p>

        <CloudAccountPanel
          destination={destination}
          onDestinationChange={(next) => {
            setDestination(next);
            setError(null);
            setResultUrl(null);
            setPublished(false);
          }}
          onStatusChange={setStatus}
        />

        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="native-button native-button-primary"
            disabled={busy || !sessionId || !configured}
            onClick={() => void publish()}
          >
            {busy ? t("cloud.publishing") : t("cloud.publish")}
          </button>
          {onOpenSettings && (
            <button
              type="button"
              className="native-button"
              disabled={busy}
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
            >
              {t("common.settings")}
            </button>
          )}
          {!sessionId && <span style={{ color: "var(--text-dim)", fontSize: 11 }}>{t("cloud.unsaved")}</span>}
        </div>

        {published && (
          <div className="native-inline-alert is-success" role="status" style={{ marginTop: 12 }}>
            {t("cloud.success")}
            {resultUrl && (
              <>
                {" "}
                <a href={resultUrl} target="_blank" rel="noreferrer">{t("cloud.openLink")}</a>
              </>
            )}
          </div>
        )}
        {error && (
          <div className="native-inline-alert is-error" role="alert" style={{ marginTop: 12 }}>{error}</div>
        )}
      </section>
    </div>,
    document.body,
  );
}
