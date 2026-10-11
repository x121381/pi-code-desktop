import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { TID_WORKFLOWS_CREATE_VIA_CHAT, TID_WORKFLOWS_LIST, TID_WORKFLOW_PROJECT_GROUP, resolveWorkspaceKey, testId, } from "@zcode/shared";
import { Button } from "../../components/ui/button.js";
import { toast } from "../../components/ui/toast.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { useConfirmDialog } from "../../hooks/useConfirmDialog.js";
import { useWorkspaceServicesResolution } from "../../hooks/useWorkspaceServices.js";
import { logger } from "../../logger.js";
import { useSavedWorkflowsDirectoryWatch } from "../../settings/saved-workflows/useSavedWorkflowsDirectoryWatch.js";
import { SavedWorkflowCard } from "../../settings/saved-workflows/SavedWorkflowCard.js";
import { SavedWorkflowDetailView } from "../../settings/saved-workflows/SavedWorkflowDetailView.js";
import { SavedWorkflowLaunchDialog } from "../../settings/saved-workflows/SavedWorkflowLaunchDialog.js";
import { buildSavedWorkflowCreatePrompt, buildSavedWorkflowRevisePrompt, } from "../../settings/saved-workflows/savedWorkflowLaunchPrompt.js";
import { useSavedWorkflowLauncher, } from "../../settings/saved-workflows/useSavedWorkflowLauncher.js";
import { useSavedWorkflowProjectTargets } from "../../settings/saved-workflows/useSavedWorkflowProjectTargets.js";
import { lastRunByWorkflowName } from "../../settings/saved-workflows/savedWorkflowRunHistory.js";
import { useSavedWorkflowPromote } from "../../settings/saved-workflows/useSavedWorkflowPromote.js";
import { useSavedWorkflowRunOpeners } from "../../settings/saved-workflows/useSavedWorkflowRunOpeners.js";
import { selectSavedWorkflowState, useSavedWorkflowStore } from "../../store/savedWorkflowStore.js";
/**
 * 单个项目的工作流组：接过 v1 单项目 section 的全部
 * 职责——用**本项目**的 agent 代理拉列表 / 运行历史、监听本项目目录、运行 / 修订 / 复制 / 删除 /
 * 提升为全局 / 进详情，全部带本项目的 target。组头 = 项目名 + 「当前」小标 + 数量 +
 * 「通过对话创建」。
 */
