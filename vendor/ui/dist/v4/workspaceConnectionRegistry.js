import { createAgentConversationTransport } from "@/v4/agentConversationTransport.js";
import { remoteAgentServiceGeneration } from "@/lib/remoteAgentServiceGeneration.js";
import { ReplaceableConversationTransport } from "@/v4/replaceableConversationTransport.js";
import { SessionDataLayer } from "@/v4/sessionDataLayer.js";
import { logger } from "@/logger.js";
const registry = new Map();
/** 本机 endpoint 的保留键（与 sessionsIndexRegistry / task list shardKey 口径一致）。 */
export const LOCAL_WORKSPACE_CONNECTION_ENDPOINT = "__base__";
/** 引用归零后延迟释放窗口（ms）；与 SessionDataLayer keep-warm 同标度。 */
export const WORKSPACE_CONNECTION_KEEP_WARM_MS = 30_000;
/** 注册表条目键 = endpoint + workspaceKey（同 workspaceKey 不同 endpoint 不共用）。 */
export function buildWorkspaceConnectionKey(scope) {
    const workspaceKey = scope.workspaceIdentity?.trim() || scope.workspacePath;
    return `${scope.remoteSessionId ?? LOCAL_WORKSPACE_CONNECTION_ENDPOINT} ${workspaceKey}`;
}
function disposeEntry(entry) {
    if (entry.keepWarmTimer !== null) {
        clearTimeout(entry.keepWarmTimer);
        entry.keepWarmTimer = null;
    }
    entry.layer.dispose();
}
function releaseEntry(entry) {
    entry.refCount -= 1;
    if (entry.refCount > 0) {
        logger.lifecycle.info("v4 workspace connection lease released", {
            event: "v4.workspace_connection.release",
            key: entry.key,
            module: "ui.v4.workspace_connection_registry",
            refCount: entry.refCount,
            status: "completed",
        });
        return;
    }
    if (entry.stale) {
        // 已被换代移出注册表：没有新消费者会再命中它，立即清场。
        disposeEntry(entry);
        logger.lifecycle.info("v4 stale workspace connection disposed", {
            event: "v4.workspace_connection.stale_disposed",
            key: entry.key,
            module: "ui.v4.workspace_connection_registry",
            refCount: 0,
            status: "completed",
        });
        return;
    }
    // 关 pane ≠ 停 session：延迟退订，防布局抖动期间反复建连/退订。
    entry.keepWarmTimer = setTimeout(() => {
        if (registry.get(entry.key) === entry) {
            registry.delete(entry.key);
        }
        entry.layer.dispose();
        logger.lifecycle.info("v4 workspace connection keep-warm expired", {
            event: "v4.workspace_connection.keep_warm_expired",
            key: entry.key,
            module: "ui.v4.workspace_connection_registry",
            refCount: 0,
            status: "completed",
        });
    }, WORKSPACE_CONNECTION_KEEP_WARM_MS);
    logger.lifecycle.info("v4 workspace connection lease released", {
        event: "v4.workspace_connection.release",
        keepWarmMs: WORKSPACE_CONNECTION_KEEP_WARM_MS,
        key: entry.key,
        module: "ui.v4.workspace_connection_registry",
        refCount: 0,
        status: "keep_warm",
    });
}
/**
 * 取/建某 endpoint+workspace 的共享 conversation 连接，refCount++。
 * agentService 由调用方（V4PaneConversationProvider 经 useWorkspaceServicesResolution）解析；
 * 调用方只在 local-ready / remote-ready 时进入本层。remote-waiting 不会拿断连代理
 * 创建 registry entry，同时仍禁止回落 base services 或为 pane 另起独立 runtime。
 */
export function acquireWorkspaceConnection(scope, agentService, createLocalMediaPreviewUrl) {
    const key = buildWorkspaceConnectionKey(scope);
    const existing = registry.get(key);
    const incomingServiceGeneration = remoteAgentServiceGeneration(agentService);
    const isRemote = (scope.remoteSessionId ?? LOCAL_WORKSPACE_CONNECTION_ENDPOINT) !==
        LOCAL_WORKSPACE_CONNECTION_ENDPOINT;
    let entry;
    if (existing && (existing.agentService === agentService || isRemote)) {
        existing.refCount += 1;
        if (existing.keepWarmTimer !== null) {
            clearTimeout(existing.keepWarmTimer);
            existing.keepWarmTimer = null;
        }
        entry = existing;
        logger.lifecycle.info("v4 workspace connection reused", {
            event: "v4.workspace_connection.reused",
            isRemote,
            key,
            module: "ui.v4.workspace_connection_registry",
            refCount: entry.refCount,
            serviceGeneration: incomingServiceGeneration,
            status: "completed",
        });
    }
    else {
        if (existing) {
            // 本地 __base__ service 换代：旧条目失效移出；
            // 无人持有则立即清场，有人持有则由其末位 release 清场。
            registry.delete(key);
            existing.stale = true;
            if (existing.refCount <= 0) {
                disposeEntry(existing);
            }
        }
        const initialTransport = createAgentConversationTransport(agentService, {
            workspacePath: scope.workspacePath,
            ...(scope.workspaceIdentity ? { workspaceIdentity: scope.workspaceIdentity } : {}),
            ...(createLocalMediaPreviewUrl ? { createLocalMediaPreviewUrl } : {}),
        });
        const replaceableTransport = isRemote
            ? new ReplaceableConversationTransport(initialTransport)
            : null;
        const transport = replaceableTransport ?? initialTransport;
        entry = {
            key,
            agentService,
            agentServiceGeneration: incomingServiceGeneration,
            transport,
            replaceableTransport,
            layer: new SessionDataLayer({ transport }),
            refCount: 1,
            keepWarmTimer: null,
            stale: false,
        };
        registry.set(key, entry);
        logger.lifecycle.info("v4 workspace connection created", {
            event: "v4.workspace_connection.created",
            isRemote,
            key,
            module: "ui.v4.workspace_connection_registry",
            refCount: 1,
            serviceGeneration: incomingServiceGeneration,
            status: "completed",
        });
    }
    let released = false;
    return {
        layer: entry.layer,
        transport: entry.transport,
        activateRemoteService: () => {
            if (released ||
                !isRemote ||
                entry.stale ||
                entry.agentService === agentService ||
                incomingServiceGeneration <= entry.agentServiceGeneration) {
                return;
            }
            // acquire 会在 React render 中执行；若此处同步 replace，会经
            // runtimeRestart listener 更新外部 store 并发起 RPC。租约只捕获候选 service，
            // 由 Provider 在 commit 阶段显式激活，同时保持 generation 单向切换。
            if (!entry.replaceableTransport) {
                throw new Error("远程 conversation registry 条目缺少可换代 transport");
            }
            entry.agentService = agentService;
            entry.agentServiceGeneration = incomingServiceGeneration;
            entry.replaceableTransport.replace(createAgentConversationTransport(agentService, {
                workspacePath: scope.workspacePath,
                ...(scope.workspaceIdentity ? { workspaceIdentity: scope.workspaceIdentity } : {}),
            }));
        },
        release: () => {
            if (released)
                return;
            released = true;
            releaseEntry(entry);
        },
    };
}
/** 仅测试/诊断用：当前注册的连接条目数（不含已换代失效、待存量租约释放的旧条目）。 */
export function workspaceConnectionRegistrySize() {
    return registry.size;
}
//# sourceMappingURL=workspaceConnectionRegistry.js.map