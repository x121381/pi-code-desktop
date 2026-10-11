"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useModalDismiss } from "@/hooks/useModalDismiss";
import { openExternal } from "@/lib/desktop-native";

/**
 * First-run "sign in and get models automatically" panel. Lists OAuth
 * providers from /api/auth/providers; signing in through the SSE login flow
 * makes Pi's built-in provider models appear in /api/models with zero manual
 * entry. Auto-opens when no provider is configured and none is logged in;
 * manual configuration stays available through the advanced Models editor.
 */

type OAuthLoginState =
  | { phase: "idle" }
  | { phase: "connecting" }
  | { phase: "auth"; url: string; instructions: string | null; token: string }
  | { phase: "device_code"; userCode: string; verificationUri: string }
  | { phase: "prompt"; message: string; placeholder: string | null; token: string }
  | { phase: "select"; message: string; options: { id: string; label: string }[]; token: string }
  | { phase: "progress"; message: string }
  | { phase: "success" }
  | { phase: "error"; message: string };

interface OAuthProvider {
  id: string;
  name: string;
  loggedIn: boolean;
  supportsApiKey: boolean;
}

interface Props {
  /** Whether the panel may auto-open on mount (checked against server state). */
  defaultOpen: boolean;
  onClose: () => void;
  onOpenAdvanced: () => void;
  /** Bump when credentials changed so parents refresh their model lists. */
  onModelsChanged: () => void;
}

const DISMISS_KEY = "pi-autosetup-dismissed";

