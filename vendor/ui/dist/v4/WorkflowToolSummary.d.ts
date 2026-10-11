import type { WorkflowRunCardSummary } from "@/ToolCallBlocks/shared.js";
/**
 * 已接进 run 的补全行（docs/dynamic-workflow/presentation.md「The fill row」）：「留白已补全 · {name} · {k} 个阶段
 * · {m} 个子代理 ↗」。计数是这次补全**写下**的，不是整条 run 的；留白的类型不上界面。
 */
export interface WorkflowFillSummary {
    name: string;
    phases: number;
    agents: number;
}
export declare function WorkflowToolSummary({ toolCallId, summary, onOpen, amend, fill, }: {
    toolCallId: string;
    summary: WorkflowRunCardSummary;
    onOpen?: () => void;
    /** AmendWorkflow 发起行：种类词换成「工作流已调整」。 */
    amend?: boolean;
    /** FillWorkflowHole 行：留白词汇与补全的计数；在场时 `amend` 不看。 */
    fill?: WorkflowFillSummary;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowToolSummary.d.ts.map