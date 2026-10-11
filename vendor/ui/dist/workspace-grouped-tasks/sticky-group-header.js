import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronDownIcon, ChevronRightIcon, MessageCirclePlus } from "lucide-react";
import { cn } from "../components/lib/utils.js";
import { Button } from "../components/ui/button.js";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger, } from "../components/ui/context-menu.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, } from "../components/ui/dropdown-menu.js";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { CRON_DEFAULT_GROUP_ID, OFF_PEAK_DEFAULT_GROUP_ID } from "@zcode/shared";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { getTaskGroupDisplayTitle } from "../workspace-grouped-tasks/group-title.js";
import { TASK_GROUP_COLORS, TaskGroupColorDot, TaskGroupColorMark, } from "../workspace-grouped-tasks/shared.js";
export function StickyGroupHeader({ node, collapsed, tooltipsDisabled, onCreateTask, onToggleCollapsed, onUpdateGroupColor, onUngroupGroup, }) {
    const { intl } = useZCodeIntl();
    const taskCount = node.tasks.length;
    // 系统分组（cron / 闲时）标题按语言环境本地化展示，与 GroupItem 保持一致。
    const displayTitle = getTaskGroupDisplayTitle(node.group, {
        cron: intl.formatMessage({ id: "taskGroup.cronGroupName" }),
        offPeak: intl.formatMessage({ id: "offPeak.sidebar.groupTitle" }),
    });
    // sticky header 的右键菜单要和 GroupItem 一样裁剪系统分组的“解散”项，
    // 否则 cron/闲时组滚动吸顶时可被误解散。系统分组一律不提供解散入口。
    const isSystemGroup = node.group.id === CRON_DEFAULT_GROUP_ID || node.group.id === OFF_PEAK_DEFAULT_GROUP_ID;
    const handleToggle = () => onToggleCollapsed(node.group.id);
    const handleGroupColorChange = (color) => {
        onUpdateGroupColor(node.group.id, color);
    };
    const newTaskButton = (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "size-6 shrink-0 text-foreground-subtle hover:bg-hover hover:text-foreground", "aria-label": intl.formatMessage({ id: "taskGroup.newTask" }), onClick: (event) => {
            event.stopPropagation();
            onCreateTask();
        }, onMouseDown: (event) => event.stopPropagation(), onPointerDown: (event) => event.stopPropagation(), onTouchStart: (event) => event.stopPropagation(), children: _jsx(MessageCirclePlus, { "aria-hidden": "true", className: "size-3.5" }) }));
    const newTaskAction = tooltipsDisabled ? (newTaskButton) : (_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "taskGroup.newTask" }), children: newTaskButton }));
    return (_jsx("div", { className: "px-2 pb-1", children: _jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { asChild: true, children: _jsxs("div", { role: "button", tabIndex: 0, "aria-expanded": !collapsed, className: cn("flex h-8 items-center gap-1 rounded-lg border border-border bg-background pl-1.5 pr-1 text-ui-base text-foreground shadow-sm", "cursor-pointer transition-[border-color,box-shadow] hover:border-border-hover"), onClick: handleToggle, onKeyDown: (event) => {
                            if (event.key !== "Enter" && event.key !== " ") {
                                return;
                            }
                            event.preventDefault();
                            handleToggle();
                        }, children: [_jsxs(DropdownMenu, { modal: false, children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx("button", { type: "button", className: "flex size-5 shrink-0 items-center justify-center rounded-full hover:bg-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-input-border-focused", "aria-label": intl.formatMessage({ id: "taskGroup.color" }), onClick: (event) => event.stopPropagation(), onMouseDown: (event) => event.stopPropagation(), onPointerDown: (event) => event.stopPropagation(), onTouchStart: (event) => event.stopPropagation(), children: _jsx(TaskGroupColorMark, { color: node.group.color }) }) }), _jsxs(DropdownMenuContent, { align: "start", className: "w-40 min-w-40", onClick: (event) => event.stopPropagation(), onPointerDown: (event) => event.stopPropagation(), children: [_jsx(DropdownMenuLabel, { children: intl.formatMessage({ id: "taskGroup.color" }) }), _jsx(DropdownMenuRadioGroup, { value: node.group.color, onValueChange: handleGroupColorChange, children: TASK_GROUP_COLORS.map((color) => (_jsxs(DropdownMenuRadioItem, { value: color, children: [_jsx(TaskGroupColorDot, { color: color }), _jsx("span", { children: intl.formatMessage({ id: `taskGroup.color.${color}` }) })] }, color))) })] })] }), _jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-1", children: [_jsx("span", { className: "min-w-0 max-w-full truncate rounded-sm px-1 text-left text-foreground", title: displayTitle, children: displayTitle }), collapsed ? (_jsx(ChevronRightIcon, { "aria-hidden": "true", className: "size-3.5 shrink-0 text-foreground-subtlest" })) : (_jsx(ChevronDownIcon, { "aria-hidden": "true", className: "size-3.5 shrink-0 text-foreground-subtlest" }))] }), _jsx("span", { className: "inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-tag/50 px-1.5 py-0.5 text-ui-sm font-medium leading-none text-foreground-subtle", children: taskCount }), newTaskAction] }) }), _jsxs(ContextMenuContent, { className: "w-44", children: [_jsx(ContextMenuItem, { onSelect: onCreateTask, children: intl.formatMessage({ id: "taskGroup.newTask" }) }), _jsx(ContextMenuSeparator, {}), _jsxs(ContextMenuSub, { children: [_jsx(ContextMenuSubTrigger, { children: intl.formatMessage({ id: "taskGroup.changeColor" }) }), _jsx(ContextMenuSubContent, { className: "w-40", onClick: (event) => event.stopPropagation(), onPointerDown: (event) => event.stopPropagation(), children: TASK_GROUP_COLORS.map((color) => (_jsxs(ContextMenuItem, { onSelect: () => handleGroupColorChange(color), children: [_jsx(TaskGroupColorDot, { color: color }), _jsx("span", { children: intl.formatMessage({ id: `taskGroup.color.${color}` }) })] }, color))) })] }), isSystemGroup ? null : (_jsxs(_Fragment, { children: [_jsx(ContextMenuSeparator, {}), _jsx(ContextMenuItem, { onSelect: () => onUngroupGroup(node.group.id), children: intl.formatMessage({ id: "taskGroup.ungroup" }) })] }))] })] }) }));
}
//# sourceMappingURL=sticky-group-header.js.map