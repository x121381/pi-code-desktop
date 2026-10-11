import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- 远端 MCP 同步弹窗集中维护加载、选择、结果和批量选择状态，拆分会增加跨状态传递复杂度。 */
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircleIcon, Loader2, Server, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { formatRemoteSkillSyncTarget } from "@/settings/RemoteSkillSyncDialog.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { isRemoteSyncPreflightTimeoutError, runRemoteSyncPreflightWithTimeout, shouldStartRemoteSyncOperation, } from "@/settings/RemoteSyncActions.js";
export function buildRemoteMcpSyncRows(candidates, statuses) {
    const statusByName = new Map(statuses.map((status) => [status.name, status]));
    return candidates.map((candidate) => ({
        candidate,
        exists: statusByName.get(candidate.name)?.exists ?? false,
    }));
}
export function resolveDefaultRemoteMcpSyncSelection(rows) {
    return new Set(rows.filter((row) => !row.exists).map((row) => row.candidate.id));
}
export function filterRemoteMcpSyncRows(rows, showExistingRemoteMcp) {
    return showExistingRemoteMcp ? [...rows] : rows.filter((row) => !row.exists);
}
export function buildRemoteMcpSyncImportParams(params) {
    return {
        servers: params.exported.servers,
        localHomeDir: params.exported.localHomeDir || params.localHomeDir,
        localWorkspacePath: params.localWorkspacePath,
        remoteWorkspacePath: params.remoteWorkspacePath,
        overwrite: false,
    };
}
function resolveMcpTypeLabel(config) {
    if (typeof config.type === "string" && config.type.trim()) {
        return config.type.trim();
    }
    if (typeof config.command === "string" && config.command.trim()) {
        return "stdio";
    }
    if (typeof config.url === "string" && config.url.trim()) {
        return "http";
    }
    return "unknown";
}
export function RemoteMcpSyncTitle() {
    const { intl } = useZCodeIntl();
    const [warningTooltipOpen, setWarningTooltipOpen] = useState(false);
    const warningTitle = intl.formatMessage({
        id: "settings.mcp.remoteSync.warningTitle",
    });
    return (_jsxs(DialogTitle, { className: "flex min-w-0 items-center gap-2 pr-8", children: [_jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({ id: "settings.mcp.remoteSync.title" }) }), _jsx(ControlHintTooltip, { open: warningTooltipOpen, title: warningTitle, description: intl.formatMessage({
                    id: "settings.mcp.remoteSync.warningDescription",
                }), side: "right", align: "center", children: _jsx("span", { "aria-label": warningTitle, className: "inline-flex size-5 items-center justify-center rounded-full text-warning transition-colors hover:bg-hover hover:text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onMouseEnter: () => setWarningTooltipOpen(true), onMouseLeave: () => setWarningTooltipOpen(false), role: "img", children: _jsx(AlertCircleIcon, { className: "size-3.5", "aria-hidden": "true" }) }) })] }));
}
export function RemoteMcpSyncExistingFilterCheckbox({ checked, onCheckedChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("label", { className: "inline-flex h-6 cursor-pointer items-center gap-2 rounded-md px-1 text-ui-base text-foreground-subtle hover:text-foreground", children: [_jsx("input", { type: "checkbox", className: "size-4", checked: checked, onChange: (event) => onCheckedChange(event.currentTarget.checked) }), _jsx("span", { children: intl.formatMessage({ id: "settings.mcp.remoteSync.showExisting" }) })] }));
}
export function RemoteMcpSyncTargetRow({ targetLabel, showExistingRemoteMcp, showExistingFilter, onShowExistingRemoteMcpChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("p", { className: "min-w-0 break-words font-mono text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.mcp.remoteSync.target" }, { target: targetLabel }) }), showExistingFilter ? (_jsx("div", { className: "shrink-0", children: _jsx(RemoteMcpSyncExistingFilterCheckbox, { checked: showExistingRemoteMcp, onCheckedChange: onShowExistingRemoteMcpChange }) })) : null] }));
}
export function RemoteMcpSyncBulkSelectionCheckbox({ selectedCount, totalSelectable, onSelectAll, onClearAll, }) {
    const { intl } = useZCodeIntl();
    const inputRef = useRef(null);
    const disabled = totalSelectable === 0;
    const checked = totalSelectable > 0 && selectedCount >= totalSelectable;
    const indeterminate = totalSelectable > 0 && selectedCount > 0 && selectedCount < totalSelectable;
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);
    return (_jsxs("label", { className: `inline-flex h-6 items-center gap-2 rounded-md px-1 text-ui-base text-foreground-subtle ${disabled ? "opacity-50" : "cursor-pointer hover:text-foreground"}`, children: [_jsx("input", { ref: inputRef, type: "checkbox", className: "size-4", checked: checked, disabled: disabled, "aria-checked": indeterminate ? "mixed" : checked ? "true" : "false", onChange: (event) => {
                    if (event.currentTarget.checked) {
                        onSelectAll();
                    }
                    else {
                        onClearAll();
                    }
                } }), _jsx("span", { children: intl.formatMessage({ id: "settings.mcp.remoteSync.selectAll" }) })] }));
}
export function RemoteMcpSyncSelectionList({ rows, selectedIds, emptyMessageId = "settings.mcp.remoteSync.empty", onToggle, }) {
    const { intl } = useZCodeIntl();
    if (rows.length === 0) {
        return (_jsx("div", { className: "rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: emptyMessageId }) }));
    }
    return (_jsx("div", { className: "grid gap-2", children: rows.map((row) => {
            const checkboxId = `remote-mcp-sync-${row.candidate.id}`;
            const labelId = `${checkboxId}-label`;
            const typeLabel = resolveMcpTypeLabel(row.candidate.config);
            const selected = !row.exists && selectedIds.has(row.candidate.id);
            return (_jsxs("label", { htmlFor: checkboxId, className: `grid grid-cols-[auto_auto_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-ui-base ${row.exists
                    ? "cursor-default"
                    : "cursor-pointer hover:border-border-hover hover:bg-surface-hover"}`, children: [_jsx("input", { id: checkboxId, type: "checkbox", "aria-labelledby": labelId, className: "mt-1 size-4", checked: selected, disabled: row.exists, onChange: (event) => onToggle(row.candidate.id, event.currentTarget.checked) }), _jsx("span", { className: "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground-subtle", "aria-hidden": "true", children: _jsx(Server, { className: "size-4" }) }), _jsxs("span", { className: "min-w-0", children: [_jsxs("span", { className: "flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1", children: [_jsx("span", { id: labelId, className: "font-medium text-foreground", children: row.candidate.name }), _jsx("span", { className: "rounded-md bg-secondary px-1.5 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: typeLabel }), _jsx("span", { className: "rounded-md bg-secondary px-1.5 py-0.5 text-ui-xs font-medium text-foreground-subtle", children: row.candidate.source }), row.exists ? (_jsx("span", { className: "text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "settings.mcp.remoteSync.existing" }) })) : null] }), _jsx("span", { className: "mt-1 block break-all font-mono text-ui-base text-foreground-subtlest", children: row.candidate.path })] })] }, row.candidate.id));
        }) }));
}
function RemoteMcpSyncResultList({ result, }) {
    const { intl } = useZCodeIntl();
    const items = result?.results ?? [];
    if (items.length === 0) {
        return (_jsx("div", { className: "rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.mcp.remoteSync.resultEmpty" }) }));
    }
    return (_jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: _jsx("div", { className: "divide-y divide-border", children: items.map((item) => (_jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "truncate text-ui-base font-medium text-foreground", children: item.name }), item.error ? (_jsx("div", { className: "mt-0.5 break-words text-ui-base text-destructive", children: item.error })) : item.path ? (_jsx("div", { className: "mt-0.5 truncate font-mono text-ui-xs text-foreground-subtlest", children: item.path })) : null] }), _jsx("span", { className: "shrink-0 rounded-md bg-surface px-1.5 py-0.5 text-ui-xs text-foreground-subtle ring-1 ring-border", children: intl.formatMessage({ id: `settings.mcp.remoteSync.${item.status}` }) })] }, `${item.name}-${item.status}`))) }) }));
}
export function RemoteMcpSyncDialog(props) {
    const { intl } = useZCodeIntl();
    const { localMcpSyncService, localWorkspacePath, onOpenChange, onSynced, open, remoteMcpSyncService, remoteTarget, workspacePath, } = props;
    const [step, setStep] = useState("loading");
    const [rows, setRows] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [showExistingRemoteMcp, setShowExistingRemoteMcp] = useState(true);
    const [importResult, setImportResult] = useState(null);
    const [error, setError] = useState(null);
    const [localHomeDir, setLocalHomeDir] = useState("");
    const syncInFlightRef = useRef(false);
    useEffect(() => {
        if (!open) {
            return;
        }
        let cancelled = false;
        setStep("loading");
        setRows([]);
        setSelectedIds(new Set());
        setShowExistingRemoteMcp(true);
        setImportResult(null);
        setError(null);
        setLocalHomeDir("");
        syncInFlightRef.current = false;
        void (async () => {
            try {
                const localResult = await localMcpSyncService.listLocalUserMcpCandidates();
                const remoteResult = await remoteMcpSyncService.listRemoteUserMcpStatuses({
                    names: localResult.candidates.map((candidate) => candidate.name),
                });
                if (cancelled) {
                    return;
                }
                const nextRows = buildRemoteMcpSyncRows(localResult.candidates, remoteResult.statuses);
                setLocalHomeDir(localResult.localHomeDir);
                setRows(nextRows);
                setSelectedIds(resolveDefaultRemoteMcpSyncSelection(nextRows));
                setStep("selection");
            }
            catch (loadError) {
                if (cancelled) {
                    return;
                }
                setError(loadError instanceof Error ? loadError.message : String(loadError));
                setStep("selection");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [localMcpSyncService, open, remoteMcpSyncService]);
    const visibleRows = useMemo(() => filterRemoteMcpSyncRows(rows, showExistingRemoteMcp), [rows, showExistingRemoteMcp]);
    const visibleMissingIds = useMemo(() => visibleRows.filter((row) => !row.exists).map((row) => row.candidate.id), [visibleRows]);
    const selectedSyncIds = useMemo(() => visibleMissingIds.filter((id) => selectedIds.has(id)), [selectedIds, visibleMissingIds]);
    const selectedCount = selectedSyncIds.length;
    const targetLabel = formatRemoteSkillSyncTarget(remoteTarget, workspacePath);
    const handleOpenChange = (nextOpen) => {
        if (!nextOpen && (step === "preflighting" || step === "syncing")) {
            return;
        }
        onOpenChange(nextOpen);
    };
    const toggleMcp = (serverId, checked) => {
        setSelectedIds((current) => {
            const next = new Set(current);
            if (checked) {
                next.add(serverId);
            }
            else {
                next.delete(serverId);
            }
            return next;
        });
    };
    const syncSelected = async () => {
        if (!shouldStartRemoteSyncOperation({
            inFlight: syncInFlightRef.current,
            selectedCount: selectedSyncIds.length,
        })) {
            if (selectedSyncIds.length === 0) {
                setError(intl.formatMessage({ id: "settings.mcp.remoteSync.noSelection" }));
            }
            return;
        }
        syncInFlightRef.current = true;
        setError(null);
        setStep("preflighting");
        try {
            const access = await runRemoteSyncPreflightWithTimeout(() => remoteMcpSyncService.checkRemoteUserMcpWriteAccess());
            if (!access.ok) {
                throw new Error(intl.formatMessage({ id: "settings.remoteSync.preflightFailed" }, { path: access.path, error: access.error ?? "" }));
            }
            setStep("syncing");
            const exported = await localMcpSyncService.exportMcpServers({
                serverIds: selectedSyncIds,
            });
            const result = await remoteMcpSyncService.importMcpServers(buildRemoteMcpSyncImportParams({
                exported,
                localHomeDir,
                localWorkspacePath,
                remoteWorkspacePath: workspacePath,
            }));
            await onSynced();
            setImportResult(result);
            setStep("complete");
        }
        catch (syncError) {
            setError(isRemoteSyncPreflightTimeoutError(syncError)
                ? intl.formatMessage({ id: "settings.remoteSync.preflightTimeout" }, { seconds: String(Math.ceil(syncError.timeoutMs / 1000)) })
                : syncError instanceof Error
                    ? syncError.message
                    : String(syncError));
            setStep("selection");
        }
        finally {
            syncInFlightRef.current = false;
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: handleOpenChange, children: _jsxs(DialogContent, { className: "h-[min(720px,calc(100dvh-2rem))] max-h-[min(720px,calc(100dvh-2rem))] max-w-2xl flex flex-col overflow-hidden", children: [_jsxs(DialogHeader, { children: [_jsx(RemoteMcpSyncTitle, {}), _jsx(RemoteMcpSyncTargetRow, { targetLabel: targetLabel, showExistingRemoteMcp: showExistingRemoteMcp, showExistingFilter: step === "selection" && rows.length > 0, onShowExistingRemoteMcpChange: setShowExistingRemoteMcp })] }), _jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto", children: [error ? (_jsx("div", { className: "mb-3 rounded-lg border border-destructive/40 bg-surface px-3 py-2 text-ui-base text-destructive", children: error })) : null, step === "loading" ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: [_jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.mcp.remoteSync.loading" })] })) : null, step === "preflighting" ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: [_jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.remoteSync.preflighting" })] })) : null, step === "selection" ? (_jsx(RemoteMcpSyncSelectionList, { rows: visibleRows, selectedIds: selectedIds, emptyMessageId: rows.length > 0
                                ? "settings.mcp.remoteSync.filteredEmpty"
                                : undefined, onToggle: toggleMcp })) : null, step === "syncing" ? (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 text-ui-base text-foreground-subtle", children: [_jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.mcp.remoteSync.syncing" })] })) : null, step === "complete" ? (_jsx(RemoteMcpSyncResultList, { result: importResult })) : null] }), _jsxs("div", { className: "flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("div", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.mcp.remoteSync.selectionCount" }, { selected: String(selectedCount), total: String(visibleMissingIds.length) }) }), _jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [step === "selection" ? (_jsx(RemoteMcpSyncBulkSelectionCheckbox, { selectedCount: selectedCount, totalSelectable: visibleMissingIds.length, onSelectAll: () => setSelectedIds(new Set(visibleMissingIds)), onClearAll: () => setSelectedIds(new Set()) })) : null, _jsxs(Button, { type: "button", size: "sm", disabled: step !== "selection" || selectedCount === 0, onClick: syncSelected, children: [_jsx(UploadCloud, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.mcp.remoteSync.start" })] })] })] })] }) }));
}
//# sourceMappingURL=RemoteMcpSyncDialog.js.map