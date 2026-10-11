"use client";

import { useCallback, useSyncExternalStore } from "react";
import { APP_PREF_KEYS, getPref, setPref } from "@/lib/app-prefs";
import { isTauriDesktop } from "@/lib/desktop-updater";

/** "system" follows the OS appearance; light/dark pin an explicit choice. */
export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function storedMode(): ThemeMode | null {
  const t = getPref(APP_PREF_KEYS.theme);
  return t === "dark" || t === "light" || t === "system" ? t : null;
}

function resolveMode(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? systemTheme() : mode;
}

function getSnapshot(): ResolvedTheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): ResolvedTheme {
  return "light";
}

function paintThemeClass(next: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", next === "dark");
  document.documentElement.style.colorScheme = next;
}

async function persistNativeTheme(theme: ResolvedTheme): Promise<void> {
  if (!isTauriDesktop()) return;
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    await invoke("set_ui_theme", { theme });
  } catch {
    // Tauri IPC may not be ready on the very first tick; next toggle retries.
  }
}

function notify() {
  listeners.forEach((cb) => cb());
}

function applyResolved(resolved: ResolvedTheme, animate: boolean, then?: () => void) {
  const apply = () => {
    paintThemeClass(resolved);
    void persistNativeTheme(resolved);
    notify();
    then?.();
  };

  if (!animate) {
    apply();
    return;
  }

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  // WebKitGTK crashes its UI process when startViewTransition is called, so the
  // desktop shell keeps the existing instant-switch fallback.
  const supportsVT =
    !isTauriDesktop() && typeof document.startViewTransition === "function";

  if (!supportsVT || reduceMotion) {
    apply();
    return;
  }

  try {
    const transition = document.startViewTransition(apply);
    // A navigation or rapid second toggle can legitimately abort a transition.
    // Consume those promise rejections so they do not surface as app errors.
    void transition.ready.catch(() => {});
    void transition.updateCallbackDone.catch(() => {});
    void transition.finished.catch(() => {});
  } catch {
    apply();
  }
}

// Apply the resolved theme synchronously on first client import so React
// hydration never briefly inherits the OS appearance after the blocking
// layout script. Also mirror an explicit choice into the desktop store.
if (typeof window !== "undefined") {
  const stored = storedMode();
  const initial = resolveMode(stored ?? "system");
  paintThemeClass(initial);
  if (stored && stored !== "system") {
    // Defer IPC until after the current turn so __TAURI_INTERNALS__ is ready.
    queueMicrotask(() => {
      void persistNativeTheme(initial);
    });
  }

  // "system" (and no stored choice) follows the OS appearance live; an explicit
  // light/dark pin stops the auto-follow.
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  media?.addEventListener?.("change", (event) => {
    if (storedMode() === "light" || storedMode() === "dark") return;
    paintThemeClass(event.matches ? "dark" : "light");
    notify();
  });
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    applyResolved(getSnapshot() === "dark" ? "light" : "dark", true, () => {
      setPref(APP_PREF_KEYS.theme, getSnapshot());
    });
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setPref(APP_PREF_KEYS.theme, next);
    applyResolved(resolveMode(next), true);
  }, []);

  return { theme, themeMode: storedMode() ?? "system", toggleTheme, setTheme, isDark: theme === "dark" };
}
