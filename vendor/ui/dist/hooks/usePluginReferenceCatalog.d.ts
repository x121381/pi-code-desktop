import type { ZCodePluginReferenceCatalogEntry } from "@zcode/shared";
export interface PluginReferenceCatalogState {
    entries: ZCodePluginReferenceCatalogEntry[];
    authority: "session" | "workspace" | null;
    loading: boolean;
    error: string | null;
}
export interface PluginReferenceCatalogOptions {
    preferredRemoteSessionId?: string;
    /** 显式重试代次；菜单重开时重新查询，关闭菜单不清空已加载的目录。 */
    refreshRevision?: number;
    /** 仅合并当前 runtime 内尚未完成的同一 Session 请求；settle 后立即释放。 */
    dedupeSessionRequest?: boolean;
    suppressErrorLog?: boolean;
}
export declare function clearPluginReferenceCatalogCacheForTest(): void;
/**
 * Plugin 对话引用 catalog。
 * authority 由 sessionId 决定：null（新建草稿）→ workspace 当前 catalog；
 * 非 null（已有 Session）→ 该 Session 创建时冻结的 session-owned catalog。
 * 异步结果按 `workspaceKey + sessionId + runtime restart 代次 + 请求序号` 校验：key 变化或新请求发出后，
 * 旧 workspace/session/进程代次的返回一律丢弃，不得回填到新目标。
 */
export declare function usePluginReferenceCatalog(workspacePath: string, workspaceIdentity: string | undefined, sessionId: string | null, enabled: boolean, options?: PluginReferenceCatalogOptions): PluginReferenceCatalogState;
//# sourceMappingURL=usePluginReferenceCatalog.d.ts.map