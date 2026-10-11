import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Save } from "lucide-react";
import { useMemo } from "react";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "../../ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ToolLayout } from "../ToolLayout.js";
const SAVE_WORKFLOW_TOOL_ICON = _jsx(Save, { className: "size-4 shrink-0 text-foreground-subtle" });
/**
 * 覆盖徽标的样式：与 CreateWorkflow 结果卡的 compiled 小签同族（镌刻小签——rounded-xs +
 * 大写等宽微标签），只把语义色换成 warning。用 warning 而不是 destructive 是刻意的：
 * 文件是被**替换**，不是被删除，destructive 会过度表达；而覆盖是真实的语义状态，
 * 不属于 DESIGN.md 禁止的「借语义色让区块更响」。
 */
const OVERWRITE_BADGE_CLASSNAME = "shrink-0 rounded-xs border border-warning/40 px-1.5 py-0.5 font-mono text-ui-xs uppercase tracking-wf-label leading-none text-warning";
function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readTrimmedString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
function readArgDeclarations(value) {
    if (!isPlainRecord(value)) {
        return [];
    }
    const declarations = [];
    for (const [name, declaration] of Object.entries(value)) {
        if (!isPlainRecord(declaration)) {
            continue;
        }
        declarations.push({
            name,
            type: readTrimmedString(declaration.type),
            description: readTrimmedString(declaration.description),
            required: declaration.required === true,
            hasDefault: "default" in declaration,
            defaultValue: declaration.default,
        });
    }
    return declarations;
}
export function readSaveWorkflowInput(input) {
    const record = isPlainRecord(input) ? input : {};
    return {
        name: readTrimmedString(record.name),
        description: readTrimmedString(record.description),
        whenToUse: readTrimmedString(record.whenToUse),
        path: readTrimmedString(record.path),
        scope: readTrimmedString(record.scope),
        shadowing: record.shadowing === "hides_global" || record.shadowing === "hidden_by_project"
            ? record.shadowing
            : undefined,
        // 只有显式 true 才是覆盖：字段缺席时说不出「已经有一个文件在那儿」，
        // 就不能让确认窗替用户断言这件事。
        overwrite: record.overwrite === true,
        script: typeof record.script === "string" && record.script.length > 0 ? record.script : undefined,
        args: readArgDeclarations(record.args),
    };
}
export function SaveWorkflowOverwriteBadge({ label }) {
    return (_jsx("span", { className: OVERWRITE_BADGE_CLASSNAME, "data-workflow-overwrite-badge": "true", children: label }));
}
/**
 * 全局作用域折叠行小标：与 overwrite 徽标同一族（镌刻小签），语义色改为 foreground-subtle——
 * 它只是一个作用域说明，不是警示状态，不借 warning / destructive。
 */
const SCOPE_BADGE_CLASSNAME = "shrink-0 rounded-xs border border-border px-1.5 py-0.5 font-mono text-ui-xs uppercase tracking-wf-label leading-none text-foreground-subtle";
function SaveWorkflowScopeBadge({ label }) {
    return (_jsx("span", { className: SCOPE_BADGE_CLASSNAME, "data-workflow-scope-badge": "global", children: label }));
}
/**
 * SaveWorkflow 的聊天卡：刻意紧凑——名字、覆盖标记、说明。
 *
 * 完整内容（落点、args 声明表、脚本）归确认窗：那才是用户做决定的地方，而这张卡是决定
 * 之后的一行记录。
 */
