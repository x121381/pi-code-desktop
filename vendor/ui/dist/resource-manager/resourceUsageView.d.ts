import type { ResourceUsageCategory, ResourceUsageProcess } from "@zcode/shared";
/** 三组固定顺序：基础服务 / 内置插件 / 社区插件 */
export declare const RESOURCE_USAGE_CATEGORY_ORDER: readonly ResourceUsageCategory[];
export interface ResourceUsageGroupView {
    category: ResourceUsageCategory;
    processCount: number;
    cpuPercent: number;
    memoryBytes: number;
    /** 组内是否有指标尚未采到的进程 */
    hasUnsampled: boolean;
    /** 按 CPU 降序、内存降序、pid 升序 */
    processes: ResourceUsageProcess[];
}
export declare function groupResourceUsage(processes: readonly ResourceUsageProcess[]): ResourceUsageGroupView[];
export declare function roundPercent(value: number): number;
export declare function clampPercent(value: number): number;
export declare function formatPercent(value: number): string;
export declare function formatBytes(bytes: number): string;
//# sourceMappingURL=resourceUsageView.d.ts.map