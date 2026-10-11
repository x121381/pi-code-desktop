import type { OAuthProviderId } from "@zcode/shared";
import type { PurchaseAudience } from "@/settings/model-provider-section/codingPlanEnterpriseTiers.js";
export interface CodingPlanUpgradeDialogTarget {
    providerId: string;
    initialAudience?: PurchaseAudience;
    initialTeamPlanKey?: string;
    funnelContext?: import("@/lib/codingPlanFunnelTelemetry.js").CodingPlanFunnelContext;
}
export interface PendingCodingPlanUpgradeAfterLogin {
    loginAttemptId: number;
    target: CodingPlanUpgradeDialogTarget;
}
export declare function beginCodingPlanUpgradeLogin(params: {
    target: CodingPlanUpgradeDialogTarget;
    oauthProviderId: OAuthProviderId;
    audience: PurchaseAudience;
    requestLoginEntry: (providerId?: OAuthProviderId) => number;
    onClose: () => void;
}): PendingCodingPlanUpgradeAfterLogin;
export declare function resolvePendingCodingPlanUpgradeAfterLogin(params: {
    pending: PendingCodingPlanUpgradeAfterLogin | null;
    loginAttempt: {
        id: number;
        status: "requested" | "waiting" | "succeeded" | "cancelled" | "failed";
    } | null;
}): {
    action: "wait";
} | {
    action: "discard";
} | {
    action: "reopen";
    target: CodingPlanUpgradeDialogTarget;
};
//# sourceMappingURL=codingPlanUpgradeLoginRecovery.d.ts.map