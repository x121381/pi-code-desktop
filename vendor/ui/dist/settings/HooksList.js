import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Anchor, Download, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Switch } from "@/components/ui/switch.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { PluginInstallEmptyState } from "@/settings/PluginInstallEmptyState.js";
import { PluginStoreAvatar } from "@/settings/PluginStoreAvatar.js";
import { settingsResourceRowInteraction } from "@/settings/settingsResourceRowInteraction.js";
import { requiresWorkspaceHookTrust } from "@/settings/WorkspaceHookTrustNotice.js";
export function groupHookSections(editableHooks, compatibilityHooks, pluginHooks) {
    const sections = [];
    if (editableHooks.length > 0) {
        sections.push({
            kind: "installed",
            title: "Installed",
            count: editableHooks.length,
            hooks: editableHooks,
        });
    }
    const pluginGroups = new Map();
    for (const hook of pluginHooks) {
        const key = hook.pluginId || hook.pluginName.trim().toLocaleLowerCase();
        pluginGroups.set(key, [...(pluginGroups.get(key) ?? []), hook]);
    }
    for (const [, hooks] of [...pluginGroups.entries()].sort(([left], [right]) => left.localeCompare(right))) {
        sections.push({
            kind: "plugin",
            pluginId: hooks[0]?.pluginId ?? "",
            title: hooks[0]?.pluginName ?? "",
            count: hooks.length,
            hooks,
        });
    }
    if (compatibilityHooks.length > 0) {
        sections.push({
            kind: "legacy",
            title: "Legacy",
            count: compatibilityHooks.length,
            hooks: compatibilityHooks,
        });
    }
    return sections;
}
export function HooksList({ compatibilityHooks, editableHooks, operatingHookId, pluginHooks, trustActionAvailable = false, trustingHookId, onEdit, onImport, onTrust, onToggle, formatPluginName = (name) => name, installedAction, installedEmptyActions, installedEmptyDescription, installedEmptyTitle, showInstalledSection = false, }) {
    const { intl } = useZCodeIntl();
    const groupedSections = groupHookSections(editableHooks, compatibilityHooks, pluginHooks);
    const sections = showInstalledSection && editableHooks.length === 0
        ? [{ kind: "installed", title: "Installed", count: 0, hooks: [] }, ...groupedSections]
        : groupedSections;
    return (_jsx("div", { className: "space-y-6", children: sections.map((section) => (_jsxs("section", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("h3", { className: "flex h-7 items-center gap-1.5 text-ui-base font-medium text-foreground", children: [section.kind === "plugin"
                                    ? formatPluginName(section.title, section.pluginId)
                                    : intl.formatMessage({
                                        id: section.kind === "installed"
                                            ? "settings.hooks.group.installed"
                                            : "settings.hooks.group.legacy",
                                    }), _jsx("span", { className: "text-ui-sm font-normal text-foreground-subtle", children: section.count })] }), section.kind === "installed" ? installedAction : null] }), section.kind === "installed" && section.hooks.length === 0 ? (_jsx(PluginInstallEmptyState, { title: installedEmptyTitle ?? "", description: installedEmptyDescription ?? "", actions: installedEmptyActions })) : (_jsx("div", { className: "overflow-hidden rounded-xl bg-surface", children: section.kind === "plugin"
                        ? section.hooks.map((hook, index) => (_jsxs("div", { children: [index > 0 ? _jsx("div", { className: "h-px bg-border/50", "aria-hidden": "true" }) : null, _jsx(PluginHookItem, { hook: hook })] }, `${hook.pluginId}-${hook.detail.sourcePath}-${index}`)))
                        : section.hooks.map((hook, index) => (_jsxs("div", { children: [index > 0 ? _jsx("div", { className: "h-px bg-border/50", "aria-hidden": "true" }) : null, section.kind === "installed" ? (_jsx(ConfiguredHookRow, { hook: hook, busy: operatingHookId === hook.id, readOnly: hook.editable === false, requiresTrust: requiresWorkspaceHookTrust(hook), trustActionAvailable: trustActionAvailable, trusting: trustingHookId === hook.id, onToggle: onToggle, onEdit: onEdit, onTrust: onTrust })) : (_jsx(CompatibilityHookRow, { hook: hook, busy: operatingHookId === hook.id, onImport: onImport }))] }, hook.id))) }))] }, `${section.kind}:${section.kind === "plugin" ? section.pluginId : section.title}`))) }));
}
function HookItemFrame({ actions, children, onEdit, pluginIconItem, testId, }) {
    return (_jsxs("div", { className: `grid cursor-default grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] ${onEdit ? "transition-colors hover:bg-hover" : ""}`, "data-testid": testId, ...settingsResourceRowInteraction(onEdit), children: [pluginIconItem ? (_jsx(PluginStoreAvatar, { item: pluginIconItem, className: "size-9 bg-background", iconClassName: "size-4", fallbackIcon: _jsx(Anchor, { className: "size-4" }) })) : (_jsx("div", { className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-foreground-subtle", "aria-hidden": "true", children: _jsx(Anchor, { className: "size-4" }) })), _jsx("div", { className: "min-w-0", children: children }), actions ? (_jsx("div", { className: "col-start-2 flex shrink-0 items-center justify-end gap-2 sm:col-start-auto", children: actions })) : null] }));
}
function HookContent({ event, command, trailingBadges, }) {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: event }), trailingBadges] }), _jsx("p", { className: "mt-1 truncate font-mono text-ui-sm text-foreground-subtle", children: command })] }));
}
function ConfiguredHookRow({ busy, hook, onEdit, onTrust, onToggle, readOnly = false, requiresTrust, trustActionAvailable, trusting, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(HookItemFrame, { testId: "configured-hook-row", onEdit: busy || readOnly ? undefined : () => onEdit(hook), actions: _jsxs(_Fragment, { children: [requiresTrust && onTrust ? (_jsxs(Button, { type: "button", variant: "outline", size: "sm", disabled: busy || trusting || !trustActionAvailable, title: trustActionAvailable ? undefined : intl.formatMessage({ id: "settings.hooks.review.unavailable" }), onClick: (event) => {
                        event.stopPropagation();
                        void onTrust(hook);
                    }, children: [_jsx(ShieldCheck, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.hooks.review.trust" })] })) : null, _jsx(Switch, { checked: requiresTrust ? false : hook.enabled, onCheckedChange: (value) => void onToggle(hook, value), onClick: (event) => event.stopPropagation(), disabled: busy || trusting || requiresTrust || readOnly })] }), children: _jsx(HookContent, { event: hook.event, command: [hook.command, ...(hook.args ?? [])].join(" ") }) }));
}
function CompatibilityHookRow({ busy, hook, onImport, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(HookItemFrame, { actions: _jsxs(Button, { variant: "outline", size: "sm", disabled: busy, onClick: () => void onImport(hook), children: [_jsx(Download, { className: "size-3" }), intl.formatMessage({ id: "settings.hooks.import" })] }), children: _jsx(HookContent, { event: hook.event, command: [hook.command, ...(hook.args ?? [])].join(" ") }) }));
}
function PluginHookItem({ hook }) {
    const { intl } = useZCodeIntl();
    return (_jsx(HookItemFrame, { testId: "plugin-hook-row", pluginIconItem: hook.pluginIconItem, children: _jsx(HookContent, { event: hook.detail.event, command: [hook.detail.command, ...(hook.detail.args ?? [])].join(" "), trailingBadges: !hook.pluginScope ? (_jsx(Badge, { variant: "secondary", className: "bg-surface text-foreground-subtle", children: intl.formatMessage({ id: "settings.hooks.scopeUnknown" }) })) : null }) }));
}
//# sourceMappingURL=HooksList.js.map