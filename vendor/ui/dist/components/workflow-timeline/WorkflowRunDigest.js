import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { MessageCircleQuestionIcon, RotateCcwIcon, SlidersHorizontalIcon, SquareIcon, } from "lucide-react";
import { TID_CHAT_WORKFLOW_RUN_DIGEST, testId } from "@zcode/shared";
import { cn } from "../../components/lib/utils.js";
import { Button } from "../../components/ui/button.js";
import { ControlHintTooltip } from "../../ControlHintTooltip.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { buildWorkflowTimeline } from "./timeline-model.js";
import { workflowCardDetail } from "./timeline-summary.js";
import { HolesWaitingChip } from "./WorkflowHoleParts.js";
import { WORKFLOW_RUN_ENDED_KIND_ID, WorkflowCardHeader, workflowRunKindMessageId, } from "./WorkflowCardChrome.js";
import { WorkflowArtifactStrip } from "./WorkflowArtifactStrip.js";
import { useWorkflowRunSettingsPopoverState, WorkflowRunSettingsPopover, } from "./WorkflowRunSettingsPopover.js";
import { timelineHeight, WorkflowTimeline } from "./WorkflowTimeline.js";
import { WorkflowTruncatedNotice } from "./WorkflowTruncatedNotice.js";
export function WorkflowRunDigest({ graph, holeLabels, name, onOpenArtifact, onOpenPill, onOpenRun, onOpenWorkspace, onResume, onCancel, pendingQuestions = 0, runId, settingsHost, subagentModelProviderName, summary, testIdKey, }) {
    const { intl } = useZCodeIntl();
    const run = summary?.run;
    const [expanded, setExpanded] = useState(true);
    // 阶段线只在有活投影且有图时画：没有投影的图全是 pending 灯，会把一条已完成的 run 画成没跑过。
    const model = useMemo(() => graph !== undefined && graph.steps.length > 0 && run !== undefined
        ? buildWorkflowTimeline(graph, run, holeLabels)
        : undefined, [graph, holeLabels, run]);
    const hasRail = model !== undefined && model.stations.length > 0;
    const shown = useMemo(() => expanded || !model
        ? model
        : {
            ...model,
            stations: model.stations.map((station) => ({ ...station, pills: [] })),
        }, [expanded, model]);
    // 去掉箭头不代表取消折叠。仅空白区域切换，子控件继续执行各自的操作。
    const hitsControl = (target, root) => {
        const control = target instanceof Element
            ? target.closest("button, a, input, textarea, select, [role='button']")
            : null;
        return control !== null && control !== root;
    };
    const format = intl.formatMessage.bind(intl);
    // 卡上刻意**不**画 lineage：
    // 「调整自 / 已被替代」两句只在详情页与确认窗说；卡只换种类词——卡上太吵。
    // 细节串的最后一段是子代理模型名（没指定过模型就没有这一段），强度与规范串进 tooltip。
    const cardDetail = workflowCardDetail(format, model, graph, run, subagentModelProviderName);
    const live = summary?.status === "running";
    const kind = format({
        id: summary === undefined ? WORKFLOW_RUN_ENDED_KIND_ID : workflowRunKindMessageId(summary),
    });
    const questionsLabel = pendingQuestions > 0
        ? format({
            id: pendingQuestions === 1
                ? "chat.toolCall.workflow.digest.question"
                : "chat.toolCall.workflow.digest.questions",
        }, { count: pendingQuestions })
        : undefined;
    const questions = questionsLabel === undefined ? undefined : onOpenRun === undefined ? (_jsxs("span", { className: "wf-arrive flex shrink-0 items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--color-warning)_12%,transparent)] py-0.5 pl-1.5 pr-2 text-ui-xs font-medium text-warning", "data-testid": "workflow-digest-questions", children: [_jsx(MessageCircleQuestionIcon, { "aria-hidden": true, className: "size-3" }), questionsLabel] })) : (_jsxs("button", { className: "wf-arrive flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--color-warning)_12%,transparent)] py-0.5 pl-1.5 pr-2 text-ui-xs font-medium text-warning outline-none transition-colors hover:bg-[color-mix(in_oklab,var(--color-warning)_20%,transparent)] focus-visible:ring-2 focus-visible:ring-ring/40", "data-testid": "workflow-digest-questions", onClick: () => onOpenRun(), type: "button", children: [_jsx(MessageCircleQuestionIcon, { "aria-hidden": true, className: "size-3" }), questionsLabel] }));
    // 「{n} 处留白待补全」（docs/dynamic-workflow/presentation.md「Holes on the timeline」）：笔芯片，落在问题
    // 芯片的槽位上，两枚可以同时在；点它开整个 run。
    const holesWaiting = (run?.holes ?? []).filter((hole) => hole.state === "waiting").length;
    const leading = questions === undefined && holesWaiting === 0 ? undefined : (_jsxs(_Fragment, { children: [questions, _jsx(HolesWaitingChip, { count: holesWaiting, ...(onOpenRun === undefined ? {} : { onOpen: () => onOpenRun() }) })] }));
    const resume = summary?.resumable === true && onResume !== undefined ? (_jsxs(Button, { "data-testid": "workflow-digest-resume", onClick: onResume, size: "default", type: "button", variant: "outline", children: [_jsx(RotateCcwIcon, { className: "size-3.5" }), format({ id: "chat.toolCall.workflow.run.resume" })] })) : undefined;
    // Stop 与 Resume 互斥（running vs 已停），共用表头右侧同一个位置。走详情页同一条命令。
    // 点下 Stop 后按钮进入禁用的「正在停止…」态，直到投影把状态换掉：按 status 键控重挂，状态一变
    // 按钮就是新的（cancelled → resume 后再 running 亦然）。复位曾是按 status 跑的
    // effect setState，每次状态变化都在投影帧的同步提交之后再补一笔更新——与工作流卡 React #185 崩溃
    // 的抛点同形；键控重挂没有第二次提交。
    const cancel = live && onCancel !== undefined ? (_jsx(CancelRunButton, { onCancel: onCancel }, summary?.status)) : undefined;
    // Configure 排在 Resume / Stop 之前、每种状态里都在同一个位置，所以它出现与否从不挪动 ⤢。
    const configure = settingsHost !== undefined && run !== undefined ? (_jsx(ConfigureRunButton, { host: settingsHost, run: run })) : undefined;
    return (_jsxs("section", { "aria-label": kind, className: cn("wf-motion wf-arrive flex w-full min-w-0 flex-col gap-1 rounded-xl border border-border/70 bg-card/70 px-3.5 pb-2 pt-1.5 outline-none", hasRail && "cursor-pointer focus-visible:ring-2 focus-visible:ring-ring/40"), "data-expanded": hasRail ? String(expanded) : undefined, "data-testid": testId(TID_CHAT_WORKFLOW_RUN_DIGEST, testIdKey), "data-workflow-run-digest": "true", "data-workflow-run-id": runId, "data-workflow-run-status": summary?.status ?? "absent", role: hasRail ? "button" : undefined, tabIndex: hasRail ? 0 : undefined, "aria-expanded": hasRail ? expanded : undefined, onClick: (event) => {
            if (hasRail && !hitsControl(event.target, event.currentTarget))
                setExpanded((value) => !value);
        }, onKeyDown: (event) => {
            if (!hasRail ||
                hitsControl(event.target, event.currentTarget) ||
                (event.key !== "Enter" && event.key !== " "))
                return;
            event.preventDefault();
            setExpanded((value) => !value);
        }, children: [_jsx(WorkflowCardHeader, { detail: cardDetail?.detail, ...(cardDetail?.title === undefined ? {} : { detailTitle: cardDetail.title }), expanded: expanded, kind: kind, leading: leading, live: live, name: name, trailing: configure === undefined ? ((resume ?? cancel)) : (_jsxs(_Fragment, { children: [configure, resume ?? cancel] })), ...(onOpenRun === undefined ? {} : { onOpenDetails: () => onOpenRun() }) }), shown === undefined || !hasRail ? null : (_jsx("div", { className: cn("wf-digest-plot overflow-hidden"), "data-testid": "workflow-digest-plot", style: { height: timelineHeight(shown) + 8 }, children: _jsx(WorkflowTimeline, { className: "py-1", model: shown, ...(onOpenPill === undefined ? {} : { onOpenPill }), ...(onOpenWorkspace === undefined ? {} : { onOpenWorkspace }), ...(onOpenRun === undefined
                        ? {}
                        : {
                            onOpenMore: (station) => onOpenRun({ phaseId: station.id }),
                            // 补全的头：开侧板、落到它写下的第一站（那一站的节头就是补全的标题）。
                            onOpenFill: (fill) => {
                                const first = shown.stations[fill.from];
                                if (first !== undefined)
                                    onOpenRun({ phaseId: first.id });
                            },
                        }) }) })), hasRail ? _jsx(WorkflowTruncatedNotice, { run: run, testId: "workflow-digest-truncated" }) : null, run?.artifacts !== undefined && run.artifacts.length > 0 ? (_jsx(WorkflowArtifactStrip, { artifacts: run.artifacts, className: "pb-0.5 pt-0.5", moreTestId: "workflow-digest-artifacts-more", pillTestId: "workflow-digest-artifact", testId: "workflow-digest-artifacts", ...(onOpenArtifact === undefined ? {} : { onOpenArtifact }) })) : null] }));
}
/**
 * 表头的 Configure 钮：滑杆图标的 ghost
 * `icon-md`，与 Stop 同形——表头容不下一枚带字的按钮。点它在自己下方开「配置」弹层。
 */