export function SaveWorkflowToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const saved = useMemo(() => readSaveWorkflowInput(toolCall.input), [toolCall.input]);
    const kindLabel = intl.formatMessage({
        id: context.isRunning
            ? "chat.toolCall.workflow.save.saving"
            : "chat.toolCall.workflow.save.saved",
    });
    const fallbackName = intl.formatMessage({ id: "chat.toolCall.workflow.fallbackName" });
    const overwriteLabel = intl.formatMessage({ id: "chat.toolCall.workflow.save.overwrite" });
    const pathLabel = intl.formatMessage({ id: "chat.permission.workflow.save.path" });
    const whenToUseLabel = intl.formatMessage({ id: "chat.permission.workflow.save.whenToUse" });
    const isGlobalScope = saved.scope === "global";
    const isProjectScope = saved.scope === "project";
    const scopeLabel = intl.formatMessage({ id: "chat.toolCall.workflow.save.scope.label" });
    const globalBadgeLabel = intl.formatMessage({ id: "chat.toolCall.workflow.scope.global" });
    const scopeValue = isGlobalScope
        ? intl.formatMessage({ id: "chat.toolCall.workflow.save.scope.global" })
        : isProjectScope
            ? intl.formatMessage({ id: "chat.toolCall.workflow.save.scope.project" })
            : null;
    const shadowingLabel = saved.shadowing === "hides_global"
        ? intl.formatMessage({ id: "chat.toolCall.workflow.save.scope.hidesGlobal" })
        : saved.shadowing === "hidden_by_project"
            ? intl.formatMessage({ id: "chat.toolCall.workflow.save.scope.hiddenByProject" })
            : null;
    const primaryText = useMemo(() => (_jsx("span", { className: "truncate font-mono text-foreground-subtlest", children: saved.name ?? fallbackName })), [fallbackName, saved.name]);
    const kindDetail = useMemo(() => 
    // 折叠行：全局档加一个「全局」小标，与 overwrite 徽标同排（未知/项目档不加）。
    saved.overwrite || isGlobalScope ? (_jsxs("span", { className: "flex items-center gap-1", children: [saved.overwrite ? _jsx(SaveWorkflowOverwriteBadge, { label: overwriteLabel }) : null, isGlobalScope ? _jsx(SaveWorkflowScopeBadge, { label: globalBadgeLabel }) : null] })) : null, [globalBadgeLabel, isGlobalScope, overwriteLabel, saved.overwrite]);
    const renderContent = useMemo(() => () => (_jsxs("div", { className: "mb-2 space-y-1.5", children: [saved.description === undefined ? null : (_jsx("p", { className: "min-w-0 whitespace-pre-wrap break-words text-ui-base leading-5 text-foreground-subtle", children: saved.description })), scopeValue === null ? null : (_jsxs("p", { className: "flex min-w-0 items-baseline gap-2 text-ui-sm", children: [_jsx("span", { className: "shrink-0 text-foreground-subtlest", children: scopeLabel }), _jsx("span", { className: "min-w-0 text-foreground-subtle", children: scopeValue })] })), shadowingLabel === null ? null : (_jsx("p", { className: "min-w-0 whitespace-pre-wrap break-words text-ui-sm text-foreground-subtle", children: shadowingLabel })), saved.path === undefined ? null : (_jsxs("p", { className: "flex min-w-0 items-baseline gap-2 text-ui-sm", children: [_jsx("span", { className: "shrink-0 text-foreground-subtlest", children: pathLabel }), _jsx("span", { className: "min-w-0 truncate font-mono text-foreground-subtle", title: saved.path, children: saved.path })] })), saved.whenToUse === undefined ? null : (_jsxs("p", { className: "flex min-w-0 items-baseline gap-2 text-ui-sm", children: [_jsx("span", { className: "shrink-0 text-foreground-subtlest", children: whenToUseLabel }), _jsx("span", { className: "min-w-0 whitespace-pre-wrap break-words text-foreground-subtle", children: saved.whenToUse })] }))] })), [
        pathLabel,
        saved.description,
        saved.path,
        saved.whenToUse,
        scopeLabel,
        scopeValue,
        shadowingLabel,
        whenToUseLabel,
    ]);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: SAVE_WORKFLOW_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: context.canToggle ?? true, forceOpen: context.forceOpen ?? false, kindLabel: context.kindLabelOverride ?? kindLabel, kindDetail: kindDetail, sourceLabel: context.sourceLabel, primaryText: primaryText, 
                // 刻意不传 secondaryText：折叠行只有名字（+ overwrite 徽标），说明/落点/whenToUse
                // 全部移入展开卡体——「决定之后的一行记录」越短越好读。
                statusLabel: context.statusLabel, statusTooltip: context.errorText, showFailureStatus: toolCall.status === "failed", isRunning: context.isRunning, title: saved.description ?? toolCall.title, renderContent: renderContent }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
//# sourceMappingURL=save-workflow.js.map