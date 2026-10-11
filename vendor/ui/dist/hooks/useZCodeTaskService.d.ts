import type { IZCodeTaskService } from "@zcode/services";
type GetTaskSnapshotParams = Parameters<IZCodeTaskService["getTaskSnapshot"]>[0];
export declare function buildSnapshotDedupeKey(params: GetTaskSnapshotParams): string;
/** 获取 ZCode task wrapper 服务实例 */
export declare function useZCodeTaskService(workspacePath?: string, preferredRemoteSessionId?: string | null, workspaceIdentity?: string | null): IZCodeTaskService;
export {};
//# sourceMappingURL=useZCodeTaskService.d.ts.map