function ConfigureRunButton({ host, run, }) {
    const { intl } = useZCodeIntl();
    const { anchorRef, open, setOpen, toggleFrom } = useWorkflowRunSettingsPopoverState();
    const label = intl.formatMessage({ id: "chat.toolCall.workflow.run.settings.title" });
    return (_jsxs(_Fragment, { children: [_jsx(ControlHintTooltip, { title: label, side: "top", children: _jsx(Button, { "aria-expanded": open, "aria-haspopup": "dialog", "aria-label": label, "data-testid": "workflow-digest-configure", onClick: (event) => toggleFrom(event.currentTarget), size: "icon-md", type: "button", variant: "ghost", children: _jsx(SlidersHorizontalIcon, { className: "size-3.5" }) }) }), _jsx(WorkflowRunSettingsPopover, { anchorRef: anchorRef, host: host, onOpenChange: setOpen, open: open, run: run })] }));
}
/**
 * 表头的 Stop 钮：形态与 ⤢ 打开详情同款（ghost 图标钮 + 提示，不带文字——表头容不下一枚带字的
 * 按钮）。「正在停止」是它自己的局部状态；宿主按 run 状态给它 key，状态一变即重挂、自然复位。
 *
 * 提示带第二行「停止后可以随时恢复，已完成的步骤会保留。」：动词从「取消」改成「停止」之后，
 * 还要在按下去的那一刻就把「不是丢弃」说出来（一个停下的 run 是可恢复的）。正在停止时那句话
 * 撤走——决定已经做完了，没什么可再劝的。
 */
function CancelRunButton({ onCancel }) {
    const { intl } = useZCodeIntl();
    const [cancelling, setCancelling] = useState(false);
    const label = intl.formatMessage({
        id: cancelling ? "chat.toolCall.workflow.run.cancelling" : "chat.toolCall.workflow.run.cancel",
    });
    return (_jsx(ControlHintTooltip, { title: label, side: "top", ...(cancelling
            ? {}
            : {
                description: intl.formatMessage({ id: "chat.toolCall.workflow.run.stopHint" }),
            }), children: _jsx(Button, { "aria-label": label, "data-testid": "workflow-digest-cancel", disabled: cancelling, onClick: () => {
                setCancelling(true);
                onCancel();
            }, size: "icon-md", type: "button", variant: "ghost", children: _jsx(SquareIcon, { className: "size-3.5 fill-current" }) }) }));
}
//# sourceMappingURL=WorkflowRunDigest.js.map