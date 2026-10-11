import type { GoalState } from "@zcode/shared/zcode-protocol-v4";
export interface ConversationGoalIterationSummary {
    iteration: number;
    title: string | null;
    items: GoalState["iterations"][number]["items"];
    completedCount: number;
    totalCount: number;
    completed: boolean;
    verificationOutcome: GoalState["verifications"][number]["outcome"] | null;
}
/** 从 V4 权威 goal 投影构造右上角逐轮摘要；不从 renderer timeline 反推轮次。 */
export declare function buildConversationGoalIterationSummaries(goal: GoalState): ConversationGoalIterationSummary[];
export declare function getConversationGoalElapsedSeconds(goal: GoalState, now: number): number;
//# sourceMappingURL=conversationGoalSummaryModel.d.ts.map