import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { CircleHelp, Loader2 } from "lucide-react";
import { ZCODE_AGENT_PROVIDER } from "@zcode/shared";
import { ThoughtLevelCycleControl } from "@/chat-input-toolbar/ThoughtLevelCycleControl.js";
export function SubagentReasoningField({ disabled, intl, labelVisibilityClassName, onValueCommit, state, }) {
    const triggerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const interactive = state.kind === "supported" && !disabled;
    useEffect(() => {
        if (!interactive) {
            // Radix Root 的 disabled 只禁用 trigger，不会关闭已 portal
            // 的菜单。字段失去 catalog 写权限时必须同步收回交互状态。
            setOpen(false);
        }
    }, [interactive]);
    if (state.kind === "not-applicable" || state.kind === "unsupported") {
        return null;
    }
    if (state.kind === "unknown") {
        const loading = state.status === "loading";
        const placeholderLabel = intl.formatMessage({
            id: loading ? "common.loading" : "settings.subagents.reasoningUnavailable",
        });
        return (_jsxs("span", { "aria-disabled": "true", "aria-label": placeholderLabel, "data-subagent-thought-level-loading": loading ? "true" : undefined, "data-subagent-thought-level-unavailable": loading ? undefined : "true", className: "inline-flex h-8 items-center gap-1 rounded-lg border border-input-border bg-input px-2 py-1.5 text-ui-base text-foreground-subtle", children: [loading ? (_jsx(Loader2, { className: "size-4 animate-spin", "aria-hidden": "true" })) : (_jsx(CircleHelp, { className: "size-4", "aria-hidden": "true" })), _jsx("span", { className: labelVisibilityClassName, children: placeholderLabel })] }));
    }
    return (_jsx(ThoughtLevelCycleControl, { intl: intl, option: state.option, provider: ZCODE_AGENT_PROVIDER, onCurrentValueCommit: onValueCommit, showInvalidCurrentValue: true, disabled: !interactive, open: interactive ? open : false, onOpenChange: (nextOpen) => {
            if (nextOpen && !interactive) {
                return;
            }
            setOpen(nextOpen);
        }, triggerRef: triggerRef, restoreFocusSelector: null, labelVisibilityClassName: labelVisibilityClassName, triggerClassName: "h-8 rounded-lg border border-input-border bg-input px-2 py-1.5 text-foreground hover:border-input-border-hover hover:bg-input", onValueChange: onValueCommit }));
}
//# sourceMappingURL=SubagentReasoningField.js.map