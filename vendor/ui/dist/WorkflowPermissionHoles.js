import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PenIcon } from "lucide-react";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
/**
 * 确认窗的留白行（docs/dynamic-workflow/presentation.md「Holes on the timeline」的「The hole station」）：
 * 还开着的留白按源码序排成一行芯片（笔、名字；类型不上界面），后面一句「运行到留白处会暂停，等主代理
 * 补全后继续。」——用户批准的是一个会停下来等代码的 run，这一句要在按下允许之前读到。没有留白时整行缺席。
 * 从 WorkflowPermissionBlock.tsx 拆出（max-lines 门）。
 */
export function WorkflowPermissionHoles({ holes, }) {
    const { intl } = useZCodeIntl();
    if (holes === undefined || holes.length === 0)
        return null;
    return (_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1", "data-testid": "workflow-permission-holes", children: [_jsx("span", { className: "shrink-0 text-ui-sm text-foreground-subtlest", children: intl.formatMessage({ id: "chat.permission.workflow.holes.label" }) }), holes.map((hole) => (_jsxs("span", { className: "inline-flex h-6 min-w-0 items-center gap-1.5 rounded-md border border-border bg-surface px-2 text-ui-sm text-foreground", "data-hole-id": hole.siteId, "data-testid": "workflow-permission-hole", title: hole.name, children: [_jsx(PenIcon, { "aria-hidden": true, className: "size-3.5 shrink-0 text-foreground-subtle" }), _jsx("span", { className: "min-w-0 truncate", children: hole.name })] }, hole.siteId))), _jsx("span", { className: "text-ui-sm text-foreground-subtlest", children: intl.formatMessage({ id: "chat.permission.workflow.holes.note" }) })] }));
}
//# sourceMappingURL=WorkflowPermissionHoles.js.map