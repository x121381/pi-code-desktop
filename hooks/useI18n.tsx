"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { APP_PREF_KEYS, getPref, setPref } from "@/lib/app-prefs";
import { getLocaleDirection, getLocalePlugin, getSupportedLocales, resolveLocalePreference } from "@/lib/i18n/registry";
import { translateMessage } from "@/lib/i18n/format";
import { SYSTEM_LOCALE, type Locale, type LocalePlugin, type LocalePreference, type TranslationParams } from "@/lib/i18n/types";

const defaultLocale: Locale = "en";

interface I18nContextValue {
  locale: Locale;
  preference: LocalePreference;
  setLocale: (locale: LocalePreference) => void;
  t: (key: string, params?: TranslationParams) => string;
  supportedLocales: LocalePlugin[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getMessages(): Record<string, Record<string, string>> {
  return Object.fromEntries(getSupportedLocales().flatMap((id) => {
    const plugin = getLocalePlugin(id);
    return plugin ? [[id, plugin.messages]] : [];
  }));
}

function readInitialLocale(): Locale {
  const languages = typeof navigator === "undefined"
    ? []
    : navigator.languages?.length ? navigator.languages : [navigator.language];
  return resolveLocalePreference(getPref(APP_PREF_KEYS.locale), languages);
}

function readInitialPreference(): LocalePreference {
  const stored = getPref(APP_PREF_KEYS.locale);
  return stored && (stored === SYSTEM_LOCALE || getLocalePlugin(stored)) ? stored : SYSTEM_LOCALE;
}

function applyDocumentLocale(locale: Locale): void {
  document.documentElement.lang = locale;
  document.documentElement.dir = getLocaleDirection(locale);
}

/**
 * 提供 Pi Web 的界面语言状态和翻译能力。
 * @param props React 子节点
 * @returns 包含语言上下文的 React 节点
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [preference, setPreference] = useState<LocalePreference>(SYSTEM_LOCALE);
  const [hydrated, setHydrated] = useState(false);
  const supportedLocales = useMemo(
    () => getSupportedLocales().map((id) => getLocalePlugin(id)).filter((plugin): plugin is LocalePlugin => Boolean(plugin)),
    [],
  );
  const messages = useMemo(() => getMessages(), []);

  useEffect(() => {
    const next = readInitialLocale();
    setPreference(readInitialPreference());
    setLocaleState(next);
    applyDocumentLocale(next);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (preference !== SYSTEM_LOCALE) return;
    const handleLanguageChange = () => {
      const next = readInitialLocale();
      setLocaleState(next);
      applyDocumentLocale(next);
    };
    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, [preference]);

  const setLocale = useCallback((next: LocalePreference) => {
    const resolved = next === SYSTEM_LOCALE ? readInitialLocale() : next;
    if (!getLocalePlugin(resolved)) return;
    setPreference(next);
    setLocaleState(resolved);
    applyDocumentLocale(resolved);
    setPref(APP_PREF_KEYS.locale, next);
  }, []);

  const t = useCallback((key: string, params?: TranslationParams) => translateMessage(locale, key, messages, params), [locale, messages]);
  const value = useMemo(() => ({ locale: hydrated ? locale : defaultLocale, preference, setLocale, t, supportedLocales }), [hydrated, locale, preference, setLocale, t, supportedLocales]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * 获取当前组件树中的国际化能力。
 * @returns 当前 locale、翻译函数、语言切换函数和支持的语言列表
 * @throws 当组件不在 I18nProvider 内时抛出异常
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
