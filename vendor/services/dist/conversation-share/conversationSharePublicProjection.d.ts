import type { ConversationShareArtifactDescriptor } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
export interface ConversationSharePublicProjection {
    rows: ConversationRow[];
    selectedProductTurnIds: string[];
    artifacts: ConversationSharePublicArtifact[];
}
export interface ConversationSharePublicArtifact {
    sourceRef: string;
    descriptor: ConversationShareArtifactDescriptor;
}
export declare function assertConversationSharePublicProjection(input: {
    rows: ConversationRow[];
    selectedProductTurnIds: string[];
}): void;
export declare function buildConversationSharePublicProjection(input: {
    rows: ConversationRow[];
    selectedProductTurnIds: string[];
    additionalArtifacts?: ConversationSharePublicArtifact[];
}): ConversationSharePublicProjection;
//# sourceMappingURL=conversationSharePublicProjection.d.ts.map