export function AutoSetupPanel({ defaultOpen, onClose, onOpenAdvanced, onModelsChanged }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState<OAuthProvider[] | null>(null);
  const [loginProvider, setLoginProvider] = useState<string | null>(null);
  const [loginState, setLoginState] = useState<OAuthLoginState>({ phase: "idle" });
  const [inputValue, setInputValue] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refreshProviders = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/providers");
      const data = await res.json() as { providers?: OAuthProvider[] };
      setProviders(data.providers ?? []);
      return data.providers ?? [];
    } catch {
      setProviders([]);
      return [];
    }
  }, []);

  // Auto-open once when nothing is configured and nothing is logged in.
  useEffect(() => {
    if (!defaultOpen) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    void (async () => {
      const [listing, configRes] = await Promise.all([
        refreshProviders(),
        fetch("/api/models-config").then((r) => r.json()).catch(() => ({ providers: {} })),
      ]);
      const configured = Object.values((configRes as { providers?: Record<string, { models?: unknown[] }> }).providers ?? {})
        .some((provider) => Array.isArray(provider?.models) && provider.models.length > 0);
      const loggedIn = listing.some((provider) => provider.loggedIn);
      if (!configured && !loggedIn) setOpen(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOpen]);

  const stopLogin = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }, []);

  const handleClose = useCallback(() => {
    stopLogin();
    setLoginProvider(null);
    setLoginState({ phase: "idle" });
    setOpen(false);
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    onClose();
  }, [onClose, stopLogin]);

  useModalDismiss(handleClose, open);

  useEffect(() => () => stopLogin(), [stopLogin]);

  useEffect(() => {
    if (loginState.phase === "auth" || loginState.phase === "prompt" || loginState.phase === "select") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loginState.phase]);

  const startLogin = useCallback((providerId: string) => {
    stopLogin();
    setLoginProvider(providerId);
    setLoginState({ phase: "connecting" });
    setInputValue("");

    const es = new EventSource(`/api/auth/login/${encodeURIComponent(providerId)}`);
    eventSourceRef.current = es;
    es.onmessage = (e) => {
      const data = JSON.parse(e.data) as {
        type: string; url?: string; instructions?: string | null;
        message?: string; placeholder?: string | null;
        userCode?: string; verificationUri?: string;
        options?: { id: string; label: string }[];
      };
      if (data.type === "auth") {
        setLoginState({ phase: "auth", url: data.url!, instructions: data.instructions ?? null, token: "" });
        void openExternal(data.url!);
      } else if (data.type === "device_code") {
        setLoginState({ phase: "device_code", userCode: data.userCode!, verificationUri: data.verificationUri! });
        void openExternal(data.verificationUri!);
      } else if (data.type === "prompt_request") {
        setLoginState({ phase: "prompt", message: data.message!, placeholder: data.placeholder ?? null, token: "" });
      } else if (data.type === "select_request") {
        setLoginState({ phase: "select", message: data.message!, options: data.options ?? [], token: "" });
      } else if (data.type === "progress") {
        setLoginState({ phase: "progress", message: data.message! });
      } else if (data.type === "success") {
        es.close();
        setLoginState({ phase: "success" });
        // New credentials → built-in provider models appear automatically.
        void refreshProviders();
        onModelsChanged();
      } else if (data.type === "error") {
        es.close();
        setLoginState({ phase: "error", message: data.message! });
      } else if (data.type === "cancelled") {
        es.close();
        setLoginState({ phase: "idle" });
      }
    };
    es.onerror = () => {
      es.close();
      setLoginState((prev) => prev.phase === "success" ? prev : { phase: "error", message: t("modelsSetup.connectionLost") });
    };
  }, [onModelsChanged, refreshProviders, stopLogin, t]);

  const submitCode = useCallback(async (code: string) => {
    if (!code.trim() || !loginProvider) return;
    setLoginState({ phase: "progress", message: t("modelsSetup.verifying") });
    try {
      const res = await fetch(`/api/auth/login/${encodeURIComponent(loginProvider)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string };
        setLoginState({ phase: "error", message: d.error ?? `HTTP ${res.status}` });
        return;
      }
      setInputValue("");
    } catch (e) {
      setLoginState({ phase: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }, [loginProvider, t]);

  const submitSelection = useCallback(async (value: string) => {
    if (!loginProvider) return;
    setLoginState({ phase: "progress", message: t("modelsSetup.continuing") });
    try {
      await fetch(`/api/auth/login/${encodeURIComponent(loginProvider)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
    } catch (e) {
      setLoginState({ phase: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }, [loginProvider, t]);

  const logout = useCallback(async (providerId: string) => {
    await fetch(`/api/auth/logout/${encodeURIComponent(providerId)}`, { method: "POST" });
    await refreshProviders();
    onModelsChanged();
  }, [onModelsChanged, refreshProviders]);

  if (!open) return null;

  const busy = loginState.phase === "connecting" || loginState.phase === "progress";
  const activeLogin = loginState.phase !== "idle" && loginState.phase !== "success";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 900,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("modelsSetup.title")}
        style={{
          width: "min(560px, 100%)", maxHeight: "min(80vh, 640px)", overflowY: "auto",
          background: "var(--color-popover)", border: "1px solid var(--color-popover-border)",
          borderRadius: 14, boxShadow: "0 18px 60px rgba(0,0,0,0.28)", padding: 22,
          color: "var(--color-popover-foreground)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>{t("modelsSetup.title")}</div>
            <div style={{ fontSize: 12.5, color: "var(--color-foreground-subtle)", marginTop: 5, lineHeight: 1.55 }}>
              {t("modelsSetup.subtitle")}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("i18n.close")}
            style={{ background: "none", border: "none", color: "var(--color-foreground-subtle)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {providers === null && (
            <div style={{ fontSize: 12.5, color: "var(--color-foreground-subtle)" }}>{t("i18n.loading")}</div>
          )}
          {providers?.length === 0 && (
            <div style={{ fontSize: 12.5, color: "var(--color-foreground-subtle)" }}>{t("modelsSetup.noProviders")}</div>
          )}
          {providers?.map((provider) => (
            <div
              key={provider.id}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                border: "1px solid var(--color-card-border)", borderRadius: 10,
                padding: "10px 12px", background: "var(--color-card)",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{provider.name}</div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-foreground-subtlest)" }}>{provider.id}</div>
              </div>
              {provider.loggedIn ? (
                <>
                  <span style={{ fontSize: 12, color: "var(--color-success)", fontWeight: 600 }}>✓ {t("modelsSetup.loggedIn")}</span>
                  <button
                    type="button"
                    onClick={() => void logout(provider.id)}
                    style={{ background: "none", border: "1px solid var(--color-border)", borderRadius: 7, padding: "4px 10px", fontSize: 12, color: "var(--color-foreground-subtle)", cursor: "pointer" }}
                  >
                    {t("modelsSetup.logout")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => startLogin(provider.id)}
                  style={{
                    background: "var(--color-primary)", color: "var(--color-primary-foreground)",
                    border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 12.5, fontWeight: 600,
                    cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1,
                  }}
                >
                  {t("modelsSetup.login")}
                </button>
              )}
            </div>
          ))}
        </div>

        {loginProvider && activeLogin && (
          <div style={{ marginTop: 14, border: "1px solid var(--color-border)", borderRadius: 10, padding: 12, background: "var(--color-surface)" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>
              {t("modelsSetup.signingIn", { provider: providers?.find((p) => p.id === loginProvider)?.name ?? loginProvider })}
            </div>
            {loginState.phase === "connecting" && (
              <div style={{ fontSize: 12, color: "var(--color-foreground-subtle)", marginTop: 6 }}>{t("modelsSetup.connecting")}</div>
            )}
            {loginState.phase === "auth" && (
              <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.55 }}>
                {loginState.instructions && <div style={{ color: "var(--color-foreground-subtle)" }}>{loginState.instructions}</div>}
                <a
                  href={loginState.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => { e.preventDefault(); void openExternal(loginState.url); }}
                  style={{ color: "var(--color-file-node-foreground)", textDecoration: "none", overflowWrap: "anywhere" }}
                >
                  {loginState.url}
                </a>
              </div>
            )}
            {loginState.phase === "device_code" && (
              <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                <div style={{ color: "var(--color-foreground-subtle)" }}>{t("modelsSetup.deviceCodeHint")}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, margin: "6px 0" }}>{loginState.userCode}</div>
                <a
                  href={loginState.verificationUri}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => { e.preventDefault(); void openExternal(loginState.verificationUri); }}
                  style={{ color: "var(--color-file-node-foreground)", textDecoration: "none" }}
                >
                  {loginState.verificationUri}
                </a>
              </div>
            )}
            {(loginState.phase === "prompt" || loginState.phase === "select") && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "var(--color-foreground-subtle)", marginBottom: 6 }}>{loginState.message}</div>
                {loginState.phase === "select" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {loginState.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => void submitSelection(option.id)}
                        style={{ textAlign: "left", padding: "7px 10px", border: "1px solid var(--color-border)", borderRadius: 8, background: "var(--color-input)", color: "var(--color-foreground)", fontSize: 12.5, cursor: "pointer" }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") void submitCode(inputValue); }}
                    placeholder={loginState.placeholder ?? ""}
                    style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid var(--color-input-border)", borderRadius: 8, background: "var(--color-input)", color: "var(--color-foreground)", fontSize: 12.5, outline: "none" }}
                  />
                )}
              </div>
            )}
            {loginState.phase === "progress" && (
              <div style={{ fontSize: 12, color: "var(--color-foreground-subtle)", marginTop: 6 }}>{loginState.message}</div>
            )}
            {loginState.phase === "error" && (
              <div style={{ fontSize: 12, color: "var(--color-destructive)", marginTop: 6, overflowWrap: "anywhere" }}>{loginState.message}</div>
            )}
          </div>
        )}

        {loginState.phase === "success" && (
          <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--color-success)", fontWeight: 600 }}>
            ✓ {t("modelsSetup.successHint")}
          </div>
        )}

        <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={onOpenAdvanced}
            style={{ background: "none", border: "none", color: "var(--color-foreground-subtle)", fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 0 }}
          >
            {t("modelsSetup.advanced")}
          </button>
          <button
            type="button"
            onClick={handleClose}
            style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)", border: "none", borderRadius: 8, padding: "7px 18px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
          >
            {t("modelsSetup.done")}
          </button>
        </div>
      </div>
    </div>
  );
}
