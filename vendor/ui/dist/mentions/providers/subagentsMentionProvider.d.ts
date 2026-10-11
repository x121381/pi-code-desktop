import type { ZCodeProvider, AgentSummary } from "@zcode/shared";
import type { MentionCategoryResult, MentionItem } from "@/mentions/mentionTypes.js";
type SubagentMentionInput = Pick<AgentSummary, "id" | "name" | "description" | "path" | "scope" | "source" | "enabled" | "modelSelection">;
export declare function mapSubagentsToMentionItemsForTest(agents: SubagentMentionInput[]): MentionItem[];
export declare function useSubagentsMentionProvider(workspacePath: string | null, provider: ZCodeProvider, query: string, enabled: boolean, emptyText: string, title: string): MentionCategoryResult;
export {};
//# sourceMappingURL=subagentsMentionProvider.d.ts.map