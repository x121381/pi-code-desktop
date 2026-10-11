import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
export declare function sharedTimelineModel<Model>(graph: WorkflowCausalityGraphData, run: WorkflowRunState | undefined, build: () => Model): Model;
//# sourceMappingURL=timeline-cache.d.ts.map