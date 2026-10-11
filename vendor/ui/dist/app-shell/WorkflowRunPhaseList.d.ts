import type { WorkflowRunPendingQuestion, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import type { WorkflowTimelineModel } from "@/components/workflow-timeline/timeline-model.js";
import type { WorkflowActorInstance } from "@/app-shell/workflowRunPanel.js";
export declare const WorkflowRunPhaseList: import("react").MemoExoticComponent<({ graph, landing, model, onOpenActor, onOpenWorkspace, pendingQuestions, run, subagentModelProviderName, }: {
    graph: WorkflowCausalityGraphData;
    model: WorkflowTimelineModel;
    run: WorkflowRunState | undefined;
    pendingQuestions: readonly WorkflowRunPendingQuestion[];
    /** 开 actor transcript tab（没有会话的槽位开占位）。缺席即行不可点——回调的存在本身就是门控。 */
    onOpenActor?: (instance: WorkflowActorInstance) => void;
    /** 开脚本 transcript tab、落到这一站；缺席即脚本行不可点。 */
    onOpenWorkspace?: (phaseId: string) => void;
    /** 落点：`key` 每次打开都不同（`phaseId@openedAt`），同一站再点一次也再落。 */
    landing?: {
        phaseId: string;
        key: string;
    };
    /** providerId → 模型清单里的 provider 名（子代理自己的模型取名用，与摘要行同一个来源）。 */
    subagentModelProviderName?: (providerId: string) => string | undefined;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkflowRunPhaseList.d.ts.map