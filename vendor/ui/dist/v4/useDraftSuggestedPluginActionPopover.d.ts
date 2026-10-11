import type { DraftSuggestedPluginFlow } from "@/v4/ConversationDraftSuggestedPluginFlow.js";
export type DraftSuggestedPluginActionPopoverState = {
    anchorItemId: string;
    operationId: string;
    phase: "confirmation" | "progress" | "success" | "error";
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    onDismiss?: () => void;
};
export declare function useDraftSuggestedPluginActionPopover(): {
    clearPluginActionPopover: (operationId?: string) => void;
    pluginActionPopover: DraftSuggestedPluginActionPopoverState | null;
    showPluginActionPopover: (flow: DraftSuggestedPluginFlow, messageId: string, phase: DraftSuggestedPluginActionPopoverState["phase"], action?: {
        label: string;
        onAction: () => void;
        onDismiss?: () => void;
    }) => void;
    showPluginActionResultPopover: (flow: DraftSuggestedPluginFlow, messageId: string, succeeded: boolean) => void;
};
//# sourceMappingURL=useDraftSuggestedPluginActionPopover.d.ts.map