export function SavedWorkflowProjectGroup({ project, isCurrent, refreshSeq, mode, onStateChange, onOpenDetail, onBack, onNavigateToLaunchedRun, onCreateViaChat, onOpenWorkflowRun, onOpenWorkflowArtifact, }) {
    const { intl, locale } = useZCodeIntl();
    const requestConfirmation = useConfirmDialog();
    const resolution = useWorkspaceServicesResolution(project.workspacePath, project.remoteSessionId ?? null, project.workspaceIdentity, project.remoteTarget);
    const { services, rpcReady } = resolution;
    const agentService = services.zcodeAgentService;
    const fileWatcherService = services.fileWatcherService;
    const workspaceKey = useMemo(() => resolveWorkspaceKey({
        workspacePath: project.workspacePath,
        ...(project.workspaceIdentity ? { workspaceIdentity: project.workspaceIdentity } : {}),
    }), [project.workspacePath, project.workspaceIdentity]);
    const { target, projectTarget, launchTarget } = useSavedWorkflowProjectTargets(project, resolution.remoteSessionId);
    const state = useSavedWorkflowStore((store) => selectSavedWorkflowState(store, target));
    const load = useSavedWorkflowStore((store) => store.load);
    const [launchEntry, setLaunchEntry] = useState(null);
    const [busyName, setBusyName] = useState(null);
    const [now, setNow] = useState(() => Date.now());
    const refresh = useCallback(async (options = {}) => {
        if (!rpcReady)
            return;
        await load(target, agentService, options);
        setNow(Date.now());
    }, [agentService, load, rpcReady, target]);
    useEffect(() => {
        void refresh();
    }, [refresh]);
    // 页级刷新：refreshSeq 变化（非首挂）时绕过缓存重拉。
    const lastRefreshSeq = useRef(refreshSeq);
    useEffect(() => {
        if (lastRefreshSeq.current === refreshSeq)
            return;
        lastRefreshSeq.current = refreshSeq;
        void refresh({ bypassCache: true });
    }, [refresh, refreshSeq]);
    useSavedWorkflowsDirectoryWatch({
        fileWatcherService,
        workspacePath: project.workspacePath,
        enabled: rpcReady,
        refresh,
    });
    // 加载态回报给页；空 = 已加载且没有合法工作流也没有坏文件；count = 合法工作流条数。
    const empty = state.loaded && state.entries.length === 0 && state.invalid.length === 0;
    const count = state.loaded ? state.entries.length : 0;
    useEffect(() => {
        onStateChange(workspaceKey, { loaded: state.loaded, empty, count });
    }, [count, empty, onStateChange, state.loaded, workspaceKey]);
    const lastRuns = useMemo(() => lastRunByWorkflowName(state.runs), [state.runs]);
    // GUI 直接启动器：载体 = 本项目解析出的 agent service；accepted 后切到新会话。
    const launcher = useSavedWorkflowLauncher({
        agentService,
        onNavigate: onNavigateToLaunchedRun,
    });
    const launch = useCallback(async (entry, args) => {
        const result = await launcher.launch(launchTarget, {
            name: entry.name,
            scope: "project",
            args,
        });
        if (result.ok) {
            // 成功：launcher 已切到新会话，关掉实参窗（无窗路径本就没开窗）。
            setLaunchEntry(null);
        }
        return result;
    }, [launchTarget, launcher]);
    const handleRun = useCallback((entry) => {
        if (entry.args && Object.keys(entry.args).length > 0) {
            launcher.clearError();
            setLaunchEntry(entry);
            return;
        }
        // 无实参项目档：不弹窗，直接启动；失败以 toast 提示（窗外路径）。
        void launch(entry, {}).then((result) => {
            if (!result.ok) {
                toast(intl.formatMessage({ id: `workflows.hub.launch.error.${result.error.reason}` }));
            }
        });
    }, [intl, launch, launcher]);
    const handleRevise = useCallback((entry) => {
        onCreateViaChat?.(buildSavedWorkflowRevisePrompt({ name: entry.name, path: entry.path, locale }), projectTarget);
    }, [locale, onCreateViaChat, projectTarget]);
    const handleCopyPath = useCallback((entry) => {
        void navigator.clipboard
            ?.writeText(entry.path)
            .then(() => toast(intl.formatMessage({ id: "workflows.hub.copied" })))
            .catch((error) => {
            logger.warn("[SavedWorkflows] 复制路径失败", {
                error: error instanceof Error ? error.message : String(error),
            });
        });
    }, [intl]);
    const handleDelete = useCallback(async (entry) => {
        const confirmed = await requestConfirmation({
            title: intl.formatMessage({ id: "workflows.hub.delete.title" }, { name: entry.name }),
            description: intl.formatMessage({ id: "workflows.hub.delete.description" }, { path: entry.path }),
            confirmLabel: intl.formatMessage({ id: "workflows.hub.delete.confirm" }),
            confirmVariant: "destructive",
        });
        if (!confirmed)
            return;
        setBusyName(entry.name);
        try {
            const result = await agentService.deleteSavedWorkflow({ ...target, name: entry.name });
            if (!result.ok) {
                toast(intl.formatMessage({ id: "workflows.hub.deleteFailed" }, { reason: intl.formatMessage({ id: `workflows.hub.reason.${result.reason}` }) }));
                return;
            }
            toast(intl.formatMessage({ id: "workflows.hub.deleted" }, { name: entry.name }));
            if (mode.kind === "detail" && mode.name === entry.name)
                onBack();
        }
        catch (error) {
            toast(intl.formatMessage({ id: "workflows.hub.deleteFailed" }, { reason: error instanceof Error ? error.message : String(error) }));
        }
        finally {
            setBusyName(null);
            void refresh({ bypassCache: true });
        }
    }, [agentService, intl, mode, onBack, refresh, requestConfirmation, target]);
    const handleCardDelete = useCallback((entry) => void handleDelete(entry), [handleDelete]);
    // 「提升为全局」：不搬文件——在本项目开新会话、
    // 自动发送概括提示，模型经 SaveWorkflow 另存全局档，源文件不动。远程项目不提供（远端
    // home 不进中枢，提升出来的东西看不见）。
    const isLocalProject = !project.remoteSessionId;
    const promoter = useSavedWorkflowPromote({ agentService, onNavigate: onNavigateToLaunchedRun });
    const handlePromote = useCallback(async (entry) => {
        setBusyName(entry.name);
        try {
            const result = await promoter.promote(launchTarget, {
                name: entry.name,
                path: entry.path,
                locale,
            });
            if (!result.ok) {
                toast(intl.formatMessage({ id: "workflows.hub.promote.failed" }, { reason: result.message ?? result.code }));
            }
        }
        finally {
            setBusyName(null);
        }
    }, [intl, launchTarget, locale, promoter]);
    const handleCardPromote = useCallback((entry) => void handlePromote(entry), [handlePromote]);
    const handleOpen = useCallback((entry) => onOpenDetail(entry.name), [onOpenDetail]);
    // 两个「打开」的门与实参构造与全局档共用（见该 hook 的注释：产物不需要 toolCallId）。
    const resolveRunTarget = useCallback(() => projectTarget, [projectTarget]);
    const { handleOpenArtifact, handleOpenRun } = useSavedWorkflowRunOpeners({
        resolveTarget: resolveRunTarget,
        ...(onOpenWorkflowRun === undefined ? {} : { onOpenWorkflowRun }),
        ...(onOpenWorkflowArtifact === undefined ? {} : { onOpenWorkflowArtifact }),
    });
    const handleCreateViaChat = useCallback(() => {
        onCreateViaChat?.(buildSavedWorkflowCreatePrompt(locale), projectTarget);
    }, [locale, onCreateViaChat, projectTarget]);
    const handleMetaSaved = useCallback(() => {
        void refresh({ bypassCache: true });
    }, [refresh]);
    const launchDialog = (_jsx(SavedWorkflowLaunchDialog, { entry: launchEntry, scope: "project", projectLabel: project.label, pending: launcher.pending, error: launcher.error, onOpenChange: (open) => (open ? undefined : setLaunchEntry(null)), onSubmit: (entry, args) => void launch(entry, args) }));
    if (mode.kind === "detail") {
        const entry = state.entries.find((candidate) => candidate.name === mode.name);
        return (_jsx(SavedWorkflowDetailView, { target: target, agentService: agentService, name: mode.name, projectLabel: project.label, entry: entry, runs: state.runs.filter((run) => run.name === mode.name), now: now, busy: busyName === mode.name, canOpenRun: Boolean(onOpenWorkflowRun), onBack: onBack, onRun: () => (entry ? handleRun(entry) : undefined), onRevise: () => (entry ? handleRevise(entry) : undefined), onCopyPath: () => (entry ? handleCopyPath(entry) : undefined), onMove: isLocalProject ? () => (entry ? void handlePromote(entry) : undefined) : undefined, onDelete: () => (entry ? void handleDelete(entry) : undefined), onOpenRun: (run) => handleOpenRun(run, mode.name), ...(onOpenWorkflowArtifact === undefined ? {} : { onOpenArtifact: handleOpenArtifact }), onMetaSaved: handleMetaSaved, launchDialog: launchDialog }));
    }
    // 列表态：已加载且既无合法工作流也无坏文件的组不渲染（空组隐藏），但仍已回报状态给页。
    if (empty)
        return null;
    if (!state.loaded && state.entries.length === 0 && state.invalid.length === 0)
        return null;
    const invalidCount = state.invalid.length;
    return (_jsxs("div", { "data-testid": testId(TID_WORKFLOW_PROJECT_GROUP, workspaceKey), "data-workflow-project-current": isCurrent ? "true" : undefined, className: "mt-8 first:mt-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("h3", { className: "flex items-center gap-2 text-ui-base font-medium leading-5 text-foreground", children: [_jsx("span", { className: "truncate", children: project.label }), isCurrent ? (_jsx("span", { className: "rounded-sm border border-border px-1.5 py-0.5 text-ui-xs leading-none text-foreground-subtlest", children: intl.formatMessage({ id: "workflows.hub.group.current" }) })) : null, state.entries.length > 0 ? (_jsx("span", { className: "font-normal text-foreground-subtlest", children: state.entries.length })) : null] }), _jsxs(Button, { type: "button", size: "lg", "data-icon": "inline-start", "data-testid": testId(TID_WORKFLOWS_CREATE_VIA_CHAT, workspaceKey), onClick: handleCreateViaChat, children: [_jsx(Plus, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "workflows.hub.createViaChat" })] })] }), state.entries.length > 0 ? (_jsx("div", { "data-testid": testId(TID_WORKFLOWS_LIST, workspaceKey), className: "mt-5 grid grid-cols-1 auto-rows-[132px] gap-x-4 gap-y-4 lg:grid-cols-2", children: state.entries.map((entry) => (_jsx(SavedWorkflowCard, { entry: entry, lastRun: lastRuns.get(entry.name), now: now, busy: busyName === entry.name, onOpen: handleOpen, onRun: handleRun, onRevise: handleRevise, onCopyPath: handleCopyPath, onMove: isLocalProject ? handleCardPromote : undefined, onDelete: handleCardDelete }, entry.path))) })) : null, state.error ? (_jsx("p", { className: "mt-4 text-ui-sm text-destructive", children: intl.formatMessage({ id: "workflows.hub.loadError" }, { error: state.error }) })) : null, invalidCount === 0 ? null : (_jsxs("div", { "data-workflows-invalid": "true", className: "mt-4 space-y-0.5 rounded-lg border border-warning/40 px-2.5 py-2", children: [_jsx("p", { className: "text-ui-sm text-warning", children: intl.formatMessage({ id: invalidCount === 1 ? "workflows.hub.invalidOne" : "workflows.hub.invalid" }, { count: String(invalidCount) }) }), state.invalid.map((entry) => (_jsxs("p", { className: "min-w-0 truncate font-mono text-ui-xs text-foreground-subtlest", title: entry.reason, children: [entry.path, " \u2014 ", entry.reason] }, entry.path)))] })), launchDialog] }));
}
//# sourceMappingURL=SavedWorkflowProjectGroup.js.map