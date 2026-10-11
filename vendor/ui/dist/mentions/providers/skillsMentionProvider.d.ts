import type { Locale, SkillScope, ZCodeProvider } from "@zcode/shared";
import type { MentionCategoryResult, MentionItem } from "@/mentions/mentionTypes.js";
export declare function mapSkillsToMentionItemsForTest(skills: Array<{
    id: string;
    name: string;
    description: string;
    path: string;
    scope: SkillScope;
    pluginName?: string;
}>, locale?: Locale): MentionItem[];
export declare function useSkillsMentionProvider(workspacePath: string, workspaceIdentity: string | undefined, sessionId: string | null, provider: ZCodeProvider, query: string, enabled: boolean, requireQuery: boolean, emptyText: string, title: string): MentionCategoryResult;
//# sourceMappingURL=skillsMentionProvider.d.ts.map