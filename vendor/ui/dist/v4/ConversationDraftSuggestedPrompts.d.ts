import { type DraftSuggestedPromptItem } from "@/v4/draftSuggestedPromptItems.js";
import type { DraftSuggestedPluginActionPopoverState } from "@/v4/useDraftSuggestedPluginActionPopover.js";
export type { DraftSuggestedPromptItem } from "@/v4/draftSuggestedPromptItems.js";
interface ConversationDraftSuggestedPromptsProps {
    className?: string;
    layout?: "chips" | "list";
    /** 推荐项列表；由上层从 Client Scenes 映射后下发。 */
    items?: DraftSuggestedPromptItem[];
    /** 点击回调；完整配置交给上层解析 prompt 与 Plugin catalog。 */
    onSelect?: (item: DraftSuggestedPromptItem) => void;
    disabled?: boolean;
    onRefresh?: () => void;
    onClose?: () => void;
    refreshDisabled?: boolean;
    pluginActionPopover?: DraftSuggestedPluginActionPopoverState | null;
}
export declare function ConversationDraftSuggestedPrompts({ className, layout, items, onSelect, disabled, onRefresh, onClose, refreshDisabled, pluginActionPopover, }: ConversationDraftSuggestedPromptsProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ConversationDraftSuggestedPrompts.d.ts.map