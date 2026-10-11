import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { toolProgressSchema } from "@zcode/shared/zcode-protocol-v4";
export const TID_TOOL_CALL_PROGRESS = "tool-call-progress";
/** 从 legacy raw 读出投影的运行中进度（toolCallRowAdapter 透传 ToolCallRow.progress）。 */
export function readToolCallProgress(raw) {
    if (typeof raw !== "object" || raw === null)
        return null;
    const parsed = toolProgressSchema.safeParse(raw.progress);
    return parsed.success ? parsed.data : null;
}
/**
 * 工具摘要行里的细进度条（）：有 fraction 用 determinate，否则 indeterminate 扫光；
 * message 跟在后面。颜色只用 brand / surface token，遵守 DESIGN.md。
 */
export function ToolCallProgressIndicator({ progress }) {
    const fraction = progress.fraction;
    return (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", "data-testid": TID_TOOL_CALL_PROGRESS, ...(fraction !== undefined ? { "data-fraction": fraction.toFixed(3) } : {}), role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 1, ...(fraction !== undefined ? { "aria-valuenow": fraction } : {}), children: [_jsx("span", { className: "text-foreground-subtlest", children: "\u00B7" }), _jsx("span", { className: "relative inline-block h-1 w-16 shrink-0 overflow-hidden rounded-full bg-surface-hover", children: fraction !== undefined ? (_jsx("span", { className: "absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-200", style: { width: `${Math.round(fraction * 100)}%` } })) : (_jsx("span", { className: "tool-call-progress-indeterminate absolute inset-y-0 w-1/3 rounded-full bg-brand" })) }), progress.message ? (_jsx("span", { className: "min-w-0 truncate text-ui-sm text-foreground-subtle", children: progress.message })) : null] }));
}
//# sourceMappingURL=ToolCallProgressIndicator.js.map