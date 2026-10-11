import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import type { TimelinePill } from "./timeline-model.js";
/** 一枚药丸「正在做什么」：优先正在跑的 step 的 label，其次最后一个已结算的，再次第一个。 */
export declare function pillActivity(graph: WorkflowCausalityGraphData, run: WorkflowRunState | undefined, pill: TimelinePill): {
    label: string;
    asks: number;
    reads: number;
};
//# sourceMappingURL=timeline-pill-activity.d.ts.map