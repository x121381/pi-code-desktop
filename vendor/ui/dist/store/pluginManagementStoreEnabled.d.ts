import type { IPluginManagementService } from "@zcode/services";
import type { ZCodePluginScope } from "@zcode/shared";
import type { PluginManagementState } from "@/store/pluginManagementStore.js";
export declare function setPluginEnabledOptimistically(set: (partial: Partial<PluginManagementState>) => void, get: () => PluginManagementState, pluginId: string, enabled: boolean, pluginService: IPluginManagementService, scope?: ZCodePluginScope): Promise<boolean>;
//# sourceMappingURL=pluginManagementStoreEnabled.d.ts.map