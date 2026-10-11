import { BIGMODEL_PROVIDER_ID, BUILTIN_MODEL_PROVIDER_IDS, DEFAULT_ZCODE_ENDPOINT_ORIGIN, isTrustedCodingPlanWebviewOrigin, isZaiCodingPlanProviderId, normalizeZCodeEndpointOrigin, ZCODE_ENV, ZAI_PROVIDER_ID, } from "@zcode/shared";
/**
 * App locale（zh-CN / en-US）→ 官网 URL lang 段（cn / en）。
 * 用于 webview URL 的 ?lang= hint，让官网首屏就有正确语言，避免注入前的英文闪烁。
 */
export function codingPlanLocaleToWebsiteLang(locale) {
    return locale === "zh-CN" ? "cn" : "en";
}
export const CODING_PLAN_WEBVIEW_OVERRIDE_ENV_KEY = "VITE_CODING_PLAN_WEBVIEW_ORIGIN";
const CODING_PLAN_WEBVIEW_CREDENTIAL_LOCAL_STORAGE_KEYS = [
    "oauth:zai:access_token",
    "zcodejwttoken",
    "oauth:bigmodel:access_token",
];
const CODING_PLAN_REPORT_CONTEXT_STORAGE_KEY = "zcode:coding-plan:report-context";
export function resolveCodingPlanWebsiteProvider(providerId) {
    return isZaiCodingPlanProviderId(providerId) ||
        providerId === BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan
        ? "zai"
        : "bigmodel";
}
export function resolveCodingPlanEmbeddedOrigin({ dev, endpointOrigin, e2eStoreBridgeEnabled, overrideOrigin, zcodeEnv = ZCODE_ENV, }) {
    const normalizedOverride = overrideOrigin?.trim();
    if (normalizedOverride &&
        isTrustedCodingPlanWebviewOrigin(normalizedOverride, { e2eStoreBridgeEnabled })) {
        return normalizeZCodeEndpointOrigin(normalizedOverride);
    }
    // Bug 原因：本地开发默认注入 ZCODE_ENV=production，不能仅凭 Vite DEV 就打开未启动的官网本地页。
    if (dev && zcodeEnv === "test") {
        return "http://localhost:3000";
    }
    const normalizedEndpointOrigin = normalizeZCodeEndpointOrigin(endpointOrigin);
    return isTrustedCodingPlanWebviewOrigin(normalizedEndpointOrigin, { e2eStoreBridgeEnabled })
        ? normalizedEndpointOrigin
        : DEFAULT_ZCODE_ENDPOINT_ORIGIN;
}
export function buildCodingPlanEmbeddedWebviewUrl({ origin, provider, locale, theme, audience, teamPlanKey, }) {
    const url = new URL("/coding-plan", normalizeZCodeEndpointOrigin(origin));
    url.searchParams.set("provider", provider);
    url.searchParams.set("embedded", "app");
    url.searchParams.set("lang", codingPlanLocaleToWebsiteLang(locale));
    if (audience) {
        url.searchParams.set("audience", audience);
    }
    if (teamPlanKey?.trim()) {
        url.searchParams.set("teamPlanKey", teamPlanKey.trim());
    }
    if (theme) {
        url.searchParams.set("theme", theme);
    }
    return url.toString();
}
export function isTrustedCodingPlanEmbeddedWebviewUrl(value, options) {
    if (!value)
        return false;
    try {
        const url = new URL(value);
        if (url.protocol !== "http:" && url.protocol !== "https:")
            return false;
        if (!isTrustedCodingPlanWebviewOrigin(url.origin, {
            e2eStoreBridgeEnabled: options?.e2eStoreBridgeEnabled,
        })) {
            return false;
        }
        if (!url.pathname.includes("coding-plan"))
            return false;
        if (url.searchParams.get("embedded") === "app")
            return true;
        // PayPal 成功后先回到 /coding-plan/payment/callback，embedded=app
        // 在 returnTo 里。该页仍需要 App 注入 OAuth token 完成 subscribe，不能被当作外站清理凭据。
        if (!url.pathname.endsWith("/coding-plan/payment/callback"))
            return false;
        const returnTo = url.searchParams.get("returnTo");
        if (!returnTo)
            return false;
        const target = new URL(returnTo, url.origin);
        return (target.origin === url.origin &&
            target.pathname.includes("coding-plan") &&
            target.searchParams.get("embedded") === "app" &&
            !target.pathname.endsWith("/coding-plan/payment/callback"));
    }
    catch {
        return false;
    }
}
export function createCodingPlanAuthInjectionScript({ provider, credentials, theme, locale, reportContext, }) {
    const values = provider === "zai"
        ? {
            "oauth:zai:access_token": credentials.zaiAccessToken?.trim() || null,
            zcodejwttoken: credentials.zcodeJwtToken?.trim() || null,
            "oauth:bigmodel:access_token": null,
        }
        : {
            "oauth:zai:access_token": null,
            // zcodejwttoken 是 zcode-plan 域通用凭证（BigModel OAuth callback 同样落盘），
            // 官网用它查 billing/balance 判定 Start Plan 是否使用中；BigModel 分支缺失注入
            // 会导致官网 Start Plan 卡因查不到权益而误显示「已过期」。业务接口仍走
            // oauth:bigmodel:access_token，互不污染。
            zcodejwttoken: credentials.zcodeJwtToken?.trim() || null,
            "oauth:bigmodel:access_token": credentials.bigmodelAccessToken?.trim() || null,
        };
    const storageUpdates = Object.entries(values)
        .map(([key, value]) => value
        ? `localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(value)});`
        : `localStorage.removeItem(${JSON.stringify(key)});`)
        .join("\n  ");
    const resolvedLocale = locale === "zh-CN" ? "zh-CN" : "en-US";
    const normalizedReportContext = normalizeCodingPlanEmbeddedReportContext(reportContext);
    return `(() => {
  ${storageUpdates}
  const zcodeTheme = ${JSON.stringify(theme)};
  document.documentElement.classList.toggle("dark", zcodeTheme === "zai-dark");
  document.documentElement.classList.toggle("theme-zai-light", zcodeTheme === "zai-light");
  document.documentElement.classList.toggle("theme-zai-dark", zcodeTheme === "zai-dark");
  localStorage.setItem("zcode-theme", zcodeTheme);
  localStorage.setItem("zcode:coding-plan:embedded", "app");
  // 写入当前 App locale，供官网 zcodeBridge.getLang() 读取。
  // 注意：这是注入 webview 执行的原始 JS，不能用 TS 语法（如 as any）。
  window.__zcodeLang__ = ${JSON.stringify(resolvedLocale)};
  const zcodeReportContext = ${JSON.stringify(normalizedReportContext)};
  window.__zcodeReportContext__ = zcodeReportContext;
  localStorage.setItem(${JSON.stringify(CODING_PLAN_REPORT_CONTEXT_STORAGE_KEY)}, JSON.stringify(zcodeReportContext));
  window.dispatchEvent(new CustomEvent("zcode-coding-plan-auth-ready", {
    detail: { ...${JSON.stringify({ provider, locale: resolvedLocale })}, reportContext: zcodeReportContext },
  }));
})()`;
}
export function buildCodingPlanEmbeddedReportContext({ funnelContext, deviceMid, userId, appVersion, }) {
    return normalizeCodingPlanEmbeddedReportContext({
        purchase_funnel_id: funnelContext?.purchaseFunnelId,
        // 缺少归属标记会让兼容官网重复上报入口；无漏斗时不能声明 App 已接管。
        purchase_entry_reporter: funnelContext ? "app" : undefined,
        upgrade_source: funnelContext?.upgradeSource,
        event_region: funnelContext?.eventRegion,
        event_text: funnelContext?.eventText,
        entry_plan_status: funnelContext?.entryPlanStatus,
        entry_plan_level: funnelContext?.entryPlanLevel,
        entry_plan_list: funnelContext?.entryPlanList,
        purchase_audience: funnelContext?.purchaseAudience,
        provider_family: funnelContext?.providerFamily,
        channel: funnelContext?.channel,
        device_mid: deviceMid ?? undefined,
        user_id: userId ?? undefined,
        app_version: appVersion ?? undefined,
    });
}
function normalizeCodingPlanEmbeddedReportContext(context) {
    if (!context)
        return {};
    return Object.fromEntries(Object.entries(context).flatMap(([key, value]) => {
        if (typeof value !== "string")
            return [];
        const normalized = value.trim();
        return normalized ? [[key, normalized]] : [];
    }));
}
export function createCodingPlanCredentialClearScript() {
    const keys = [...CODING_PLAN_WEBVIEW_CREDENTIAL_LOCAL_STORAGE_KEYS];
    return `(() => {
  for (const key of ${JSON.stringify(keys)}) {
    localStorage.removeItem(key);
  }
  localStorage.removeItem(${JSON.stringify(CODING_PLAN_REPORT_CONTEXT_STORAGE_KEY)});
  delete window.__zcodeReportContext__;
})()`;
}
export function createCodingPlanScrollbarHideScript() {
    return `(() => {
  const styleId = "zcode-coding-plan-hide-scrollbar";
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = \`
html,
body,
* {
  scrollbar-width: none !important;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar,
*::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
\`;
  document.head.appendChild(style);
})()`;
}
/**
 * 生成「更新 webview 当前 locale」的注入脚本。
 * App locale 运行时变化时对 webview executeJavaScript 此脚本：
 * 重写 window.__zcodeLang__ 并派发 zcode-coding-plan-lang-change 事件，
 * 官网侧（zcodeBridge.onLangChange 或 window 监听）据此无感切换语言。
 */
export function createCodingPlanLangInjectionScript(locale) {
    const resolvedLocale = locale === "zh-CN" ? "zh-CN" : "en-US";
    return `(() => {
  // 注意：注入 webview 执行的原始 JS，不能用 TS 语法（如 as any）。
  window.__zcodeLang__ = ${JSON.stringify(resolvedLocale)};
  window.dispatchEvent(new CustomEvent("zcode-coding-plan-lang-change", {
    detail: ${JSON.stringify({ locale: resolvedLocale })},
  }));
})()`;
}
export function getCodingPlanCredentialKeys(provider) {
    // zcodejwttoken 对两个 provider 都加载：它是 zcode-plan 域通用凭证，
    // BigModel OAuth callback 同样落盘（见 resolveBigModelStartPlanZcodeJwt）。
    return provider === "zai"
        ? [`oauth:${ZAI_PROVIDER_ID}:access_token`, "zcodejwttoken"]
        : [`oauth:${BIGMODEL_PROVIDER_ID}:access_token`, "zcodejwttoken"];
}
//# sourceMappingURL=codingPlanEmbeddedWebview.js.map