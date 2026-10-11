import { type ModelSelectionView } from "@zcode/provider";
import { type ModelSelection, type UsageEntitlementSnapshot } from "@zcode/shared";
/** 只消费目标 Registry 与已有额度事实；未知额度跳过，不为提交增加查询门禁。 */
export declare function resolveStartPlanRecommendation(selection: ModelSelection, view: ModelSelectionView | null | undefined, snapshot: UsageEntitlementSnapshot | null): ModelSelection | null;
/** 只改思考档位、继承或其他字段不属于模型更换。 */
export declare function hasExplicitModelChanged(previous: ModelSelection | null | undefined, next: ModelSelection | null | undefined): next is ModelSelection;
//# sourceMappingURL=startPlanRecommendation.d.ts.map