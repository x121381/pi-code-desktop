export interface PlanToolCallSource {
    input?: unknown;
    inputText?: string;
    output?: unknown;
    raw?: unknown;
}
export interface PlanToolCallContent {
    markdown?: string;
    planFilePath?: string;
}
export declare function extractPlanToolCallContent(toolCall: PlanToolCallSource, workspacePath: string): PlanToolCallContent;
/** 计划目录标题取首个 H1，否则取首个非空文本行。 */
export declare function getPlanDirectoryTitle(markdown: string): string | undefined;
export declare function getPlanFileLabel(planFilePath?: string): string | undefined;
//# sourceMappingURL=planToolCall.d.ts.map