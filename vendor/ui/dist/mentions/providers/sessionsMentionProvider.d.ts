import type { ZCodeProvider, ZCodeTaskMeta } from "@zcode/shared";
import type { MentionCategoryResult, MentionItem } from "@/mentions/mentionTypes.js";
import type { SessionMentionWorkspaceScope } from "@/mentions/mentionPanelRouting.js";
interface SessionMentionItem extends MentionItem {
    /** 只在候选聚合阶段分桶，不写入 Lexical node 或 canonical mention。 */
    workspaceKey: string;
}
export declare function collectSessionMentionItems(tasks: ZCodeTaskMeta[], provider: ZCodeProvider, options?: {
    workspacePath?: string;
    workspaceIdentity?: string;
}): SessionMentionItem[];
export declare function useSessionsMentionProvider(provider: ZCodeProvider, workspacePath: string, workspaceIdentity: string | undefined, query: string, enabled: boolean, workspaceScope: SessionMentionWorkspaceScope, emptyText: string, title: string): MentionCategoryResult;
export {};
//# sourceMappingURL=sessionsMentionProvider.d.ts.map