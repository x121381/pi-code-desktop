import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- 外部 Agent 导入弹窗复用 skills/commands 的交互状态机，业务扫描与导入在服务层按类别分开 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircleIcon, CheckIcon, ChevronDown, ChevronRight, Loader2Icon, MinusIcon, RefreshCw, XIcon, } from "lucide-react";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { cn } from "@/components/lib/utils.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { Progress } from "@/components/ui/progress.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { logger } from "@/logger.js";
function getSourceSelectionKey(agent, category, sourceScope) {
    return sourceScope ? `${agent}:${category}:${sourceScope}` : `${agent}:${category}`;
}
function getResourceSelectionKey(payload) {
    return JSON.stringify(payload);
}
function readResourceSelectionKey(key) {
    try {
        const payload = JSON.parse(key);
        if (typeof payload.agent !== "string" ||
            typeof payload.category !== "string" ||
            typeof payload.resourcePath !== "string") {
            return null;
        }
        return {
            agent: payload.agent,
            category: payload.category,
            ...(payload.sourceScope ? { sourceScope: payload.sourceScope } : {}),
            resourcePath: payload.resourcePath,
        };
    }
    catch {
        return null;
    }
}
export function buildExternalAgentImportSelections(selectedKeys, targetScope, importMode) {
    const grouped = new Map();
    for (const key of selectedKeys) {
        const payload = readResourceSelectionKey(key);
        if (!payload) {
            continue;
        }
        const groupKey = JSON.stringify([
            payload.agent,
            payload.category,
            payload.sourceScope ?? null,
        ]);
        const selection = grouped.get(groupKey) ?? {
            agent: payload.agent,
            category: payload.category,
            ...(payload.sourceScope ? { sourceScope: payload.sourceScope } : {}),
            targetScope,
            importMode,
            ...(payload.category === "skills"
                ? { skillPaths: [] }
                : payload.category === "commands"
                    ? { commandPaths: [] }
                    : payload.category === "plugins"
                        ? { pluginPaths: [] }
                        : { mcpServerPaths: [] }),
        };
        if (payload.category === "skills") {
            selection.skillPaths = [...(selection.skillPaths ?? []), payload.resourcePath];
        }
        else if (payload.category === "commands") {
            selection.commandPaths = [...(selection.commandPaths ?? []), payload.resourcePath];
        }
        else if (payload.category === "plugins") {
            selection.pluginPaths = [...(selection.pluginPaths ?? []), payload.resourcePath];
        }
        else {
            selection.mcpServerPaths = [...(selection.mcpServerPaths ?? []), payload.resourcePath];
        }
        grouped.set(groupKey, selection);
    }
    return [...grouped.values()];
}
function normalizeError(error) {
    return error instanceof Error ? error.message : String(error);
}
function getImportResults(result, category) {
    return result?.taskResults.flatMap((taskResult) => category === "skills"
        ? taskResult.skillResults ?? []
        : category === "commands"
            ? taskResult.commandResults ?? []
            : category === "plugins"
                ? taskResult.pluginResults ?? []
                : taskResult.mcpServerResults ?? []) ?? [];
}
function formatAgentName(agent, intl) {
    switch (agent) {
        case "claudeCode":
            return intl.formatMessage({ id: "settingsSync.agent.claudeCode" });
        case "codexCli":
            return intl.formatMessage({ id: "settingsSync.agent.codexCli" });
        case "openCode":
            return intl.formatMessage({ id: "settingsSync.agent.openCode" });
        case "openClaw":
            return intl.formatMessage({ id: "settingsSync.agent.openClaw" });
        case "augment":
            return intl.formatMessage({ id: "settingsSync.agent.augment" });
        case "continue":
            return intl.formatMessage({ id: "settingsSync.agent.continue" });
        case "goose":
            return intl.formatMessage({ id: "settingsSync.agent.goose" });
        case "qwenCode":
            return intl.formatMessage({ id: "settingsSync.agent.qwenCode" });
        case "qode":
            return intl.formatMessage({ id: "settingsSync.agent.qode" });
        case "qodeCn":
            return intl.formatMessage({ id: "settingsSync.agent.qodeCn" });
        case "windsurf":
            return intl.formatMessage({ id: "settingsSync.agent.windsurf" });
        case "trae":
            return intl.formatMessage({ id: "settingsSync.agent.trae" });
        case "traeCn":
            return intl.formatMessage({ id: "settingsSync.agent.traeCn" });
        case "kiroCli":
            return intl.formatMessage({ id: "settingsSync.agent.kiroCli" });
        case "roo":
            return intl.formatMessage({ id: "settingsSync.agent.roo" });
        case "codeBuddy":
            return intl.formatMessage({ id: "settingsSync.agent.codeBuddy" });
        case "agents":
            return intl.formatMessage({ id: "settingsSync.agent.agents" });
        case "zcode":
            return intl.formatMessage({ id: "settingsSync.agent.zcode" });
        default:
            return agent;
    }
}
function getResourceCategory(agent, resourceCategory) {
    return agent.categories.find((category) => category.category === resourceCategory);
}
const SOURCE_ROOT_SCOPE_ORDER = ["global", "project"];
const IMPORT_MODE_ORDER = ["symlink", "copy"];
function formatSourceRootScope(scope, intl, resourceCategory) {
    return intl.formatMessage({ id: `settings.${resourceCategory}.import.scope.${scope}` });
}
function getSourceRootItems(sourceRoot, resourceCategory) {
    return resourceCategory === "skills"
        ? sourceRoot.skills ?? []
        : resourceCategory === "commands"
            ? sourceRoot.commands ?? []
            : resourceCategory === "plugins"
                ? sourceRoot.plugins ?? []
                : sourceRoot.mcpServers ?? [];
}
function normalizePathForScope(path) {
    return path.replaceAll("\\", "/").replace(/\/+$/u, "");
}
function inferSourceRootScope(path, workspacePath) {
    if (!workspacePath) {
        return "global";
    }
    const normalizedPath = normalizePathForScope(path);
    const normalizedWorkspacePath = normalizePathForScope(workspacePath);
    return normalizedPath === normalizedWorkspacePath ||
        normalizedPath.startsWith(`${normalizedWorkspacePath}/`)
        ? "project"
        : "global";
}
function getSourceRoots(agent, workspacePath, resourceCategory) {
    const category = getResourceCategory(agent, resourceCategory);
    if (!category) {
        return [];
    }
    if (category.sourceRoots && category.sourceRoots.length > 0) {
        return category.sourceRoots;
    }
    return (category.sourcePaths ?? []).map((path) => ({
        scope: inferSourceRootScope(path, workspacePath),
        path,
        discoveredCount: category.discoveredCount,
        importableCount: category.importableCount,
        skippedCount: category.skippedCount,
    }));
}
function groupAgentsBySourceRootScope(agents, workspacePath, resourceCategory) {
    return SOURCE_ROOT_SCOPE_ORDER.map((scope) => ({
        scope,
        rows: agents.flatMap((agent) => getSourceRoots(agent, workspacePath, resourceCategory)
            .filter((sourceRoot) => sourceRoot.scope === scope)
            .filter((sourceRoot) => getSourceRootItems(sourceRoot, resourceCategory).some((item) => item.importable))
            .map((sourceRoot) => ({ agent, sourceRoot }))),
    }));
}
export function SkillsImportDialog(props) {
    return _jsx(ExternalAgentImportDialog, { ...props, category: "skills" });
}
export function CommandsImportDialog(props) {
    return _jsx(ExternalAgentImportDialog, { ...props, category: "commands" });
}
export function PluginsImportDialog(props) {
    return _jsx(ExternalAgentImportDialog, { ...props, category: "plugins" });
}
export function McpServersImportDialog(props) {
    return _jsx(ExternalAgentImportDialog, { ...props, category: "mcpServers" });
}
export function useExternalAgentImportCategoryState({ category, enabled, settingsSyncService, workspaceIdentity, workspacePath, }) {
    const [loading, setLoading] = useState(false);
    const [discovery, setDiscovery] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [expandedSourceKeys, setExpandedSourceKeys] = useState([]);
    const [activeScope, setActiveScope] = useState("global");
    const [importTargetScope, setImportTargetScope] = useState("global");
    const [importMode, setImportMode] = useState("symlink");
    const [error, setError] = useState(null);
    const totalImportableCount = useMemo(() => discovery?.agents.reduce((sum, agent) => sum +
        agent.categories.reduce((categorySum, category) => categorySum + category.importableCount, 0), 0) ?? 0, [discovery]);
    const loadDiscovery = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const nextDiscovery = await settingsSyncService.detect({
                workspacePath: workspacePath ?? undefined,
                workspaceIdentity,
                categories: [category],
                intent: "manualImport",
            });
            setDiscovery(nextDiscovery);
            setSelectedKeys([]);
            setExpandedSourceKeys([]);
            setActiveScope("global");
            setImportTargetScope("global");
        }
        catch (loadError) {
            const message = normalizeError(loadError);
            logger.error("[ExternalAgentImportDialog] scan failed", { category, error: message });
            setError(message);
            setDiscovery({ agents: [] });
            setSelectedKeys([]);
        }
        finally {
            setLoading(false);
        }
    }, [category, settingsSyncService, workspaceIdentity, workspacePath]);
    useEffect(() => {
        if (!enabled || discovery || loading) {
            return;
        }
        void loadDiscovery();
    }, [discovery, enabled, loadDiscovery, loading]);
    const toggleSelection = useCallback((key) => {
        setSelectedKeys((current) => {
            const next = new Set(current);
            if (next.has(key)) {
                next.delete(key);
            }
            else {
                next.add(key);
            }
            return [...next];
        });
    }, []);
    const setResourceSelection = useCallback((keys, checked) => {
        setSelectedKeys((current) => {
            const next = new Set(current);
            for (const key of keys) {
                if (checked) {
                    next.add(key);
                }
                else {
                    next.delete(key);
                }
            }
            return [...next];
        });
    }, []);
    const toggleExpanded = useCallback((key) => {
        setExpandedSourceKeys((current) => current.includes(key)
            ? current.filter((item) => item !== key)
            : [...current, key]);
    }, []);
    const setActiveSourceScope = useCallback((nextScope) => {
        setActiveScope(nextScope);
        setImportTargetScope(nextScope);
    }, []);
    const selections = useMemo(() => buildExternalAgentImportSelections(selectedKeys, importTargetScope, importMode), [importMode, importTargetScope, selectedKeys]);
    return {
        activeScope,
        discovery,
        error,
        expandedSourceKeys,
        importMode,
        importTargetScope,
        loading,
        selectedCount: selectedKeys.length,
        selectedKeys,
        selections,
        totalImportableCount,
        loadDiscovery,
        setActiveSourceScope,
        setImportMode,
        setImportTargetScope,
        setResourceSelection,
        toggleExpanded,
        toggleSelection,
    };
}
function ExternalAgentImportDialog({ category, open, workspacePath, workspaceIdentity, settingsSyncService, onOpenChange, onImported, }) {
    const { intl } = useZCodeIntl();
    const [step, setStep] = useState("selection");
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState(null);
    const [importError, setImportError] = useState(null);
    const importState = useExternalAgentImportCategoryState({
        category,
        enabled: open,
        settingsSyncService,
        workspacePath,
        workspaceIdentity,
    });
    const { activeScope, discovery, error, expandedSourceKeys, importMode, importTargetScope, loading, selectedCount, selectedKeys, totalImportableCount, } = importState;
    const importProgress = step === "complete" ? 100 : importing ? 62 : 0;
    const importedResults = useMemo(() => getImportResults(result, category), [category, result]);
    const displayError = error ?? importError;
    useEffect(() => {
        if (!open) {
            return;
        }
        setResult(null);
        setImportError(null);
        setStep("selection");
    }, [open]);
    const startImport = useCallback(async (targetScope) => {
        if (selectedKeys.length === 0) {
            return;
        }
        setImporting(true);
        setStep("importing");
        setImportError(null);
        try {
            logger.debug("[ExternalAgentImportDialog] import start", {
                category,
                targetScope,
                importMode,
                selectedCount: selectedKeys.length,
            });
            const importResult = await settingsSyncService.importSelected({
                workspacePath: workspacePath ?? undefined,
                workspaceIdentity,
                selections: buildExternalAgentImportSelections(selectedKeys, targetScope, importMode),
            });
            setResult(importResult);
            setStep("complete");
            await onImported();
        }
        catch (importError) {
            const message = normalizeError(importError);
            logger.error("[ExternalAgentImportDialog] import failed", { category, error: message });
            setImportError(message);
            setStep("selection");
        }
        finally {
            setImporting(false);
        }
    }, [
        onImported,
        category,
        importMode,
        selectedKeys,
        settingsSyncService,
        workspaceIdentity,
        workspacePath,
    ]);
    const closeLabel = step === "complete"
        ? intl.formatMessage({ id: `settings.${category}.import.finish` })
        : intl.formatMessage({ id: "settingsSync.action.skip" });
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsx(DialogContent, { className: "h-[min(84vh,640px)] max-h-[calc(100vh-2rem)] max-w-2xl overflow-hidden rounded-2xl p-0", children: _jsx("div", { className: "flex h-full min-h-0 min-w-0 flex-col", children: _jsxs("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-5", children: [_jsx(DialogHeader, { className: "shrink-0 sm:-mt-1", children: _jsxs("div", { className: "flex flex-col gap-3 pr-8 sm:flex-row sm:items-center sm:justify-between", children: [_jsx(DialogTitle, { className: "flex min-w-0 items-center text-ui-lg", children: _jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({ id: `settings.${category}.import.title` }) }) }), step === "selection" && !loading && discovery?.agents.length ? (_jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [_jsx(SourceScopeSelect, { category: category, activeScope: activeScope, onActiveScopeChange: importState.setActiveSourceScope }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "settingsSync.action.rescan" }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({ id: "settingsSync.action.rescan" }), onClick: () => void importState.loadDiscovery(), disabled: loading, children: _jsx(RefreshCw, { className: "size-3", "aria-hidden": "true" }) }) })] })) : null] }) }), _jsx("div", { className: "min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card", children: _jsxs("div", { className: "h-full overflow-auto p-3", children: [displayError ? (_jsx("div", { className: "mb-3 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-ui-base text-foreground", children: displayError })) : null, loading ? (_jsxs("div", { className: "flex h-full min-h-48 items-center justify-center gap-2 rounded-lg bg-surface px-4 py-10 text-ui-base text-foreground-subtle", children: [_jsx(Loader2Icon, { className: "size-4 animate-spin" }), intl.formatMessage({ id: `settings.${category}.import.scanning` })] })) : step === "importing" ? (_jsxs("div", { className: "space-y-4 rounded-lg bg-surface px-4 py-5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 text-ui-base text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({ id: `settings.${category}.import.importing` }) }), _jsxs("span", { children: [importProgress, "%"] })] }), _jsx(Progress, { value: importProgress, className: "h-2 rounded-full bg-background" })] })) : step === "complete" ? (_jsxs("div", { className: "space-y-4", children: [_jsx(ImportStatsSummary, { category: category, result: result }), _jsx(ImportResultList, { category: category, results: importedResults })] })) : discovery && discovery.agents.length > 0 ? (_jsx(ImportSelectionList, { category: category, discovery: discovery, workspacePath: workspacePath, activeScope: activeScope, selectedKeys: selectedKeys, expandedSourceKeys: expandedSourceKeys, onToggleSelection: importState.toggleSelection, onSetResourceSelection: importState.setResourceSelection, onToggleExpanded: importState.toggleExpanded })) : (_jsx("div", { className: "rounded-lg border border-dashed border-border bg-surface px-4 py-10 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: `settings.${category}.import.empty` }) }))] }) }), _jsxs("div", { className: cn("flex shrink-0 flex-wrap items-center gap-3", step === "complete" ? "justify-end" : "justify-between"), children: [step === "complete" ? null : (_jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2", children: [_jsx("div", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: `settings.${category}.import.summary` }, { count: String(totalImportableCount) }) }), step === "selection" && category !== "mcpServers" ? (_jsx(ImportModeSelect, { category: category, importMode: importMode, onImportModeChange: importState.setImportMode })) : null] })), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [step === "complete" ? (_jsx(Button, { type: "button", size: "lg", onClick: () => onOpenChange(false), children: closeLabel })) : null, step === "selection" ? (_jsx(ImportTargetDropdownButton, { category: category, targetScope: importTargetScope, disabled: selectedCount === 0 || loading, workspacePath: workspacePath, onTargetScopeChange: importState.setImportTargetScope, onImport: (targetScope) => void startImport(targetScope) })) : null] })] })] }) }) }) }));
}
export function ExternalAgentImportSelectionPanel({ category, state, workspacePath, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex h-full min-h-0 flex-col gap-3", children: [_jsxs("div", { className: "flex shrink-0 items-center justify-between gap-3", children: [_jsx("div", { className: "min-w-0 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: `settings.${category}.import.summary` }, { count: String(state.totalImportableCount) }) }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [_jsx(SourceScopeSelect, { category: category, activeScope: state.activeScope, onActiveScopeChange: state.setActiveSourceScope }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "settingsSync.action.rescan" }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({ id: "settingsSync.action.rescan" }), onClick: () => void state.loadDiscovery(), disabled: state.loading, children: _jsx(RefreshCw, { className: "size-3", "aria-hidden": "true" }) }) })] })] }), _jsx("div", { className: "min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card", children: _jsxs("div", { className: "h-full overflow-auto p-3", children: [state.error ? (_jsx("div", { className: "mb-3 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-ui-base text-foreground", children: state.error })) : null, state.loading ? (_jsxs("div", { className: "flex h-full min-h-48 items-center justify-center gap-2 rounded-lg bg-surface px-4 py-10 text-ui-base text-foreground-subtle", children: [_jsx(Loader2Icon, { className: "size-4 animate-spin" }), intl.formatMessage({ id: `settings.${category}.import.scanning` })] })) : state.discovery && state.discovery.agents.length > 0 ? (_jsx(ImportSelectionList, { category: category, discovery: state.discovery, workspacePath: workspacePath, activeScope: state.activeScope, selectedKeys: state.selectedKeys, expandedSourceKeys: state.expandedSourceKeys, onToggleSelection: state.toggleSelection, onSetResourceSelection: state.setResourceSelection, onToggleExpanded: state.toggleExpanded })) : (_jsx("div", { className: "rounded-lg border border-dashed border-border bg-surface px-4 py-10 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: `settings.${category}.import.empty` }) }))] }) }), _jsxs("div", { className: "flex shrink-0 flex-wrap items-center justify-between gap-3", children: [_jsx("div", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: `settings.${category}.import.selectionCount` }, {
                            selected: String(state.selectedCount),
                            total: String(state.totalImportableCount),
                        }) }), _jsxs("div", { className: "flex items-center gap-3", children: [category !== "mcpServers" ? (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "shrink-0 text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: `settings.${category}.import.modeLabel` }) }), _jsx(ImportModeSelect, { category: category, importMode: state.importMode, onImportModeChange: state.setImportMode })] })) : null, _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "shrink-0 text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: `settings.${category}.import.targetLabel` }) }), _jsx(ImportTargetScopeSelect, { category: category, targetScope: state.importTargetScope, workspacePath: workspacePath, onTargetScopeChange: state.setImportTargetScope })] })] })] })] }));
}
function ImportModeSelect({ category, importMode, onImportModeChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex items-center gap-1 text-ui-base text-foreground-subtle", children: [_jsxs(Select, { value: importMode, onValueChange: (nextMode) => {
                    onImportModeChange(nextMode);
                }, children: [_jsx(SelectTrigger, { size: "sm", variant: "ghost", "aria-label": intl.formatMessage({ id: `settings.${category}.import.modeLabel` }), className: "w-fit shrink-0 justify-end border-border bg-surface text-right font-medium text-foreground hover:bg-surface-hover hover:text-foreground aria-expanded:bg-selected *:data-[slot=select-value]:justify-end", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { align: "end", children: IMPORT_MODE_ORDER.map((mode) => (_jsx(SelectItem, { value: mode, children: intl.formatMessage({ id: `settings.${category}.import.mode.${mode}` }) }, mode))) })] }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: `settings.${category}.import.modeLabel` }), description: intl.formatMessage({
                    id: importMode === "symlink"
                        ? `settings.${category}.import.mode.symlink.description`
                        : `settings.${category}.import.mode.copy.description`,
                }), side: "top", align: "start", children: _jsx("span", { role: "img", "aria-label": intl.formatMessage({ id: `settings.${category}.import.modeHelp` }), className: "inline-flex size-4 items-center justify-center rounded-full text-foreground-subtlest hover:bg-hover hover:text-foreground", children: _jsx(AlertCircleIcon, { className: "size-3", "aria-hidden": "true" }) }) })] }));
}
function ImportTargetDropdownButton({ category, targetScope, disabled, workspacePath, onTargetScopeChange, onImport, }) {
    const { intl } = useZCodeIntl();
    const hasWorkspaceTarget = Boolean(workspacePath);
    const canImportToTarget = targetScope === "global" || hasWorkspaceTarget;
    const activeTargetLabelId = targetScope === "project"
        ? `settings.${category}.import.target.project`
        : `settings.${category}.import.target.global`;
    return (_jsxs("div", { className: "flex items-center", children: [_jsx(Button, { type: "button", size: "lg", disabled: disabled || !canImportToTarget, "aria-label": intl.formatMessage({ id: activeTargetLabelId }), className: "rounded-r-none border-r-0", onClick: () => onImport(targetScope), children: intl.formatMessage({ id: activeTargetLabelId }) }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", size: "lg", className: "rounded-l-none border-l-0 px-2", disabled: disabled, "aria-label": intl.formatMessage({ id: `settings.${category}.import.targetLabel` }), children: _jsx(ChevronDown, { className: "size-3.5", "aria-hidden": "true" }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-44", children: [_jsx(DropdownMenuItem, { onSelect: () => onTargetScopeChange("global"), children: intl.formatMessage({ id: `settings.${category}.import.target.global` }) }), _jsx(DropdownMenuItem, { disabled: !hasWorkspaceTarget, onSelect: () => onTargetScopeChange("project"), children: intl.formatMessage({ id: `settings.${category}.import.target.project` }) })] })] })] }));
}
function ImportTargetScopeSelect({ category, targetScope, workspacePath, onTargetScopeChange, }) {
    const { intl } = useZCodeIntl();
    const hasWorkspaceTarget = Boolean(workspacePath);
    return (_jsxs(Select, { value: targetScope, onValueChange: (nextScope) => {
            onTargetScopeChange(nextScope);
        }, children: [_jsx(SelectTrigger, { size: "sm", variant: "ghost", "aria-label": intl.formatMessage({ id: `settings.${category}.import.targetLabel` }), className: "w-fit shrink-0 justify-end border-border bg-surface text-right font-medium text-foreground hover:bg-surface-hover hover:text-foreground aria-expanded:bg-selected *:data-[slot=select-value]:justify-end", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { align: "end", children: [_jsx(SelectItem, { value: "global", children: intl.formatMessage({ id: `settings.${category}.import.scope.global` }) }), _jsx(SelectItem, { value: "project", disabled: !hasWorkspaceTarget, children: intl.formatMessage({ id: `settings.${category}.import.scope.project` }) })] })] }));
}
function ImportStatsSummary({ category, result, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-surface px-3 py-2 text-ui-xs text-foreground-subtle", children: [_jsx(ImportStat, { label: intl.formatMessage({ id: `settings.${category}.import.imported` }), value: result?.successCount ?? 0 }), _jsx(ImportStat, { label: intl.formatMessage({ id: `settings.${category}.import.skipped` }), value: result?.skippedCount ?? 0 }), _jsx(ImportStat, { label: intl.formatMessage({ id: `settings.${category}.import.failed` }), value: result?.failedCount ?? 0 })] }));
}
function ImportStat({ label, value }) {
    return (_jsxs("span", { className: "inline-flex items-baseline gap-1.5", children: [_jsx("span", { className: "font-mono text-ui-base font-medium text-foreground", children: value }), _jsx("span", { children: label })] }));
}
function ImportResultList({ category, results, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: `settings.${category}.import.resultList` }) }), _jsx("div", { className: "overflow-hidden rounded-lg bg-card", children: results.length === 0 ? (_jsx("div", { className: "px-3 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: `settings.${category}.import.resultEmpty` }) })) : (_jsx("div", { className: "divide-y divide-border", children: results.map((itemResult) => (_jsx(ImportResultRow, { category: category, result: itemResult }, `${itemResult.status}:${itemResult.sourceScope}:${itemResult.path}`))) })) })] }));
}
function ImportResultRow({ category, result, }) {
    return (_jsxs("div", { className: "flex min-w-0 items-center gap-2.5 px-3 py-2", children: [_jsx(ImportStatusBadge, { category: category, result: result }), _jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: result.name }), "version" in result && result.version ? (_jsx(Badge, { variant: "outline", className: "h-5 border-border bg-surface px-1.5 font-mono text-ui-xs font-normal text-foreground-subtle", children: result.version.startsWith("v") ? result.version : `v${result.version}` })) : null] })] }));
}
function ImportStatusBadge({ category, result, }) {
    const { intl } = useZCodeIntl();
    const label = intl.formatMessage({
        id: result.status === "imported"
            ? `settings.${category}.import.imported`
            : result.status === "skipped"
                ? `settings.${category}.import.skipped`
                : `settings.${category}.import.failed`,
    });
    const reasonLabel = result.skipReason
        ? intl.formatMessage({ id: `settings.${category}.import.skipReason.${result.skipReason}` })
        : null;
    const accessibleLabel = reasonLabel ? `${label}: ${reasonLabel}` : label;
    const Icon = result.status === "imported"
        ? CheckIcon
        : result.status === "skipped"
            ? AlertCircleIcon
            : XIcon;
    return (_jsx("span", { "aria-label": accessibleLabel, role: "img", className: cn("flex size-3 shrink-0 items-center justify-center rounded-full", result.status === "imported" && "bg-success text-success-foreground", result.status === "skipped" && "bg-warning text-warning-foreground", result.status === "failed" && "bg-destructive text-destructive-foreground"), title: accessibleLabel, children: _jsx(Icon, { className: "size-2", "aria-hidden": "true" }) }));
}
function SourceScopeSelect({ category, activeScope, onActiveScopeChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(Select, { value: activeScope, onValueChange: (nextScope) => {
            onActiveScopeChange(nextScope);
        }, children: [_jsx(SelectTrigger, { size: "sm", variant: "ghost", "aria-label": intl.formatMessage({ id: `settings.${category}.import.scopeLabel` }), className: "w-fit shrink-0 justify-end text-right text-foreground-subtle hover:text-foreground *:data-[slot=select-value]:justify-end", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { align: "end", children: SOURCE_ROOT_SCOPE_ORDER.map((scope) => (_jsx(SelectItem, { value: scope, children: formatSourceRootScope(scope, intl, category) }, scope))) })] }));
}
function ImportSelectionList({ category, discovery, workspacePath, activeScope, selectedKeys, expandedSourceKeys, onToggleSelection, onSetResourceSelection, onToggleExpanded, }) {
    const { intl } = useZCodeIntl();
    const selected = useMemo(() => new Set(selectedKeys), [selectedKeys]);
    const expanded = useMemo(() => new Set(expandedSourceKeys), [expandedSourceKeys]);
    const scopes = useMemo(() => groupAgentsBySourceRootScope(discovery.agents, workspacePath, category), [category, discovery.agents, workspacePath]);
    const activeGroup = scopes.find((scope) => scope.scope === activeScope);
    const activeImportableResourceKeys = useMemo(() => activeGroup?.rows.flatMap(({ agent, sourceRoot }) => {
        const resourceCategory = getResourceCategory(agent, category);
        if (!resourceCategory) {
            return [];
        }
        return getSourceRootItems(sourceRoot, category)
            .filter((item) => item.importable)
            .map((item) => getResourceSelectionKey({
            agent: agent.agent,
            category,
            sourceScope: sourceRoot.scope,
            resourcePath: item.path,
        }));
    }) ?? [], [activeGroup, category]);
    const activeSelectedCount = activeImportableResourceKeys.filter((key) => selected.has(key)).length;
    const allActiveSelected = activeImportableResourceKeys.length > 0 &&
        activeSelectedCount === activeImportableResourceKeys.length;
    const partiallyActiveSelected = activeSelectedCount > 0 && activeSelectedCount < activeImportableResourceKeys.length;
    const toggleAllLabel = intl.formatMessage({
        id: allActiveSelected
            ? `settings.${category}.import.clearAll`
            : `settings.${category}.import.selectAll`,
    });
    return (_jsxs("div", { className: "flex w-full flex-col gap-1", children: [activeImportableResourceKeys.length > 0 ? (_jsxs("div", { className: "mb-1 flex min-w-0 items-center justify-between gap-2 px-2", children: [_jsxs("button", { type: "button", role: "checkbox", "aria-checked": partiallyActiveSelected ? "mixed" : allActiveSelected, "aria-label": toggleAllLabel, onClick: () => onSetResourceSelection(activeImportableResourceKeys, !allActiveSelected), className: "flex min-w-0 items-center gap-2 rounded-md py-1 pr-2 text-left text-ui-base text-foreground-subtle transition-colors hover:text-foreground", children: [_jsxs("span", { className: cn("flex size-4 shrink-0 items-center justify-center rounded-sm border border-border", (allActiveSelected || partiallyActiveSelected) &&
                                    "border-primary bg-primary text-primary-foreground"), children: [allActiveSelected ? _jsx(CheckIcon, { className: "size-3.5", "aria-hidden": "true" }) : null, partiallyActiveSelected ? (_jsx(MinusIcon, { className: "size-3.5", "aria-hidden": "true" })) : null] }), _jsx("span", { className: "shrink-0", children: toggleAllLabel })] }), _jsx("div", { className: "min-w-0 text-right text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: `settings.${category}.import.selectionCount` }, {
                            selected: String(activeSelectedCount),
                            total: String(activeImportableResourceKeys.length),
                        }) })] })) : null, _jsxs("div", { className: "flex flex-col gap-1", children: [activeGroup?.rows.length === 0 ? (_jsx("div", { className: "rounded-lg border border-dashed border-border bg-card px-3 py-6 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: `settings.${category}.import.scopeEmpty` }) })) : null, activeGroup?.rows.map(({ agent, sourceRoot }) => {
                        const resourceCategory = getResourceCategory(agent, category);
                        if (!resourceCategory) {
                            return null;
                        }
                        const key = getSourceSelectionKey(agent.agent, category, sourceRoot.scope);
                        const sourceKey = `${key}:${sourceRoot.path}`;
                        const items = getSourceRootItems(sourceRoot, category).filter((item) => item.importable);
                        const importableResourceKeys = items
                            .map((item) => getResourceSelectionKey({
                            agent: agent.agent,
                            category,
                            sourceScope: sourceRoot.scope,
                            resourcePath: item.path,
                        }));
                        const selectedImportableCount = importableResourceKeys.filter((itemKey) => selected.has(itemKey)).length;
                        const checked = importableResourceKeys.length > 0 &&
                            selectedImportableCount === importableResourceKeys.length;
                        const partiallyChecked = selectedImportableCount > 0 && selectedImportableCount < importableResourceKeys.length;
                        const disabled = importableResourceKeys.length === 0;
                        const isExpanded = expanded.has(sourceKey);
                        return (_jsxs("div", { className: "rounded-lg", children: [_jsxs("div", { className: cn("flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors", disabled
                                        ? "opacity-70"
                                        : "hover:bg-surface-hover/50"), children: [_jsx("button", { type: "button", disabled: disabled, "aria-label": intl.formatMessage({
                                                id: checked
                                                    ? `settings.${category}.import.deselectSource`
                                                    : `settings.${category}.import.selectSource`,
                                            }), onClick: () => onSetResourceSelection(importableResourceKeys, !checked), className: cn("flex size-5 shrink-0 items-center justify-center rounded-md", disabled ? "cursor-default" : "cursor-pointer"), children: _jsxs("span", { className: cn("flex size-4 items-center justify-center rounded-sm border border-border", (checked || partiallyChecked) && !disabled &&
                                                    "border-primary bg-primary text-primary-foreground"), children: [checked && !disabled ? _jsx(CheckIcon, { className: "size-3.5" }) : null, partiallyChecked && !disabled ? _jsx(MinusIcon, { className: "size-3.5" }) : null] }) }), _jsxs("button", { type: "button", onClick: () => onToggleExpanded(sourceKey), className: "flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1 text-left", children: [_jsx("span", { className: "text-ui-base font-medium text-foreground", children: formatAgentName(agent.agent, intl) }), _jsx("span", { className: "min-w-0 break-all font-mono text-ui-xs text-foreground-subtle", children: sourceRoot.path }), items.length > 0 ? (_jsx("span", { className: "text-ui-xs text-foreground-subtlest", children: intl.formatMessage({ id: `settings.${category}.import.itemCount` }, { count: String(items.length) }) })) : null] }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({
                                                id: isExpanded
                                                    ? `settings.${category}.import.collapseSource`
                                                    : `settings.${category}.import.expandSource`,
                                            }), onClick: () => onToggleExpanded(sourceKey), className: "shrink-0", children: isExpanded ? (_jsx(ChevronDown, { className: "size-3" })) : (_jsx(ChevronRight, { className: "size-3" })) })] }), isExpanded ? (_jsx("div", { className: "ml-9 border-l border-border pl-3", children: items.map((item) => (_jsx(ResourceSelectionRow, { agent: agent, category: category, sourceScope: sourceRoot.scope, selected: selected, item: item, onToggleSelection: onToggleSelection }, `${sourceKey}:${item.path}`))) })) : null] }, sourceKey));
                    })] })] }));
}
function ResourceSelectionRow({ agent, category, sourceScope, selected, item, onToggleSelection, }) {
    const itemKey = getResourceSelectionKey({
        agent: agent.agent,
        category,
        sourceScope,
        resourcePath: item.path,
    });
    const checked = selected.has(itemKey);
    return (_jsx("button", { type: "button", onClick: () => onToggleSelection(itemKey), className: "flex w-full min-w-0 items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-hover/50", children: _jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: cn("flex size-4 shrink-0 items-center justify-center rounded-sm border border-border", checked && "border-primary bg-primary text-primary-foreground"), children: checked ? _jsx(CheckIcon, { className: "size-3.5" }) : null }), _jsx("span", { className: "min-w-0 truncate text-ui-base text-foreground", children: item.name }), "version" in item && item.version ? (_jsx(Badge, { variant: "outline", className: "h-5 border-border bg-surface px-1.5 font-mono text-ui-xs font-normal text-foreground-subtle", children: item.version.startsWith("v") ? item.version : `v${item.version}` })) : null] }) }));
}
//# sourceMappingURL=ExternalAgentImportDialog.js.map