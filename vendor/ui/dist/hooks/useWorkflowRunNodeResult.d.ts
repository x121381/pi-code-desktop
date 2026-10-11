import type { V4ConversationWorkflowRunNodeResultResult } from "@zcode/shared/zcode-protocol-v4";
/** 测试用：清空模块级缓存。 */
export declare function resetWorkflowRunNodeResultCache(): void;
interface WorkflowRunNodeResultState {
    result: V4ConversationWorkflowRunNodeResultResult | null;
    loading: boolean;
    error: string | null;
}
export declare function useWorkflowRunNodeResult(options: {
    sessionId: string;
    runId: string;
    siteId: string;
    ordinal: number;
    /** 关掉即不读（收起的卡、running 的行）。 */
    enabled?: boolean;
}): WorkflowRunNodeResultState;
export {};
//# sourceMappingURL=useWorkflowRunNodeResult.d.ts.map