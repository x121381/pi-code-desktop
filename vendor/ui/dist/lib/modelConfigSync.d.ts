import { type ZCodeConfigOption, type ZCodeProvider, type ZCodeTaskMeta } from "@zcode/shared";
interface ModelConfigSyncScope {
    provider: ZCodeProvider;
    supplierKey: string;
}
export interface ModelConfigSyncWorkspaceSnapshot {
    activeTaskId: string | null;
    selectedProvider: ZCodeProvider;
    selectedSupplierKey: string;
    configOptions: ZCodeConfigOption[] | null;
    optimisticTaskListByTaskId: Record<string, Pick<ZCodeTaskMeta, "provider">>;
    taskListCache: ZCodeTaskMeta[] | null;
}
export declare function parseCustomProviderIdFromSupplierKey(supplierKey: string): string | null;
export declare function isCustomSupplierKeyForProvider(supplierKey: string, providerId: string): boolean;
export declare function resolveWorkspaceModelConfigSyncScope(snapshot: ModelConfigSyncWorkspaceSnapshot): ModelConfigSyncScope;
export declare function resolveModelNameForConfigSync(params: {
    configOptions: ZCodeConfigOption[] | null;
    selectedProvider: ZCodeProvider;
    providerId: string;
    providerModels: string[];
}): string | undefined;
export {};
//# sourceMappingURL=modelConfigSync.d.ts.map