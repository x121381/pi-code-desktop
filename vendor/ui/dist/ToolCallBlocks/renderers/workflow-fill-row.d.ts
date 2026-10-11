import { type ReactNode } from "react";
import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
import { type WorkflowTimelineModel } from "@/components/workflow-timeline/timeline-model.js";
import { type WorkflowHoleTarget } from "@/ToolCallBlocks/renderers/createWorkflowHoleInput.js";
import type { WorkflowKindVocabulary } from "@/ToolCallBlocks/renderers/createWorkflowInput.js";
/**
 * 留白补全行在 create-workflow 渲染器里的那几样（docs/dynamic-workflow/presentation.md「The fill row」）。
 * 从 create-workflow.tsx 拆出（max-lines 门）：同一个渲染器换留白词汇；主文本是留白的名字（来自 display
 * 的 `fill` 块——行的入参没有名字）；草稿阶段线是父轨道上补全所在的那一截（新的站全墨、两侧邻站 ghost）。
 */
export declare function useWorkflowHoleRow(toolCall: {
    toolName?: string | null;
    kind?: string | null;
    title?: string | null;
    raw?: unknown;
    input?: unknown;
}, amend: boolean): {
    fill: boolean;
    holeTarget: WorkflowHoleTarget | undefined;
    vocabulary: WorkflowKindVocabulary;
};
/** 卡上的时间线模型：有图按图（补全行收窄到补全那一截），流式中按草稿扫描，其余没有。 */
export declare function useWorkflowCardModel({ graph, holeTarget, run, scriptText, writing, }: {
    graph: WorkflowCausalityGraphData | undefined;
    run: WorkflowRunState | undefined;
    holeTarget: WorkflowHoleTarget | undefined;
    scriptText: string | undefined;
    writing: boolean;
}): WorkflowTimelineModel | undefined;
/**
 * 启动前 / 反馈行的主文本。ToolLayout 是 memo 组件：交给它的节点必须引用稳定。补全行是
 * `· <留白名>`；其余只有名字。留白的类型不上界面。
 */
export declare function useWorkflowRowPrimaryText(fill: boolean, name: string): ReactNode;
//# sourceMappingURL=workflow-fill-row.d.ts.map