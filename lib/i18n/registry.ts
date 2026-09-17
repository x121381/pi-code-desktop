import { enLocale } from "./messages/en.ts";
import { zhCNLocale } from "./messages/zh-CN.ts";
import { zhTWLocale } from "./messages/zh-TW.ts";
import { jaLocale } from "./messages/ja.ts";
import { koLocale } from "./messages/ko.ts";
import { esLocale } from "./messages/es.ts";
import { SYSTEM_LOCALE } from "./types";
import type { Locale, LocalePlugin } from "./types";

const localePlugins = new Map<string, LocalePlugin>();

/** 注册一个语言包；重复注册会抛出异常，避免静默覆盖翻译。 */
export function registerLocale(plugin: LocalePlugin): void {
  if (!plugin.id.trim()) throw new Error("Locale id must not be empty");
  if (localePlugins.has(plugin.id)) throw new Error(`Locale already registered: ${plugin.id}`);
  localePlugins.set(plugin.id, plugin);
}

/**
 * 根据标识获取已注册的语言包。
 * @param id 要查询的语言标识
 * @returns 已注册的语言包，不存在时返回 undefined
 */
export function getLocalePlugin(id: string): LocalePlugin | undefined {
  return localePlugins.get(id);
}

/** 获取当前已注册语言的稳定顺序列表。 */
export function getSupportedLocales(): string[] {
  return [...localePlugins.keys()];
}

/** 获取内置英语 fallback 的标识。 */
export function getDefaultLocale(): Locale {
  return enLocale.id;
}

function normalizeLocale(id: string): string {
  return id.trim().toLowerCase().replace(/_/g, "-");
}

function findLocale(id: string): Locale | undefined {
  const normalized = normalizeLocale(id);
  return getSupportedLocales().find((supported) => normalizeLocale(supported) === normalized);
}

const localeAliases: Record<string, Locale> = {
  "zh-hk": "zh-TW",
  "zh-mo": "zh-TW",
  "zh-hant": "zh-TW",
  "zh-sg": "zh-CN",
  "zh-hans": "zh-CN",
};

/**
 * 将浏览器语言列表解析为已注册语言。
 * 先尝试精确匹配，再尝试基础语言匹配，最后回退到英语。
 */
export function resolveBrowserLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    if (!language) continue;
    const aliased = localeAliases[normalizeLocale(language)];
    if (aliased && getLocalePlugin(aliased)) return aliased;
    const exact = findLocale(language);
    if (exact) return exact;
    const base = normalizeLocale(language).split("-")[0];
    const baseMatch = getSupportedLocales().find((supported) => normalizeLocale(supported).split("-")[0] === base);
    if (baseMatch) return baseMatch;
  }
  return getDefaultLocale();
}

/** 将持久化偏好解析为实际注册的语言；system 使用浏览器语言列表。 */
export function resolveLocalePreference(preference: string | null | undefined, languages: readonly string[]): Locale {
  if (preference && preference !== SYSTEM_LOCALE) return findLocale(preference) ?? resolveBrowserLocale(languages);
  return resolveBrowserLocale(languages);
}

/** 获取语言方向；第三方语言包未声明时保持默认的 ltr。 */
export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  return getLocalePlugin(locale)?.direction ?? "ltr";
}

registerLocale(enLocale);
registerLocale(zhCNLocale);
registerLocale(zhTWLocale);
registerLocale(jaLocale);
registerLocale(koLocale);
registerLocale(esLocale);
