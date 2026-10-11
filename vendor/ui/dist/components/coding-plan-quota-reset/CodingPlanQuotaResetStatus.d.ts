import type { CodingPlanResetType } from "@zcode/shared";
import type { CodingPlanQuotaResetUiStatus } from "@/lib/codingPlanQuotaResetUi.js";
/**
 * 自动重置提示内容（纯展示），供 composer 额度入口的受控 tooltip 使用：
 * - processing：转圈 +「正在重置 5 小时/周额度…」
 * - completed： 绿色勾选 +「5 小时/周额度已重置」
 * 带 role="status" 让读屏在状态切换时朗读。
 */
export declare function CodingPlanQuotaResetStatusContent({ status, resetType, }: {
    status: CodingPlanQuotaResetUiStatus;
    resetType?: CodingPlanResetType;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CodingPlanQuotaResetStatus.d.ts.map