import { type ResourceUsageGroupView } from "./resourceUsageView.js";
export declare const UNSAMPLED_PLACEHOLDER = "\u2014";
export type UsageMetric = "cpu" | "memory";
interface UsageMeterProps {
    testId: string;
    label: string;
    appValue: string;
    systemValue: string;
    appPercent: number;
    systemPercent: number;
    appLabel: string;
    systemLabel: string;
}
/** 双层进度条：灰色 = 整机总占用，brand = ZCode 自身占用；图例文字做颜色之外的第二编码 */
export declare function UsageMeter({ testId, label, appValue, systemValue, appPercent, systemPercent, appLabel, systemLabel, }: UsageMeterProps): import("react/jsx-runtime").JSX.Element;
interface UsageGroupProps {
    group: ResourceUsageGroupView;
    metric: UsageMetric;
    title: string;
    expanded: boolean;
    onToggle: () => void;
    emptyText: string;
    samplingText: string;
    columns: {
        process: string;
        pid: string;
        cpu: string;
        memory: string;
    };
}
export declare function UsageGroup({ group, metric, title, expanded, onToggle, emptyText, samplingText, columns, }: UsageGroupProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=resourceUsageParts.d.ts.map