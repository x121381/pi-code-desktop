import type { CodingPlanModelData, CodingPlanToolData, CodingPlanUsageSnapshot } from "@zcode/shared";
import { buildCodingPlanUsageSources, type CodingPlanUsageSource } from "@/lib/codingPlanUsageSources.js";
export { buildCodingPlanUsageSources, type CodingPlanUsageSource };
/** Usage stats 独有的完整重置时刻格式；其它紧凑入口继续按各自规则展示。 */
export declare function formatUsageStatsQuotaResetTime(locale: string, value: number | null | undefined): string | undefined;
export declare function CodingPlanUsagePanel({ loadingSources, selectedSource, workspaceIdentity, workspacePath, }: {
    loadingSources: boolean;
    selectedSource?: CodingPlanUsageSource | null;
    workspaceIdentity?: string;
    workspacePath?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function resolveCodingPlanUsageProviderName({ fallbackProviderName, snapshot, source, }: {
    fallbackProviderName?: string;
    snapshot: CodingPlanUsageSnapshot | null;
    source: CodingPlanUsageSource | null;
}): string | undefined;
export declare function hasCodingPlanCreditUsageData({ summary, modelDataList, toolDataList, }: {
    summary: CodingPlanUsageSnapshot["detail"]["model"];
    modelDataList: CodingPlanModelData[];
    toolDataList: CodingPlanToolData[];
}): boolean;
export declare function shouldShowCodingPlanUsageDetailSummary({ summary, modelDataList, toolDataList, }: {
    summary: CodingPlanUsageSnapshot["detail"]["model"];
    modelDataList: CodingPlanModelData[];
    toolDataList: CodingPlanToolData[];
}): boolean;
//# sourceMappingURL=CodingPlanUsagePanel.d.ts.map