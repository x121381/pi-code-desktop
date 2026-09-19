"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { AppComponentReleaseInfo, AppUpdatesResponse } from "@/lib/app-update-types";
import {
  APP_DISTRIBUTION_NAME,
  APP_RELEASES_URL,
  APP_REPOSITORY,
  APP_REPOSITORY_URL,
  APP_VERSION,
  APP_VERSION_DISPLAY,
  PRODUCT_NAME,
} from "@/lib/branding";
import { compareAppVersions } from "@/lib/app-updates";
import { APP_PREF_KEYS, getPrefBool, setPrefBool } from "@/lib/app-prefs";
import {
  installLatestDesktopRelease,
  isTauriDesktop,
  type DesktopUpgradeProgress,
} from "@/lib/desktop-updater";
import {
  handleExternalLinkClick,
  openPathNative,
  quitAppNative,
  selectDirectoryNative,
  setCloseQuitsNative,
} from "@/lib/desktop-native";
import { useI18n } from "@/hooks/useI18n";
import { SYSTEM_LOCALE, type LocalePreference } from "@/lib/i18n/types";
import { useTheme } from "@/hooks/useTheme";
import { useDiffViewMode } from "@/hooks/useDiffViewMode";
import { CloudAccountPanel } from "./CloudAccountPanel";
import type { CloudDestination } from "@/lib/cloud-chat-store";

const sectionCardStyle: CSSProperties = {
  padding: "13px 14px",
  border: "1px solid var(--border)",
  borderRadius: 8,
  background: "var(--bg)",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
};

const sectionHintStyle: CSSProperties = {
  marginTop: 3,
  color: "var(--text-muted)",
  fontSize: 11,
  lineHeight: 1.5,
};

type SessionStorageState = {
  version: 1;
  activeRoot: string;
  defaultRoot: string;
  source: "environment" | "config" | "default";
  readOnly: boolean;
  environmentVariable?: "PI_CODING_AGENT_SESSION_DIR";
  roots: Array<{
    path: string;
    kind: "active" | "historical" | "backup";
    writable: boolean;
  }>;
};

type SessionStorageMigration = {
  sourceRoot: string;
  targetRoot: string;
  backupRoot: string;
  copiedSessions: number;
  reusedSessions: number;
};

function LanguageSelect({
  preference,
  supportedLocales,
  t,
  setLocale,
  onOpenChange,
}: {
  preference: LocalePreference;
  supportedLocales: Array<{ id: string; label: string }>;
  t: (key: string) => string;
  setLocale: (locale: LocalePreference) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const setMenuOpen = useCallback((next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  }, [onOpenChange]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const options = [
    { id: SYSTEM_LOCALE, label: t("appSettings.languageSystem") },
    ...supportedLocales.map((plugin) => ({ id: plugin.id, label: plugin.label })),
  ];
  const selected = options.find((option) => option.id === preference) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setMenuOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", handleKey, true);
    };
  }, [open, setMenuOpen]);

  return (
    <div className="native-field" style={{ marginTop: 10, maxWidth: 280, position: "relative" }}>
      <span className="native-field-label">{t("appSettings.languageSection")}</span>
      <button
        ref={triggerRef}
        type="button"
        className="native-input"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("appSettings.languageSection")}
        onClick={() => {
          const rect = triggerRef.current?.getBoundingClientRect();
          if (rect) setMenuRect({ top: rect.bottom + 6, left: rect.left, width: Math.max(rect.width, 220) });
          setMenuOpen(!open);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.label}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <polyline points="2 3.5 5 6.5 8 3.5" />
        </svg>
      </button>
      {open && menuRect && createPortal(
        <div
          ref={menuRef}
          className="native-popover"
          role="listbox"
          aria-label={t("appSettings.languageSection")}
          style={{
            position: "fixed",
            top: menuRect.top,
            left: menuRect.left,
            width: menuRect.width,
            zIndex: 1400,
            maxHeight: 280,
            overflowY: "auto",
            padding: 5,
          }}
        >
          {options.map((option) => {
            const active = option.id === preference;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLocale(option.id as LocalePreference);
                  setMenuOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "7px 9px",
                  border: 0,
                  borderRadius: 6,
                  background: active ? "var(--bg-selected)" : "transparent",
                  color: active ? "var(--text)" : "var(--text-muted)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                <span style={{ flex: 1 }}>{option.label}</span>
                {active && <span style={{ color: "var(--accent)" }}>✓</span>}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="native-button"
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        minWidth: 88,
        borderColor: active ? "var(--accent)" : "var(--border)",
        color: active ? "var(--accent)" : "var(--text-muted)",
        fontWeight: active ? 700 : 500,
      }}
    >
      {children}
    </button>
  );
}

const metaChipStyle = (emphasized: boolean): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  maxWidth: "100%",
  padding: "6px 9px",
  border: `1px solid ${emphasized ? "var(--accent)" : "var(--border)"}`,
  borderRadius: 7,
  background: emphasized
    ? "color-mix(in srgb, var(--accent) 10%, transparent)"
    : "var(--bg)",
  color: emphasized ? "var(--accent)" : "var(--text-muted)",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: emphasized ? 700 : 500,
  lineHeight: 1.35,
  textDecoration: "none",
});

