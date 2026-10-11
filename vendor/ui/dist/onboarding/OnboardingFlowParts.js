import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, FolderIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Progress } from "@/components/ui/progress.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { UNLIMITED_SCAN_LIMIT_INPUT } from "@/hooks/useClaudeSessionMigration.js";
import { SettingsSyncSelectionStep } from "@/settings-sync/SettingsSyncSelectionStep.js";
import { Badge } from "@/components/ui/badge.js";
import { ExternalAgentImportSelectionPanel, } from "@/settings/ExternalAgentImportDialog.js";
export { OnboardingWelcomeView } from "@/onboarding/OnboardingWelcomeView.js";
export function createInitialFinishExecutionState() {
    return {
        started: false,
        running: false,
        finished: false,
        sessionCompletedCount: 0,
        sessionTotalCount: 0,
        sessionImportedCount: 0,
        sessionSkippedCount: 0,
        sessionFailedCount: 0,
        agentsFileCompletedCount: 0,
        agentsFileTotalCount: 0,
        agentsFileImportedCount: 0,
        agentsFileSkippedCount: 0,
        agentsFileFailedCount: 0,
        currentTaskLabel: null,
        error: null,
    };
}
export function OnboardingSessionsStep(props) {
    const { intl } = useZCodeIntl();
    const selectedCount = props.selectedWorkspacePaths.length;
    const totalCount = props.workspaceCandidates.length;
    const allSelected = totalCount > 0 && selectedCount === totalCount;
    return (_jsxs("div", { className: "flex h-full min-h-0 flex-1 flex-col gap-6", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs(Select, { value: props.migration.range, onValueChange: (value) => props.migration.setRange(value), children: [_jsx(SelectTrigger, { size: "lg", className: "h-9 justify-between text-ui-base", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "7d", children: intl.formatMessage({ id: "settings.migration.range.7d" }) }), _jsx(SelectItem, { value: "30d", children: intl.formatMessage({ id: "settings.migration.range.30d" }) }), _jsx(SelectItem, { value: "90d", children: intl.formatMessage({ id: "settings.migration.range.90d" }) }), _jsx(SelectItem, { value: "all", children: intl.formatMessage({ id: "settings.migration.range.all" }) })] })] }), _jsxs(Select, { value: props.migration.limitInput, onValueChange: (value) => {
                            props.migration.setLimitInput(value);
                        }, children: [_jsx(SelectTrigger, { size: "lg", className: "h-9 justify-between text-ui-base", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: ["30", "50", "100", UNLIMITED_SCAN_LIMIT_INPUT].map((value) => (_jsx(SelectItem, { value: value, children: value === UNLIMITED_SCAN_LIMIT_INPUT
                                        ? intl.formatMessage({ id: "onboarding.sessions.unlimited" })
                                        : intl.formatMessage({ id: "onboarding.sessions.count" }, { count: value }) }, value))) })] }), _jsxs(Button, { type: "button", variant: "secondary", size: "lg", className: "h-9 min-w-0 px-4 text-ui-base", disabled: !props.migration.supportState.supported || props.migration.isScanning, onClick: () => {
                            void props.migration.scan();
                        }, children: [props.migration.isScanning ? _jsx(Loader2Icon, { className: "size-4 animate-spin" }) : null, intl.formatMessage({ id: "settings.migration.scan" })] })] }), props.migration.scanError ? (_jsx("div", { className: "rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-ui-base text-foreground", children: intl.formatMessage({ id: "settings.migration.scanFailedDescription" }, { error: props.migration.scanError }) })) : null, _jsxs("div", { className: "min-h-0 flex w-full flex-col flex-1 rounded-xl border border-border bg-background", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-border bg-surface/50 px-4 py-3", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx(FolderIcon, { className: "size-4 shrink-0 text-foreground-subtle" }), _jsx("div", { className: "flex min-w-0 items-center gap-2", children: _jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({
                                                id: "onboarding.sessions.chooseWorkspace",
                                            }) }) })] }), _jsx(Button, { type: "button", variant: "secondary", size: "sm", disabled: totalCount === 0, onClick: allSelected ? props.onClearSelection : props.onSelectAll, children: allSelected
                                    ? intl.formatMessage({ id: "settingsSync.selection.clearAll" })
                                    : intl.formatMessage({ id: "settingsSync.selection.selectAll" }) })] }), props.workspaceCandidates.length === 0 ? (_jsx("div", { className: "flex h-full items-center justify-center px-4 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "onboarding.sessions.empty" }) })) : (_jsx("div", { className: "flex-1 min-h-0 flex flex-col gap-1 p-2 overflow-y-auto", children: props.workspaceCandidates.map((workspace) => {
                            const checked = props.selectedWorkspacePaths.includes(workspace.workspacePath);
                            return (_jsxs("button", { type: "button", onClick: () => props.onToggleWorkspace(workspace.workspacePath), className: "flex min-w-0 w-full items-start gap-3 rounded-lg bg-background p-3 pl-3 text-left transition-colors hover:bg-surface-hover/50", children: [_jsx("div", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx("div", { className: `flex size-4 items-center justify-center rounded-sm border ${checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-transparent"}`, children: _jsx(CheckIcon, { className: "size-3.5" }) }) }), _jsxs("div", { className: "min-w-0 flex-1 flex flex-col gap-1", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("div", { className: "min-w-0 truncate text-ui-base font-medium text-foreground", children: workspace.label }), _jsx(Badge, { variant: "outline", children: intl.formatMessage({ id: "onboarding.sessions.count" }, { count: String(workspace.sessionCount) }) })] }), _jsx("div", { className: "w-full truncate text-ui-base text-foreground-subtlest", children: workspace.workspacePath })] })] }, workspace.workspacePath));
                        }) }))] })] }));
}
export function OnboardingAgentSettingsStep(props) {
    const { intl } = useZCodeIntl();
    const { discovery, loading, error } = props.settingsSync.state;
    return (_jsx("div", { className: "flex h-full min-h-0 flex-1 flex-col rounded-xl bg-background border border-border overflow-y-auto", children: _jsx("div", { className: "flex min-h-0 flex-1 flex-col gap-1 border-b border-border p-2", children: discovery ? (_jsx(SettingsSyncSelectionStep, { discovery: discovery, selectedKeys: props.settingsSync.state.selectedKeys, onToggleSelection: props.settingsSync.actions.toggleSelection, onSetCategorySelectionAllAgents: props.settingsSync.actions.setCategorySelectionAllAgents })) : loading ? (_jsxs("div", { className: "flex items-center justify-center gap-2 py-8 text-ui-base text-foreground-subtle", children: [_jsx(Loader2Icon, { className: "size-4 animate-spin" }), _jsx("span", { children: intl.formatMessage({ id: "common.loading" }) })] })) : error ? (_jsx("div", { className: "rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-ui-base text-foreground", children: error })) : (_jsx("div", { className: "flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-background-alt px-4 py-8 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "onboarding.agentSettings.empty" }) })) }) }));
}
export function OnboardingExternalAgentImportStep(props) {
    return (_jsx(ExternalAgentImportSelectionPanel, { category: props.category, state: props.state, workspacePath: props.workspacePath }));
}
export function OnboardingMigrationStep(props) {
    const { intl } = useZCodeIntl();
    return (_jsx("div", { className: "flex h-full min-h-0 flex-col justify-center", children: _jsxs("div", { className: "mx-auto flex w-full max-w-xl flex-col gap-5 rounded-xl bg-background border border-border px-6 py-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 text-ui-base text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({
                                        id: "settingsSync.importing.progressLabel",
                                    }) }), _jsxs("span", { children: [props.overallProgress, "%"] })] }), _jsx(Progress, { value: props.overallProgress, className: "h-2 rounded-full bg-card" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Loader2Icon, { className: "size-5 animate-spin" }), _jsxs("div", { children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "onboarding.migration.progress" }, { progress: String(props.overallProgress) }) }), _jsx("div", { className: "mt-1 text-ui-base text-foreground-subtle", children: props.finishExecution.currentTaskLabel ??
                                        intl.formatMessage({ id: "onboarding.migration.ready" }) })] })] })] }) }));
}
export function OnboardingFinishStep(props) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex h-full min-h-0 flex-col gap-8 pt-8", children: [_jsxs("div", { className: "flex flex-col items-center gap-4 text-center", children: [_jsx("div", { className: "flex size-14 items-center justify-center rounded-full bg-success text-success-foreground", children: _jsx(CheckIcon, { className: "size-7" }) }), _jsx("div", { className: "text-2xl font-medium text-foreground", children: intl.formatMessage({ id: "onboarding.finish.done" }) }), _jsx("div", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "onboarding.finish.ready" }) }), props.finishExecution.error ? (_jsx("div", { className: "rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-ui-base text-foreground", children: props.finishExecution.error })) : null] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [_jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-4", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "onboarding.finish.summary.sessions" }) }), _jsxs("div", { className: "mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-ui-base text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.imported" }) }), _jsx("span", { children: props.finishExecution.sessionImportedCount }), _jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.skipped" }) }), _jsx("span", { children: props.finishExecution.sessionSkippedCount }), _jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.failed" }) }), _jsx("span", { children: props.finishExecution.sessionFailedCount })] })] }), _jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-4", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "onboarding.finish.summary.agentsFile" }) }), _jsxs("div", { className: "mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-ui-base text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.imported" }) }), _jsx("span", { children: props.finishExecution.agentsFileImportedCount }), _jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.skipped" }) }), _jsx("span", { children: props.finishExecution.agentsFileSkippedCount }), _jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.failed" }) }), _jsx("span", { children: props.finishExecution.agentsFileFailedCount })] })] }), _jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-4", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "onboarding.finish.summary.settings" }) }), _jsxs("div", { className: "mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-ui-base text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.imported" }) }), _jsx("span", { children: props.settingsImportedCount }), _jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.skipped" }) }), _jsx("span", { children: props.settingsSkippedCount }), _jsx("span", { children: intl.formatMessage({ id: "onboarding.finish.summary.label.failed" }) }), _jsx("span", { children: props.settingsFailedCount })] })] })] })] }));
}
//# sourceMappingURL=OnboardingFlowParts.js.map