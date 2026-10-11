import type { ConversationShareFailureIssue } from "@zcode/services";
export interface ConversationShareErrorDetails {
    name: string;
    kind: string;
    reasonCode?: string;
    diagnostics?: Record<string, string | number | boolean>;
    status?: number;
    code?: number;
    requestId?: string;
    clientRequestId?: string;
    issues?: readonly ConversationShareFailureIssue[];
    issueCount?: number;
    omittedIssueCount?: number;
}
export declare function getConversationShareErrorDetails(error: unknown): ConversationShareErrorDetails;
export declare function formatConversationShareErrorSummary(error: unknown): {
    titleId: string;
    issueCount: number;
    turnOrdinals: number[];
};
export declare function resolveConversationShareIssueMessageId(issue: ConversationShareFailureIssue): string;
export declare function formatConversationShareArtifactType(issue: ConversationShareFailureIssue, locale: string): string;
export declare function formatConversationShareAllowedArtifacts(issue: ConversationShareFailureIssue, locale: string): string;
export declare function resolveConversationShareWarningMessageId(issue: ConversationShareFailureIssue): string;
/** Host 侧已脱敏，这里仍复用同一套校验兜底，避免 progress 载荷被改动后泄漏路径。 */
export declare function sanitizeConversationShareWarnings(value: unknown): readonly ConversationShareFailureIssue[];
export declare function resolveConversationShareFallbackIssueCode(details: ConversationShareErrorDetails): ConversationShareFailureIssue["code"];
export declare function resolveConversationSharePublishErrorMessageId(error: unknown): string;
//# sourceMappingURL=conversationShareError.d.ts.map