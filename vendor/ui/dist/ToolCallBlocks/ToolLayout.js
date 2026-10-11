import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useEffect, useRef, useState } from "react";
import { Collapsible, CollapsibleContent } from "../components/ui/collapsible.js";
import { Button } from "../components/ui/button.js";
import { cn } from "../components/lib/utils.js";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "../components/ui/tooltip.js";
import { ToolSummaryRow } from "../ToolCallBlocks/ToolSummaryRow.js";
import { uiMemoryDiagnosticsRegistry } from "../lib/memoryDiagnostics.js";
const toolLayoutOpenState = new Map();
// 内存诊断计数器：该表按 toolId 只增不减，先落日志。
uiMemoryDiagnosticsRegistry.register("toolLayout", () => ({ openState: toolLayoutOpenState.size }));
const TOOL_CONTENT_COLLAPSE_UNMOUNT_DELAY_MS = 300;
const TOOL_CONTENT_SHELL_CLASSNAME = "text-popover-foreground outline-none";
const TOOL_CONTENT_SPACING_CLASSNAME = "pt-2";
function ToolLayoutComponent({ toolId, persistOpenKey, icon, showIcon = true, canToggle = true, forceOpen = false, autoOpen = false, autoCollapseOnComplete = false, kindLabel, expandedKindLabel, kindDetail, expandedKindDetail, sourceLabel, primaryText, prioritizePrimaryText = false, expandedPrimaryText, secondaryText, expandedSecondaryText, summaryContentSeparator, animateSummaryContent = false, disableSummaryContentAnimation = false, summaryContentKey, summaryContentRefreshVersion, hideSecondaryTextWhenOpen = false, diffCount, hideDiffCountWhenOpen = false, statusLabel, statusTooltip, statusIndicator, showStatusLabel = false, showFailureStatus = false, isRunning = false, title, expandedTitle, content, renderContent, summaryAction, }) {
    const { intl } = useZCodeIntl();
    const resolvedPersistOpenKey = persistOpenKey ?? toolId;
    const [isOpen, setIsOpen] = useState(() => toolLayoutOpenState.get(resolvedPersistOpenKey) ?? false);
    const hasSummaryAction = summaryAction !== undefined;
    const isExpanded = !hasSummaryAction && (forceOpen || (canToggle && isOpen));
    const [shouldRenderContent, setShouldRenderContent] = useState(isExpanded);
    const [isFailureTooltipCopied, setIsFailureTooltipCopied] = useState(false);
    const failureTooltipCopyResetRef = useRef(null);
    const contentUnmountDelayRef = useRef(null);
    const hasAutoOpenedRef = useRef(false);
    const previousIsRunningRef = useRef(isRunning);
    const shouldShowStatusLabel = (showStatusLabel || showFailureStatus) && statusLabel != null;
    const shouldRenderResolvedContent = !hasSummaryAction && (isExpanded || shouldRenderContent);
    const resolvedContent = shouldRenderResolvedContent
        ? (renderContent?.() ?? content ?? null)
        : null;
    const summaryPrimaryText = isExpanded && expandedPrimaryText != null ? expandedPrimaryText : primaryText;
    const summaryKindLabel = isExpanded && expandedKindLabel != null ? expandedKindLabel : kindLabel;
    const summaryKindDetail = isExpanded && expandedKindDetail !== undefined ? expandedKindDetail : kindDetail;
    const summarySecondaryText = isExpanded && expandedSecondaryText !== undefined
        ? expandedSecondaryText
        : isExpanded && hideSecondaryTextWhenOpen
            ? null
            : secondaryText;
    const summaryTitle = isExpanded && expandedTitle !== undefined ? expandedTitle : title;
    const resolvedSummaryContentKey = summaryContentKey ?? `${String(summaryTitle ?? "")}:${String(statusLabel ?? "")}`;
    const shouldShowDiffCount = diffCount != null && !(isExpanded && hideDiffCountWhenOpen);
    // toolcall 在流式期间数量多且持续更新，旋转 loading 图标会让
    // 动画长期占用渲染资源；运行态改由文案扫光和状态文字表达，图标保持静态。
    const summaryIcon = icon;
    // 运行态需要保留 kind 文案扫光，用来表达当前工具仍在进行中；
    // 非运行态仍保持最浅文本色，避免摘要信息喧宾夺主。
    const kindLabelClassName = cn("font-medium whitespace-nowrap shrink-0", isRunning ? "animated-gradient-text" : "text-foreground-subtlest");
    useEffect(() => {
        const persistedOpen = toolLayoutOpenState.get(resolvedPersistOpenKey);
        setIsOpen(persistedOpen ?? false);
    }, [resolvedPersistOpenKey]);
    useEffect(() => {
        // edit/read 这类工具有“完成后默认自动展开”的需求，
        // 但 forceOpen 会把卡片彻底锁死成不可收起。
        // 这里改成一次性的 autoOpen：首次满足条件时自动展开一次，之后仍允许用户手动关闭。
        if (!autoOpen || hasAutoOpenedRef.current) {
            return;
        }
        toolLayoutOpenState.set(resolvedPersistOpenKey, true);
        setShouldRenderContent(true);
        setIsOpen(true);
        hasAutoOpenedRef.current = true;
    }, [autoOpen, resolvedPersistOpenKey]);
    useEffect(() => {
        const wasRunning = previousIsRunningRef.current;
        previousIsRunningRef.current = isRunning;
        // 子智能体在执行完成后，如果继续保持展开，会把一长串子工具明细永久摊开，
        // 聊天流里会迅速变得很长，也和“运行中自动展开、完成后回到摘要”这套交互不一致。
        // 这里只在 running -> completed 的边沿自动收起一次，不影响用户后续手动再次展开查看细节。
        if (autoCollapseOnComplete && !isRunning && wasRunning) {
            toolLayoutOpenState.set(resolvedPersistOpenKey, false);
            setIsOpen(false);
        }
    }, [autoCollapseOnComplete, isRunning, resolvedPersistOpenKey]);
    useEffect(() => {
        if (isExpanded) {
            if (contentUnmountDelayRef.current !== null) {
                window.clearTimeout(contentUnmountDelayRef.current);
                contentUnmountDelayRef.current = null;
            }
            setShouldRenderContent(true);
            return;
        }
        if (!shouldRenderContent) {
            return;
        }
        // 收起工具详情时不能立刻卸载 children。
        // Radix 会在 closed 动画里读取 --radix-collapsible-content-height；
        // 如果子内容先被卸载，内层高度变量会消失并继承外层历史消息的高度，
        // 导致详情区域短暂撑成超高空白块，下面内容看起来像全部闪没了。
        contentUnmountDelayRef.current = window.setTimeout(() => {
            setShouldRenderContent(false);
            contentUnmountDelayRef.current = null;
        }, TOOL_CONTENT_COLLAPSE_UNMOUNT_DELAY_MS);
        return () => {
            if (contentUnmountDelayRef.current !== null) {
                window.clearTimeout(contentUnmountDelayRef.current);
                contentUnmountDelayRef.current = null;
            }
        };
    }, [isExpanded, shouldRenderContent]);
    useEffect(() => {
        return () => {
            if (failureTooltipCopyResetRef.current !== null) {
                window.clearTimeout(failureTooltipCopyResetRef.current);
            }
            if (contentUnmountDelayRef.current !== null) {
                window.clearTimeout(contentUnmountDelayRef.current);
            }
        };
    }, []);
    const handleCopyFailureTooltip = () => {
        if (typeof statusTooltip !== "string" || statusTooltip.trim().length === 0) {
            return;
        }
        navigator.clipboard.writeText(statusTooltip).then(() => {
            setIsFailureTooltipCopied(true);
            if (failureTooltipCopyResetRef.current !== null) {
                window.clearTimeout(failureTooltipCopyResetRef.current);
            }
            failureTooltipCopyResetRef.current = window.setTimeout(() => {
                setIsFailureTooltipCopied(false);
                failureTooltipCopyResetRef.current = null;
            }, 1500);
        });
    };
    const statusWordNode = shouldShowStatusLabel && statusLabel != null ? (statusTooltip ? (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("span", { className: "whitespace-nowrap underline decoration-dotted underline-offset-2 cursor-help", children: statusLabel }) }), _jsx(TooltipContent, { side: "top", align: "start", className: "max-w-96", children: _jsxs("div", { className: "flex max-w-96 items-center gap-2", children: [_jsx("span", { className: "line-clamp-3 min-w-0 flex-1 whitespace-pre-wrap break-words", children: statusTooltip }), typeof statusTooltip === "string" && statusTooltip.trim().length > 0 ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-md", className: "shrink-0", onClick: (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleCopyFailureTooltip();
                                }, title: intl.formatMessage({
                                    id: isFailureTooltipCopied
                                        ? "chat.toolCall.copyError.copied"
                                        : "chat.toolCall.copyError",
                                }), "aria-label": intl.formatMessage({
                                    id: isFailureTooltipCopied
                                        ? "chat.toolCall.copyError.copied"
                                        : "chat.toolCall.copyError",
                                }), children: isFailureTooltipCopied ? (_jsx(CheckIcon, { className: "size-3" })) : (_jsx(CopyIcon, { className: "size-3" })) })) : null] }) })] }) })) : (_jsx("span", { className: "whitespace-nowrap", children: statusLabel }))) : null;
    const statusNode = statusWordNode !== null && statusIndicator != null ? (_jsxs("span", { className: "inline-flex shrink-0 items-center gap-1.5", children: [statusIndicator, statusWordNode] })) : (statusWordNode);
    return (_jsxs(Collapsible, { open: !hasSummaryAction && (forceOpen || (canToggle && isOpen)), onOpenChange: (open) => {
            if (hasSummaryAction || forceOpen) {
                return;
            }
            toolLayoutOpenState.set(resolvedPersistOpenKey, open);
            if (open) {
                setShouldRenderContent(true);
            }
            setIsOpen(open);
        }, className: "w-full flex flex-col", children: [_jsx(ToolSummaryRow, { action: summaryAction, animateContent: animateSummaryContent, canToggle: canToggle, contentKey: resolvedSummaryContentKey, contentRefreshVersion: summaryContentRefreshVersion, diffCount: shouldShowDiffCount ? diffCount : undefined, disableContentAnimation: disableSummaryContentAnimation, forceOpen: forceOpen, icon: summaryIcon, isExpanded: isExpanded, kindDetail: summaryKindDetail, kindLabel: summaryKindLabel, kindLabelClassName: kindLabelClassName, primaryText: summaryPrimaryText, prioritizePrimaryText: prioritizePrimaryText, secondaryText: summarySecondaryText, separator: summaryContentSeparator, showIcon: showIcon, sourceLabel: sourceLabel, statusNode: statusNode, title: summaryTitle, toggleAriaLabel: intl.formatMessage({
                    id: isExpanded ? "chat.toolCall.collapseDetails" : "chat.toolCall.expandDetails",
                }), toolId: toolId }), !hasSummaryAction && canToggle ? (_jsx(CollapsibleContent, { className: TOOL_CONTENT_SHELL_CLASSNAME, children: _jsx("div", { className: TOOL_CONTENT_SPACING_CLASSNAME, children: resolvedContent }) })) : !hasSummaryAction && forceOpen ? (_jsx("div", { className: cn(TOOL_CONTENT_SHELL_CLASSNAME, TOOL_CONTENT_SPACING_CLASSNAME), children: resolvedContent })) : null] }));
}
export const ToolLayout = memo(ToolLayoutComponent);
ToolLayout.displayName = "ToolLayout";
//# sourceMappingURL=ToolLayout.js.map