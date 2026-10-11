import type { ZCodeConfigOption, ZCodeTaskMeta } from "@zcode/shared";
export declare function resolveGlmRecoveredTaskModelValue(taskModel: string | undefined): string | null;
export declare function resolveRecoveredTaskModelValue(taskMeta: Pick<ZCodeTaskMeta, "provider" | "model">): string | null;
export declare function mergeRecoveredTaskModelConfigOptions({ taskMeta, configOptions, }: {
    taskMeta: Pick<ZCodeTaskMeta, "provider" | "model">;
    configOptions: readonly ZCodeConfigOption[];
}): ZCodeConfigOption[] | null;
export declare function resolveTaskRestorePreloadConfigOptions({ taskMeta, cachedTaskConfigOptions, }: {
    taskMeta: Pick<ZCodeTaskMeta, "provider" | "model"> & Partial<Pick<ZCodeTaskMeta, "mode" | "thoughtLevel">>;
    cachedTaskConfigOptions?: readonly ZCodeConfigOption[];
}): ZCodeConfigOption[];
export declare function mergeGlmRecoveredTaskModelConfigOptions({ taskMeta, configOptions, }: {
    taskMeta: Pick<ZCodeTaskMeta, "provider" | "model">;
    configOptions: readonly ZCodeConfigOption[];
}): ZCodeConfigOption[] | null;
//# sourceMappingURL=taskModelRecovery.d.ts.map