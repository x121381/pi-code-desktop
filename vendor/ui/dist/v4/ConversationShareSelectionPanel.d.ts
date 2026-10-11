import type { ConversationTurnNavigatorItem } from "@/v4/conversationTurnNavigatorHelpers.js";
export interface ConversationShareSelectionPanelProps {
    visible: boolean;
    items: readonly ConversationTurnNavigatorItem[];
    selectedRowIds: ReadonlySet<number>;
    onToggle: (rowId: number) => void;
    onInspect: (target: {
        unitIndex: number;
        rowId: number;
    }) => void;
}
declare function ConversationShareSelectionPanelImpl({ visible, items, selectedRowIds, onToggle, onInspect, }: ConversationShareSelectionPanelProps): import("react/jsx-runtime").JSX.Element;
export declare const ConversationShareSelectionPanel: import("react").MemoExoticComponent<typeof ConversationShareSelectionPanelImpl>;
export {};
//# sourceMappingURL=ConversationShareSelectionPanel.d.ts.map