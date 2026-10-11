import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, Cable, ChevronRight, Trash2 } from "lucide-react";
import { Badge } from "../components/ui/badge.js";
import { Button } from "../components/ui/button.js";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { PluginConfigControls } from "../settings/PluginConfigControls.js";
import { PluginComponentGroups } from "../settings/PluginComponentGroups.js";
import { buildInstalledPluginDisplayGroups } from "../settings/pluginManagedResourceGroups.js";
import { isPluginUpdatePending } from "../settings/pluginStoreListing.js";
export function InstalledPluginDetailDialog({ diagnostics, getPluginOptionValue, configScope, installedAt, latestVersion, onOpenChange, onRequestUninstall, onRequestUpdate, onSavePluginOptions, open, operationId, plugin, renderPluginSource, setPluginOptionDraft, uninstallable, updateStatus, }) {
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-h-[calc(100vh-3rem)] w-[min(600px,calc(100vw-2rem))] max-w-none gap-0 overflow-hidden p-0", "data-testid": "plugin-settings-detail-dialog", "data-plugin-id": plugin?.id, children: [_jsx(DialogTitle, { className: "sr-only", children: plugin?.name ?? "" }), _jsx(InstalledPluginDetailPanel, { diagnostics: diagnostics, getPluginOptionValue: getPluginOptionValue, configScope: configScope, installedAt: installedAt, latestVersion: latestVersion, operationId: operationId, plugin: plugin, renderPluginSource: renderPluginSource, setPluginOptionDraft: setPluginOptionDraft, uninstallable: uninstallable, updateStatus: updateStatus, onRequestUninstall: onRequestUninstall, onRequestUpdate: onRequestUpdate, onSavePluginOptions: onSavePluginOptions })] }) }));
}
export function InstalledPluginDetailPanel({ diagnostics = [], getPluginOptionValue, configScope, installedAt, latestVersion, onRequestUninstall, onRequestUpdate, onSavePluginOptions, operationId, plugin, renderPluginSource, setPluginOptionDraft, uninstallable, updateStatus, }) {
    const { intl } = useZCodeIntl();
    if (!plugin) {
        return (_jsx("div", { className: "px-5 py-4 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.detail.empty" }) }));
    }
    const componentGroups = buildInstalledPluginDisplayGroups(plugin);
    const hookDetails = plugin.hookDetails ?? [];
    // Bugfix（静默失败）：插件 warning 诊断（如声明的技能路径扫描为空）此前在 UI 无任何
    // 渲染位置，用户看到「安装成功、启用生效、技能数 0」却无从排查。这里在详情面板
    // 直接列出该插件自身的 warning；正文直出 CLI 下发的 message（含具体路径）。
    const pluginWarnings = diagnostics.filter((diagnostic) => diagnostic.pluginId === plugin.id && diagnostic.severity === "warning");
    const hasAdvanced = hookDetails.length > 0 || Object.keys(plugin.userConfig ?? {}).length > 0;
    const sourceLabel = renderPluginSource(plugin);
    return (_jsxs("div", { className: "max-h-[calc(100vh-3rem)] overflow-y-auto text-ui-base text-foreground", children: [_jsxs("div", { className: "border-b border-border px-5 pb-4 pt-5 pr-12", children: [_jsxs("div", { className: "flex min-w-0 items-start gap-3", children: [_jsx("div", { className: "flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground-subtle", "aria-hidden": "true", children: _jsx(Cable, { className: "size-4" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("h2", { className: "flex min-w-0 flex-wrap items-baseline gap-2 text-ui-base font-semibold text-foreground", children: [_jsx("span", { className: "min-w-0 truncate", children: plugin.name }), plugin.version ? (_jsxs("span", { className: "text-ui-xs font-normal text-foreground-subtle", children: ["v", plugin.version] })) : null] }), _jsxs("div", { className: "mt-1.5 flex min-w-0 flex-wrap items-center gap-1.5", children: [_jsx(Badge, { variant: plugin.enabled ? "secondary" : "outline", className: "rounded-md", children: plugin.enabled
                                                    ? intl.formatMessage({
                                                        id: "settings.plugins.detail.enabled",
                                                    })
                                                    : intl.formatMessage({
                                                        id: "settings.plugins.detail.disabled",
                                                    }) }), _jsx(Badge, { variant: "outline", className: "min-w-0 rounded-md", children: _jsx("span", { className: "truncate", children: sourceLabel }) })] })] })] }), plugin.description ? (_jsx("p", { className: "mt-3 leading-relaxed text-foreground-subtle", children: plugin.description })) : null] }), _jsxs("div", { className: "space-y-5 px-5 py-4", children: [_jsx(DetailSection, { title: intl.formatMessage({ id: "settings.plugins.detail.details" }), children: componentGroups.length > 0 ? (_jsx(PluginComponentGroups, { groups: componentGroups })) : (_jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                id: "settings.plugins.detail.componentsEmpty",
                            }) })) }), pluginWarnings.length > 0 ? (_jsx(DetailSection, { title: intl.formatMessage({ id: "settings.plugins.detail.warnings" }), children: _jsx(PluginWarningList, { warnings: pluginWarnings }) })) : null, installedAt ? (_jsxs("div", { className: "border-t border-border pt-4", children: [_jsx("div", { className: "text-ui-xs font-medium text-foreground-subtle", children: intl.formatMessage({
                                    id: "settings.plugins.detail.installedAt",
                                }) }), _jsx("div", { className: "mt-1 break-all text-ui-base text-foreground", children: installedAt })] })) : null, hasAdvanced ? (_jsxs("details", { className: "group/advanced border-t border-border pt-4", children: [_jsxs("summary", { className: "flex cursor-pointer list-none items-center gap-2 text-ui-xs font-medium text-foreground-subtle transition-colors hover:text-foreground", children: [_jsx(ChevronRight, { className: "size-3.5 transition-transform group-open/advanced:rotate-90" }), intl.formatMessage({
                                        id: "settings.plugins.detail.moreDetails",
                                    })] }), _jsxs("div", { className: "mt-3 space-y-3", children: [_jsx(PluginDetailRow, { label: intl.formatMessage({
                                            id: "settings.plugins.detail.rootPath",
                                        }), value: plugin.rootPath }), _jsx(PluginHookDetails, { hooks: hookDetails }), _jsx(PluginConfigControls, { getValue: getPluginOptionValue, onSave: onSavePluginOptions, onSetDraft: setPluginOptionDraft, operationId: operationId, plugin: plugin, scope: configScope })] })] })) : null, isPluginUpdatePending(updateStatus) ? (_jsxs("div", { className: "flex items-center justify-between gap-2 border-t border-border pt-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-ui-base font-medium text-foreground", children: updateStatus === "update-available"
                                            ? intl.formatMessage({ id: "settings.plugins.detail.updateAvailable" }, { version: latestVersion ?? "" })
                                            : intl.formatMessage({
                                                id: "settings.plugins.detail.versionChanged",
                                            }) }), _jsx("p", { className: "text-ui-xs text-foreground-subtle", children: intl.formatMessage({
                                            id: "settings.plugins.detail.updateNewSessionsNote",
                                        }) })] }), onRequestUpdate ? (_jsx(Button, { type: "button", variant: "outline", size: "sm", disabled: operationId === `plugin:update:${plugin.id}`, onClick: () => onRequestUpdate(plugin.id), children: intl.formatMessage({ id: "settings.plugins.detail.update" }) })) : null] })) : null, uninstallable && onRequestUninstall ? (_jsx("div", { className: "flex justify-end border-t border-border pt-4", children: _jsxs(Button, { type: "button", variant: "ghost", size: "sm", className: "text-destructive hover:bg-destructive/10 hover:text-destructive", disabled: operationId === `plugin:uninstall:${plugin.id}`, onClick: () => onRequestUninstall(plugin.id), children: [_jsx(Trash2, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.detail.uninstall" })] }) })) : null] })] }));
}
function DetailSection({ title, children }) {
    return (_jsxs("section", { children: [_jsx("h3", { className: "mb-1.5 text-ui-base font-semibold text-foreground", children: title }), children] }));
}
/**
 * 插件 warning 诊断列表。CLI 对「声明的技能路径扫描为空」等异常
 * 只写 diagnostics 的话 UI 无渲染位置，用户无从排查。message 由 CLI 下发并包含
 * 具体路径（协议 wire 不携带 path 字段），因此正文直出 message 即可。
 */
export function PluginWarningList({ warnings }) {
    return (_jsx("ul", { className: "space-y-2", children: warnings.map((diagnostic, index) => (_jsxs("li", { className: "flex min-w-0 items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2", children: [_jsx(AlertTriangle, { className: "mt-0.5 size-3.5 shrink-0 text-warning", "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 break-all text-ui-sm text-foreground", children: diagnostic.message })] }, `${diagnostic.code}-${index}`))) }));
}
export function PluginHookDetails({ hooks, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { children: [_jsx("div", { className: "mb-2 text-ui-xs font-medium text-foreground", children: intl.formatMessage({ id: "settings.plugins.detail.hooks" }) }), hooks.length === 0 ? (_jsx("div", { className: "rounded-lg border border-border bg-surface px-3 py-2 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.detail.none" }) })) : (_jsx("div", { className: "space-y-2", children: hooks.map((hook, index) => (_jsxs("div", { className: "min-w-0 space-y-2 rounded-lg border border-border bg-surface px-3 py-2", children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-1.5", children: [_jsx(Badge, { variant: "outline", className: "rounded-md font-mono", children: hook.event }), _jsx(Badge, { variant: "outline", className: "rounded-md", children: hook.matcher ??
                                        intl.formatMessage({
                                            id: "settings.plugins.detail.hook.defaultMatcher",
                                        }) }), _jsx(Badge, { variant: hook.runnable ? "secondary" : "outline", className: "rounded-md", children: hook.runnable
                                        ? intl.formatMessage({
                                            id: "settings.plugins.detail.hook.runnable",
                                        })
                                        : intl.formatMessage({
                                            id: "settings.plugins.detail.hook.diagnosticOnly",
                                        }) })] }), _jsx(PluginDetailInlineValue, { label: intl.formatMessage({
                                id: "settings.plugins.detail.hook.command",
                            }), value: formatHookCommand(hook) }), _jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [hook.timeoutMs !== undefined ? (_jsx(PluginDetailInlineValue, { label: intl.formatMessage({
                                        id: "settings.plugins.detail.hook.timeoutMs",
                                    }), value: `${hook.timeoutMs}ms` })) : null, hook.timeout !== undefined ? (_jsx(PluginDetailInlineValue, { label: intl.formatMessage({
                                        id: "settings.plugins.detail.hook.timeout",
                                    }), value: String(hook.timeout) })) : null, hook.async !== undefined ? (_jsx(PluginDetailInlineValue, { label: intl.formatMessage({
                                        id: "settings.plugins.detail.hook.async",
                                    }), value: String(hook.async) })) : null, hook.shell !== undefined ? (_jsx(PluginDetailInlineValue, { label: intl.formatMessage({
                                        id: "settings.plugins.detail.hook.shell",
                                    }), value: hook.shell === true ? "true" : hook.shell })) : null, hook.statusMessage ? (_jsx(PluginDetailInlineValue, { label: intl.formatMessage({
                                        id: "settings.plugins.detail.hook.statusMessage",
                                    }), value: hook.statusMessage })) : null] }), _jsx(PluginDetailInlineValue, { label: intl.formatMessage({
                                id: "settings.plugins.detail.hook.sourcePath",
                            }), value: hook.sourcePath })] }, `${hook.event}-${hook.matcher ?? "default"}-${hook.command}-${index}`))) }))] }));
}
function PluginDetailInlineValue({ label, value }) {
    return (_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-ui-xs text-foreground-subtle", children: label }), _jsx("div", { className: "mt-0.5 break-all font-mono text-ui-xs text-foreground", children: value })] }));
}
function formatHookCommand(hook) {
    if (!hook.args || hook.args.length === 0)
        return hook.command;
    return `${hook.command} ${hook.args.join(" ")}`;
}
export function PluginDetailRow({ label, value }) {
    return (_jsxs("div", { className: "min-w-0 rounded-lg border border-border bg-surface px-3 py-2", children: [_jsx("div", { className: "text-ui-xs text-foreground-subtle", children: label }), _jsx("div", { className: "mt-1 break-all font-mono text-ui-xs text-foreground", children: value })] }));
}
//# sourceMappingURL=InstalledPluginManagement.js.map