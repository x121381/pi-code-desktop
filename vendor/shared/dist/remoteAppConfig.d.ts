import type { Locale } from "./protocol.js";
type LocaleUrlMap = Partial<Record<Locale, string>>;
export declare function getFeedbackUrlFromConfig(config: unknown): string | undefined;
export declare function getFeedbackApiBaseFromConfig(config: unknown): string | undefined;
export declare function getFeedbackUseExternalFormFromConfig(config: unknown): boolean;
export declare function getCommunityUrlsFromConfig(config: unknown): LocaleUrlMap;
export declare function getCommunityUrlFromConfig(config: unknown, locale: Locale): string | undefined;
export declare function getCommunityUrlFromConfigs(remoteConfig: unknown, localConfig: unknown, locale: Locale): string | undefined;
export declare function getForceUpdateMinimalVersionFromConfig(config: unknown): string | undefined;
export {};
//# sourceMappingURL=remoteAppConfig.d.ts.map