import type { MentionItem } from "@/mentions/mentionTypes.js";
export declare const MENTION_DEFAULT_GROUP_PREVIEW_LIMIT = 3;
export declare const MENTION_FILES_ONLY_DEFAULT_PREVIEW_LIMIT = 10;
export declare function hasMentionQuery(query: string): boolean;
export declare function getMentionGroupLimitForQuery(query: string, defaultLimit?: number): number | undefined;
interface FilterMentionItemsOptions {
    limit?: number;
    requireQuery?: boolean;
}
export interface MentionResultGroup<TItem = MentionItem> {
    id: string;
    title: string;
    items: TItem[];
    loading: boolean;
    errorText: string | null;
    emptyText: string;
}
export declare function buildVisibleMentionGroups<TItem>(groups: MentionResultGroup<TItem>[]): MentionResultGroup<TItem>[];
export declare function filterMentionItems(items: MentionItem[], query: string): MentionItem[];
export declare function filterMentionItemsWithOptions(items: MentionItem[], query: string, options?: FilterMentionItemsOptions): MentionItem[];
export {};
//# sourceMappingURL=mentionSearch.d.ts.map