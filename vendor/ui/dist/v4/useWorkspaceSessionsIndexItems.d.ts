import type { ZCodeTaskMeta } from "@zcode/shared";
import { type SessionsIndexAgentService } from "@/v4/sessionsIndexRegistry.js";
export interface WorkspaceSessionsIndexScope {
    workspacePath: string;
    workspaceIdentity?: string;
    /** endpoint 维度（remote shard 的 remoteSessionId）；缺省 = 本机 __base__。 */
    endpointKey?: string;
    /** scope 所属 endpoint 的 agent service（resolveWorkspaceServices 产物）；缺省 = base services。 */
    agentService?: SessionsIndexAgentService;
}
export interface WorkspaceSessionsIndexItemsResult {
    /** 聚合会话 meta（running 置顶；其余按 updatedAt 降序；tick 驱动重算，引用稳定）。 */
    items: ZCodeTaskMeta[];
    /**
     * 每个 endpoint + workspace scope 的只读代次。包含 service binding 与 store 的
     * logEpoch/seq，供异步 tasks-index membership join 精确拒绝旧 activity 快照。
     */
    sourceRevisionByScopeKey: Readonly<Record<string, string>>;
    /**
     * 已订阅但尚未收到首个 snapshot 的 endpoint（"__base__" 或 remoteSessionId）。
     * 消费者用它维持 loading/syncing 提示，避免远端首帧未到时把列表当成空。
     */
    hydratingEndpointKeys: string[];
}
export declare function buildWorkspaceSessionsIndexSourceKey(scope: Pick<WorkspaceSessionsIndexScope, "workspacePath" | "workspaceIdentity" | "endpointKey">): string;
/**
 * 订阅给定 workspace scope 的 sessions-index，聚合出 ZCodeTaskMeta[]（running 置顶，其余按 updatedAt 降序）。
 * 生命周期：scope 集合变化时按引用计数 acquire/release 共享 store；任一 store 变化即重算。
 * sessions-index 变化是 conflated 低频列表事件，不属于高频 snapshot。
 */
export declare function useWorkspaceSessionsIndexItems(scopes: WorkspaceSessionsIndexScope[]): WorkspaceSessionsIndexItemsResult;
//# sourceMappingURL=useWorkspaceSessionsIndexItems.d.ts.map