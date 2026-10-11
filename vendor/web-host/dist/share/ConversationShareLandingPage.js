import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- share 公开页的状态文案、Row allow-list 和登录态需保持同一安全边界。 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, } from "react";
import { ArrowUpRightIcon, MoonIcon, SunIcon } from "lucide-react";
import { BIGMODEL_PROVIDER_ID, ZAI_PROVIDER_ID } from "@zcode/shared";
import { ConversationShareReadonlyTimeline } from "@zcode/ui/conversation-share-readonly";
import { renderOAuthProviderIcon } from "@zcode/ui/oauth-provider-icon";
import { applyTheme, resolveTheme } from "@zcode/ui/useTheme";
import "./conversationShareLandingPage.css";
import { buildShareImportDeepLink, } from "./conversationSharePreviewClient.js";
import { resolveShareHeaderView } from "./shareHeaderLayout.js";
/** 登录入口的展示顺序，与桌面端登录卡片一致（z.ai 在上）。 */
const SHARE_LOGIN_PROVIDERS = [
    ZAI_PROVIDER_ID,
    BIGMODEL_PROVIDER_ID,
];
function logPreviewLoadFailure(stage, error, kind) {
    const clientError = error;
    console.warn("[conversation-share-web]", "preview_load_failed", {
        stage,
        kind,
        errorName: error instanceof Error ? error.name : typeof error,
        status: typeof clientError?.status === "number" ? clientError.status : undefined,
        code: typeof clientError?.code === "number" ? clientError.code : undefined,
    });
}
// 站点首页本身就是下载入口，没有 /download 这个 path（单独的下载链接会 404）。
const ZCODE_DOWNLOAD_URL = "https://zcode.z.ai";
const COPY = {
    "zh-CN": {
        brand: "ZCode 会话分享",
        loading: "正在加载分享内容",
        loadingDescription: "请稍候，我们正在验证分享链接。",
        loginTitle: "登录后查看分享",
        loginDescription: "请登录后确认你是否有权限查看这个分享。",
        login: "登录",
        loginWith: {
            zai: "连接 Z.ai 继续使用",
            bigmodel: "连接 BigModel 继续使用",
        },
        loginRegion: { zai: "全球", bigmodel: "中国" },
        expiredTitle: "分享已过期",
        expiredDescription: "这个分享链接已经过期，请让分享者重新生成链接。",
        notFoundTitle: "找不到分享内容",
        notFoundDescription: "链接可能无效、分享已被移除，或当前登录账号无法访问。",
        notFoundAccountHint: "Z.ai 与 BigModel 的账号数据不互通。请检查是否选错了登录平台或使用了其他账号。",
        backToHome: "回到首页",
        networkTitle: "暂时无法加载分享",
        networkDescription: "请检查网络后重试。",
        invalidTitle: "分享格式无效",
        invalidDescription: "服务返回的分享内容无法通过安全校验。",
        outdatedTitle: "需要更新 ZCode",
        outdatedDescription: "这个分享由更新版本的 ZCode 创建，请升级后再查看。",
        unavailableTitle: "分享不可访问",
        unavailableDescription: "当前账号没有权限，或者分享内容已不存在。",
        retry: "重试",
        continueInZCode: "去 ZCode 继续",
        switchToDarkTheme: "切换到深色主题",
        switchToLightTheme: "切换到浅色主题",
        continueHelp: "如果没有自动打开 ZCode，请先下载客户端，或再次尝试打开。",
        downloadZCode: "下载 ZCode",
        artifactCountOne: "{count} 个结果物",
        artifactCountOther: "{count} 个结果物",
        retryOpen: "再次打开",
    },
    "en-US": {
        brand: "ZCode Conversation Share",
        loading: "Loading shared conversation",
        loadingDescription: "Please wait while we verify this share link.",
        loginTitle: "Sign in to view this share",
        loginDescription: "Sign in to check whether you can view this shared conversation.",
        login: "Sign in",
        loginWith: {
            zai: "Connect to Z.ai",
            bigmodel: "Connect to BigModel",
        },
        loginRegion: { zai: "Global", bigmodel: "CN" },
        expiredTitle: "Share expired",
        expiredDescription: "This share link has expired. Ask the author to create a new one.",
        notFoundTitle: "Share not found",
        notFoundDescription: "The link may be invalid, the share may have been removed, or your current account may not have access.",
        notFoundAccountHint: "Z.ai and BigModel do not share account data. Check whether you selected the wrong sign-in platform or used a different account.",
        backToHome: "Back to home",
        networkTitle: "Unable to load share",
        networkDescription: "Check your network connection and try again.",
        invalidTitle: "Invalid share content",
        invalidDescription: "The shared content failed the public safety contract.",
        outdatedTitle: "Update ZCode to continue",
        outdatedDescription: "This share was created by a newer version of ZCode. Please update to view it.",
        unavailableTitle: "Share unavailable",
        unavailableDescription: "This account is not allowed to view the share, or it no longer exists.",
        retry: "Try again",
        continueInZCode: "Continue in ZCode",
        switchToDarkTheme: "Switch to dark theme",
        switchToLightTheme: "Switch to light theme",
        continueHelp: "If ZCode did not open, download the app or try opening it again.",
        downloadZCode: "Download ZCode",
        artifactCountOne: "{count} artifact",
        artifactCountOther: "{count} artifacts",
        retryOpen: "Try again",
    },
};
function localeOf(locale) {
    if (locale)
        return locale;
    return /^zh(?:-|$)/iu.test(globalThis.navigator?.language ?? "") ? "zh-CN" : "en-US";
}
function formatDate(timestamp, locale) {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp));
}
const SHARE_CONTENT_RAIL_CLASS = "@container/conversation mx-auto w-full max-w-4xl px-4 sm:px-8 xl:max-w-6xl";
const SHARE_CONTINUE_LINK_CLASS = "inline-flex max-w-full items-center gap-2 rounded-xl bg-primary px-4 py-2 text-ui-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-input-border-focused sm:gap-3 sm:px-5 sm:py-2.5";
const SHARE_CONTINUE_MEASURE_CLASS = "inline-flex max-w-none items-center gap-2 rounded-xl bg-primary px-4 py-2 text-ui-base font-medium text-primary-foreground sm:gap-3 sm:px-5 sm:py-2.5";
const SHARE_CONTINUE_COMPACT_CLASS = "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-input-border-focused";
const SHARE_THEME_TOGGLE_CLASS = "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused";
function ShareThemeToggle({ theme, copy, onThemeChange, }) {
    const resolvedTheme = resolveTheme(theme);
    const nextTheme = resolvedTheme === "dark" ? "zai-light" : "zai-dark";
    const label = resolvedTheme === "dark" ? copy.switchToLightTheme : copy.switchToDarkTheme;
    const Icon = resolvedTheme === "dark" ? SunIcon : MoonIcon;
    return (_jsx("button", { type: "button", "data-share-theme-toggle": "true", className: SHARE_THEME_TOGGLE_CLASS, "aria-label": label, title: label, onClick: () => onThemeChange?.(nextTheme), children: _jsx(Icon, { className: "size-4", "aria-hidden": "true" }) }));
}
function ShareContentRail({ children, className = "", body = false, }) {
    return (_jsx("div", { "data-share-content-rail": "true", "data-share-body-rail": body ? "true" : undefined, className: `${SHARE_CONTENT_RAIL_CLASS} ${className}`, children: children }));
}
function ShareContentInset({ children, className = "", }) {
    return (_jsx("div", { "data-share-content-inset": "true", className: `w-full px-4 @md/conversation:px-6 ${className}`, children: children }));
}
export function ConversationShareLandingPage({ shareCode, preview, locale, theme, onThemeChange, }) {
    const resolvedLocale = localeOf(locale);
    const copy = COPY[resolvedLocale];
    const activeTheme = theme ?? "zai-light";
    // preview 到手后把会话标题写进浏览器标签；main.tsx 只能先给一个语言正确的兜底标题。
    const shareTitle = preview.share.title;
    useEffect(() => {
        document.title = `${shareTitle} · ${copy.brand}`;
    }, [copy.brand, shareTitle]);
    const [showContinueHelp, setShowContinueHelp] = useState(false);
    const importLink = preview.share.access_mode === "public_importable" || preview.share.access_mode === "private"
        ? buildShareImportDeepLink(shareCode)
        : null;
    // 结果物数量只统计时间线实际展示的 artifact Row；preview.artifacts 还包含 userInput
    // 附件的下载 manifest，不能直接拿 manifest 数量当作结果物数量。
    const artifactCount = preview.rows.filter((row) => row.kind === "artifact").length;
    const artifactCountLabel = (artifactCount === 1 ? copy.artifactCountOne : copy.artifactCountOther).replace("{count}", String(artifactCount));
    const artifactUrls = new Map(preview.artifacts.map((artifact) => [artifact.artifact_id, artifact.url]));
    const artifactNames = new Map(preview.artifacts.map((artifact) => [artifact.artifact_id, artifact.display_name]));
    const headerRowRef = useRef(null);
    const headerShellRef = useRef(null);
    const brandRef = useRef(null);
    const titleRef = useRef(null);
    const titleMeasureRef = useRef(null);
    const continueMeasureRef = useRef(null);
    const compactContinueMeasureRef = useRef(null);
    const [headerMeasured, setHeaderMeasured] = useState(false);
    const [headerView, setHeaderView] = useState({
        progress: 0,
        brandLeft: 0,
        titleLeft: 0,
        titleWidth: 0,
        continueRight: 0,
        titleTruncated: false,
        continueVisible: Boolean(importLink),
        continueCompact: false,
    });
    useLayoutEffect(() => {
        const row = headerRowRef.current;
        if (!row)
            return;
        const updateLayout = () => {
            const rowRect = row.getBoundingClientRect();
            const shellRect = headerShellRef.current?.getBoundingClientRect();
            if (!shellRect)
                return;
            const nextView = resolveShareHeaderView({
                shellWidth: shellRect.width,
                railContentLeft: rowRect.left - shellRect.left,
                railContentRight: shellRect.right - rowRect.right,
                brandWidth: brandRef.current?.getBoundingClientRect().width ?? 50,
                titleContentWidth: titleMeasureRef.current?.getBoundingClientRect().width ?? 0,
                continueWidth: continueMeasureRef.current?.getBoundingClientRect().width ?? 0,
                compactContinueWidth: compactContinueMeasureRef.current?.getBoundingClientRect().width ?? 0,
                hasContinueAction: Boolean(importLink),
            });
            setHeaderMeasured(true);
            setHeaderView((current) => current.progress === nextView.progress &&
                current.brandLeft === nextView.brandLeft &&
                current.titleLeft === nextView.titleLeft &&
                current.titleWidth === nextView.titleWidth &&
                current.continueRight === nextView.continueRight &&
                current.titleTruncated === nextView.titleTruncated &&
                current.continueVisible === nextView.continueVisible &&
                current.continueCompact === nextView.continueCompact
                ? current
                : nextView);
        };
        updateLayout();
        if (typeof ResizeObserver === "undefined")
            return;
        const observer = new ResizeObserver(updateLayout);
        observer.observe(row);
        if (headerShellRef.current)
            observer.observe(headerShellRef.current);
        if (brandRef.current)
            observer.observe(brandRef.current);
        if (titleRef.current)
            observer.observe(titleRef.current);
        if (titleMeasureRef.current)
            observer.observe(titleMeasureRef.current);
        if (continueMeasureRef.current)
            observer.observe(continueMeasureRef.current);
        if (compactContinueMeasureRef.current)
            observer.observe(compactContinueMeasureRef.current);
        return () => observer.disconnect();
    }, [resolvedLocale, importLink]);
    const headerGeometryStyle = {
        "--share-brand-left": `${headerView.brandLeft}px`,
        "--share-title-left": `${headerView.titleLeft}px`,
        "--share-title-width": `${headerView.titleWidth}px`,
        "--share-continue-right": `${headerView.continueRight}px`,
    };
    const handleContinue = useCallback((event) => {
        event.preventDefault();
        setShowContinueHelp(false);
        window.location.href = importLink;
        window.setTimeout(() => {
            if (document.visibilityState === "visible") {
                setShowContinueHelp(true);
            }
        }, 1500);
    }, [importLink]);
    return (_jsxs("main", { className: "h-full min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain bg-background text-foreground [scrollbar-gutter:stable]", "data-markdown-table-layout-root": "true", "data-share-scroll-viewport": "true", children: [_jsx("header", { "data-share-header": "true", className: "sticky top-0 z-20 border-b border-border bg-background backdrop-blur", children: _jsx("div", { ref: headerShellRef, "data-share-header-shell": "true", "data-share-header-layout": "continuous", "data-share-header-ready": headerMeasured ? "true" : "false", className: "w-full", style: headerGeometryStyle, children: _jsx(ShareContentRail, { className: "flex h-16 items-center", children: _jsx(ShareContentInset, { children: _jsxs("div", { ref: headerRowRef, "data-share-header-row": "true", className: "h-full w-full min-w-0", children: [_jsx("div", { ref: brandRef, "data-share-brand": "true", className: "shrink-0 text-ui-lg font-semibold text-foreground", "aria-label": "ZCode", children: "ZCode" }), _jsx("h1", { ref: titleRef, "data-share-title": "true", "data-share-title-truncated": headerView.titleTruncated ? "true" : "false", className: "truncate text-left text-ui-lg font-medium", title: preview.share.title, children: preview.share.title }), _jsx("span", { ref: titleMeasureRef, "data-share-title-measure": "true", className: "text-ui-lg font-medium", "aria-hidden": "true", children: preview.share.title }), _jsxs("div", { "data-share-continue-slot": "true", "data-share-continue-visible": importLink && headerView.continueVisible ? "true" : "false", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ShareThemeToggle, { theme: activeTheme, copy: copy, onThemeChange: onThemeChange }), importLink && headerView.continueVisible ? (_jsxs("a", { "data-share-continue-link": "true", "data-share-continue-compact": headerView.continueCompact ? "true" : "false", className: headerView.continueCompact
                                                            ? SHARE_CONTINUE_COMPACT_CLASS
                                                            : SHARE_CONTINUE_LINK_CLASS, href: importLink, "aria-label": copy.continueInZCode, title: copy.continueInZCode, onClick: handleContinue, children: [_jsx("span", { className: headerView.continueCompact ? "sr-only" : "truncate", children: copy.continueInZCode }), _jsx(ArrowUpRightIcon, { className: headerView.continueCompact
                                                                    ? "size-4 shrink-0"
                                                                    : "size-4 shrink-0 sm:size-5", "aria-hidden": "true" })] })) : null] }), _jsxs("span", { ref: continueMeasureRef, "data-share-continue-measure": "true", className: "inline-flex items-center gap-2", "aria-hidden": "true", tabIndex: -1, children: [_jsx("span", { className: SHARE_THEME_TOGGLE_CLASS, children: _jsx(MoonIcon, { className: "size-4", "aria-hidden": "true" }) }), importLink ? (_jsxs("span", { className: SHARE_CONTINUE_MEASURE_CLASS, children: [_jsx("span", { children: copy.continueInZCode }), _jsx(ArrowUpRightIcon, { className: "size-4 shrink-0 sm:size-5", "aria-hidden": "true" })] })) : null] }), _jsxs("span", { ref: compactContinueMeasureRef, "data-share-continue-compact-measure": "true", className: "inline-flex items-center gap-2", "aria-hidden": "true", tabIndex: -1, children: [_jsx("span", { className: SHARE_THEME_TOGGLE_CLASS, children: _jsx(MoonIcon, { className: "size-4", "aria-hidden": "true" }) }), importLink ? (_jsx("span", { className: SHARE_CONTINUE_COMPACT_CLASS, children: _jsx(ArrowUpRightIcon, { className: "size-4", "aria-hidden": "true" }) })) : null] })] })] }) }) }) }) }), _jsxs(ShareContentRail, { body: true, className: "py-6 sm:py-10", children: [_jsx(ShareContentInset, { children: _jsxs("div", { "data-share-metadata": "true", className: "mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-ui-sm text-foreground-subtle", children: [_jsx("span", { children: formatDate(preview.share.created_at, resolvedLocale) }), artifactCount ? (_jsxs("span", { "aria-label": artifactCountLabel, children: ["\u00B7 ", artifactCountLabel] })) : null] }) }), importLink && showContinueHelp ? (_jsx(ShareContentInset, { children: _jsxs("div", { className: "mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-ui-sm text-foreground-subtle", role: "status", children: [_jsx("span", { children: copy.continueHelp }), _jsx("a", { className: "text-brand underline underline-offset-2", href: importLink, onClick: handleContinue, children: copy.retryOpen }), _jsx("a", { className: "text-brand underline underline-offset-2", href: ZCODE_DOWNLOAD_URL, children: copy.downloadZCode })] }) })) : null, _jsx(ConversationShareReadonlyTimeline, { rows: preview.rows, unsupportedRowCount: preview.unsupportedRowCount, locale: resolvedLocale, theme: theme, artifactUrls: artifactUrls, artifactNames: artifactNames }), importLink ? (_jsx(ShareContentInset, { children: _jsx("div", { "data-share-continue-footer": "true", className: "flex justify-center pb-2 pt-8 sm:pt-10", children: _jsxs("a", { "data-share-continue-link": "true", className: SHARE_CONTINUE_LINK_CLASS, href: importLink, onClick: handleContinue, children: [_jsx("span", { className: "truncate", children: copy.continueInZCode }), _jsx(ArrowUpRightIcon, { className: "size-4 shrink-0 sm:size-5", "aria-hidden": "true" })] }) }) })) : null] })] }));
}
export function ConversationShareLandingStatus({ state, locale, onLogin, onRetry, }) {
    const copy = COPY[localeOf(locale)];
    const content = state.kind === "loading"
        ? { title: copy.loading, description: copy.loadingDescription }
        : state.kind === "login_required"
            ? { title: copy.loginTitle, description: copy.loginDescription }
            : state.error === "expired"
                ? { title: copy.expiredTitle, description: copy.expiredDescription }
                : state.error === "not_found"
                    ? { title: copy.notFoundTitle, description: copy.notFoundDescription }
                    : state.error === "unsupported_schema_version"
                        ? { title: copy.outdatedTitle, description: copy.outdatedDescription }
                        : state.error === "invalid_contract"
                            ? { title: copy.invalidTitle, description: copy.invalidDescription }
                            : state.error === "authentication_required"
                                ? { title: copy.loginTitle, description: copy.loginDescription }
                                : { title: copy.networkTitle, description: copy.networkDescription };
    const showLogin = state.kind === "login_required" ||
        (state.kind === "error" && state.error === "authentication_required");
    const isNotFound = state.kind === "error" && state.error === "not_found";
    /**
     * 只在「重发同一个请求有可能得到不同结果」时给重试。
     *
     * 需要登录时该做的是登录，重发未授权请求结果不变；已过期不会自己变回未过期；载荷版本
     * 高于本 build 得升级客户端。这几种给重试等于给一个必然无效的动作。
     */
    const canRetry = Boolean(onRetry) &&
        state.kind !== "loading" &&
        !showLogin &&
        !(state.kind === "error" &&
            (state.error === "expired" || state.error === "unsupported_schema_version"));
    return (_jsx("main", { className: "flex h-full min-h-0 items-center justify-center overflow-y-auto bg-background px-4 py-8 text-foreground", children: _jsxs("section", { className: "w-full max-w-md rounded-lg border border-card-border bg-card p-6 shadow-sm", children: [_jsx("div", { className: "mb-4 text-ui-sm font-medium text-brand", children: copy.brand }), _jsx("h1", { className: "text-ui-xl font-semibold", children: content.title }), _jsx("p", { className: "mt-3 text-ui-base leading-6 text-foreground-subtle", children: content.description }), isNotFound ? (_jsx("p", { className: "mt-4 text-ui-base leading-6 text-foreground-subtle", children: copy.notFoundAccountHint })) : null, showLogin && onLogin ? (_jsx("div", { className: "mt-5 space-y-2", children: SHARE_LOGIN_PROVIDERS.map((provider) => (_jsxs("button", { type: "button", "data-share-login-provider": provider, className: "flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-ui-base text-primary-foreground", onClick: () => onLogin(provider), children: [renderOAuthProviderIcon(provider, "size-4"), _jsx("span", { className: "min-w-0 truncate", children: copy.loginWith[provider] }), _jsx("span", { className: "ml-1 inline-flex h-5 shrink-0 items-center rounded-full border border-primary-foreground/30 px-2 text-ui-xs font-medium leading-none text-primary-foreground/60", children: copy.loginRegion[provider] })] }, provider))) })) : null, canRetry || isNotFound ? (_jsxs("div", { className: "mt-5 flex flex-wrap gap-2", children: [canRetry ? (_jsx("button", { type: "button", className: "rounded-md border border-border px-4 py-2 text-ui-base text-foreground", onClick: onRetry, children: copy.retry })) : null, isNotFound ? (_jsx("a", { className: "rounded-md bg-primary px-4 py-2 text-ui-base text-primary-foreground", href: ZCODE_DOWNLOAD_URL, children: copy.backToHome })) : null] })) : null] }) }));
}
export function ConversationShareLandingLoader({ shareCode, client, getAccessToken, onLogin, onLogout, locale, theme, }) {
    const [state, setState] = useState({ kind: "loading" });
    const [activeTheme, setActiveTheme] = useState(theme ?? "zai-light");
    const handleThemeChange = useCallback((nextTheme) => {
        localStorage.setItem("zcode-theme", nextTheme);
        setActiveTheme(nextTheme);
        applyTheme(nextTheme);
    }, []);
    useEffect(() => {
        if (activeTheme !== "system")
            return;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = () => applyTheme("system");
        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }, [activeTheme]);
    const load = useCallback(async () => {
        setState({ kind: "loading" });
        // 有登录态就第一次直接带上：private 分享匿名请求必然被服务端按存在性隐匿判 404，
        // 先发一次注定失败的匿名请求只是白跑一个往返。没有登录态时仍然匿名试——公开分享
        // 不需要登录，不能因为没 token 就先弹登录。
        const initialToken = getAccessToken?.() ?? null;
        try {
            const preview = await client.getPreview(shareCode, initialToken ?? undefined);
            setState({ kind: "ready", preview });
        }
        catch (error) {
            const kind = error && typeof error === "object" && "kind" in error
                ? error.kind
                : "network";
            logPreviewLoadFailure(initialToken ? "authenticated" : "anonymous", error, kind);
            if (kind === "authentication_required" || kind === "not_found") {
                // 带过 token 还失败就没有第二次机会了：要么本地登录态已失效（让宿主清理并重新登录），
                // 要么服务端确实不认这个访问者。
                if (initialToken) {
                    setState({ kind: "error", error: kind });
                    if (kind === "authentication_required")
                        onLogout?.();
                    return;
                }
                setState({ kind: "login_required" });
                return;
            }
            setState({ kind: "error", error: kind });
        }
    }, [client, getAccessToken, onLogout, shareCode]);
    useEffect(() => {
        void load();
    }, [load]);
    if (state.kind === "ready")
        return (_jsx(ConversationShareLandingPage, { shareCode: shareCode, preview: state.preview, locale: locale, theme: activeTheme, onThemeChange: handleThemeChange }));
    return (_jsx(ConversationShareLandingStatus, { state: state, locale: locale, onLogin: onLogin, onRetry: () => void load() }));
}
//# sourceMappingURL=ConversationShareLandingPage.js.map