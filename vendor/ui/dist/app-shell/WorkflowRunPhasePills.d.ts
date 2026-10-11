import type { WorkflowRunPendingQuestion, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import type { TimelinePill, WorkflowTimelineModel } from "@/components/workflow-timeline/timeline-model.js";
import { WorkflowAgentPill } from "@/components/workflow-timeline/WorkflowAgentPill.js";
import { type useWorkflowActorModelLabels } from "@/app-shell/WorkflowRunSpineParts.js";
import type { WorkflowActorInstance } from "@/app-shell/workflowRunPanel.js";
/**
 * 详情页脊线上药丸的接线（docs/dynamic-workflow/presentation.md「The spine」）。从
 * WorkflowRunPhaseList.tsx 拆出（max-lines 门）：那里只管节的开合、落点与留白，药丸怎么命名、怎么打开、
 * 尾槽写什么全在这里。纯函数工厂：清单每帧调用一次拿到三把闭包，没有自己的状态。
 */
type FormatMessage = (descriptor: {
    id: string;
}, values?: Record<string, string | number>) => string;
export interface PhasePillRenderers {
    nameOf: (pill: TimelinePill) => string;
    pillProps: (pill: TimelinePill) => Parameters<typeof WorkflowAgentPill>[0];
    renderPill: (pill: TimelinePill) => JSX.Element;
}
export declare function phasePillRenderers({ actorModels, format, graph, model, now, onOpenActor, onOpenWorkspace, questionsByInstance, run, }: {
    model: WorkflowTimelineModel;
    graph: WorkflowCausalityGraphData;
    run: WorkflowRunState | undefined;
    format: FormatMessage;
    actorModels: ReturnType<typeof useWorkflowActorModelLabels>;
    questionsByInstance: ReadonlyMap<string, WorkflowRunPendingQuestion[]>;
    now: number;
    onOpenActor?: (instance: WorkflowActorInstance) => void;
    onOpenWorkspace?: (phaseId: string) => void;
}): PhasePillRenderers;
export {};
//# sourceMappingURL=WorkflowRunPhasePills.d.ts.map