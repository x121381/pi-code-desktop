import type { CodingPlanResetType, ZCodeAccountAccess, ZCodeProviderAccountAccess } from "@zcode/shared";
import { type CodingPlanQuotaResetUiEntry } from "@/lib/codingPlanQuotaResetUi.js";
import type { CodingPlanQuotaResetAutoPlayReservation, CodingPlanQuotaResetAutoPlayReservationAttempt } from "@/store/codingPlanQuotaResetState.js";
export interface CodingPlanQuotaResetTypeController {
    entry: CodingPlanQuotaResetUiEntry | null;
    /** 仍有可核销的手动重置机会（available，或 completed 携带的同类型余下机会）。 */
    opportunityVisible: boolean;
    /** 手动 use + status 对账中。 */
    processing: boolean;
    /** 已拿到服务端 used_at。 */
    done: boolean;
    statusVisible: boolean;
    /** 发起手动核销；失败 reject 供 Action 恢复交互。 */
    reset: () => Promise<void>;
}
export interface CodingPlanQuotaResetUiController extends CodingPlanQuotaResetTypeController {
    enabled: boolean;
    week: CodingPlanQuotaResetTypeController;
    /** Composer 申请临时播放 reservation；此阶段不写 played。 */
    reserveAutomaticCompletion: (resetType: CodingPlanResetType, completedAt: number) => Promise<CodingPlanQuotaResetAutoPlayReservationAttempt>;
    /** 组件仍有效且即将展示时提交 played。 */
    commitAutomaticCompletion: (reservation: CodingPlanQuotaResetAutoPlayReservation) => boolean;
    /** 组件在 commit 前失效时释放 reservation。 */
    releaseAutomaticCompletion: (reservation: CodingPlanQuotaResetAutoPlayReservation) => Promise<void>;
}
export declare function useCodingPlanQuotaResetUi({ sourceKey, preferredProviderId, accountAccess, enabled: requestedEnabled, onEntitlementRefresh, }: {
    sourceKey: string | null | undefined;
    preferredProviderId?: string | null;
    accountAccess?: ZCodeProviderAccountAccess | ZCodeAccountAccess | null;
    enabled?: boolean;
    onEntitlementRefresh?: () => void | Promise<void>;
}): CodingPlanQuotaResetUiController;
//# sourceMappingURL=useCodingPlanQuotaResetUi.d.ts.map