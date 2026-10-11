import { type ZCodeEnv } from "@zcode/shared";
import type { CodingPlanWebviewLocale } from "@zcode/shared";
import type { CodingPlanFunnelContext } from "@/lib/codingPlanFunnelTelemetry.js";
import type { CodingPlanProviderId } from "@/settings/model-provider-section/constants.js";
export type CodingPlanWebsiteProvider = "zai" | "bigmodel";
export type CodingPlanPurchaseAudience = "personal" | "team";
export interface CodingPlanEmbeddedCredentials {
    zaiAccessToken?: string | null;
    zcodeJwtToken?: string | null;
    bigmodelAccessToken?: string | null;
}
export interface CodingPlanEmbeddedReportContext {
    purchase_funnel_id?: string;
    purchase_entry_reporter?: "app";
    upgrade_source?: string;
    event_region?: string;
    event_text?: string;
    entry_plan_status?: string;
    entry_plan_level?: string;
    entry_plan_list?: string;
    purchase_audience?: string;
    provider_family?: string;
    channel?: string;
    device_mid?: string;
    user_id?: string;
    app_version?: string;
}
export type CodingPlanEmbeddedTheme = "zai-light" | "zai-dark";
/**
 * App locale（zh-CN / en-US）→ 官网 URL lang 段（cn / en）。
 * 用于 webview URL 的 ?lang= hint，让官网首屏就有正确语言，避免注入前的英文闪烁。
 */
export declare function codingPlanLocaleToWebsiteLang(locale: CodingPlanWebviewLocale | null | undefined): "cn" | "en";
export interface ResolveCodingPlanEmbeddedOriginOptions {
    dev: boolean;
    endpointOrigin: string;
    e2eStoreBridgeEnabled?: boolean;
    overrideOrigin?: string | null;
    zcodeEnv?: ZCodeEnv;
}
export declare const CODING_PLAN_WEBVIEW_OVERRIDE_ENV_KEY = "VITE_CODING_PLAN_WEBVIEW_ORIGIN";
export declare function resolveCodingPlanWebsiteProvider(providerId: CodingPlanProviderId): CodingPlanWebsiteProvider;
export declare function resolveCodingPlanEmbeddedOrigin({ dev, endpointOrigin, e2eStoreBridgeEnabled, overrideOrigin, zcodeEnv, }: ResolveCodingPlanEmbeddedOriginOptions): string;
export declare function buildCodingPlanEmbeddedWebviewUrl({ origin, provider, locale, theme, audience, teamPlanKey, }: {
    origin: string;
    provider: CodingPlanWebsiteProvider;
    locale?: CodingPlanWebviewLocale | null;
    theme?: CodingPlanEmbeddedTheme | null;
    audience?: CodingPlanPurchaseAudience;
    teamPlanKey?: string | null;
}): string;
export declare function isTrustedCodingPlanEmbeddedWebviewUrl(value: string | null | undefined, options?: {
    e2eStoreBridgeEnabled?: boolean;
}): boolean;
export declare function createCodingPlanAuthInjectionScript({ provider, credentials, theme, locale, reportContext, }: {
    provider: CodingPlanWebsiteProvider;
    credentials: CodingPlanEmbeddedCredentials;
    theme: CodingPlanEmbeddedTheme;
    locale: CodingPlanWebviewLocale | null;
    reportContext?: CodingPlanEmbeddedReportContext | null;
}): string;
export declare function buildCodingPlanEmbeddedReportContext({ funnelContext, deviceMid, userId, appVersion, }: {
    funnelContext?: CodingPlanFunnelContext | null;
    deviceMid?: string | null;
    userId?: string | null;
    appVersion?: string | null;
}): CodingPlanEmbeddedReportContext;
export declare function createCodingPlanCredentialClearScript(): string;
export declare function createCodingPlanScrollbarHideScript(): string;
/**
 * 生成「更新 webview 当前 locale」的注入脚本。
 * App locale 运行时变化时对 webview executeJavaScript 此脚本：
 * 重写 window.__zcodeLang__ 并派发 zcode-coding-plan-lang-change 事件，
 * 官网侧（zcodeBridge.onLangChange 或 window 监听）据此无感切换语言。
 */
export declare function createCodingPlanLangInjectionScript(locale: CodingPlanWebviewLocale): string;
export declare function getCodingPlanCredentialKeys(provider: CodingPlanWebsiteProvider): string[];
//# sourceMappingURL=codingPlanEmbeddedWebview.d.ts.map