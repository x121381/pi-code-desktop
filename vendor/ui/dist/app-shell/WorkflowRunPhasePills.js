import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { laneDisplayName } from "../components/workflow-graph/lane-name.js";
import { phaseDisplayName } from "../components/workflow-graph/phase-name.js";
import { pillActivity } from "../components/workflow-timeline/timeline-pill-activity.js";
import { pillInstanceKey } from "../components/workflow-timeline/roster-model.js";
import { WorkflowAgentPill, } from "../components/workflow-timeline/WorkflowAgentPill.js";
import { WorkflowRunQuestionRow } from "../app-shell/WorkflowRunQuestionRow.js";
import { SpinePillTrailer, } from "../app-shell/WorkflowRunSpineParts.js";
export function phasePillRenderers({ actorModels, format, graph, model, now, onOpenActor, onOpenWorkspace, questionsByInstance, run, }) {
    const pillKey = pillInstanceKey;
    const nameOf = (pill) => pill.runtimeName ?? laneDisplayName(pill.lane, format);
    const phaseNameOf = (phaseId) => {
        const station = model.stations.find((candidate) => candidate.id === phaseId);
        return station === undefined ? phaseId : phaseDisplayName(station.naming, format);
    };
    // 行交出槽位身份：会话 id 有则随行，没有就开占位 tab。
    const openActor = (pill) => {
        const slot = pill.slot;
        if (onOpenActor === undefined || slot === undefined)
            return;
        const sessionId = pill.instance?.sessionId;
        onOpenActor({
            ordinal: slot.ordinal,
            ...(sessionId === undefined ? {} : { sessionId }),
            siteId: slot.siteId,
            status: pill.status === "running"
                ? "running"
                : pill.status === "done" || pill.status === "failed"
                    ? "completed"
                    : "waiting",
            ...(pill.runtimeName === undefined ? {} : { name: pill.runtimeName }),
        });
    };
    /** 药丸的公共接线（名字、状态、可打开）；整行药丸与「列出全部」的密排药丸共用。 */
    const pillProps = (pill) => {
        const label = nameOf(pill);
        const openable = onOpenActor !== undefined && pill.slot !== undefined;
        // 脚本行同一条打开语法：开整个 run 的脚本 transcript，落到这一站的第一张卡。
        const workspacePhaseId = onOpenWorkspace === undefined ? undefined : pill.workspace?.phaseId;
        const open = openable
            ? {
                data: {
                    "data-agent-key": pillKey(pill) ?? "",
                    "data-agent-session-id": pill.instance?.sessionId ?? "",
                    "data-agent-status": pill.status ?? "pending",
                },
                label: format({ id: "chat.toolCall.workflow.timeline.openAgent" }, { name: label }),
                onOpen: () => openActor(pill),
                testId: "workflow-run-agent-open",
            }
            : workspacePhaseId !== undefined
                ? {
                    data: { "data-phase-id": workspacePhaseId },
                    label: format({ id: "chat.toolCall.workflow.timeline.openScript" }, { phase: phaseNameOf(workspacePhaseId) }),
                    onOpen: () => onOpenWorkspace?.(workspacePhaseId),
                    testId: "workflow-run-workspace-open",
                }
                : undefined;
        const actorModel = actorModels.get(pillKey(pill) ?? "");
        return {
            avatarIndex: pill.avatarIndex,
            laneClass: pill.laneClass,
            name: label,
            status: pill.status,
            title: actorModel === undefined ? label : `${label}\n${actorModel.canonical}`,
            ...(open === undefined ? {} : { open }),
        };
    };
    const renderPill = (pill) => {
        const activity = pillActivity(graph, run, pill);
        const key = pillKey(pill);
        const questions = key === undefined ? [] : (questionsByInstance.get(key) ?? []);
        const counts = [];
        if (activity.asks > 0) {
            counts.push(format({ id: "chat.toolCall.workflow.graph.card.tasks" }, { count: activity.asks }));
        }
        if (activity.reads > 0) {
            counts.push(format({ id: "chat.toolCall.workflow.graph.card.reads" }, { count: activity.reads }));
        }
        // 可打开的药丸是 <button>：块级父元素里它只包住内容，行宽会随名字长短参差。
        // 纵向 flex 容器让每一行拉满本列宽度（与卡上站下的药丸列同一机制）。
        return (_jsxs("div", { className: "flex min-w-0 flex-col", children: [_jsx(WorkflowAgentPill, { ...pillProps(pill), children: _jsx(SpinePillTrailer, { counts: counts, modelName: actorModels.get(key ?? "")?.name }) }), questions.map((question) => (_jsx(WorkflowRunQuestionRow, { className: "ml-[26px]", now: now, question: question }, question.qid)))] }, pill.key));
    };
    return { nameOf, pillProps, renderPill };
}
//# sourceMappingURL=WorkflowRunPhasePills.js.map