function MetaChip({
  label,
  value,
  emphasized = false,
  href,
  title,
  ariaLabel,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
  href?: string;
  title?: string;
  ariaLabel?: string;
}) {
  const content = (
    <>
      <span style={{ opacity: 0.72, fontWeight: 500 }}>{label}</span>
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value}
      </span>
      {href ? <span aria-hidden="true">↗</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={title}
        aria-label={ariaLabel ?? title}
        style={metaChipStyle(emphasized)}
        onClick={(event) => handleExternalLinkClick(event, href)}
      >
        {content}
      </a>
    );
  }

  return (
    <span title={title} aria-label={ariaLabel ?? title} style={metaChipStyle(emphasized)}>
      {content}
    </span>
  );
}

function VersionChip({
  currentValue,
  latestValue,
  versionsMatch,
  updateAvailable,
  href,
  title,
  ariaLabel,
  versionLabel,
  currentLabel,
  latestLabel,
  upgradeAvailableLabel,
}: {
  currentValue: string;
  latestValue: string;
  versionsMatch: boolean;
  updateAvailable: boolean;
  href: string;
  title: string;
  ariaLabel: string;
  versionLabel: string;
  currentLabel: string;
  latestLabel: string;
  upgradeAvailableLabel: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      aria-label={ariaLabel}
      style={metaChipStyle(updateAvailable)}
      onClick={(event) => handleExternalLinkClick(event, href)}
    >
      {versionsMatch ? (
        <>
          <span style={{ opacity: 0.72, fontWeight: 500 }}>{versionLabel}</span>
          <span>{currentValue}</span>
        </>
      ) : (
        <>
          <span style={{ opacity: 0.72, fontWeight: 500 }}>{currentLabel}</span>
          <span>{currentValue}</span>
          <span aria-hidden="true" style={{ width: 1, height: 13, background: "currentColor", opacity: 0.2 }} />
          <span style={{ opacity: updateAvailable ? 0.9 : 0.72, fontWeight: 500 }}>{latestLabel}</span>
          <span style={{ color: updateAvailable ? "var(--accent)" : undefined, fontWeight: updateAvailable ? 800 : undefined }}>
            {latestValue}
          </span>
          {updateAvailable ? (
            <span
              style={{
                padding: "1px 5px",
                borderRadius: 999,
                background: "var(--accent)",
                color: "var(--bg-panel)",
                fontSize: 9,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {upgradeAvailableLabel}
            </span>
          ) : null}
        </>
      )}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function AppSettings({ onClose }: { onClose: () => void }) {
  const { t, preference, setLocale, supportedLocales } = useI18n();
  const { theme, setTheme } = useTheme();
  const { mode: diffViewMode, setMode: setDiffViewMode } = useDiffViewMode();
  const desktop = isTauriDesktop();
  const [components, setComponents] = useState<AppComponentReleaseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [upgradeProgress, setUpgradeProgress] = useState<DesktopUpgradeProgress | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [closeQuits, setCloseQuits] = useState(() => getPrefBool(APP_PREF_KEYS.closeQuits, false));
  const [notifyOnComplete, setNotifyOnComplete] = useState(() => getPrefBool(APP_PREF_KEYS.notifyOnComplete, true));
  const [customCssBusy, setCustomCssBusy] = useState(false);
  const [customCssError, setCustomCssError] = useState<string | null>(null);
  const [sessionStorage, setSessionStorage] = useState<SessionStorageState | null>(null);
  const [sessionStorageLoading, setSessionStorageLoading] = useState(true);
  const [sessionStorageTarget, setSessionStorageTarget] = useState<string | null>(null);
  const [sessionStorageBusy, setSessionStorageBusy] = useState(false);
  const [sessionStorageError, setSessionStorageError] = useState<string | null>(null);
  const [sessionStorageMigration, setSessionStorageMigration] = useState<SessionStorageMigration | null>(null);
  const [cloudDestination, setCloudDestination] = useState<CloudDestination>("github");
  const [settingsSection, setSettingsSection] = useState<"language" | "storage" | "cloud" | "appearance" | "desktop">("language");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openCustomCss = async () => {
    setCustomCssBusy(true);
    setCustomCssError(null);
    try {
      const response = await fetch("/api/custom-css", { method: "POST" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as { path?: string };
      if (!data.path) throw new Error("Missing path in response");
      await openPathNative(data.path);
    } catch (error) {
      console.error("Failed to open custom.css:", error);
      setCustomCssError(t("appSettings.customCssOpenError"));
    } finally {
      setCustomCssBusy(false);
    }
  };

  const migrateSessionStorage = async () => {
    const targetRoot = sessionStorageTarget?.trim();
    if (!targetRoot || sessionStorageBusy) return;

    setSessionStorageBusy(true);
    setSessionStorageError(null);
    setSessionStorageMigration(null);
    try {
      const response = await fetch("/api/session-storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRoot }),
      });
      const data = await response.json().catch(() => ({})) as {
        error?: string;
        code?: string;
        storage?: SessionStorageState;
        migration?: SessionStorageMigration;
      };
      if (!response.ok || !data.storage || !data.migration) {
        throw new Error(data.code || `HTTP_${response.status}`);
      }
      setSessionStorage(data.storage);
      setSessionStorageMigration(data.migration);
      setSessionStorageTarget(null);
    } catch (error) {
      const code = error instanceof Error ? error.message : String(error);
      setSessionStorageError(`${t("appSettings.sessionStorageError")} (${code})`);
    } finally {
      setSessionStorageBusy(false);
    }
  };

  const chooseSessionStorage = async () => {
    if (!sessionStorage || sessionStorage.readOnly || sessionStorageBusy) return;
    setSessionStorageError(null);
    try {
      const path = await selectDirectoryNative({
        defaultPath: sessionStorage.activeRoot,
        title: t("appSettings.sessionStorageSelectTitle"),
      });
      if (path && path !== sessionStorage.activeRoot) setSessionStorageTarget(path);
    } catch (error) {
      console.error("Failed to select session storage directory:", error);
      setSessionStorageError(t("appSettings.sessionStorageError"));
    }
  };

  const openSessionStorage = async () => {
    if (!sessionStorage || sessionStorageBusy) return;
    setSessionStorageError(null);
    try {
      await openPathNative(sessionStorage.activeRoot);
    } catch (error) {
      console.error("Failed to open session storage directory:", error);
      setSessionStorageError(t("appSettings.sessionStorageError"));
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/session-storage", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<SessionStorageState>;
      })
      .then((data) => {
        setSessionStorage(data);
        setSessionStorageError(null);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSessionStorageError(t("appSettings.sessionStorageError"));
      })
      .finally(() => {
        if (!controller.signal.aborted) setSessionStorageLoading(false);
      });
    return () => controller.abort();
  }, [t]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/updates?refresh=1", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<AppUpdatesResponse>;
      })
      .then((data) => {
        const list = Array.isArray(data.components) ? data.components : [];
        setComponents(list);
        setLoadError(null);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError("checkFailed");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const frame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(
        "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex='-1'])",
      )?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !upgradeProgress && !sessionStorageBusy && !languageMenuOpen) {
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
  }, [languageMenuOpen, onClose, sessionStorageBusy, upgradeProgress]);

  const appRelease = useMemo(
    () => components.find((component) => component.project === "pi-code-desktop"),
    [components],
  );
  const pendingUpdates = useMemo(
    () => components.filter((component) => component.updateAvailable),
    [components],
  );
  const updateAvailable = pendingUpdates.length > 0;
  const canUpgrade = !loading && updateAvailable && !upgradeProgress;
  const downloadPercent = upgradeProgress?.phase === "downloading"
    && upgradeProgress.totalBytes
    ? Math.min(100, Math.round((upgradeProgress.downloadedBytes ?? 0) / upgradeProgress.totalBytes * 100))
    : null;
  const upgradeLabel = upgradeProgress?.phase === "checking"
    ? t("appSettings.preparing")
    : upgradeProgress?.phase === "downloading"
      ? (downloadPercent === null
        ? t("appSettings.downloading")
        : t("appSettings.downloadingPercent", { percent: downloadPercent }))
      : upgradeProgress?.phase === "installing"
        ? t("appSettings.installing")
        : t("appSettings.update");

  const latestReleaseText = loading
    ? "…"
    : loadError
      ? t("appSettings.checkFailed")
      : !appRelease || appRelease.releaseStatus === "unknown"
        ? t("appSettings.releaseUnavailable")
        : appRelease.releaseStatus === "unpublished" || !appRelease.latestVersion
          ? t("appSettings.noReleases")
          : `v${appRelease.latestVersion}`;

  const statusText = loading
    ? t("appSettings.checkingReleases")
    : loadError
      ? t("appSettings.checkFailed")
      : updateAvailable
        ? t("appSettings.updateAvailable")
        : t("appSettings.upToDate");

  const currentVersion = appRelease?.currentVersion ?? APP_VERSION;
  const currentVersionText = `v${currentVersion === APP_VERSION ? APP_VERSION_DISPLAY : currentVersion}`;
  const versionsMatch = Boolean(
    appRelease?.latestVersion
      && compareAppVersions(currentVersion, appRelease.latestVersion) === 0,
  );
  const versionAriaLabel = versionsMatch
    ? `${t("appSettings.version")}: ${currentVersionText}. ${statusText}`
    : `${t("appSettings.currentVersion")}: ${currentVersionText}. ${t("appSettings.latestRelease")}: ${latestReleaseText}. ${statusText}`;

  const handleUpgrade = async () => {
    if (!canUpgrade) return;
    setUpgradeError(null);
    try {
      const result = await installLatestDesktopRelease(setUpgradeProgress);
      if (!result.installed) {
        setUpgradeProgress(null);
        setUpgradeError(t("appSettings.noSignedBundle", { name: APP_DISTRIBUTION_NAME }));
      }
    } catch (error) {
      setUpgradeProgress(null);
      setUpgradeError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div
      className="native-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !upgradeProgress && !sessionStorageBusy) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
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
        aria-labelledby="app-settings-title"
        tabIndex={-1}
        style={{
          width: "min(820px, 100%)",
          maxHeight: "min(720px, calc(100vh - 36px))",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid var(--border)",
          borderRadius: 12,
          background: "var(--bg-panel)",
          color: "var(--text)",
          boxShadow: "0 22px 70px rgba(0,0,0,0.32)",
        }}
      >
        <header className="native-modal-header" style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "20px 22px 17px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 className="native-modal-title" id="app-settings-title" style={{ margin: 0, fontSize: 18, lineHeight: 1.25 }}>
              {PRODUCT_NAME}
            </h2>
            <div style={{ marginTop: 5, color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 }}>
              {t("appSettings.tagline", { product: PRODUCT_NAME })}
              <br />
              {t("appSettings.taglineDetails")}
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
              <MetaChip
                label={t("appSettings.repository")}
                value={APP_REPOSITORY}
                href={APP_REPOSITORY_URL}
                title={t("appSettings.openRepository")}
                ariaLabel={`${t("appSettings.repository")}: ${APP_REPOSITORY}`}
              />
              <VersionChip
                currentValue={currentVersionText}
                latestValue={latestReleaseText}
                versionsMatch={versionsMatch}
                updateAvailable={updateAvailable}
                href={appRelease?.releaseUrl ?? APP_RELEASES_URL}
                title={statusText}
                ariaLabel={versionAriaLabel}
                versionLabel={t("appSettings.version")}
                currentLabel={t("appSettings.currentVersion")}
                latestLabel={t("appSettings.latestRelease")}
                upgradeAvailableLabel={t("appSettings.upgradeAvailable")}
              />
              {(updateAvailable || upgradeProgress) && (
                <button
                  className="native-button native-button-primary"
                  type="button"
                  disabled={!canUpgrade}
                  onClick={() => void handleUpgrade()}
                  style={{ minWidth: 112 }}
                >
                  {upgradeLabel}
                </button>
              )}
            </div>
            {upgradeError && (
              <div className="native-inline-alert is-error" role="alert" style={{ marginTop: 9 }}>
                {upgradeError}
              </div>
            )}
          </div>
          <button
            className="native-modal-close"
            type="button"
            onClick={onClose}
            disabled={Boolean(upgradeProgress) || sessionStorageBusy}
            aria-label={t("appSettings.close")}
            title={t("appSettings.close")}
            style={{
              padding: "1px 5px",
              border: 0,
              background: "transparent",
              color: "var(--text-muted)",
              cursor: upgradeProgress || sessionStorageBusy ? "default" : "pointer",
              fontSize: 21,
              lineHeight: 1,
              opacity: upgradeProgress || sessionStorageBusy ? 0.35 : 1,
            }}
          >
            ×
          </button>
        </header>

        <div className="settings-layout">
          <nav className="settings-nav" aria-label={t("appSettings.navLabel")}>
            {([
              ["language", "appSettings.languageSection"],
              ["storage", "appSettings.sessionStorageSection"],
              ["cloud", "appSettings.cloudSection"],
              ["appearance", "appSettings.appearanceSection"],
              ...(desktop ? [["desktop", "appSettings.desktopSection"] as const] : []),
            ] as const).map(([id, key]) => (
              <button
                key={id}
                type="button"
                className={`settings-nav-item${settingsSection === id ? " is-active" : ""}`}
                aria-current={settingsSection === id ? "page" : undefined}
                onClick={() => setSettingsSection(id)}
              >
                {t(key)}
              </button>
            ))}
          </nav>
          <div style={{ overflowY: "auto", padding: "18px 22px 20px", display: "flex", flexDirection: "column", gap: 12, minWidth: 0, flex: 1 }}>
          {settingsSection === "language" && (
          <div className="native-settings-card" style={sectionCardStyle}>
            <div style={sectionTitleStyle}>{t("appSettings.languageSection")}</div>
            <div style={sectionHintStyle}>{t("appSettings.languageHint")}</div>
            <LanguageSelect
              preference={preference}
              supportedLocales={supportedLocales}
              t={t}
              setLocale={setLocale}
              onOpenChange={setLanguageMenuOpen}
            />
          </div>
          )}

          {settingsSection === "storage" && (
          <div className="native-settings-card" style={sectionCardStyle}>
            <div style={sectionTitleStyle}>{t("appSettings.sessionStorageSection")}</div>
            <div style={sectionHintStyle}>{t("appSettings.sessionStorageHint")}</div>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 9 }}>
              <label className="native-field">
                <span className="native-field-label">{t("appSettings.sessionStorageCurrent")}</span>
                <input
                  className="native-input"
                  type="text"
                  value={sessionStorageTarget ?? sessionStorage?.activeRoot ?? ""}
                  readOnly
                  disabled={sessionStorageLoading || sessionStorageBusy}
                  spellCheck={false}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                />
              </label>
              {sessionStorage && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ color: "var(--text-dim)", fontSize: 11 }}>
                    {sessionStorage.source === "environment"
                      ? t("appSettings.sessionStorageManaged")
                      : sessionStorage.source === "default"
                        ? t("appSettings.sessionStorageDefault")
                        : t("appSettings.sessionStorageCustom")}
                  </span>
                  <button
                    type="button"
                    className="native-button"
                    disabled={sessionStorage.readOnly || sessionStorageBusy}
                    onClick={() => void chooseSessionStorage()}
                  >
                    {t("appSettings.sessionStorageChoose")}
                  </button>
                  {desktop && (
                    <button
                      type="button"
                      className="native-button"
                      disabled={sessionStorageBusy}
                      onClick={() => void openSessionStorage()}
                    >
                      {t("appSettings.sessionStorageOpen")}
                    </button>
                  )}
                  <button
                    type="button"
                    className="native-button"
                    disabled={
                      sessionStorage.readOnly
                      || sessionStorageBusy
                      || sessionStorage.activeRoot === sessionStorage.defaultRoot
                    }
                    onClick={() => {
                      setSessionStorageTarget(sessionStorage.defaultRoot);
                      setSessionStorageError(null);
                      setSessionStorageMigration(null);
                    }}
                  >
                    {t("appSettings.sessionStorageRestoreDefault")}
                  </button>
                </div>
              )}
              {sessionStorageTarget?.trim()
                && sessionStorage
                && sessionStorageTarget.trim() !== sessionStorage.activeRoot && (
                  <div
                    className="native-inline-alert"
                    role="region"
                    aria-labelledby="session-storage-confirm-title"
                    aria-live="polite"
                  >
                    <strong id="session-storage-confirm-title" style={{ display: "block", marginBottom: 4 }}>
                      {t("appSettings.sessionStorageConfirmTitle")}
                    </strong>
                    <div>{t("appSettings.sessionStorageConfirmBody", { path: sessionStorageTarget.trim() })}</div>
                    <div style={{ marginTop: 9, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="native-button native-button-primary"
                        disabled={sessionStorageBusy}
                        onClick={() => void migrateSessionStorage()}
                      >
                        {sessionStorageBusy
                          ? t("appSettings.sessionStorageMigrating")
                          : t("appSettings.sessionStorageConfirm")}
                      </button>
                      <button
                        type="button"
                        className="native-button"
                        disabled={sessionStorageBusy}
                        onClick={() => setSessionStorageTarget(null)}
                      >
                        {t("appSettings.sessionStorageCancel")}
                      </button>
                    </div>
                  </div>
                )}
              {sessionStorageMigration && (
                <div className="native-inline-alert is-success" role="status">
                  {t("appSettings.sessionStorageSuccess")}
                </div>
              )}
              {sessionStorageError && (
                <div className="native-inline-alert is-error" role="alert">
                  {sessionStorageError}
                </div>
              )}
            </div>
          </div>
          )}

          {settingsSection === "cloud" && (
          <div className="native-settings-card" style={sectionCardStyle}>
            <div style={sectionTitleStyle}>{t("appSettings.cloudSection")}</div>
            <div style={sectionHintStyle}>{t("appSettings.cloudHint")}</div>
            <div style={{ marginTop: 10 }}>
              <CloudAccountPanel
                destination={cloudDestination}
                onDestinationChange={setCloudDestination}
              />
            </div>
          </div>
          )}

          {settingsSection === "appearance" && (
          <div className="native-settings-card" style={sectionCardStyle}>
            <div style={sectionTitleStyle}>{t("appSettings.appearanceSection")}</div>
            <div style={sectionHintStyle}>{t("appSettings.appearanceHint")}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <ChoiceButton active={theme === "light"} onClick={() => setTheme("light")}>
                {t("appSettings.themeLight")}
              </ChoiceButton>
              <ChoiceButton active={theme === "dark"} onClick={() => setTheme("dark")}>
                {t("appSettings.themeDark")}
              </ChoiceButton>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{t("appSettings.diffViewMode")}</div>
              <div style={{ color: "var(--text-dim)", fontSize: 11, lineHeight: 1.45 }}>
                {t("appSettings.diffViewModeHint")}
              </div>
              <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
                <ChoiceButton active={diffViewMode === "split"} onClick={() => setDiffViewMode("split")}>
                  {t("appSettings.diffViewModeSplit")}
                </ChoiceButton>
                <ChoiceButton active={diffViewMode === "unified"} onClick={() => setDiffViewMode("unified")}>
                  {t("appSettings.diffViewModeUnified")}
                </ChoiceButton>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{t("appSettings.customCss")}</div>
              <div style={{ color: "var(--text-dim)", fontSize: 11, lineHeight: 1.45 }}>
                {t("appSettings.customCssHint")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {desktop ? (
                  <button
                    type="button"
                    className="native-button"
                    disabled={customCssBusy}
                    onClick={() => void openCustomCss()}
                    style={{ alignSelf: "flex-start", marginTop: 2 }}
                  >
                    {customCssBusy ? t("appSettings.customCssOpening") : t("appSettings.customCssOpen")}
                  </button>
                ) : null}
                {customCssError ? (
                  <span style={{ color: "var(--danger)", fontSize: 11 }}>{customCssError}</span>
                ) : null}
              </div>
            </div>
          </div>
          )}

          {desktop && settingsSection === "desktop" && (
            <div className="native-settings-card" style={sectionCardStyle}>
              <div style={sectionTitleStyle}>{t("appSettings.desktopSection")}</div>
              <div style={sectionHintStyle}>{t("appSettings.desktopHint")}</div>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={closeQuits}
                    onChange={(event) => {
                      const next = event.target.checked;
                      setCloseQuits(next);
                      setPrefBool(APP_PREF_KEYS.closeQuits, next);
                      void setCloseQuitsNative(next);
                    }}
                    style={{ marginTop: 2 }}
                  />
                  <span>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{t("appSettings.closeQuits")}</div>
                    <div style={{ marginTop: 2, color: "var(--text-dim)", fontSize: 11, lineHeight: 1.45 }}>
                      {t("appSettings.closeQuitsHint")}
                    </div>
                  </span>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={notifyOnComplete}
                    onChange={(event) => {
                      const next = event.target.checked;
                      setNotifyOnComplete(next);
                      setPrefBool(APP_PREF_KEYS.notifyOnComplete, next);
                    }}
                    style={{ marginTop: 2 }}
                  />
                  <span>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{t("appSettings.notifyOnComplete")}</div>
                    <div style={{ marginTop: 2, color: "var(--text-dim)", fontSize: 11, lineHeight: 1.45 }}>
                      {t("appSettings.notifyOnCompleteHint")}
                    </div>
                  </span>
                </label>
                <button
                  type="button"
                  className="native-button"
                  onClick={() => void quitAppNative()}
                  style={{ alignSelf: "flex-start", marginTop: 2 }}
                >
                  {t("appSettings.quitApp")}
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </section>
    </div>
  );
}
