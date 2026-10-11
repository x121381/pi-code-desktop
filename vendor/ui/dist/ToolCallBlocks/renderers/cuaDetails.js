import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, XCircle } from "lucide-react";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { CuaScreenshotSection } from "../../ToolCallBlocks/renderers/CuaScreenshotSection.js";
import { CuaDetailListSection } from "../../ToolCallBlocks/renderers/cuaListDetails.js";
function asRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value)
        ? value
        : null;
}
function readText(record, key) {
    const value = record?.[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
}
function CuaDetailRows({ rows }) {
    const { intl } = useZCodeIntl();
    return (_jsx("dl", { className: "grid grid-cols-[minmax(4rem,auto)_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm", children: rows.map((row) => (_jsxs("div", { className: "contents", children: [_jsx("dt", { className: "text-foreground-subtlest", children: intl.formatMessage({ id: row.labelId }) }), _jsx("dd", { className: row.code
                        ? "min-w-0 break-all font-mono text-foreground"
                        : "min-w-0 break-words text-foreground", children: _jsxs("span", { className: "flex items-center gap-2", children: [row.status === true ? (_jsx(CheckCircle2, { className: "size-3.5 shrink-0 text-success" })) : null, row.status === false ? (_jsx(XCircle, { className: "size-3.5 shrink-0 text-destructive" })) : null, row.value] }) })] }, `${row.labelId}:${row.value}`))) }));
}
export function CuaToolCallDetails({ model, toolCall, }) {
    const { intl } = useZCodeIntl();
    const typedCount = readText(asRecord(toolCall.input), "text")?.length ?? 0;
    // 完整 tool call JSON 混入了面向用户的 CUA 详情，暴露内部生命周期字段并制造无效入口。
    // 原始数据继续保留在协议与持久化层；这里仅渲染用户完成操作所需的信息。
    return (_jsxs("div", { className: "space-y-3 rounded-xl border border-border bg-surface/40 p-3", children: [model.actionRows.length > 0 ? (_jsxs("section", { className: "space-y-2", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.cua.details.action" }) }), _jsx(CuaDetailRows, { rows: model.actionRows })] })) : null, _jsxs("section", { className: model.actionRows.length > 0 ? "space-y-2 border-t border-border pt-3" : "space-y-2", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.cua.details.result" }) }), _jsxs("div", { className: model.success
                            ? "flex items-center gap-2 text-sm text-foreground"
                            : "flex items-center gap-2 text-sm text-destructive", children: [model.success ? (_jsx(CheckCircle2, { className: "size-3.5 shrink-0" })) : (_jsx(XCircle, { className: "size-3.5 shrink-0" })), _jsx("span", { children: intl.formatMessage({ id: model.resultId }, model.resultValues ?? { count: String(typedCount) }) })] })] }), model.failureReasonId || model.failureReason ? (_jsxs("section", { className: "space-y-2 border-t border-border pt-3", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.cua.details.failureReason" }) }), _jsx("p", { className: "text-sm text-foreground", children: model.failureReasonId
                            ? intl.formatMessage({ id: model.failureReasonId })
                            : model.failureReason })] })) : null, model.suggestedActionId || model.suggestedAction ? (_jsxs("section", { className: "space-y-2 border-t border-border pt-3", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.cua.details.suggestedAction" }) }), _jsx("p", { className: "text-sm text-foreground", children: model.suggestedActionId
                            ? intl.formatMessage({ id: model.suggestedActionId })
                            : model.suggestedAction })] })) : null, model.screenshot ? _jsx(CuaScreenshotSection, { screenshot: model.screenshot }) : null, model.permissionRows?.length ? (_jsxs("section", { className: "space-y-2 border-t border-border pt-3", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.cua.details.permissions" }) }), _jsx(CuaDetailRows, { rows: model.permissionRows })] })) : null, model.environmentRows?.length ? (_jsxs("section", { className: "space-y-2 border-t border-border pt-3", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.cua.details.environment" }) }), _jsx(CuaDetailRows, { rows: model.environmentRows })] })) : null, model.list && model.list.items.length > 0 ? (_jsx(CuaDetailListSection, { list: model.list })) : null, model.stateRows.length > 0 ? (_jsxs("section", { className: "space-y-2 border-t border-border pt-3", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.cua.details.state" }) }), _jsx(CuaDetailRows, { rows: model.stateRows })] })) : null] }));
}
//# sourceMappingURL=cuaDetails.js.map