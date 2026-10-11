import type { StartPlanPreviewConfig } from "@zcode/shared";
export declare function useStartPlanPreview(options?: {
    enabled?: boolean;
}): {
    refresh: () => Promise<void>;
    preview: StartPlanPreviewConfig | null;
    loading: boolean;
    error: string | null;
};
export declare function clearStartPlanPreviewCacheForTest(): void;
export declare function primeStartPlanPreviewCacheForTest(preview: StartPlanPreviewConfig | null): void;
//# sourceMappingURL=useStartPlanPreview.d.ts.map