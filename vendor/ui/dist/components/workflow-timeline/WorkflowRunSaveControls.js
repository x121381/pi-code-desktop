import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// 完成卡与 run 侧板表头上的那一对控件（docs/dynamic-workflow/transcript-and-notifications.md
// 「Saving the run, and running it again」）：
//
//   leading  ── 「已保存」芯片：一条关于**文件**的事实，不是运行状态，所以中性底色而非绿色；
//   trailing ── 「保存」/「再次运行」：一次 run 跑完的那一刻，用户正好知道它值不值得留下。
//
// 两个槽共用一个控制器（`useWorkflowRunSave`），因此同一个 run 在卡上与侧板上说的是同一句话。
// 返回 ReactNode 而不是渲染成组件：表头的两个插槽在结构上是分开的，但它们背后必须是同一次查询。
import { useMemo, useRef, useState } from "react";
import { CheckIcon, ArrowUpRightIcon, PlayIcon, SaveIcon } from "lucide-react";
import { resolveWorkspaceKey, } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { Spinner } from "@/components/ui/spinner.js";
import { toast } from "@/components/ui/toast.js";
import { cn } from "@/components/lib/utils.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { useWorkflowRunSave } from "@/hooks/useWorkflowRunSave.js";
import { useSavedWorkflowHub } from "@/v4/savedWorkflowHubContext.js";
import { useOptionalServices } from "@/hooks/useServices.js";
import { useOptionalTabStore } from "@/store/TabStoreProvider.js";
import { buildAutomationWorkspaceOptions, } from "@/settings/automationWorkspaceOptions.js";
import { SavedWorkflowLaunchDialog } from "@/settings/saved-workflows/SavedWorkflowLaunchDialog.js";
import { WorkflowSavePopover } from "./WorkflowSavePopover.js";
import { buildWorkflowSaveRequestPrompt } from "./workflowRunSave.js";
/** 卡窄到这个宽度以下时动词只剩图标（词退到 aria-label 与提示里）。 */
const SAVE_WORD_CONTAINER = "@[480px]/wf-card:inline";
export function useWorkflowRunSaveSlots(host) {
    const { intl, locale } = useZCodeIntl();
    const format = (id) => intl.formatMessage({ id });
    const hub = useSavedWorkflowHub();
    const anchorRef = useRef(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [launchEntry, setLaunchEntry] = useState(null);
    const [announcement, setAnnouncement] = useState(null);
    const controller = useWorkflowRunSave({
        workspacePath: host.workspacePath,
        ...(host.workspaceIdentity === undefined ? {} : { workspaceIdentity: host.workspaceIdentity }),
        ...(host.remoteSessionId === undefined ? {} : { remoteSessionId: host.remoteSessionId }),
        runId: host.runId,
        ...(host.candidates === undefined ? {} : { candidates: host.candidates }),
        ...(hub === null ? {} : { onNavigateToRun: hub.navigateToRun }),
    });
    const entry = controller.entry;
    // 全局档的「运行于」候选：与中枢全局组同一张表（本机项目，不含远程）。默认落在这次 run
    // 自己的项目上——从一张卡上按「再次运行」，最自然的落点就是它跑过的那个项目。
    const tabs = useOptionalTabStore((store) => store.tabs);
    const localProjects = useMemo(() => buildAutomationWorkspaceOptions(tabs).filter((project) => !project.remoteSessionId), [tabs]);
    const runProjectKey = useMemo(() => resolveWorkspaceKey({
        workspacePath: host.workspacePath,
        ...(host.workspaceIdentity ? { workspaceIdentity: host.workspaceIdentity } : {}),
    }), [host.workspacePath, host.workspaceIdentity]);
    const sendLead = host.sendLead;
    const leadHandler = sendLead === undefined
        ? undefined
        : async (draft) => {
            await sendLead(buildWorkflowSaveRequestPrompt({
                locale,
                runId: host.runId,
                ...(host.runName === undefined ? {} : { runName: host.runName }),
                name: draft.name,
                scope: draft.scope,
                description: draft.description,
            }));
        };
    const handleRunAgain = () => {
        if (entry === undefined || controller.launching)
            return;
        const hasArgs = entry.args !== undefined && Object.keys(entry.args).length > 0;
        // 全局档永远开窗：它需要一个「运行于」的项目，而那是用户的选择而不是卡片的推断。
        if (hasArgs || entry.scope === "global") {
            controller.clearLaunchError();
            setLaunchEntry(entry);
            return;
        }
        // 窗外路径：失败以 toast 说出来，措辞取启动器自己的原因表（与中枢的「运行」同一套）。
        void controller.launch(entry, {}).then((result) => {
            if (!result.ok) {
                toast(intl.formatMessage({ id: `workflows.hub.launch.error.${result.error.reason}` }));
            }
        });
    };
    const leading = entry === undefined ? null : (_jsx(WorkflowRunSavedChip, { entry: entry, label: format("chat.toolCall.workflow.saveRun.chip"), ...(hub === null
            ? {}
            : {
                hint: format("chat.toolCall.workflow.saveRun.chip.hint"),
                onOpen: () => hub.openWorkflow({
                    name: entry.name,
                    scope: entry.scope,
                    workspacePath: host.workspacePath,
                    ...(host.workspaceIdentity ? { workspaceIdentity: host.workspaceIdentity } : {}),
                }),
            }) }));
    if (host.canSave !== true)
        return { leading, trailing: null };
    const verb = entry === undefined
        ? {
            label: format("chat.toolCall.workflow.saveRun.action"),
            icon: _jsx(SaveIcon, { className: "size-3.5" }),
            testId: "workflow-save-open",
            onClick: (element) => {
                anchorRef.current = element;
                setPopoverOpen((open) => !open);
            },
        }
        : {
            label: controller.launching
                ? format("chat.toolCall.workflow.saveRun.starting")
                : format("chat.toolCall.workflow.saveRun.runAgain"),
            icon: controller.launching ? (_jsx(Spinner, { className: "size-3.5" })) : (_jsx(PlayIcon, { className: "size-3.5" })),
            testId: "workflow-save-run-again",
            onClick: handleRunAgain,
        };
    const trailing = (_jsxs(_Fragment, { children: [_jsx(ControlHintTooltip, { title: verb.label, side: "top", children: _jsxs(Button, { "aria-expanded": entry === undefined ? popoverOpen : undefined, "aria-haspopup": entry === undefined ? "dialog" : undefined, "aria-label": verb.label, "data-icon": "inline-start", "data-testid": verb.testId, disabled: controller.launching, onClick: (event) => verb.onClick(event.currentTarget), size: "sm", type: "button", variant: "outline", children: [verb.icon, _jsx("span", { className: host.verbWord === "never" ? undefined : cn("hidden", SAVE_WORD_CONTAINER), children: verb.label })] }) }), _jsx(WorkflowSavePopover, { anchorRef: anchorRef, host: {
                    ...(host.runName === undefined ? {} : { runName: host.runName }),
                    directSaveUnsupported: controller.directSaveUnsupported,
                    scopeLocked: controller.scopeLocked,
                    saving: controller.saving,
                    save: controller.save,
                    checkNameTaken: controller.checkNameTaken,
                    ...(leadHandler === undefined ? {} : { sendLead: leadHandler }),
                    onSaved: (saved) => {
                        setAnnouncement(format(saved.scope === "global"
                            ? "chat.toolCall.workflow.saveRun.announce.global"
                            : "chat.toolCall.workflow.saveRun.announce.project"));
                        // 焦点回到那个槽位——它此刻已经是「再次运行」了。
                        anchorRef.current?.focus();
                    },
                }, onOpenChange: setPopoverOpen, open: popoverOpen }), _jsx(SavedWorkflowLaunchDialog, { entry: launchEntry, scope: launchEntry?.scope ?? "project", projectLabel: localProjects.find((project) => resolveWorkspaceKey({
                    workspacePath: project.workspacePath,
                    ...(project.workspaceIdentity
                        ? { workspaceIdentity: project.workspaceIdentity }
                        : {}),
                }) === runProjectKey)?.label ?? host.workspacePath, ...(controller.runArgs === undefined ? {} : { initialArgs: controller.runArgs }), ...(launchEntry?.scope === "global"
                    ? { targets: localProjects, defaultTargetKey: runProjectKey }
                    : {}), pending: controller.launching, error: controller.launchError, onOpenChange: (open) => (open ? undefined : setLaunchEntry(null)), onSubmit: (submitted, args, target) => {
                    void controller
                        .launch(submitted, args, target === undefined
                        ? undefined
                        : {
                            workspacePath: target.workspacePath,
                            ...(target.workspaceIdentity
                                ? { workspaceIdentity: target.workspaceIdentity }
                                : {}),
                            ...(target.remoteSessionId ? { remoteSessionId: target.remoteSessionId } : {}),
                        })
                        .then((result) => {
                        if (result.ok)
                            setLaunchEntry(null);
                    });
                } }), _jsx("span", { className: "sr-only", "aria-live": "polite", "data-testid": "workflow-save-announcement", children: announcement })] }));
    return { leading, trailing };
}
/**
 * 只在有服务上下文时挂载控制器（spec「Gates」：没有会话上下文的卡——静态渲染、回放、分享只读
 * 时间线——就是它原来那张卡，一个控件都没有）。控制器要查 agent，而这些宿主根本没有 agent 可查；
 * 用一层边界而不是在 hook 里判空，是因为 hook 不能按条件调用。
 */
export function WorkflowRunSaveSlotsBoundary({ children, host, }) {
    const services = useOptionalServices();
    if (services === null)
        return _jsx(_Fragment, { children: children(null) });
    return _jsx(WorkflowRunSaveSlotsMount, { host: host, children: children });
}
function WorkflowRunSaveSlotsMount({ children, host, }) {
    const slots = useWorkflowRunSaveSlots(host);
    return _jsx(_Fragment, { children: children(slots) });
}
/** 「已保存」芯片：待答问题芯片的形状，`bg-surface` 中性底——它说的是文件，不是运行状态。 */
function WorkflowRunSavedChip({ entry, hint, label, onOpen, }) {
    const content = (_jsxs(_Fragment, { children: [_jsx(CheckIcon, { "aria-hidden": true, className: "size-3" }), label, onOpen === undefined ? null : (_jsx(ArrowUpRightIcon, { "aria-hidden": true, className: "hidden size-3 group-hover/saved-chip:block group-focus-visible/saved-chip:block" }))] }));
    const className = "group/saved-chip flex shrink-0 items-center gap-1 rounded-full bg-surface py-0.5 pl-1.5 pr-2 text-ui-xs font-medium text-foreground-subtle";
    if (onOpen === undefined) {
        return (_jsx("span", { className: className, "data-testid": "workflow-saved-chip", children: content }));
    }
    return (_jsx(ControlHintTooltip, { title: hint ?? label, side: "top", children: _jsx("button", { className: cn(className, "hover:bg-hover hover:text-foreground"), "data-testid": "workflow-saved-chip", onClick: onOpen, title: entry.name, type: "button", children: content }) }));
}
//# sourceMappingURL=WorkflowRunSaveControls.js.map