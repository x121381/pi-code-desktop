"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { openExternal } from "@/lib/desktop-native";
import { cloudChatErrorKey, safePublishedCloudUrl } from "@/lib/cloud-chat-ui";
import {
  CLOUD_ACCOUNT_PROVIDERS,
  NUTSTORE_DAV_URL,
  isUnavailableCloudProvider,
  type CloudAccountProvider,
} from "@/lib/cloud-drive-presets";
import type { CloudChatStatus, CloudDestination, FeishuMode } from "@/lib/cloud-chat-store";

export const emptyCloudStatus = (): CloudChatStatus => ({
  github: { configured: false, public: false, authMode: "token" },
  webdav: { configured: false },
  feishu: { configured: false, mode: "webhook" },
});

function destinationForProvider(provider: CloudAccountProvider): CloudDestination {
  if (provider === "github") return "github";
  if (provider === "feishu") return "feishu";
  return "webdav";
}

function BrandMark({ provider }: { provider: CloudAccountProvider }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true as const };
  if (provider === "github") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8a9.56 9.56 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }
  if (provider === "feishu") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="5" width="16" height="14" rx="3" />
        <path d="M8 10h8M8 14h5" />
      </svg>
    );
  }
  if (provider === "nutstore") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 17a5 5 0 1 1 1.2-9.8A6 6 0 0 1 20 11.5 4 4 0 0 1 18 19H8" />
      </svg>
    );
  }
  if (provider === "nextcloud") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="8" cy="12" r="3.2" />
        <circle cx="16" cy="12" r="3.2" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 16V8a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

