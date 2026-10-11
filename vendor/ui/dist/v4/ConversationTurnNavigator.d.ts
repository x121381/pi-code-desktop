import { type ConversationTurnNavigatorVirtualItem } from "@/v4/conversationTurnNavigatorHelpers.js";
import type { ConversationTurnRenderUnit } from "@/v4/conversationTurnRenderUnits.js";
export interface ConversationTurnNavigatorProps {
    renderUnits: readonly ConversationTurnRenderUnit[];
    scrollOffsetPx: number;
    viewportHeightPx: number;
    virtualItems: readonly ConversationTurnNavigatorVirtualItem[];
    activeQueryRowId?: number;
    isHydratingDirectory?: boolean;
    onJumpToQuery: (target: {
        unitIndex: number;
        rowId: number;
    }, behavior: ScrollBehavior) => void;
}
declare function ConversationTurnNavigatorImpl({ renderUnits, scrollOffsetPx, viewportHeightPx, virtualItems, activeQueryRowId, isHydratingDirectory, onJumpToQuery, }: ConversationTurnNavigatorProps): import("react/jsx-runtime").JSX.Element | null;
export declare const ConversationTurnNavigator: import("react").MemoExoticComponent<typeof ConversationTurnNavigatorImpl>;
export {};
//# sourceMappingURL=ConversationTurnNavigator.d.ts.map