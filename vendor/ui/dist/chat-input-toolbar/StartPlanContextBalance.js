import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodingPlanEntryButton } from "@/settings/CodingPlanEntryButton.js";
import { Loader2Icon, RocketIcon } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { CodingPlanBillingDiscountBadgePill, CodingPlanBillingDiscountInfoDialog, useCodingPlanBillingDiscount, } from "@/CodingPlanBillingDiscount.js";
import { getContextQuotaMeterGridClass } from "@/chat-input-toolbar/contextQuotaMeterGrid.js";
import { formatStartPlanBucketResetTime } from "@/lib/codingPlanQuotaPresentation.js";
import { formatQuotaModelDisplayName } from "@/settings/model-provider-section/quotaModelDisplayName.js";
function resolveLimitTotal(limit) {
    return limit.number ?? limit.unit ?? 0;
}
function resolveLimitRemaining(limit) {
    return limit.remaining ?? 0;
}
function formatStartPlanRemainingPercentage(ratio, locale) {
    const boundedRatio = Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
    return new Intl.NumberFormat(locale || undefined, {
        maximumFractionDigits: 0,
        style: "percent",
    }).format(boundedRatio);
}
function formatModelCode(modelCode) {
    const normalized = modelCode.replace(/^model:/i, "");
    if (normalized.toLowerCase() === "glm-5-turbo") {
        return "GLM-5Turbo";
    }
    return normalized.toUpperCase();
}
function formatLimitModels(limit) {
    const modelNames = limit.usageDetails
        .map((detail) => {
        const displayName = detail.displayName?.trim();
        return formatQuotaModelDisplayName(displayName || formatModelCode(detail.modelCode.trim()));
    })
        .filter((modelName) => modelName.length > 0);
    if (modelNames.length === 0) {
        return limit.type;
    }
    return modelNames.join(" / ");
}
function getVisibleStartPlanLimits(snapshot) {
    return (snapshot?.quota?.limits ?? []).filter((limit) => {
        const total = resolveLimitTotal(limit);
        const remaining = resolveLimitRemaining(limit);
        return total > 0 || remaining > 0;
    });
}
export function hasChatStartPlanBalance(config) {
    if (!config) {
        return false;
    }
    return (config.loading ||
        getVisibleStartPlanLimits(config.snapshot).length > 0 ||
        // Start Plan 与 Coding Plan 连接方式互斥，hover 刷新入口不能只挂在 Coding Plan
        // 配置上；首次无缓存快照时本段（含触发器）不渲染，用户没有 hover 入口发起第一次余额请求。
        // onAccess 存在即视为可按需刷新，保留触发器（对齐 hasChatCodingPlanUsageRemaining 的兜底）。
        Boolean(config.onAccess));
}
function ChatStartPlanBalanceMeter({ limit, locale, }) {
    const total = resolveLimitTotal(limit);
    const remaining = resolveLimitRemaining(limit);
    const remainingRatio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
    // 桶刷新时间只来自本桶 expires_at（nextResetTime）；不再用套餐级 renewTime
    // 或全局聚合时间兜底，否则多套餐下会把同一时间复制进每个桶。
    const renewTime = formatStartPlanBucketResetTime(locale, limit.nextResetTime);
    return (_jsxs("div", { className: "min-w-0 space-y-1.5", children: [_jsxs("div", { className: "min-w-0 space-y-0.5 text-ui-sm", children: [_jsx("div", { className: "min-w-0 truncate text-foreground-subtle", children: formatLimitModels(limit) }), _jsxs("div", { className: "min-w-0 text-ui-sm tabular-nums", children: [_jsx("span", { className: "font-mono text-foreground", children: formatStartPlanRemainingPercentage(remainingRatio, locale) }), renewTime ? (_jsxs("span", { className: "text-foreground-subtle", children: [" \u00B7 ", renewTime] })) : null] })] }), _jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-surface-hover", children: _jsx("div", { className: "h-full rounded-full bg-success transition-[width] duration-500 ease-out motion-reduce:transition-none", style: { width: `${remainingRatio * 100}%` } }) })] }));
}
export function ChatStartPlanBalancePanel({ config, intl, locale, separated = false, }) {
    const billingDiscount = useCodingPlanBillingDiscount();
    const upgradeButtonHighlighted = billingDiscount.active === true;
    const limits = getVisibleStartPlanLimits(config.snapshot);
    if (!config.loading && limits.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: separated ? "border-t border-border pt-2" : undefined, children: [_jsxs("div", { className: "mb-2 flex min-w-0 items-center gap-3", children: [_jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-1.5", children: [_jsx("span", { className: "min-w-0 truncate text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.modelProvider.startPlan.balance.title" }) }), config.loading || config.refreshing === true ? (_jsx(Loader2Icon, { className: "size-3.5 shrink-0 animate-spin text-foreground-subtle" })) : null] }), config.onUpgradeClick ? (_jsxs("div", { className: "inline-flex shrink-0 items-center gap-1", children: [_jsxs(CodingPlanEntryButton, { type: "button", size: "xs", className: cn("h-6 shrink-0 gap-1 px-2 text-ui-sm", upgradeButtonHighlighted &&
                                    "button-gradient rounded-full pr-[5px] text-white hover:bg-transparent hover:opacity-90 dark:bg-[#484A58] dark:hover:bg-[#484A58]"), onClick: (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    config.onUpgradeClick?.();
                                }, children: [_jsx(RocketIcon, { className: "size-3" }), intl.formatMessage({ id: "chat.quota.action.upgrade" }), upgradeButtonHighlighted ? (_jsx(CodingPlanBillingDiscountBadgePill, { config: billingDiscount.config, iconVisible: false, size: "compact", variant: "surface" })) : null] }), upgradeButtonHighlighted ? (_jsx(CodingPlanBillingDiscountInfoDialog, { config: billingDiscount.config })) : null] })) : null] }), _jsx("div", { className: cn("grid gap-2", getContextQuotaMeterGridClass(limits.length)), children: limits.map((limit) => (_jsx(ChatStartPlanBalanceMeter, { limit: limit, locale: locale }, `${limit.type}:${formatLimitModels(limit)}`))) })] }));
}
//# sourceMappingURL=StartPlanContextBalance.js.map