export function CloudAccountPanel({
  destination,
  onDestinationChange,
  onStatusChange,
}: {
  destination: CloudDestination;
  onDestinationChange: (destination: CloudDestination) => void;
  onStatusChange?: (status: CloudChatStatus) => void;
}) {
  const { t } = useI18n();
  const [status, setStatus] = useState<CloudChatStatus>(emptyCloudStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<CloudAccountProvider>(
    destination === "feishu" ? "feishu" : destination === "webdav" ? "nutstore" : "github",
  );
  const [githubToken, setGithubToken] = useState("");
  const [githubPublic, setGithubPublic] = useState(false);
  const [githubAdvanced, setGithubAdvanced] = useState(false);
  const [webdavAdvanced, setWebdavAdvanced] = useState(false);
  const [githubDevice, setGithubDevice] = useState<{
    loginId: string;
    userCode: string;
    verificationUri: string;
    intervalSeconds: number;
  } | null>(null);
  const [webdavDevice, setWebdavDevice] = useState<{
    loginId: string;
    loginUrl: string;
    intervalSeconds: number;
  } | null>(null);
  const [webdavUrl, setWebdavUrl] = useState("");
  const [webdavUsername, setWebdavUsername] = useState("");
  const [webdavPassword, setWebdavPassword] = useState("");
  const [nextcloudInstance, setNextcloudInstance] = useState("");
  const [feishuMode, setFeishuMode] = useState<FeishuMode>("webhook");
  const [feishuWebhookUrl, setFeishuWebhookUrl] = useState("");
  const [feishuAppId, setFeishuAppId] = useState("");
  const [feishuAppSecret, setFeishuAppSecret] = useState("");
  const [feishuReceiveId, setFeishuReceiveId] = useState("");
  const [feishuReceiveIdType, setFeishuReceiveIdType] = useState("chat_id");

  const applyStatus = useCallback((next: CloudChatStatus) => {
    setStatus(next);
    setGithubPublic(next.github.public);
    setWebdavUrl(next.webdav.url ?? "");
    setWebdavUsername(next.webdav.username ?? "");
    setFeishuMode(next.feishu.mode);
    onStatusChange?.(next);
  }, [onStatusChange]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/cloud-chat", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("UNTRUSTED_REQUEST");
        return response.json() as Promise<CloudChatStatus>;
      })
      .then((data) => {
        applyStatus(data);
      })
      .catch((cause) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(t("cloud.error"));
      });
    return () => controller.abort();
  }, [applyStatus, t]);

  useEffect(() => {
    if (!githubDevice) return;
    let cancelled = false;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const response = await fetch("/api/cloud-chat/github", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ loginId: githubDevice.loginId }),
        });
        const data = await response.json().catch(() => ({})) as {
          pending?: boolean;
          intervalSeconds?: number;
          status?: CloudChatStatus;
          code?: string;
        };
        if (cancelled) return;
        if (!response.ok) throw new Error(data.code || `HTTP_${response.status}`);
        if (data.pending) {
          timer = window.setTimeout(() => { void poll(); }, Math.max(5, data.intervalSeconds ?? githubDevice.intervalSeconds) * 1000);
          return;
        }
        if (data.status) applyStatus(data.status);
        setGithubDevice(null);
        setGithubToken("");
      } catch (cause) {
        if (cancelled) return;
        const code = cause instanceof Error ? cause.message : String(cause);
        setError(t(cloudChatErrorKey(code)));
        setGithubDevice(null);
      }
    };
    timer = window.setTimeout(() => { void poll(); }, githubDevice.intervalSeconds * 1000);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [applyStatus, githubDevice, t]);

  useEffect(() => {
    if (!webdavDevice) return;
    let cancelled = false;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const response = await fetch("/api/cloud-chat/webdav", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ loginId: webdavDevice.loginId }),
        });
        const data = await response.json().catch(() => ({})) as {
          pending?: boolean;
          intervalSeconds?: number;
          status?: CloudChatStatus;
          code?: string;
        };
        if (cancelled) return;
        if (!response.ok) throw new Error(data.code || `HTTP_${response.status}`);
        if (data.pending) {
          timer = window.setTimeout(() => { void poll(); }, Math.max(5, data.intervalSeconds ?? webdavDevice.intervalSeconds) * 1000);
          return;
        }
        if (data.status) applyStatus(data.status);
        setWebdavDevice(null);
        setWebdavPassword("");
      } catch (cause) {
        if (cancelled) return;
        const code = cause instanceof Error ? cause.message : String(cause);
        setError(t(cloudChatErrorKey(code)));
        setWebdavDevice(null);
      }
    };
    timer = window.setTimeout(() => { void poll(); }, webdavDevice.intervalSeconds * 1000);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [applyStatus, webdavDevice, t]);

  const connectGitHub = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/cloud-chat/github", { method: "POST" });
      const data = await response.json().catch(() => ({})) as {
        code?: string;
        loginId?: string;
        userCode?: string;
        verificationUri?: string;
        intervalSeconds?: number;
      };
      if (!response.ok || !data.loginId || !data.userCode || !data.verificationUri) {
        throw new Error(data.code || `HTTP_${response.status}`);
      }
      const verificationUri = safePublishedCloudUrl(data.verificationUri);
      if (!verificationUri) throw new Error("UPSTREAM_ERROR");
      setGithubDevice({
        loginId: data.loginId,
        userCode: data.userCode,
        verificationUri,
        intervalSeconds: Math.max(5, data.intervalSeconds ?? 5),
      });
      await openExternal(verificationUri);
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : String(cause);
      setError(t(cloudChatErrorKey(code)));
    } finally {
      setBusy(false);
    }
  };

  const connectWebDav = async (folderUrl: string, passwordFallback = false) => {
    setBusy(true);
    setError(null);
    try {
      if (passwordFallback || (webdavUsername.trim() && webdavPassword.trim())) {
        const response = await fetch("/api/cloud-chat/webdav", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: folderUrl,
            username: webdavUsername,
            password: webdavPassword,
          }),
        });
        const data = await response.json().catch(() => ({})) as CloudChatStatus & { code?: string; status?: CloudChatStatus };
        if (!response.ok) throw new Error(data.code || `HTTP_${response.status}`);
        applyStatus(data.status ?? data);
        setWebdavPassword("");
        return;
      }
      const response = await fetch("/api/cloud-chat/webdav", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: folderUrl }),
      });
      const data = await response.json().catch(() => ({})) as {
        code?: string;
        loginId?: string;
        loginUrl?: string;
        intervalSeconds?: number;
      };
      if (!response.ok || !data.loginId || !data.loginUrl) {
        throw new Error(data.code || `HTTP_${response.status}`);
      }
      const loginUrl = safePublishedCloudUrl(data.loginUrl);
      if (!loginUrl) throw new Error("UPSTREAM_ERROR");
      setWebdavDevice({
        loginId: data.loginId,
        loginUrl,
        intervalSeconds: Math.max(5, data.intervalSeconds ?? 5),
      });
      await openExternal(loginUrl);
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : String(cause);
      if (code === "WEBDAV_LOGIN_UNSUPPORTED" && folderUrl === NUTSTORE_DAV_URL) {
        setError(t("cloud.errorWebdavLogin"));
        return;
      }
      setError(t(cloudChatErrorKey(code)));
    } finally {
      setBusy(false);
    }
  };

  const connectFeishu = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/cloud-chat/feishu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: feishuMode,
          webhookUrl: feishuWebhookUrl || undefined,
          appId: feishuAppId || undefined,
          appSecret: feishuAppSecret || undefined,
          receiveId: feishuReceiveId || undefined,
          receiveIdType: feishuReceiveIdType,
        }),
      });
      const data = await response.json().catch(() => ({})) as CloudChatStatus & { code?: string; status?: CloudChatStatus };
      if (!response.ok) throw new Error(data.code || `HTTP_${response.status}`);
      applyStatus(data.status ?? data);
      setFeishuWebhookUrl("");
      setFeishuAppSecret("");
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : String(cause);
      setError(t(cloudChatErrorKey(code)));
    } finally {
      setBusy(false);
    }
  };

  const saveGithubToken = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/cloud-chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github: { token: githubToken || undefined, public: githubPublic } }),
      });
      const data = await response.json().catch(() => ({})) as CloudChatStatus & { code?: string };
      if (!response.ok) throw new Error(data.code || `HTTP_${response.status}`);
      applyStatus(data);
      setGithubToken("");
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : String(cause);
      setError(t(cloudChatErrorKey(code)));
    } finally {
      setBusy(false);
    }
  };

  const clearCredentials = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/cloud-chat?destination=${encodeURIComponent(destination)}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({})) as CloudChatStatus & { code?: string };
      if (!response.ok) throw new Error(data.code || `HTTP_${response.status}`);
      applyStatus(data);
      if (destination === "github") {
        setGithubToken("");
        setGithubDevice(null);
      }
      if (destination === "webdav") {
        setWebdavUrl("");
        setWebdavUsername("");
        setWebdavPassword("");
        setWebdavDevice(null);
      }
      if (destination === "feishu") {
        setFeishuWebhookUrl("");
        setFeishuAppId("");
        setFeishuAppSecret("");
        setFeishuReceiveId("");
      }
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : String(cause);
      setError(t(cloudChatErrorKey(code)));
    } finally {
      setBusy(false);
    }
  };

  const selectProvider = (next: CloudAccountProvider) => {
    setProvider(next);
    setError(null);
    if (isUnavailableCloudProvider(next)) return;
    const nextDestination = destinationForProvider(next);
    onDestinationChange(nextDestination);
    if (next === "github") void connectGitHub();
    if (next === "nutstore") {
      setWebdavUrl(NUTSTORE_DAV_URL);
      void connectWebDav(NUTSTORE_DAV_URL);
    }
  };

  const configured =
    destination === "github" ? status.github.configured
      : destination === "webdav" ? status.webdav.configured
        : status.feishu.configured;
  const unavailable = isUnavailableCloudProvider(provider);

  return (
    <div className="cloud-account-panel">
      <div className="cloud-account-grid" role="group" aria-label={t("cloud.iconHint")}>
        {CLOUD_ACCOUNT_PROVIDERS.map((item) => {
          const blocked = isUnavailableCloudProvider(item);
          const active = provider === item;
          const linked = item === "github" ? status.github.configured
            : item === "feishu" ? status.feishu.configured
              : item === "nutstore" || item === "nextcloud" ? status.webdav.configured
                : false;
          return (
            <button
              key={item}
              type="button"
              className={`cloud-account-icon${active ? " is-active" : ""}${blocked ? " is-unavailable" : ""}${linked ? " is-linked" : ""}`}
              disabled={busy || blocked}
              title={blocked
                ? t(
                    item === "drive123" ? "cloud.drive123Unavailable"
                      : item === "baidu" ? "cloud.baiduUnavailable"
                        : item === "aliyun" ? "cloud.aliyunUnavailable"
                          : `cloud.${item}Unavailable`,
                  )
                : t(`cloud.${item}`)}
              aria-label={t(`cloud.${item}`)}
              aria-pressed={active}
              onClick={() => selectProvider(item)}
            >
              <BrandMark provider={item} />
              <span>{t(`cloud.${item}`)}</span>
            </button>
          );
        })}
      </div>

      <div style={{ color: "var(--text-dim)", fontSize: 11, margin: "10px 0 8px" }}>
        {unavailable
          ? t(
              provider === "drive123" ? "cloud.drive123Unavailable"
                : provider === "baidu" ? "cloud.baiduUnavailable"
                  : provider === "aliyun" ? "cloud.aliyunUnavailable"
                    : `cloud.${provider}Unavailable`,
            )
          : `${t("cloud.iconHint")} · ${configured ? t("cloud.configured") : t("cloud.notConfigured")}`}
      </div>

      {provider === "github" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {status.github.login && (
            <div style={{ fontSize: 12, color: "var(--text)" }}>
              {t("cloud.githubConnected", { login: status.github.login })}
            </div>
          )}
          {githubDevice ? (
            <div className="native-inline-alert" role="status">
              {t("cloud.githubDeviceHint", { code: githubDevice.userCode })}
              {" "}
              <button type="button" className="native-button" onClick={() => void openExternal(githubDevice.verificationUri)}>
                {t("cloud.githubOpen")}
              </button>
            </div>
          ) : (
            <button type="button" className="native-button native-button-primary" disabled={busy} onClick={() => void connectGitHub()}>
              {t("cloud.githubConnect")}
            </button>
          )}
          <button type="button" className="native-button" onClick={() => setGithubAdvanced((open) => !open)}>
            {t("cloud.githubAdvanced")}
          </button>
          {githubAdvanced && (
            <>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.githubToken")}</span>
                <input
                  className="native-input"
                  type="password"
                  autoComplete="off"
                  value={githubToken}
                  placeholder={status.github.configured ? t("cloud.secretPlaceholder") : t("cloud.githubTokenHint")}
                  onChange={(event) => setGithubToken(event.target.value)}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <input type="checkbox" checked={githubPublic} onChange={(event) => setGithubPublic(event.target.checked)} />
                {t("cloud.githubPublic")}
              </label>
              <button type="button" className="native-button" disabled={busy} onClick={() => void saveGithubToken()}>
                {t("cloud.save")}
              </button>
            </>
          )}
        </div>
      )}

      {provider === "nutstore" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {status.webdav.configured && status.webdav.username && (
            <div style={{ fontSize: 12, color: "var(--text)" }}>
              {t("cloud.webdavConnected", { login: status.webdav.username })}
            </div>
          )}
          {webdavDevice && (
            <div className="native-inline-alert" role="status">
              {t("cloud.webdavDeviceHint")}
              {" "}
              <button type="button" className="native-button" onClick={() => void openExternal(webdavDevice.loginUrl)}>
                {t("cloud.webdavOpen")}
              </button>
            </div>
          )}
          {error === t("cloud.errorWebdavLogin") && (
            <>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.webdavUsername")}</span>
                <input className="native-input" value={webdavUsername} onChange={(event) => setWebdavUsername(event.target.value)} autoComplete="off" />
              </label>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.webdavPassword")}</span>
                <input
                  className="native-input"
                  type="password"
                  value={webdavPassword}
                  placeholder={t("cloud.nutstorePasswordHint")}
                  onChange={(event) => setWebdavPassword(event.target.value)}
                  autoComplete="off"
                />
              </label>
              <button
                type="button"
                className="native-button native-button-primary"
                disabled={busy}
                onClick={() => void connectWebDav(NUTSTORE_DAV_URL, true)}
              >
                {t("cloud.webdavConnect")}
              </button>
            </>
          )}
        </div>
      )}

      {provider === "nextcloud" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {status.webdav.configured && status.webdav.username && (
            <div style={{ fontSize: 12, color: "var(--text)" }}>
              {t("cloud.webdavConnected", { login: status.webdav.username })}
            </div>
          )}
          <label className="native-field">
            <span className="native-field-label">{t("cloud.nextcloudInstance")}</span>
            <input
              className="native-input"
              value={nextcloudInstance}
              onChange={(event) => setNextcloudInstance(event.target.value)}
              placeholder={t("cloud.nextcloudInstanceHint")}
              spellCheck={false}
            />
          </label>
          <button
            type="button"
            className="native-button native-button-primary"
            disabled={busy || !nextcloudInstance.trim()}
            onClick={() => void connectWebDav(nextcloudInstance.trim())}
          >
            {webdavDevice ? t("cloud.webdavWaiting") : t("cloud.webdavConnect")}
          </button>
          {webdavDevice && (
            <div className="native-inline-alert" role="status">
              {t("cloud.webdavDeviceHint")}
              {" "}
              <button type="button" className="native-button" onClick={() => void openExternal(webdavDevice.loginUrl)}>
                {t("cloud.webdavOpen")}
              </button>
            </div>
          )}
        </div>
      )}

      {provider === "feishu" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {status.feishu.configured && (
            <div style={{ fontSize: 12, color: "var(--text)" }}>
              {t("cloud.feishuConnected")}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="native-button" aria-pressed={feishuMode === "webhook"} onClick={() => setFeishuMode("webhook")}>
              {t("cloud.feishuWebhook")}
            </button>
            <button type="button" className="native-button" aria-pressed={feishuMode === "bot"} onClick={() => setFeishuMode("bot")}>
              {t("cloud.feishuBot")}
            </button>
          </div>
          {feishuMode === "webhook" ? (
            <label className="native-field">
              <span className="native-field-label">{t("cloud.feishuWebhookUrl")}</span>
              <input
                className="native-input"
                type="password"
                value={feishuWebhookUrl}
                placeholder={status.feishu.configured ? t("cloud.secretPlaceholder") : ""}
                onChange={(event) => setFeishuWebhookUrl(event.target.value)}
                autoComplete="off"
              />
            </label>
          ) : (
            <>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.feishuAppId")}</span>
                <input className="native-input" value={feishuAppId} onChange={(event) => setFeishuAppId(event.target.value)} autoComplete="off" />
              </label>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.feishuAppSecret")}</span>
                <input
                  className="native-input"
                  type="password"
                  value={feishuAppSecret}
                  placeholder={status.feishu.configured ? t("cloud.secretPlaceholder") : ""}
                  onChange={(event) => setFeishuAppSecret(event.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.feishuReceiveId")}</span>
                <input className="native-input" value={feishuReceiveId} onChange={(event) => setFeishuReceiveId(event.target.value)} autoComplete="off" />
              </label>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.feishuReceiveIdType")}</span>
                <select className="native-input" value={feishuReceiveIdType} onChange={(event) => setFeishuReceiveIdType(event.target.value)}>
                  {["chat_id", "open_id", "user_id", "union_id", "email"].map((idType) => (
                    <option key={idType} value={idType}>{idType}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          <button type="button" className="native-button native-button-primary" disabled={busy} onClick={() => void connectFeishu()}>
            {t("cloud.feishuConnect")}
          </button>
        </div>
      )}

      {!unavailable && (
        <div style={{ marginTop: 10 }}>
          <button type="button" className="native-button" onClick={() => setWebdavAdvanced((open) => !open)}>
            {t("cloud.webdavAdvanced")}
          </button>
          {webdavAdvanced && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.webdavUrl")}</span>
                <input className="native-input" value={webdavUrl} onChange={(event) => setWebdavUrl(event.target.value)} spellCheck={false} />
              </label>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.webdavUsername")}</span>
                <input className="native-input" value={webdavUsername} onChange={(event) => setWebdavUsername(event.target.value)} autoComplete="off" />
              </label>
              <label className="native-field">
                <span className="native-field-label">{t("cloud.webdavPassword")}</span>
                <input
                  className="native-input"
                  type="password"
                  value={webdavPassword}
                  placeholder={status.webdav.configured ? t("cloud.secretPlaceholder") : t("cloud.webdavPasswordHint")}
                  onChange={(event) => setWebdavPassword(event.target.value)}
                  autoComplete="off"
                />
              </label>
              <button type="button" className="native-button" disabled={busy} onClick={() => void connectWebDav(webdavUrl, true)}>
                {t("cloud.webdavConnect")}
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="native-button" disabled={busy || !configured} onClick={() => void clearCredentials()}>
          {t("cloud.clear")}
        </button>
      </div>
      {error && error !== t("cloud.errorWebdavLogin") && (
        <div className="native-inline-alert is-error" role="alert" style={{ marginTop: 12 }}>{error}</div>
      )}
    </div>
  );
}
