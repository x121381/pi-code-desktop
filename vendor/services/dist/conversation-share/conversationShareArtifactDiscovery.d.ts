import { type ConversationPreviewArtifactCandidate, type ConversationShareCapabilities } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import type { IZCodeAgentService } from "../zcode-agent/zcodeAgent.js";
import type { ConversationShareFailureIssue, PublishTextConversationInput } from "./conversationShare.js";
import type { ConversationShareArtifactSource } from "./conversationShareArtifactSource.js";
import type { ConversationSharePublicArtifact } from "./conversationSharePublicProjection.js";
export interface ConversationShareArtifactSnapshot {
    rows: ConversationRow[];
    bytesBySourceRef: Map<string, Uint8Array>;
    additionalArtifacts: ConversationSharePublicArtifact[];
    issues: ConversationShareFailureIssue[];
    /** 非阻断：被跳过的预览结果物，发布照常继续。 */
    warnings: ConversationShareFailureIssue[];
}
export interface ConversationSharePreviewPreflightSnapshot {
    revision: number;
    logEpoch: string;
    capabilitiesFingerprint: string;
    candidateFingerprint: string;
    visibleSourceRefs: readonly string[];
}
export declare function getConversationSharePreviewCandidateFingerprint(candidates: readonly ConversationPreviewArtifactCandidate[]): string;
export declare function buildConversationShareArtifactSnapshot(options: {
    zcodeAgentService: Pick<IZCodeAgentService, "conversationFileChangesV4" | "conversationAttachmentReadV4">;
    artifactSource: ConversationShareArtifactSource;
    input: PublishTextConversationInput;
    selectedRows: ConversationRow[];
    registeredArtifacts: ConversationSharePublicArtifact[];
    inlineBytesBySourceRef?: ReadonlyMap<string, Uint8Array>;
    capabilities: ConversationShareCapabilities;
    revision: number;
    logEpoch: string;
    turnOrdinalByProductTurnId?: ReadonlyMap<string, number>;
    preflightPreviewSnapshots?: ReadonlyMap<string, ConversationSharePreviewPreflightSnapshot>;
    currentCapabilitiesFingerprint?: string;
}): Promise<ConversationShareArtifactSnapshot>;
//# sourceMappingURL=conversationShareArtifactDiscovery.d.ts.map