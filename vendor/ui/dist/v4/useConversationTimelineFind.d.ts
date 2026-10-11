import type { ConversationRow, SessionPhase } from "@zcode/shared/zcode-protocol-v4";
import type { ConversationTurnRenderUnit } from "@/v4/conversationTurnRenderUnits.js";
import type { ChatSearchResultHighlightRequest, ConversationFindMatchState } from "@/v4/legacyChatViewTypes.js";
export interface UseConversationTimelineFindOptions {
    rootRef: React.RefObject<HTMLElement | null>;
    renderUnits: readonly ConversationTurnRenderUnit[];
    rows: readonly ConversationRow[];
    mountedRowsKey: string;
    canLoadOlder: boolean;
    loadingOlder: boolean;
    onLoadOlder?: () => Promise<void> | void;
    sessionPhase?: SessionPhase;
    conversationFindQuery: string;
    conversationFindActiveIndex: number;
    conversationFindNavigationRequestId: number;
    onConversationFindMatchStateChange?: (state: ConversationFindMatchState) => void;
    searchResultHighlightRequest?: ChatSearchResultHighlightRequest | null;
    onSearchResultHighlightDone?: (requestId: number) => void;
    scrollToUnit: (unitIndex: number) => void;
}
export declare function useConversationTimelineFind({ rootRef, renderUnits, rows, mountedRowsKey, canLoadOlder, loadingOlder, onLoadOlder, sessionPhase, conversationFindQuery, conversationFindActiveIndex, conversationFindNavigationRequestId, onConversationFindMatchStateChange, searchResultHighlightRequest, onSearchResultHighlightDone, scrollToUnit, }: UseConversationTimelineFindOptions): void;
//# sourceMappingURL=useConversationTimelineFind.d.ts.map