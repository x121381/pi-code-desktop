/*
 * Derived from vercel/ai-elements (packages/elements/src/context.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "../ui/button.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card.js";
import { Progress } from "../ui/progress.js";
import { cn } from "../lib/utils.js";
import { Loader2 } from "lucide-react";
import { createContext, useContext, useMemo } from "react";
import { getUsage } from "tokenlens";
import { formatCompactTokenNumber } from "../../lib/tokenNumberFormat.js";
const PERCENT_MAX = 100;
const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 4;
const ContextContext = createContext(null);
function formatFullNumber(value) {
    return new Intl.NumberFormat(undefined).format(value);
}
function formatUsagePercent(usedTokens, maxTokens) {
    if (maxTokens <= 0) {
        return 0;
    }
    return Math.min(Math.max(usedTokens / maxTokens, 0), 1);
}
const useContextValue = () => {
    const context = useContext(ContextContext);
    if (!context) {
        throw new Error("Context components must be used within Context");
    }
    return context;
};
export const Context = ({ usedTokens, maxTokens, usage, modelId, ...props }) => {
    const contextValue = useMemo(() => ({ maxTokens, modelId, usage, usedTokens }), [maxTokens, modelId, usage, usedTokens]);
    return (_jsx(ContextContext.Provider, { value: contextValue, children: _jsx(HoverCard, { closeDelay: 0, openDelay: 0, ...props }) }));
};
const ContextIcon = () => {
    const { usedTokens, maxTokens } = useContextValue();
    const circumference = 2 * Math.PI * ICON_RADIUS;
    const usedPercent = formatUsagePercent(usedTokens, maxTokens);
    const dashOffset = circumference * (1 - usedPercent);
    return (_jsxs("svg", { "aria-hidden": "true", className: "size-3.5", focusable: "false", style: { color: "currentcolor" }, viewBox: `0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`, children: [_jsx("circle", { cx: ICON_CENTER, cy: ICON_CENTER, fill: "none", opacity: "0.25", r: ICON_RADIUS, stroke: "currentColor", strokeWidth: ICON_STROKE_WIDTH }), _jsx("circle", { cx: ICON_CENTER, cy: ICON_CENTER, fill: "none", opacity: "0.7", r: ICON_RADIUS, stroke: "currentColor", strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: dashOffset, strokeLinecap: "round", strokeWidth: ICON_STROKE_WIDTH, style: { transform: "rotate(-90deg)", transformOrigin: "center" } })] }));
};
export const ContextTrigger = ({ children, loading = false, ...props }) => {
    return (_jsx(HoverCardTrigger, { asChild: true, children: children ?? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-md", ...props, className: cn(props.className), children: loading ? (_jsx(Loader2, { className: "size-3.5 animate-spin motion-reduce:animate-none", "aria-hidden": "true" })) : (_jsx(ContextIcon, {})) })) }));
};
export const ContextContent = ({ className, ...props }) => (_jsx(HoverCardContent, { className: cn("!w-64 overflow-hidden rounded-lg border border-border bg-tooltip p-0 text-tooltip-foreground shadow-none ring-0 outline-0", className), ...props }));
export const ContextContentHeader = ({ action, children, className, progressSegments, ...props }) => {
    const { usedTokens, maxTokens } = useContextValue();
    const usedPercent = formatUsagePercent(usedTokens, maxTokens);
    const displayPct = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 1,
        style: "percent",
    }).format(usedPercent);
    const used = formatFullNumber(usedTokens);
    const total = formatFullNumber(maxTokens);
    return (_jsx("div", { className: cn("w-full space-y-2 p-3", className), ...props, children: children ?? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("p", { className: "text-ui-base font-medium text-foreground-subtle", children: "Context" }), action] }), _jsx("div", { className: "border-t border-border" }), _jsxs("div", { className: "flex items-center justify-between gap-3 text-ui-base text-foreground-subtle", children: [_jsx("p", { className: "text-ui-lg font-medium text-foreground", children: displayPct }), _jsxs("p", { children: [used, " / ", total] })] }), _jsx(Progress, { className: "h-2 bg-surface", indicatorClassName: "min-w-2", segments: progressSegments, value: usedPercent * PERCENT_MAX })] })) }));
};
export const ContextContentBody = ({ children, className, ...props }) => (_jsx("div", { className: cn("w-full bg-menu p-3", className), ...props, children: children }));
export const ContextContentFooter = ({ children, className, ...props }) => {
    const { modelId, usage } = useContextValue();
    const costUSD = modelId
        ? getUsage({
            modelId,
            usage: {
                input: usage?.inputTokens ?? 0,
                output: usage?.outputTokens ?? 0,
            },
        }).costUSD?.totalUSD
        : undefined;
    const totalCost = new Intl.NumberFormat(undefined, {
        currency: "USD",
        style: "currency",
    }).format(costUSD ?? 0);
    return (_jsx("div", { className: cn("flex w-full items-center justify-between gap-3 border-t border-popover-border bg-surface p-3 text-ui-base", className), ...props, children: children ?? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-muted-foreground", children: "Total cost" }), _jsx("span", { children: totalCost })] })) }));
};
const TokensWithCost = ({ tokens, costText }) => (_jsxs("span", { children: [tokens === undefined ? "—" : formatCompactTokenNumber("", tokens), costText ? _jsxs("span", { className: "ml-2 text-muted-foreground", children: ["\u2022 ", costText] }) : null] }));
export const ContextInputUsage = ({ className, children, ...props }) => {
    const { usage, modelId } = useContextValue();
    const inputTokens = usage?.inputTokens ?? 0;
    if (children) {
        return children;
    }
    if (!inputTokens) {
        return null;
    }
    const inputCost = modelId
        ? getUsage({
            modelId,
            usage: { input: inputTokens, output: 0 },
        }).costUSD?.totalUSD
        : undefined;
    const inputCostText = new Intl.NumberFormat(undefined, {
        currency: "USD",
        style: "currency",
    }).format(inputCost ?? 0);
    return (_jsxs("div", { className: cn("flex items-center justify-between text-ui-base", className), ...props, children: [_jsx("span", { className: "text-foreground-subtle", children: "Input" }), _jsx(TokensWithCost, { costText: inputCostText, tokens: inputTokens })] }));
};
export const ContextOutputUsage = ({ className, children, ...props }) => {
    const { usage, modelId } = useContextValue();
    const outputTokens = usage?.outputTokens ?? 0;
    if (children) {
        return children;
    }
    if (!outputTokens) {
        return null;
    }
    const outputCost = modelId
        ? getUsage({
            modelId,
            usage: { input: 0, output: outputTokens },
        }).costUSD?.totalUSD
        : undefined;
    const outputCostText = new Intl.NumberFormat(undefined, {
        currency: "USD",
        style: "currency",
    }).format(outputCost ?? 0);
    return (_jsxs("div", { className: cn("flex items-center justify-between text-ui-base", className), ...props, children: [_jsx("span", { className: "text-foreground-subtle", children: "Output" }), _jsx(TokensWithCost, { costText: outputCostText, tokens: outputTokens })] }));
};
export const ContextReasoningUsage = ({ className, children, ...props }) => {
    const { usage, modelId } = useContextValue();
    const reasoningTokens = usage?.reasoningTokens ?? 0;
    if (children) {
        return children;
    }
    if (!reasoningTokens) {
        return null;
    }
    const reasoningCost = modelId
        ? getUsage({
            modelId,
            usage: { reasoningTokens },
        }).costUSD?.totalUSD
        : undefined;
    const reasoningCostText = new Intl.NumberFormat(undefined, {
        currency: "USD",
        style: "currency",
    }).format(reasoningCost ?? 0);
    return (_jsxs("div", { className: cn("flex items-center justify-between text-ui-base", className), ...props, children: [_jsx("span", { className: "text-foreground-subtle", children: "Reasoning" }), _jsx(TokensWithCost, { costText: reasoningCostText, tokens: reasoningTokens })] }));
};
export const ContextCacheUsage = ({ className, children, ...props }) => {
    const { usage, modelId } = useContextValue();
    const cacheTokens = usage?.cachedInputTokens ?? 0;
    if (children) {
        return children;
    }
    if (!cacheTokens) {
        return null;
    }
    const cacheCost = modelId
        ? getUsage({
            modelId,
            usage: { cacheReads: cacheTokens, input: 0, output: 0 },
        }).costUSD?.totalUSD
        : undefined;
    const cacheCostText = new Intl.NumberFormat(undefined, {
        currency: "USD",
        style: "currency",
    }).format(cacheCost ?? 0);
    return (_jsxs("div", { className: cn("flex items-center justify-between text-ui-base", className), ...props, children: [_jsx("span", { className: "text-foreground-subtle", children: "Cache" }), _jsx(TokensWithCost, { costText: cacheCostText, tokens: cacheTokens })] }));
};
//# sourceMappingURL=context.js.map