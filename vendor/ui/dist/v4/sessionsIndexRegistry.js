import { logger } from "@/logger.js";
import { remoteAgentServiceGeneration } from "@/lib/remoteAgentServiceGeneration.js";
import { findRemoteWorkspaceSessionIdForAgentService } from "@/store/remoteWorkspaceSessionStore.js";
import { createAgentSessionsIndexTransport } from "@/v4/agentSessionsIndexTransport.js";
import { SessionsIndexStore } from "@/v4/sessionsIndexStore.js";
const registry = new Map();
const entriesByStore = new WeakMap();
/** 已上报过的 endpoint 不一致 scope；同一 scope 反复 acquire（重渲染/多消费者）只落一条日志。 */
const reportedScopeEndpointMismatches = new Set();
/** 本机 endpoint 的保留键（与 task list shardKey 口径一致）。 */
export const LOCAL_SESSIONS_INDEX_ENDPOINT = "__base__";
/**
 * 诊断：scope 声明的 endpoint 必须与 agentService 实际所属的远程 session 一致，否则同一个
 * 远程 workspace 会被登记成两个条目、对同一 topic 发两条订阅，而 CLI 对同 connection/topic 只保留
 * 最新一条——先到的订阅被静默替换，侧栏从此收不到帧且没有任何错误。这类键不一致
 * （如 Settings tab 覆盖时 Root 丢掉 remoteSessionId）在生产日志里没有任何 renderer 痕迹，只能靠
 * RPC 指纹反推；这里用 lifecycle 通道落盘，让同类键不一致在用户日志里直接可见。只记录、不改键。
 */
function reportScopeEndpointMismatch(scope, agentService) {
    const remoteSessionId = findRemoteWorkspaceSessionIdForAgentService(agentService);
    if (!remoteSessionId)
        return;
    const endpointKey = scope.endpointKey ?? LOCAL_SESSIONS_INDEX_ENDPOINT;
    if (endpointKey === remoteSessionId)
        return;
    const reportKey = `${endpointKey}\0${scope.workspaceKey}\0${remoteSessionId}`;
    if (reportedScopeEndpointMismatches.has(reportKey))
        return;
    reportedScopeEndpointMismatches.add(reportKey);
    logger.lifecycle.warn("[v4-sessions-index] scope endpoint 与远程代理归属不一致", {
        event: "v4.sessions_index.scope_endpoint_mismatch",
        endpointKey,
        remoteSessionId,
        workspaceKey: scope.workspaceKey,
        workspacePath: scope.workspacePath,
    });
}
export function resetSessionsIndexScopeEndpointMismatchReportsForTest() {
    reportedScopeEndpointMismatches.clear();
}
function createSessionsIndexTransport(scope, agentService) {
    const workspaceIdentity = scope.workspaceIdentity?.trim();
    return createAgentSessionsIndexTransport(agentService, {
        workspacePath: scope.workspacePath,
        ...(workspaceIdentity ? { workspaceIdentity } : {}),
    });
}
/** 注册表条目键 = endpoint + workspaceKey（同 workspaceKey 不同 endpoint 不共用）。 */
export function buildSessionsIndexEntryKey(scope, agentService) {
    const entryKey = `${scope.endpointKey ?? LOCAL_SESSIONS_INDEX_ENDPOINT}\0${scope.workspaceKey}`;
    return agentService
        ? `${entryKey}\0service-generation:${remoteAgentServiceGeneration(agentService)}`
        : entryKey;
}
/** 取/建某 endpoint+workspace 的共享 sessions-index store，refCount++（首次 acquire 发起订阅）。 */
export function acquireSessionsIndex(scope, agentService) {
    reportScopeEndpointMismatch(scope, agentService);
    const entryKey = buildSessionsIndexEntryKey(scope);
    const incomingServiceGeneration = remoteAgentServiceGeneration(agentService);
    const existing = registry.get(entryKey);
    if (existing?.agentService === agentService) {
        existing.refCount += 1;
        return existing.store;
    }
    if (existing &&
        (scope.endpointKey ?? LOCAL_SESSIONS_INDEX_ENDPOINT) !== LOCAL_SESSIONS_INDEX_ENDPOINT) {
        existing.refCount += 1;
        // 远程 RPC proxy 换代期间，不同 React consumer 可能短暂持有新旧 service。
        // CLI 对同 connection/topic 只保留后一次订阅；若这里并行创建第二个 store，旧 store
        // 会继续显示 live/空快照却永远收不到帧。远程 scope 固定复用同一 store，并按 service
        // generation 单向、串行切换 transport；迟到的旧 consumer 不允许把 transport 切回去。
        if (incomingServiceGeneration > existing.agentServiceGeneration) {
            existing.agentService = agentService;
            existing.agentServiceGeneration = incomingServiceGeneration;
            const transport = createSessionsIndexTransport(scope, agentService);
            // 任何中间 proxy 的 subscribe 都可能永久 pending，换代不能排队等待
            // 前一条 I/O。store generation 会同步 detach 旧 transport，并让迟到结果自行失效。
            void existing.store.replaceTransport(transport).catch((error) => {
                logger.warn("[v4-sessions-index] remote transport replacement failed", error);
            });
        }
        return existing.store;
    }
    if (existing) {
        // 本地 __base__ 保持原生命周期：service 实例换代时创建新 store；旧 consumer
        // 后续 cleanup 仍按 store 身份精确 release，不能误减新条目的 refCount。
        registry.delete(entryKey);
        if (existing.refCount <= 0) {
            existing.store.close();
            entriesByStore.delete(existing.store);
        }
    }
    const store = new SessionsIndexStore();
    const transport = createSessionsIndexTransport(scope, agentService);
    // 初始 subscribe 可能在旧 RPC proxy 被销毁后永久 pending。换代队列不能
    // 等待这条旧 I/O；replaceTransport 会用 store generation 失效其迟到结果。
    void store.connect(transport, { forceSnapshot: true });
    const entry = {
        key: entryKey,
        agentService,
        agentServiceGeneration: incomingServiceGeneration,
        store,
        refCount: 1,
    };
    registry.set(entryKey, entry);
    entriesByStore.set(store, entry);
    return store;
}
/** refCount--，归零则 close + 移除（退订 + 解监听）。 */
export function releaseSessionsIndex(scope, store) {
    const entryKey = buildSessionsIndexEntryKey(scope);
    const entry = entriesByStore.get(store);
    if (!entry || entry.key !== entryKey)
        return;
    entry.refCount -= 1;
    if (entry.refCount <= 0) {
        entry.store.close();
        entriesByStore.delete(entry.store);
        if (registry.get(entryKey) === entry)
            registry.delete(entryKey);
    }
}
/** 仅测试/诊断用：当前注册的 endpoint+workspaceKey 条目数。 */
export function sessionsIndexRegistrySize() {
    return registry.size;
}
//# sourceMappingURL=sessionsIndexRegistry.js.map