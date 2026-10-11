import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
import { TID_WORKFLOWS_CREATE_VIA_CHAT, TID_WORKFLOWS_LIST, TID_WORKFLOW_GLOBAL_GROUP, testId, } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { SavedWorkflowCard } from "@/settings/saved-workflows/SavedWorkflowCard.js";
import { SavedWorkflowDetailView } from "@/settings/saved-workflows/SavedWorkflowDetailView.js";
import { SavedWorkflowLaunchDialog } from "@/settings/saved-workflows/SavedWorkflowLaunchDialog.js";
import { SavedWorkflowMoveDialog } from "@/settings/saved-workflows/SavedWorkflowMoveDialog.js";
import { GLOBAL_SAVED_WORKFLOW_TARGET } from "@/settings/saved-workflows/globalWorkflowGroupHelpers.js";
import { useSavedWorkflowGlobalGroup } from "@/settings/saved-workflows/useSavedWorkflowGlobalGroup.js";
/**
 * 全局工作流组：顶部固定的「全局」组，空也显示。载体不用
 * `useWorkspaceServicesResolution`——直接用 `useServices().zcodeAgentService`，RPC 带 `{ scope: "global" }`，
 * services 层自选本机运行时。运行走带「运行于」的实参窗；卡片 / 详情可「移到项目…」搬回本地项目。
 * 状态与动作全在 `useSavedWorkflowGlobalGroup`，本文件只负责渲染。
 */
export function SavedWorkflowGlobalGroup(props) {
    const { mode, onBack, onOpenWorkflowRun, onOpenWorkflowArtifact, localProjects, activeProjectKey, } = props;
    const { intl } = useZCodeIntl();
    const group = useSavedWorkflowGlobalGroup(props);
    const { agentService, state, now, busyName, launchEntry, launchPending, launchError, moveEntry, actionTarget, resolveRunProject, setLaunchEntry, setMoveEntry, launch, handleRun, handleRevise, handleCreateViaChat, handleCopyPath, handleDelete, handleCardDelete, handleCardMove, handleOpen, handleOpenRun, handleOpenArtifact, handleMoveSubmit, lastRuns, refresh, } = group;
    const launchDialog = (_jsx(SavedWorkflowLaunchDialog, { entry: launchEntry, scope: "global", projectLabel: intl.formatMessage({ id: "workflows.hub.global.title" }), targets: localProjects, defaultTargetKey: activeProjectKey, pending: launchPending, error: launchError, onOpenChange: (open) => (open ? undefined : setLaunchEntry(null)), onSubmit: (entry, args, target) => void launch(entry, args, target) }));
    const moveDialog = (_jsx(SavedWorkflowMoveDialog, { open: moveEntry !== null, entryName: moveEntry?.name ?? null, targets: localProjects, defaultTargetKey: activeProjectKey, busy: busyName !== null, onOpenChange: (open) => (open ? undefined : setMoveEntry(null)), onSubmit: (target) => void handleMoveSubmit(target) }));
    if (mode.kind === "detail") {
        const entry = state.entries.find((candidate) => candidate.name === mode.name);
        return (_jsxs(_Fragment, { children: [_jsx(SavedWorkflowDetailView, { target: GLOBAL_SAVED_WORKFLOW_TARGET, agentService: agentService, name: mode.name, projectLabel: intl.formatMessage({ id: "workflows.hub.global.title" }), entry: entry, runs: state.runs.filter((run) => run.name === mode.name), now: now, busy: busyName === mode.name, canOpenRun: Boolean(onOpenWorkflowRun), resolveRunProject: resolveRunProject, onBack: onBack, onRun: () => (entry ? handleRun(entry) : undefined), onRevise: () => (entry ? handleRevise(entry) : undefined), onCopyPath: () => (entry ? handleCopyPath(entry) : undefined), onMove: () => (entry ? setMoveEntry(entry) : undefined), onDelete: () => (entry ? void handleDelete(entry) : undefined), onOpenRun: (run) => handleOpenRun(run, mode.name), ...(onOpenWorkflowArtifact === undefined ? {} : { onOpenArtifact: handleOpenArtifact }), onMetaSaved: () => void refresh({ bypassCache: true }), launchDialog: launchDialog }), moveDialog] }));
    }
    const noActionTarget = actionTarget === null;
    const createButton = (_jsxs(Button, { type: "button", size: "lg", "data-icon": "inline-start", "data-testid": testId(TID_WORKFLOWS_CREATE_VIA_CHAT, "global"), disabled: noActionTarget, onClick: handleCreateViaChat, children: [_jsx(Plus, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "workflows.hub.createViaChat" })] }));
    return (_jsxs("div", { "data-testid": TID_WORKFLOW_GLOBAL_GROUP, className: "mt-8 first:mt-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("h3", { className: "flex items-center gap-2 text-ui-base font-medium leading-5 text-foreground", children: [_jsx("span", { className: "truncate", children: intl.formatMessage({ id: "workflows.hub.global.title" }) }), _jsx("span", { className: "rounded-sm border border-border px-1.5 py-0.5 text-ui-xs leading-none text-foreground-subtlest", children: intl.formatMessage({ id: "workflows.hub.global.hint" }) }), state.entries.length > 0 ? (_jsx("span", { className: "font-normal text-foreground-subtlest", children: state.entries.length })) : null] }), noActionTarget ? (_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "workflows.hub.launch.noLocalProject" }), children: _jsx("span", { className: "inline-flex", children: createButton }) })) : (createButton)] }), state.entries.length > 0 ? (_jsx("div", { "data-testid": testId(TID_WORKFLOWS_LIST, "global"), className: "mt-5 grid grid-cols-1 auto-rows-[132px] gap-x-4 gap-y-4 lg:grid-cols-2", children: state.entries.map((entry) => (_jsx(SavedWorkflowCard, { entry: entry, lastRun: lastRuns.get(entry.name), now: now, busy: busyName === entry.name, onOpen: handleOpen, onRun: handleRun, onRevise: handleRevise, onCopyPath: handleCopyPath, onMove: handleCardMove, onDelete: handleCardDelete }, entry.path))) })) : state.errorCode === -32602 ? (_jsx("p", { className: "mt-5 text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "workflows.hub.global.unsupported" }) })) : state.error ? (_jsxs("p", { className: "mt-5 text-ui-sm text-destructive", children: [intl.formatMessage({ id: "workflows.hub.global.noLocalRuntime" }), " ", state.error] })) : (_jsx("p", { className: "mt-5 text-ui-base text-foreground-subtlest", children: intl.formatMessage({ id: "workflows.hub.global.empty" }) })), state.invalid.length > 0 ? (_jsxs("div", { "data-workflows-invalid": "true", className: "mt-4 space-y-0.5 rounded-lg border border-warning/40 px-2.5 py-2", children: [_jsx("p", { className: "text-ui-sm text-warning", children: intl.formatMessage({
                            id: state.invalid.length === 1 ? "workflows.hub.invalidOne" : "workflows.hub.invalid",
                        }, { count: String(state.invalid.length) }) }), state.invalid.map((entry) => (_jsxs("p", { className: "min-w-0 truncate font-mono text-ui-xs text-foreground-subtlest", title: entry.reason, children: [entry.path, " \u2014 ", entry.reason] }, entry.path)))] })) : null, launchDialog, moveDialog] }));
}
//# sourceMappingURL=SavedWorkflowGlobalGroup.js.map