import type { ZCodePluginReferenceCatalogEntry } from "@zcode/shared";
import type { ComposerMentionPrefill } from "@/store/zcodeSessionStoreTypes.js";
export interface DraftSuggestedPromptPluginReference {
    stableId: string;
    label: string;
}
export interface DraftSuggestedPromptPrefill {
    text: string;
    mention?: ComposerMentionPrefill;
    pluginUnavailable?: true;
}
export declare function buildDraftSuggestedPluginMention(plugin: DraftSuggestedPromptPluginReference, icon?: string): ComposerMentionPrefill;
export declare function buildDraftSuggestedPromptPrefill({ prompt, plugin, loadPluginCatalog, onCatalogError, }: {
    prompt: string;
    plugin?: DraftSuggestedPromptPluginReference;
    loadPluginCatalog: () => Promise<readonly ZCodePluginReferenceCatalogEntry[]>;
    onCatalogError?: (error: unknown) => void;
}): Promise<DraftSuggestedPromptPrefill>;
//# sourceMappingURL=draftSuggestedPromptPrefill.d.ts.map