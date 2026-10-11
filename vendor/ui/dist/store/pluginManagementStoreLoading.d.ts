import type { IPluginManagementService } from "@zcode/services";
import type { ZCodePluginScope } from "@zcode/shared";
import type { PluginManagementState } from "@/store/pluginManagementStore.js";
export declare function buildWorkspaceKey(workspacePath: string, workspaceIdentity: string | null): string;
export declare function runWorkspaceOperation(set: (partial: Partial<PluginManagementState>) => void, get: () => PluginManagementState, pluginService: IPluginManagementService, operationId: string, operation: (workspace: {
    workspacePath: string;
    workspaceIdentity?: string;
}) => Promise<void>): Promise<boolean>;
export declare function loadInto(set: (partial: Partial<PluginManagementState>) => void, get: () => PluginManagementState, params: {
    workspacePath: string;
    workspaceIdentity: string | null;
    configScope: ZCodePluginScope | null;
    pluginService: IPluginManagementService;
}): Promise<void>;
//# sourceMappingURL=pluginManagementStoreLoading.d.ts.map