import type { ConfigOptionsStatus } from "@/store/zcodeSessionStoreTypes.js";
/** 获取 toolbar 当前作用域的 configOptions：active task 读 task 快照，草稿态读 workspace 默认配置。 */
export declare function useToolbarConfigOptions(workspacePath: string, taskId: string | null, workspaceIdentity?: string): {
    configOptions: import("@zcode/shared").ZCodeConfigOption[];
    status: ConfigOptionsStatus;
    loading: boolean;
    error: boolean;
};
//# sourceMappingURL=useZCodeConfig.d.ts.map