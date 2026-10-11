import type { IZCodeAgentService } from "@zcode/services";
import { SessionsIndexStore } from "@/v4/sessionsIndexStore.js";
/** 注册表需要的 agentService 窄面（= transport 的依赖面，便于测试注入）。 */
export type SessionsIndexAgentService = Pick<IZCodeAgentService, "subscribeSessionsIndexV4" | "resyncSessionsIndexV4" | "helloConversationV4" | "initializeConversationV4" | "unsubscribeSessionsIndexV4" | "onDynamicSessionsIndexFrame" | "onAgentRuntimeRestarted">;
/** 本机 endpoint 的保留键（与 task list shardKey 口径一致）。 */
export declare const LOCAL_SESSIONS_INDEX_ENDPOINT = "__base__";
export interface SessionsIndexScope {
    /** workspace 复用键（= services resolveWorkspaceKey 口径：workspaceIdentity ?? workspacePath）。 */
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    /** endpoint 维度：remote shard 的 remoteSessionId；缺省 = 本机 __base__。 */
    endpointKey?: string;
}
export declare function resetSessionsIndexScopeEndpointMismatchReportsForTest(): void;
/** 注册表条目键 = endpoint + workspaceKey（同 workspaceKey 不同 endpoint 不共用）。 */
export declare function buildSessionsIndexEntryKey(scope: Pick<SessionsIndexScope, "workspaceKey" | "endpointKey">, agentService?: SessionsIndexAgentService): string;
/** 取/建某 endpoint+workspace 的共享 sessions-index store，refCount++（首次 acquire 发起订阅）。 */
export declare function acquireSessionsIndex(scope: SessionsIndexScope, agentService: SessionsIndexAgentService): SessionsIndexStore;
/** refCount--，归零则 close + 移除（退订 + 解监听）。 */
export declare function releaseSessionsIndex(scope: Pick<SessionsIndexScope, "workspaceKey" | "endpointKey">, store: SessionsIndexStore): void;
/** 仅测试/诊断用：当前注册的 endpoint+workspaceKey 条目数。 */
export declare function sessionsIndexRegistrySize(): number;
//# sourceMappingURL=sessionsIndexRegistry.d.ts.map