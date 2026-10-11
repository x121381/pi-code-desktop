import { type WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
/**
 * FillWorkflowHole 行的目标留白（docs/dynamic-workflow/presentation.md「The fill row」）：`run_id` /
 * `hole_id` 来自行的入参（模型写的）；**名字、草稿路径与行号来自 display 的 `fill` 块**，工具从解析
 * 出的留白写进输出、投影原样带上。入参里的 `hole` 块是 resolveInput 给权限规则回填的，transcript
 * 不存它（2026-09-28 首次接龙实测：只读入参的行标题成了 `hole#1`）——这里仍读它，只为确认窗那条
 * 拿得到解析入参的路，display 在场时以 display 为准。从 createWorkflowInput.ts 拆出（max-lines 门）。
 */
export interface WorkflowHoleTarget {
    runId: string | undefined;
    holeId: string | undefined;
    name: string | undefined;
    draftPath: string | undefined;
    line: number | undefined;
}
/** display 的 `fill` 块（与 shared 的 toolCallCreateWorkflowDisplaySchema.fill 同形），未解析的原样。 */
export interface WorkflowDisplayFill {
    siteId: string;
    name: string;
    draftPath?: string;
    line?: number;
}
export declare function readWorkflowHoleTarget(input: unknown, fill?: WorkflowDisplayFill): WorkflowHoleTarget | undefined;
/** 补全的体（`script`）：与 CreateWorkflow 的脚本同一通道，流式草稿的笔从它里扫阶段。 */
export declare function readWorkflowHoleBody(input: unknown): string | undefined;
/**
 * 一次补全写下了几个阶段、几个子代理（「留白已补全 · {name} · {k} 个阶段 · {m} 个子代理」）：
 * 有效脚本的图上带 `fill === holeId` 的阶段与站点。留白自己的阶段（无阶段的补全）不算阶段。
 */
export declare function workflowFillCounts(graph: WorkflowCausalityGraphData | undefined, holeId: string): {
    phases: number;
    agents: number;
};
//# sourceMappingURL=createWorkflowHoleInput.d.ts.map