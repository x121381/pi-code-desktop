import { type CodingPlanProviderId } from "@/settings/model-provider-section/constants.js";
import { type CodingPlanUpgradeDialogTarget } from "@/settings/codingPlanUpgradeLoginRecovery.js";
export { isCodingPlanPurchaseAuthPending } from "@/settings/model-provider-section/codingPlanPurchaseAuth.js";
export { beginCodingPlanUpgradeLogin, resolvePendingCodingPlanUpgradeAfterLogin, } from "@/settings/codingPlanUpgradeLoginRecovery.js";
export type { CodingPlanUpgradeDialogTarget } from "@/settings/codingPlanUpgradeLoginRecovery.js";
interface CodingPlanUpgradeDialogProps {
    target?: CodingPlanUpgradeDialogTarget;
    onClose: () => void;
    onOpenResult?: (opened: boolean) => void;
    onReopen?: (target: CodingPlanUpgradeDialogTarget) => void;
}
export declare function refreshCodingPlanUpgradeCompletion(params: {
    productsProviderId: CodingPlanProviderId | null;
    providerId: CodingPlanProviderId | null;
    refreshCodingPlanEntitlements: () => Promise<unknown> | unknown;
    refreshProviderState: () => Promise<unknown> | unknown;
    refreshTeamPlanProducts?: () => Promise<unknown> | unknown;
}): Promise<void>;
export declare function closeAndRefreshCodingPlanUpgradeFromWebview(params: {
    onClose: () => void;
    refresh: () => Promise<unknown> | unknown;
    onRefreshError?: (error: unknown) => void;
}): Promise<void>;
export declare function CodingPlanUpgradeDialog({ target, onClose, onOpenResult }: CodingPlanUpgradeDialogProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=CodingPlanUpgradeDialog.d.ts.map