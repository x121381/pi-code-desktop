import type { ReactNode } from "react";
import type { Locale, LocalePreference } from "@zcode/shared";
import type { BroadcastMessage, IBroadcastService, ISettingService } from "@zcode/services";
/** 简易 intl 工具：根据 id 查找翻译，支持 {key} 占位符替换 */
export interface IntlInstance {
    formatMessage(descriptor: {
        id: string;
    }, values?: Record<string, string | number>): string;
}
interface LocaleBroadcastPayload {
    preference: LocalePreference;
    resolvedLocale: Locale;
}
export declare function resolveLocalePreferenceFromSettings({ storedPreference, settingsLocale, settingsLocalePreference, preferSettingServiceLocale, }: {
    storedPreference: LocalePreference | null;
    settingsLocale: Locale | undefined;
    settingsLocalePreference: LocalePreference | undefined;
    preferSettingServiceLocale: boolean;
}): LocalePreference | null;
export declare function shouldApplyLocaleBroadcastMessage(message: Pick<BroadcastMessage, "channel" | "payload" | "sourceWindowId">, options?: {
    ignoredLocalPayload?: LocaleBroadcastPayload | null;
}): message is Pick<BroadcastMessage, "channel"> & {
    payload: Locale | LocaleBroadcastPayload;
};
interface IntlContextValue {
    intl: IntlInstance;
    locale: Locale;
    localePreference: LocalePreference;
    setLocale: (locale: Locale) => void;
    setLocalePreference: (localePreference: LocalePreference) => void;
}
/**
 * 国际化 Provider —— 管理当前语言和 intl 实例。
 * 如果传入 settingService，会从设置中读取初始语言并在切换时持久化。
 */
export declare function ZCodeIntlProvider({ children, settingService, broadcastService, initialLocale, preferSettingServiceLocale, resolveSystemLocale: resolveHostSystemLocale, }: {
    children: ReactNode;
    settingService?: ISettingService;
    broadcastService?: Pick<IBroadcastService, "send" | "onMessage">;
    initialLocale?: Locale;
    preferSettingServiceLocale?: boolean;
    resolveSystemLocale?: () => Locale | Promise<Locale>;
}): import("react/jsx-runtime").JSX.Element;
/** 获取 intl 上下文 */
export declare function useZCodeIntl(): IntlContextValue;
export {};
//# sourceMappingURL=IntlProvider.d.ts.map