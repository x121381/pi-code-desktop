import { type PluginStoreModeOrder, type ZCodePluginReferenceCatalogEntry } from "@zcode/shared";
import type { MentionCategoryResult, MentionItem } from "@/mentions/mentionTypes.js";
export interface PluginMentionLabels {
    conflictReason: string;
}
export declare function mapPluginCatalogToMentionItemsForTest(entries: ZCodePluginReferenceCatalogEntry[], labels: PluginMentionLabels, locale: string, order?: PluginStoreModeOrder): MentionItem[];
export declare function usePluginsMentionProvider(workspacePath: string, workspaceIdentity: string | undefined, sessionId: string | null, query: string, enabled: boolean, emptyText: string, title: string): MentionCategoryResult;
//# sourceMappingURL=pluginsMentionProvider.d.ts.map