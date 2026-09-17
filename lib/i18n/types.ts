/** 可用界面语言标识。语言由 registry 注册，因此这里保持可扩展。 */
export type Locale = string;

/** 用户选择跟随操作系统/浏览器语言时使用的偏好值。 */
export const SYSTEM_LOCALE = "system" as const;
export type LocalePreference = Locale | typeof SYSTEM_LOCALE;

/** 翻译字符串使用的简单插值参数。 */
export type TranslationParams = Record<string, string | number>;

/** 可注册的语言包定义。 */
export interface LocalePlugin {
  /** 语言包唯一标识。 */
  id: string;
  /** 用于语言选择菜单的显示名称。 */
  label: string;
  /** 文档方向；未指定时默认为从左到右。 */
  direction?: "ltr" | "rtl";
  /** 以稳定 key 索引的翻译消息。 */
  messages: Record<string, string>;
}
