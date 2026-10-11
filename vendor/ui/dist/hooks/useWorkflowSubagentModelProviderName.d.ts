/**
 * 上面那张表的 hook 形态。workspacePath 缺席（宿主给不出作用域）即没有查找函数——
 * 此时拼名规则退回裸 modelId，这是刻意的兜底，不是缺陷。
 */
export declare function useWorkflowSubagentModelProviderName(workspacePath: string | undefined, workspaceIdentity?: string): ((providerId: string) => string | undefined) | undefined;
//# sourceMappingURL=useWorkflowSubagentModelProviderName.d.ts.map