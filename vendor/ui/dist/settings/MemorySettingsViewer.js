import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useEffect, useMemo, useState } from "react";
import { TID_SETTINGS_MEMORY_COUNT, TID_SETTINGS_MEMORY_FILE, TID_SETTINGS_MEMORY_FILE_EDITOR_ACTIONS, TID_SETTINGS_MEMORY_FILE_ICON, TID_SETTINGS_MEMORY_FILE_NAME, TID_SETTINGS_MEMORY_FILE_UPDATED_AT, TID_SETTINGS_MEMORY_REFRESH, TID_SETTINGS_MEMORY_SCOPE_ICON, TID_SETTINGS_MEMORY_SCOPE_TRIGGER, TID_SETTINGS_MEMORY_SEARCH_CLEAR, TID_SETTINGS_MEMORY_SEARCH_INPUT, TID_SETTINGS_MEMORY_WORKSPACE, testId, } from "@zcode/shared";
import { Alert, AlertDescription } from "@/components/ui/alert.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { FileDisplayIcon, resolveFileDisplayDescriptor } from "@/lib/fileDisplay.js";
import { PluginScopeMenu } from "@/settings/PluginScopeMenu.js";
import { PluginSearchEmptyState } from "@/settings/PluginInstallEmptyState.js";
import { SettingsSearchInput } from "@/settings/SettingsSearchInput.js";
import { SettingsResourceHeaderActions } from "@/settings/SettingsResourceHeaderActions.js";
import { formatMemoryUpdatedAt } from "@/settings/memoryUpdatedAt.js";
import { WorkspaceEditorButtonGroup } from "@/WorkspaceEditorButtonGroup.js";
export function MemorySettingsViewer({ catalogError, catalogState, selectedWorkspace, workspaces, onRefresh, onScopeKeyChange, }) {
    const { intl, locale } = useZCodeIntl();
    const [searchQuery, setSearchQuery] = useState("");
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const interval = window.setInterval(() => setNow(Date.now()), 60_000);
        return () => window.clearInterval(interval);
    }, []);
    const formatMemoryCount = (count) => intl.formatMessage({
        id: `settings.memory.viewer.memoryCount.${count === 1 ? "one" : "other"}`,
    }, { count });
    const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
    const visibleFiles = useMemo(() => selectedWorkspace?.files.filter((file) => file.name.toLocaleLowerCase().includes(normalizedSearchQuery)) ?? [], [normalizedSearchQuery, selectedWorkspace]);
    if (catalogError) {
        return (_jsx(Alert, { children: _jsx(AlertDescription, { children: catalogError }) }));
    }
    if (catalogState === "loading" && workspaces.length === 0) {
        return (_jsx("div", { className: "rounded-xl border border-dashed border-border bg-transparent px-4 py-8 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.memory.viewer.loading" }) }));
    }
    if (!selectedWorkspace) {
        return (_jsx("div", { className: "rounded-xl border border-dashed border-border bg-transparent px-4 py-8 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.memory.viewer.empty" }) }));
    }
    return (_jsxs("section", { className: "space-y-4", children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx(PluginScopeMenu, { includeUser: false, selectedScopeKey: selectedWorkspace.id, workspaceOptions: workspaces.map((workspace) => ({
                                    key: workspace.id,
                                    label: workspace.label,
                                })), onScopeKeyChange: onScopeKeyChange, triggerIconTestId: TID_SETTINGS_MEMORY_SCOPE_ICON, triggerTestId: TID_SETTINGS_MEMORY_SCOPE_TRIGGER, workspaceOptionTestIdPrefix: TID_SETTINGS_MEMORY_WORKSPACE }), _jsx("div", { className: "h-4 w-px bg-border", "aria-hidden": "true" }), _jsx("span", { "data-testid": TID_SETTINGS_MEMORY_COUNT, className: "shrink-0 text-ui-sm text-foreground-subtle", children: formatMemoryCount(selectedWorkspace.files.length) })] }), _jsx("div", { className: "flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2", children: _jsx(SettingsSearchInput, { containerClassName: "w-full sm:w-64", clearLabel: intl.formatMessage({ id: "settings.search.clear" }), clearTestId: TID_SETTINGS_MEMORY_SEARCH_CLEAR, "data-testid": TID_SETTINGS_MEMORY_SEARCH_INPUT, value: searchQuery, onClear: () => setSearchQuery(""), onChange: (event) => setSearchQuery(event.target.value), placeholder: intl.formatMessage({
                                id: "settings.memory.viewer.searchPlaceholder",
                            }) }) })] }), normalizedSearchQuery && visibleFiles.length === 0 ? (_jsx(PluginSearchEmptyState, { label: intl.formatMessage({
                    id: "settings.memory.viewer.searchEmpty",
                }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex min-h-7 flex-wrap items-center justify-between gap-3", children: [_jsx("h3", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.memory.viewer.files" }) }), _jsx(SettingsResourceHeaderActions, { onRefresh: () => void onRefresh(), refreshing: catalogState === "loading", refreshTestId: TID_SETTINGS_MEMORY_REFRESH, refreshLabel: intl.formatMessage({
                                    id: "settings.memory.viewer.refresh",
                                }) })] }), _jsx("div", { className: "overflow-hidden rounded-xl bg-surface", children: visibleFiles.map((file, index) => (_jsxs(Fragment, { children: [index > 0 ? _jsx("div", { className: "h-px bg-border/50", "aria-hidden": "true" }) : null, _jsxs("div", { className: "flex min-w-0 items-center hover:bg-hover", children: [_jsxs("div", { "data-testid": testId(TID_SETTINGS_MEMORY_FILE, file.name), className: "flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left", children: [_jsx("span", { "data-testid": testId(TID_SETTINGS_MEMORY_FILE_ICON, file.name), className: "flex size-9 shrink-0 items-center justify-center rounded-xl bg-background", children: _jsx(FileDisplayIcon, { src: resolveFileDisplayDescriptor(file.path).fileIconSrc, size: 16, className: "size-4 shrink-0" }) }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { "data-testid": testId(TID_SETTINGS_MEMORY_FILE_NAME, file.name), className: "block truncate text-ui-base font-medium text-foreground", children: file.name }), _jsx("span", { "data-testid": testId(TID_SETTINGS_MEMORY_FILE_UPDATED_AT, file.name), className: "mt-0.5 block truncate text-ui-sm text-foreground-subtle", children: formatMemoryUpdatedAt({
                                                                formatMessage: intl.formatMessage,
                                                                locale,
                                                                now,
                                                                updatedAt: file.updatedAt,
                                                            }) })] })] }), _jsx("span", { "data-testid": testId(TID_SETTINGS_MEMORY_FILE_EDITOR_ACTIONS, file.name), className: "mr-3 shrink-0", children: _jsx(WorkspaceEditorButtonGroup, { workspaceAbsPath: file.path }) })] })] }, file.name))) })] }))] }));
}
//# sourceMappingURL=MemorySettingsViewer.js.map