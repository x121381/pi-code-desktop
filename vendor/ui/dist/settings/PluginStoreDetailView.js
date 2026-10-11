import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- 商店详情页把 hero/示例提示词/组件分区/信息区/高级折叠组织为一个连贯页面，与截图 1:1 对齐。 */
import { useState } from "react";
import { Anchor, ArrowRight, Bot, ChevronRight, ExternalLink, Loader2, MessagesSquare, RefreshCw, Server, Terminal, TriangleAlert, WandSparkles, } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { useOptionalPlatform } from "@/hooks/usePlatform.js";
import { PluginStoreAvatar } from "@/settings/PluginStoreAvatar.js";
import { ThemeHeroVisual } from "@/openWorkspacePageThemeHero.js";
import documentsIconUrl from "@/assets/document-skill-icons/documents@2x.png";
import pdfIconUrl from "@/assets/document-skill-icons/pdf@2x.png";
import spreadsheetsIconUrl from "@/assets/document-skill-icons/spreadsheets@2x.png";
import { PluginStoreInstallButton, PluginStoreItemMenu, PluginStorePaidPlanBadge, } from "@/settings/PluginStoreCard.js";
import { isTrustedImageUrl, KNOWN_CATEGORY_LABEL_IDS, resolveItemDescription, resolveStoreCategory, resolveItemDisplayName, resolveLocalizedList, } from "@/settings/pluginStoreListing.js";
import { buildInstalledPluginDisplayGroups, describeResultToDisplayGroups, } from "@/settings/pluginManagedResourceGroups.js";
// 组件分区顺序与截图一致：MCP 服务器 → 技能 → 命令 → 子智能体 → Hooks。
const SECTION_ORDER = ["mcp", "skill", "command", "agent", "hook"];
const SECTION_TITLE_IDS = {
    mcp: "settings.plugins.store.section.mcp",
    skill: "settings.plugins.store.section.skills",
    command: "settings.plugins.store.section.commands",
    agent: "settings.plugins.store.section.agents",
    hook: "settings.plugins.store.section.hooks",
};
// 与各资源设置列表共用同一图标语义，避免详情页用近似图标造成识别不一致。
const SECTION_ICONS = {
    mcp: Server,
    skill: WandSparkles,
    command: Terminal,
    agent: Bot,
    hook: Anchor,
};
const EXAMPLE_PROMPT_DOCUMENT_ICON_URLS = {
    documents: documentsIconUrl,
    pdf: pdfIconUrl,
    spreadsheets: spreadsheetsIconUrl,
};
export function resolveExamplePromptDocumentIcon(prompt) {
    if (/\bpdf\b/iu.test(prompt)) {
        return "pdf";
    }
    if (/\b(?:csv|xlsx|excel)\b/iu.test(prompt)) {
        return "spreadsheets";
    }
    return "documents";
}
export function PluginStoreDetailView({ item, actions, describeEntry, onRetryDescribe, onUsePrompt, advanced, }) {
    const { intl, locale } = useZCodeIntl();
    const displayName = resolveItemDisplayName(item, locale);
    const description = resolveItemDescription(item, locale);
    const heroImage = item.listing?.heroImage;
    const examplePrompts = resolveLocalizedList(locale, item.listing?.examplePrompts, item.listing?.examplePromptsI18n) ??
        [];
    const describeMetadata = describeEntry?.status === "loaded" ? describeEntry.data?.metadata : undefined;
    const componentGroups = item.info
        ? buildInstalledPluginDisplayGroups(item.info)
        : describeEntry?.status === "loaded" && describeEntry.data
            ? describeResultToDisplayGroups(describeEntry.data)
            : [];
    const orderedGroups = SECTION_ORDER.map((kind) => componentGroups.find((group) => group.kind === kind)).filter((group) => group !== undefined);
    const componentsLoading = !item.info && (describeEntry?.status ?? "loading") === "loading";
    const componentsFailed = !item.info && describeEntry?.status === "error";
    return (_jsxs("div", { className: "space-y-8", "data-testid": "plugin-store-detail", "data-plugin-id": item.id, children: [_jsxs("div", { className: "space-y-3", children: [_jsx(PluginStoreAvatar, { item: item, className: "size-16 rounded-2xl", iconClassName: "size-6" }), _jsxs("div", { className: "flex min-w-0 items-center justify-between gap-3", "data-testid": "plugin-store-title-actions", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("h1", { className: "min-w-0 truncate text-2xl font-semibold tracking-tight text-foreground", children: displayName }), _jsx(PluginStorePaidPlanBadge, { item: item })] }), _jsx("div", { className: "flex shrink-0 items-center gap-1.5", children: item.installed ? (_jsxs(_Fragment, { children: [_jsx(PluginStoreItemMenu, { item: item, actions: actions, triggerVariant: "outline", triggerSize: "icon-lg" }), _jsxs(Button, { type: "button", variant: "default", size: "lg", "data-testid": "plugin-store-try-now", "data-plugin-id": item.id, onClick: () => onUsePrompt(item, ""), children: [_jsx(MessagesSquare, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.store.tryNow" })] })] })) : (_jsxs(_Fragment, { children: [actions.onResetConfig ? (_jsx(PluginStoreItemMenu, { item: item, actions: actions, triggerVariant: "outline", triggerSize: "icon-lg" })) : null, _jsx(PluginStoreInstallButton, { item: item, actions: actions, size: "lg" })] })) })] }), description ? (_jsx("p", { "data-testid": "plugin-store-description", className: "text-ui-base text-foreground-subtle", children: description })) : null, item.orphaned ? (_jsxs("p", { "data-testid": "plugin-store-source-degraded", "data-plugin-id": item.id, className: "flex items-center gap-1.5 text-ui-base text-warning", children: [_jsx(TriangleAlert, { className: "size-3.5 shrink-0", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.store.sourceMissing" })] })) : null] }), isTrustedImageUrl(heroImage) || examplePrompts.length > 0 ? (_jsx(HeroSection, { item: item, displayName: displayName, examplePrompts: examplePrompts, heroImage: heroImage, onUsePrompt: onUsePrompt })) : null, componentsLoading ? (_jsxs("div", { className: "flex items-center gap-2 py-2 text-ui-base text-foreground-subtle", "data-testid": "plugin-store-components-loading", children: [_jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }), _jsx("span", { children: intl.formatMessage({ id: "settings.plugins.marketplace.componentsLoading" }) })] })) : componentsFailed ? (_jsxs("div", { className: "flex items-center justify-between gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-ui-base text-foreground-subtle", "data-testid": "plugin-store-components-error", children: [_jsx("span", { children: intl.formatMessage({ id: "settings.plugins.marketplace.componentsError" }) }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", "data-testid": "plugin-store-components-retry", onClick: onRetryDescribe, children: [_jsx(RefreshCw, { className: "size-3", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.marketplace.componentsRetry" })] })] })) : (orderedGroups.map((group) => _jsx(ComponentSection, { group: group }, group.kind))), _jsx(InfoSection, { item: item, describeMetadata: describeMetadata }), advanced] }));
}
function HeroSection({ item, displayName, examplePrompts, heroImage, onUsePrompt, }) {
    const [heroFailed, setHeroFailed] = useState(false);
    const showHeroImage = isTrustedImageUrl(heroImage) && !heroFailed;
    const prompts = examplePrompts.map((prompt) => {
        const documentIcon = resolveExamplePromptDocumentIcon(prompt);
        return (_jsxs("button", { type: "button", "data-testid": "plugin-store-example-prompt", "data-plugin-id": item.id, 
            // 彩色 Hero 上统一使用参考图的深色半透明胶囊，不随底图有无切换为普通卡片。
            className: "group/prompt flex w-fit max-w-2xl items-center gap-2.5 rounded-3xl bg-black/75 px-3.5 py-2.5 text-left text-ui-base text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70", onClick: () => onUsePrompt(item, prompt), children: [_jsx("img", { src: EXAMPLE_PROMPT_DOCUMENT_ICON_URLS[documentIcon], alt: "", "aria-hidden": "true", className: "size-7 shrink-0 object-contain" }), _jsx("span", { className: "shrink-0 font-medium text-white/70", children: displayName }), _jsx("span", { className: "min-w-0 whitespace-normal", children: prompt }), _jsx("span", { "aria-hidden": "true", className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors group-hover/prompt:bg-white/25", children: _jsx(ArrowRight, { className: "size-4" }) })] }, prompt));
    });
    if (!showHeroImage && prompts.length === 0)
        return null;
    return (_jsxs("div", { className: "relative min-h-72 overflow-hidden rounded-3xl sm:aspect-[3/1] sm:min-h-0", "data-testid": "plugin-store-hero", children: [_jsx(ThemeHeroVisual, { className: "pointer-events-none absolute inset-0" }), showHeroImage ? (_jsx("img", { src: heroImage, alt: "", "aria-hidden": "true", draggable: false, className: "absolute inset-0 size-full select-none object-cover opacity-80", onError: () => setHeroFailed(true) })) : null, _jsx("div", { className: "absolute inset-0 bg-black/15", "data-testid": "plugin-store-hero-overlay", "aria-hidden": "true" }), prompts.length > 0 ? (_jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-4 p-5 sm:p-8", children: prompts })) : null] }));
}
function ComponentSection({ group }) {
    const { intl } = useZCodeIntl();
    const Icon = SECTION_ICONS[group.kind];
    return (_jsxs("section", { "data-testid": "plugin-store-component-section", "data-component-kind": group.kind, children: [_jsxs("div", { className: "flex items-baseline gap-2 border-b border-border pb-2", children: [_jsx("h2", { className: "text-ui-lg font-semibold text-foreground", children: intl.formatMessage({ id: SECTION_TITLE_IDS[group.kind] }) }), _jsx("span", { className: "text-ui-base text-foreground-subtle", children: group.count })] }), _jsx("ul", { className: "mt-1 divide-y divide-border/60", children: group.items.map((componentItem) => (_jsxs("li", { className: "flex min-w-0 items-center gap-3 py-2.5", children: [_jsx("span", { "aria-hidden": "true", className: "flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface text-foreground-subtle", children: _jsx(Icon, { className: "size-4" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "truncate text-ui-base font-medium text-foreground", children: componentItem.name }), componentItem.description ? (_jsx("div", { className: "mt-0.5 line-clamp-1 text-ui-base text-foreground-subtle", children: componentItem.description })) : null] })] }, componentItem.name))) })] }));
}
function InfoSection({ item, describeMetadata, }) {
    const { intl } = useZCodeIntl();
    const platform = useOptionalPlatform();
    const listing = item.listing;
    const developer = listing?.author ?? item.info?.author ?? describeMetadata?.author;
    const category = resolveStoreCategory(listing?.category);
    const categoryLabelId = category ? KNOWN_CATEGORY_LABEL_IDS[category] : undefined;
    const categoryLabel = category
        ? categoryLabelId
            ? intl.formatMessage({ id: categoryLabelId })
            : category
        : undefined;
    const version = item.info?.version ??
        item.installedMeta?.version ??
        item.summary?.version ??
        describeMetadata?.version;
    const website = pickHttpsUrl(listing?.homepage, item.info?.homepage, describeMetadata?.homepage);
    const privacyPolicy = pickHttpsUrl(listing?.privacyPolicy);
    const termsOfService = pickHttpsUrl(listing?.termsOfService);
    const rows = [];
    if (developer) {
        rows.push({
            key: "developer",
            label: intl.formatMessage({ id: "settings.plugins.store.info.developer" }),
            value: developer,
        });
    }
    if (categoryLabel) {
        rows.push({
            key: "category",
            label: intl.formatMessage({ id: "settings.plugins.store.info.category" }),
            value: categoryLabel,
        });
    }
    if (version) {
        rows.push({
            key: "version",
            label: intl.formatMessage({ id: "settings.plugins.store.info.version" }),
            value: version,
        });
    }
    const linkRows = [];
    if (website) {
        linkRows.push({
            key: "website",
            label: intl.formatMessage({ id: "settings.plugins.store.info.website" }),
            url: website,
        });
    }
    if (privacyPolicy) {
        linkRows.push({
            key: "privacyPolicy",
            label: intl.formatMessage({ id: "settings.plugins.store.info.privacyPolicy" }),
            url: privacyPolicy,
        });
    }
    if (termsOfService) {
        linkRows.push({
            key: "termsOfService",
            label: intl.formatMessage({ id: "settings.plugins.store.info.termsOfService" }),
            url: termsOfService,
        });
    }
    if (rows.length === 0 && linkRows.length === 0)
        return null;
    return (_jsxs("section", { children: [_jsx("div", { className: "border-b border-border pb-2", children: _jsx("h2", { className: "text-ui-lg font-semibold text-foreground", children: intl.formatMessage({ id: "settings.plugins.store.info.title" }) }) }), _jsxs("dl", { className: "mt-3 space-y-2.5", children: [rows.map((row) => (_jsxs("div", { className: "grid grid-cols-[8rem_minmax(0,1fr)] items-baseline gap-3", children: [_jsx("dt", { className: "text-ui-base text-foreground-subtle", children: row.label }), _jsx("dd", { className: "min-w-0 truncate text-ui-base text-foreground", children: row.value })] }, row.key))), linkRows.map((row) => (_jsxs("div", { className: "grid grid-cols-[8rem_minmax(0,1fr)] items-baseline gap-3", children: [_jsx("dt", { className: "text-ui-base text-foreground-subtle", children: row.label }), _jsx("dd", { className: "min-w-0", children: _jsx("button", { type: "button", title: row.url, "aria-label": `${row.label}: ${row.url}`, className: "inline-flex items-center gap-1 rounded-md text-ui-base text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onClick: () => platform?.openExternal(row.url), children: _jsx(ExternalLink, { className: "size-3.5", "aria-hidden": "true" }) }) })] }, row.key)))] })] }));
}
/** 外链只放行 https（信息区渲染层统一收口，schema 不做校验）。 */
function pickHttpsUrl(...candidates) {
    return candidates.find((candidate) => typeof candidate === "string" && candidate.startsWith("https://"));
}
/** 高级折叠区外壳：详情页底部的「更多详情」，内容由父级注入（rootPath/Hook 明细/配置）。 */
export function PluginStoreAdvancedSection({ children }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("details", { className: "group/advanced border-t border-border pt-4", "data-testid": "plugin-store-advanced", children: [_jsxs("summary", { className: "flex cursor-pointer list-none items-center gap-2 text-ui-base font-medium text-foreground-subtle transition-colors hover:text-foreground", children: [_jsx(ChevronRight, { className: "size-3.5 transition-transform group-open/advanced:rotate-90", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.detail.moreDetails" })] }), _jsx("div", { className: "mt-3 space-y-3", children: children })] }));
}
//# sourceMappingURL=PluginStoreDetailView.js.map