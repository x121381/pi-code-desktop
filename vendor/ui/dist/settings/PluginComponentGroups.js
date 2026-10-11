import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/components/lib/utils.js";
import { Badge } from "@/components/ui/badge.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
/** 组件分组徽标配色：复用主题里已有的 Tailwind 调色板做轻量底色，深浅主题均正确。 */
const COMPONENT_BADGE_STYLES = {
    agent: "bg-violet-500/15 text-violet-500 dark:text-violet-300",
    command: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
    skill: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    hook: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    mcp: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
};
const COMPONENT_LABEL_IDS = {
    agent: "settings.plugins.detail.component.agent",
    command: "settings.plugins.detail.component.command",
    skill: "settings.plugins.detail.component.skill",
    hook: "settings.plugins.detail.component.hook",
    mcp: "settings.plugins.detail.component.mcp",
};
/**
 * 共享的「组件分组 + 名称—描述两行体」渲染，供 marketplace 详情视图与已安装详情弹窗共用，
 * 保证两处呈现一致。每个组件项：首行 mono 名称，次行截断描述（无描述时只显示名称）。
 */
export function PluginComponentGroups({ groups, className, }) {
    const { intl } = useZCodeIntl();
    return (_jsx("div", { className: cn("space-y-3", className), children: groups.map((group) => (_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { className: cn("rounded-md border-transparent px-1.5 font-medium", COMPONENT_BADGE_STYLES[group.kind]), children: intl.formatMessage({ id: COMPONENT_LABEL_IDS[group.kind] }) }), _jsx("span", { className: "text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.detail.items" }, { count: String(group.count) }) })] }), group.items.length > 0 ? (_jsx("ul", { className: "space-y-1", children: group.items.map((item) => (_jsxs("li", { className: "min-w-0 rounded-md bg-surface px-2 py-1.5", children: [_jsx("div", { className: "truncate font-mono text-ui-xs text-foreground", children: item.name }), item.description ? (_jsx("div", { className: "mt-0.5 line-clamp-2 text-ui-xs leading-snug text-foreground-subtle", children: item.description })) : null] }, item.name))) })) : null] }, group.kind))) }));
}
//# sourceMappingURL=PluginComponentGroups.js.map