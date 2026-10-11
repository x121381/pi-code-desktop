import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { TaskRowActionButton } from "@/workspace-grouped-tasks/task-row-action-button.js";
export function GroupedDraftTaskRow({ active, workspaceLabel, onSelect, onClose, }) {
    const { intl } = useZCodeIntl();
    const title = intl.formatMessage({ id: "taskList.newThread" });
    const handleKeyDown = (event) => {
        if (event.target !== event.currentTarget) {
            return;
        }
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }
        event.preventDefault();
        onSelect();
    };
    const handleClose = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose?.();
    };
    return (_jsx("div", { className: cn("rounded-lg py-px transition-colors"), children: _jsxs("div", { role: "button", tabIndex: 0, onClick: onSelect, onKeyDown: handleKeyDown, className: cn("group/task-row flex h-7 w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg pl-2.5 pr-1 text-left text-ui-base transition-colors", "border border-dashed", active
                ? "bg-selected border-primary/35"
                : "bg-success/10 border-primary/20 hover:bg-success/14"), children: [_jsx("span", { className: "min-w-0 flex-1 truncate text-foreground-subtlest", title: title, children: title }), _jsxs("span", { className: "ml-auto flex shrink-0 items-center gap-1.5 text-ui-sm text-foreground-subtle", children: [_jsx("span", { className: "max-w-24 truncate rounded-full bg-tag/50 px-1.5 py-0.5 text-ui-sm text-foreground-subtle", title: workspaceLabel, children: workspaceLabel }), _jsxs("span", { className: "relative size-6 shrink-0", children: [_jsx("span", { "aria-hidden": "true", className: cn("absolute inset-0 flex items-center justify-center", onClose && "group-hover/task-row:hidden"), children: _jsx("span", { className: "size-1.5 rounded-full bg-green-500 dark:bg-green-400" }) }), onClose ? (_jsx("span", { className: "absolute inset-0 hidden items-center justify-center group-hover/task-row:flex", children: _jsx(TaskRowActionButton, { label: intl.formatMessage({ id: "common.close" }), onClick: handleClose, children: _jsx(X, { className: "size-3.5" }) }) })) : null] })] })] }) }));
}
//# sourceMappingURL=draft-task-row.js.map