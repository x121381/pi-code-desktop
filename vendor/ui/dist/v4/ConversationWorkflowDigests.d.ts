import type { ConversationRowRenderContext } from "@/v4/conversationRowContext.js";
import type { WorkflowTurnDigest } from "@/v4/workflowTurnDigests.js";
/**
 * 轮尾摘要的落位：把解析出的摘要接上
 * 宿主回调。回调的存在即门控（不变式 7）：打开详情要 `onOpenWorkflowRun` + sessionId；Resume 要
 * `onResumeWorkflowRun` + 联接摘要说可恢复；药丸要 `onOpenWorkflowActor` + 活投影。与
 * `ToolCallRowView` 给工具卡接线的路径一字不差——同一个 run 从两处打开的是同一个 tab。
 */
export declare function ConversationWorkflowDigests({ context, digests, turnKey, }: {
    digests: readonly WorkflowTurnDigest[];
    context: ConversationRowRenderContext;
    turnKey: string;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ConversationWorkflowDigests.d.ts.map