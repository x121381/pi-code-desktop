import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message.js";
import { ToolOutput } from "@/components/ai-elements/tool.js";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { getToolCallErrorText } from "@/lib/toolError.js";
import { extractPlanToolCallContent, getPlanFileLabel } from "@/lib/planToolCall.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ArrowRightIcon, CheckIcon, CopyIcon, NotepadTextIcon } from "lucide-react";
function isInteractiveDescendant(target, card) {
    if (!(target instanceof Element))
        return false;
    const interactive = target.closest("button, a, input, textarea, select, [role='button']");
    // 卡片自身带 role=button，旧 closest 会让卡片任意位置都命中自己，
    // 结果“点击卡片打开详情”从未执行。这里只拦截复制/展开/正文链接等真实子控件。
    return interactive !== null && interactive !== card;
}
export function SwitchModeToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const errorText = getToolCallErrorText(toolCall);
    const { markdown, planFilePath } = extractPlanToolCallContent(toolCall, context.workspacePath);
    const snapshotNotice = (_jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
            ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
            : undefined }));
    const hasMarkdown = typeof markdown === "string" && markdown.length > 0;
    const [copiedMarkdown, setCopiedMarkdown] = useState(null);
    const copied = copiedMarkdown === markdown;
    const openDetail = () => {
        if (!markdown || !context.onOpenPlanDetail)
            return;
        context.onOpenPlanDetail({
            toolCallId: toolCall.toolId,
            markdown,
            ...(planFilePath ? { planFilePath } : {}),
        });
    };
    const handleCardClick = (event) => {
        if (!isInteractiveDescendant(event.target, event.currentTarget))
            openDetail();
    };
    const handleCardKeyDown = (event) => {
        if (event.key !== "Enter" && event.key !== " ")
            return;
        // 内部按钮的 keydown 会继续冒泡到整卡，导致一次键盘操作重复打开详情。
        // 与点击路径共用交互元素判定，只允许整卡自身接管 Enter / Space。
        if (isInteractiveDescendant(event.target, event.currentTarget))
            return;
        event.preventDefault();
        openDetail();
    };
    const handleCopy = () => {
        if (!markdown || typeof navigator === "undefined" || !navigator.clipboard?.writeText)
            return;
        void navigator.clipboard.writeText(markdown).then(() => setCopiedMarkdown(markdown), () => setCopiedMarkdown(null));
    };
    if (hasMarkdown) {
        return (_jsxs(_Fragment, { children: [_jsxs("section", { role: context.onOpenPlanDetail ? "button" : undefined, tabIndex: context.onOpenPlanDetail ? 0 : undefined, "aria-label": intl.formatMessage({ id: "planTool.panel.open" }), onClick: handleCardClick, onKeyDown: handleCardKeyDown, className: "group w-full min-w-0 overflow-hidden rounded-xl border border-card-border bg-card text-foreground shadow-xs outline-none transition-colors hover:border-border-hover focus-visible:border-input-border-focused focus-visible:ring-2 focus-visible:ring-ring/40", children: [_jsxs("header", { className: "flex h-10 min-w-0 items-start gap-2 px-4 pt-4", children: [_jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [_jsx(NotepadTextIcon, { className: "size-4 shrink-0 text-foreground-subtle" }), _jsx("h3", { className: "text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({ id: "planTool.panel.planTab" }) })] }), planFilePath ? (_jsx("code", { className: "min-w-0 truncate text-ui-sm text-foreground-subtlest", title: planFilePath, children: getPlanFileLabel(planFilePath) })) : null, _jsx("div", { className: "ml-auto flex shrink-0 items-center gap-1", children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({
                                            id: copied ? "planTool.panel.copied" : "planTool.panel.copy",
                                        }), onClick: (event) => {
                                            event.stopPropagation();
                                            handleCopy();
                                        }, children: copied ? _jsx(CheckIcon, { className: "size-3.5" }) : _jsx(CopyIcon, { className: "size-3.5" }) }) })] }), _jsxs("div", { className: "relative overflow-hidden", children: [_jsx("div", { className: "max-h-64 overflow-hidden px-4 pt-2 pb-12 [mask-image:linear-gradient(to_bottom,black_0%,black_30%,transparent_100%)]", children: _jsx(MessageResponse, { className: "min-w-0 break-words text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_li]:text-foreground-subtle [&_p]:text-foreground-subtle", workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenExternalUrl: context.onOpenBrowserUrl, children: markdown }) }), _jsxs(Button, { type: "button", variant: "default", size: "lg", className: "absolute bottom-6 left-1/2 h-10 -translate-x-1/2 rounded-full !pr-4.5 pl-6 shadow-xs", onClick: (event) => {
                                        event.stopPropagation();
                                        openDetail();
                                    }, children: [intl.formatMessage({ id: "planTool.panel.viewFull" }), _jsx(ArrowRightIcon, { "data-icon": "inline-end", className: "size-4" })] })] })] }), snapshotNotice] }));
    }
    // switch_mode 的有效信息通常就是那段 markdown 结果，不应该再套一层通用工具卡片。
    // 只有当 provider 没给出 markdown、或者当前是失败态时，才回退到最小输出块，避免 UI 彻底空白。
    if (toolCall.output !== undefined || errorText) {
        return (_jsxs(_Fragment, { children: [_jsx(ToolOutput, { errorText: errorText, output: errorText ? undefined : toolCall.output }), snapshotNotice] }));
    }
    return snapshotNotice;
}
//# sourceMappingURL=switch-mode.js.map