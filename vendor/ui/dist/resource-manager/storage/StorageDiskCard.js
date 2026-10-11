import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { HardDrive } from "lucide-react";
import { TID_RESOURCE_MANAGER_STORAGE_DISK_CARD, TID_RESOURCE_MANAGER_STORAGE_ROOT, testId, } from "@zcode/shared";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { formatBytes } from "@/resource-manager/resourceUsageView.js";
import { storageCategoryTitleId } from "./storageCategoryPresentation.js";
export function StorageDiskCard({ group, index, legend, selected, selectable, onSelect, }) {
    const { intl } = useZCodeIntl();
    const label = group.volume?.mountPoint ?? intl.formatMessage({ id: "resourceManager.storage.disk" });
    const body = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2 text-ui-base font-medium text-foreground", children: [_jsx(HardDrive, { className: "size-4 shrink-0 text-foreground-subtle", "aria-hidden": "true" }), _jsx("span", { className: "truncate", title: label, children: label })] }), _jsx("div", { className: "mt-4 flex h-2 w-full overflow-hidden rounded-full bg-surface", "aria-hidden": "true", children: legend.map((item) => group.bytes > 0 ? (_jsx("div", { className: "h-full", style: { width: `${(item.bytes / group.bytes) * 100}%`, backgroundColor: item.color } }, item.id)) : null) }), _jsxs("div", { className: "mt-2 text-ui-caption text-foreground-subtle", children: [intl.formatMessage({ id: "resourceManager.storage.diskUsage" }, { used: formatBytes(group.bytes) }), " · ", group.volume
                        ? intl.formatMessage({ id: "resourceManager.storage.diskFree" }, {
                            free: formatBytes(group.volume.freeBytes),
                            total: formatBytes(group.volume.totalBytes),
                        })
                        : intl.formatMessage({ id: "resourceManager.storage.diskUnknown" })] }), _jsx("ul", { className: "mt-3 space-y-1.5", children: legend.map((item) => (_jsxs("li", { className: "flex items-center gap-2 text-ui-base", children: [_jsx("span", { className: "size-2 shrink-0 rounded-full", style: { backgroundColor: item.color }, "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 flex-1 truncate text-foreground-subtle", children: item.id === "rest"
                                ? intl.formatMessage({ id: "resourceManager.storage.legendMore" }, { count: item.restCount ?? 0 })
                                : intl.formatMessage({ id: storageCategoryTitleId(item.id) }) }), _jsx("span", { className: "tabular-nums text-foreground", children: formatBytes(item.bytes) })] }, item.id))) }), _jsxs("div", { className: "mt-3 border-t border-border pt-3", children: [_jsx("div", { className: "text-ui-caption font-medium text-foreground-subtle", children: intl.formatMessage({ id: "resourceManager.storage.roots" }) }), _jsx("ul", { className: "mt-1.5 space-y-1", children: group.roots.map((root) => (_jsxs("li", { "data-testid": testId(TID_RESOURCE_MANAGER_STORAGE_ROOT, root.id), className: "flex items-center gap-2 text-ui-caption", children: [_jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-foreground-subtle", title: root.path, children: root.path }), _jsx("span", { className: "tabular-nums text-foreground", children: formatBytes(root.bytes) })] }, root.id))) })] })] }));
    const className = cn("w-full rounded-xl border border-card-border bg-card p-4 text-left", selectable && "cursor-pointer transition-colors hover:bg-surface-hover", selected && selectable && "bg-card-selected border-brand");
    return selectable ? (_jsx("button", { type: "button", "data-testid": testId(TID_RESOURCE_MANAGER_STORAGE_DISK_CARD, String(index)), "data-selected": selected ? "true" : "false", className: className, onClick: onSelect, children: body })) : (_jsx("div", { "data-testid": testId(TID_RESOURCE_MANAGER_STORAGE_DISK_CARD, String(index)), className: className, children: body }));
}
//# sourceMappingURL=StorageDiskCard.js.map