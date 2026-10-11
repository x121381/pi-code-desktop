import type { ZCodeProvider } from "@zcode/shared";
import type { IZCodeTaskService } from "@zcode/services";
type WorkspaceProviderConfigServiceScope = "workspace" | "base";
export declare function resolveWorkspaceProviderConfigZCodeService(params: {
    configuredServiceScope: WorkspaceProviderConfigServiceScope;
    workspaceZCodeService: IZCodeTaskService;
    baseZCodeService: IZCodeTaskService | null;
    remoteSessionId: string | null;
}): IZCodeTaskService | null;
/**
 * 读取当前 workspace + provider 的主配置文件路径。
 *
 * 统一通过 zcodeTaskService 获取路径规则，避免 UI 层拼接 provider 配置路径。
 */
export declare function useWorkspaceProviderConfigFile(workspacePath: string, provider: ZCodeProvider, preferredRemoteSessionId?: string | null, workspaceIdentity?: string, options?: {
    serviceScope?: "workspace" | "base";
    enabled?: boolean;
}): {
    refresh: () => void;
    path: string | null;
    exists: boolean;
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useWorkspaceProviderConfigFile.d.ts.map