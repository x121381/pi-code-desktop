import type { CuaPermissionStatusQueryOptions, CuaPermissionStatusResult } from "@zcode/services";
export declare function useCuaPermissionStatus(workspacePath: string | null, workspaceIdentity?: string): {
    status: CuaPermissionStatusResult | null;
    fresh: boolean;
    /** 展示用的稳定标志：有可展示内容即为 true，不随每次查询回落。见 store 内注释。 */
    settled: boolean;
    refresh: (options?: CuaPermissionStatusQueryOptions) => void;
};
//# sourceMappingURL=useCuaPermissionStatus.d.ts.map