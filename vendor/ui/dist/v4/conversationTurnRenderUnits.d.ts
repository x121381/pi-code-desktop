import type { ConversationTurnRenderUnit, BuildConversationTurnRenderUnitsOptions } from "@/v4/conversationTurnRenderUnitTypes.js";
export type { ConversationTurnRenderUnit, BuildConversationTurnRenderUnitsOptions, } from "@/v4/conversationTurnRenderUnitTypes.js";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
export type { AssistantWorkRow, ConversationTurnFlowItem } from "@/v4/conversationTurnFlowItems.js";
export type { ConversationTurnWorkSegment, ConversationTurnWorkStatus, } from "@/v4/conversationTurnWorkSegments.js";
export { resolveNextHighspeedExpiryMs } from "@/highspeed/highspeedConversationRows.js";
export declare function buildConversationTurnRenderUnits(rows: readonly ConversationRow[], options?: BuildConversationTurnRenderUnitsOptions): ConversationTurnRenderUnit[];
//# sourceMappingURL=conversationTurnRenderUnits.d.ts.map