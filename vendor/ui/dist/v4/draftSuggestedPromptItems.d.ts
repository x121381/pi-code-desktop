import type { ClientSceneConfig } from "@zcode/services";
export interface DraftSuggestedPromptLocalizedText {
    cn?: string;
    en?: string;
}
export declare const DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS: "NAVIGATE:AUTOMATIONS";
export declare const DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS_OFFPEAK: "NAVIGATE:AUTOMATIONS:OFFPEAK";
export type DraftSuggestedPromptAction = typeof DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS | typeof DRAFT_SUGGESTED_PROMPT_NAVIGATE_AUTOMATIONS_OFFPEAK;
export interface DraftSuggestedPromptItem {
    id: string;
    /** Lucide canonical 名称，只来自 ClientSceneItem.img；不使用 imgs。 */
    iconName?: string;
    /** 官方推荐项的市场图标。 */
    iconUrl?: string;
    /** 复用插件市场图标的展示样式，不代表绑定插件。 */
    iconStyle?: "plugin";
    label: DraftSuggestedPromptLocalizedText;
    prompt: DraftSuggestedPromptLocalizedText;
    actions?: DraftSuggestedPromptAction[];
    plugin?: {
        stableId: string;
        label: DraftSuggestedPromptLocalizedText;
    };
}
export declare function parseDraftSuggestedPromptActions(onFinish: string | null | undefined): DraftSuggestedPromptAction[];
export declare function mapClientScenesToDraftSuggestedPromptItems(scenes: readonly ClientSceneConfig[]): DraftSuggestedPromptItem[];
export declare function resolveDraftSuggestedPromptText(text: DraftSuggestedPromptLocalizedText, locale: string): string;
//# sourceMappingURL=draftSuggestedPromptItems.d.ts.map