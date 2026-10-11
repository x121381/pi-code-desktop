import { type AgentDiagnostic, type AgentScope, type AgentSummary, type SubAgentConfig } from "@zcode/shared";
export interface ParseSubagentMarkdownInput {
    content: string;
    path: string;
    scope: AgentScope;
}
export interface ParseSubagentMarkdownResult {
    agent?: AgentSummary;
    diagnostic?: AgentDiagnostic;
}
export declare function parseSubagentMarkdown(input: ParseSubagentMarkdownInput): ParseSubagentMarkdownResult;
export declare function serializeSubagentMarkdown(config: SubAgentConfig): string;
//# sourceMappingURL=subagentMarkdown.d.ts.map