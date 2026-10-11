import type { ModelConfigResolution } from "@zcode/provider";
export declare function useModelConfigResolution({ open, enabled, originalModelId, modelId, resolve, }: {
    open: boolean;
    enabled?: boolean;
    originalModelId?: string;
    modelId: string;
    resolve?: (modelId: string) => Promise<ModelConfigResolution>;
}): {
    readonly cancel: () => void;
    readonly restore: (intent: {
        isCurrent: () => boolean;
        apply: (resolution: ModelConfigResolution) => void;
    }) => Promise<ModelConfigResolution | undefined>;
    readonly defaultsLoaded: boolean;
    readonly flush: () => Promise<ModelConfigResolution | undefined>;
    readonly resolution: ModelConfigResolution | null;
    readonly resolving: boolean;
    readonly scheduled: boolean;
};
//# sourceMappingURL=useModelConfigResolution.d.ts.map