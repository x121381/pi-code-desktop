export declare function resolveConversationSelectionTooltipEnabled({ selectionActionsEnabled, partialShareActive, }: {
    selectionActionsEnabled: boolean;
    partialShareActive: boolean;
}): boolean;
export declare function resolveConversationShareBackgroundScrollLocked({ partialShareActive, stage, view, }: {
    partialShareActive: boolean;
    stage?: "selection" | "configuration";
    view: "selection" | "timeline" | undefined;
}): boolean;
export declare function resolveConversationShareSelectionPanelVisible({ partialShareActive, stage, view, }: {
    partialShareActive: boolean;
    stage?: "selection" | "configuration";
    view: "selection" | "timeline" | undefined;
}): boolean;
//# sourceMappingURL=conversationShareModePolicy.d.ts.map