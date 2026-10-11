import { create } from "zustand";
import { normalizeAgentProviderToZCodeAgent, ZCODE_AGENT_PROVIDER, } from "@zcode/shared";
import { shouldExposeE2EStoreBridge } from "../lib/e2eStoreBridge.js";
import { logger } from "../logger.js";
import { getSubagentsContextKey, useSubagentsContextStore } from "../store/subagentsContextStore.js";
const inFlightAgentLoads = new Map();
let latestAgentLoadRequestId = 0;
function getAgentLoadKey(workspacePath, provider, workspaceIdentity) {
    return `${workspaceIdentity?.trim() || workspacePath}::${provider}`;
}
function loadAgentsOnce(workspacePath, provider, subagentsService, workspaceIdentity, options = {}) {
    const key = getAgentLoadKey(workspacePath, provider, workspaceIdentity);
    if (!options.bypassCache) {
        const current = inFlightAgentLoads.get(key);
        if (current) {
            return current;
        }
    }
    // 设置页写入 subagent 后必须重新扫文件系统。
    // 如果 refresh 继续复用旧的 in-flight list，请求会把写入前的列表带回输入框 @ 面板。
    const request = subagentsService
        .list({ workspacePath, workspaceIdentity, provider })
        .finally(() => {
        if (inFlightAgentLoads.get(key) === request) {
            inFlightAgentLoads.delete(key);
        }
    });
    inFlightAgentLoads.set(key, request);
    return request;
}
function nextAgentLoadRequestId() {
    latestAgentLoadRequestId += 1;
    return latestAgentLoadRequestId;
}
function isLatestAgentLoadRequest(requestId) {
    return requestId === latestAgentLoadRequestId;
}
export const useSubagentsStore = create((set, get) => ({
    workspacePath: null,
    workspaceIdentity: null,
    loadedWorkspacePath: null,
    loadedWorkspaceIdentity: null,
    provider: ZCODE_AGENT_PROVIDER,
    loadedProvider: null,
    agents: [],
    capability: null,
    loading: false,
    error: null,
    operatingAgentId: null,
    async initialize(workspacePath, providerOrSubagentsService, maybeSubagentsService, workspaceIdentity) {
        const currentState = get();
        const hasProvider = typeof providerOrSubagentsService === "string";
        const provider = normalizeAgentProviderToZCodeAgent(hasProvider ? providerOrSubagentsService : ZCODE_AGENT_PROVIDER);
        const subagentsService = hasProvider ? maybeSubagentsService : providerOrSubagentsService;
        const normalizedWorkspaceIdentity = workspaceIdentity?.trim() || null;
        if (!subagentsService) {
            set({
                workspacePath,
                workspaceIdentity: normalizedWorkspaceIdentity,
                provider,
                loading: false,
                error: "subagentsService is required",
                loadedWorkspacePath: workspacePath,
                loadedWorkspaceIdentity: normalizedWorkspaceIdentity,
                loadedProvider: provider,
            });
            return;
        }
        const hasCachedAgents = currentState.agents.length > 0 &&
            currentState.loadedWorkspacePath === workspacePath &&
            currentState.loadedWorkspaceIdentity === normalizedWorkspaceIdentity &&
            currentState.loadedProvider === provider;
        set({
            workspacePath,
            workspaceIdentity: normalizedWorkspaceIdentity,
            provider,
            agents: hasCachedAgents ? currentState.agents : [],
            capability: hasCachedAgents ? currentState.capability : null,
            loading: !hasCachedAgents,
            error: null,
        });
        const requestId = nextAgentLoadRequestId();
        try {
            const result = await loadAgentsOnce(workspacePath, provider, subagentsService, normalizedWorkspaceIdentity ?? undefined);
            if (!isLatestAgentLoadRequest(requestId)) {
                return;
            }
            set({
                agents: result.agents,
                capability: result.capability,
                loading: false,
                loadedWorkspacePath: workspacePath,
                loadedWorkspaceIdentity: normalizedWorkspaceIdentity,
                loadedProvider: provider,
            });
        }
        catch (error) {
            if (!isLatestAgentLoadRequest(requestId)) {
                return;
            }
            logger.error("[subagents] initialize failed", {
                workspacePath,
                provider,
                error: error instanceof Error ? error.message : String(error),
            });
            set({
                loading: false,
                error: error instanceof Error ? error.message : String(error),
                loadedWorkspacePath: workspacePath,
                loadedWorkspaceIdentity: normalizedWorkspaceIdentity,
                loadedProvider: provider,
            });
        }
    },
    async refresh(subagentsService, workspaceIdentity) {
        const workspacePath = get().workspacePath;
        if (!workspacePath) {
            return;
        }
        const workspaceIdentityFromState = workspaceIdentity?.trim() || get().workspaceIdentity || undefined;
        const provider = normalizeAgentProviderToZCodeAgent(get().provider);
        const hasCachedAgents = get().agents.length > 0;
        set({ loading: !hasCachedAgents, error: null });
        const requestId = nextAgentLoadRequestId();
        try {
            const result = await loadAgentsOnce(workspacePath, provider, subagentsService, workspaceIdentityFromState, { bypassCache: true });
            if (!isLatestAgentLoadRequest(requestId)) {
                return;
            }
            set({
                agents: result.agents,
                capability: result.capability,
                loading: false,
                loadedWorkspacePath: workspacePath,
                loadedWorkspaceIdentity: workspaceIdentityFromState ?? null,
                loadedProvider: provider,
            });
        }
        catch (error) {
            if (!isLatestAgentLoadRequest(requestId)) {
                return;
            }
            logger.error("[subagents] refresh failed", {
                workspacePath,
                provider,
                error: error instanceof Error ? error.message : String(error),
            });
            set({
                loading: false,
                error: error instanceof Error ? error.message : String(error),
                loadedWorkspacePath: workspacePath,
                loadedWorkspaceIdentity: workspaceIdentityFromState ?? null,
                loadedProvider: provider,
            });
        }
    },
    async setEnabled(agentId, enabled, subagentsService, workspaceIdentity) {
        const workspacePath = get().workspacePath;
        if (!workspacePath) {
            return;
        }
        const workspaceIdentityFromState = workspaceIdentity?.trim() || get().workspaceIdentity || undefined;
        set({ operatingAgentId: agentId });
        try {
            await subagentsService.setEnabled({
                agentId,
                enabled,
            });
            await get().refresh(subagentsService, workspaceIdentityFromState);
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : String(error),
            });
        }
        finally {
            set({ operatingAgentId: null });
        }
    },
    async createAgent(config, provider, subagentsService, workspaceIdentity) {
        const workspacePath = get().workspacePath;
        if (!workspacePath) {
            return null;
        }
        const workspaceIdentityFromState = workspaceIdentity?.trim() || get().workspaceIdentity || undefined;
        set({ operatingAgentId: `new:${config.name}` });
        try {
            const result = await subagentsService.createAgent({
                config,
                provider: normalizeAgentProviderToZCodeAgent(provider),
            });
            await get().refresh(subagentsService, workspaceIdentityFromState);
            return result.agent;
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
        finally {
            set({ operatingAgentId: null });
        }
    },
    async updateAgent(agentId, config, oldFilePath, provider, subagentsService, workspaceIdentity) {
        const workspacePath = get().workspacePath;
        if (!workspacePath) {
            return null;
        }
        const workspaceIdentityFromState = workspaceIdentity?.trim() || get().workspaceIdentity || undefined;
        set({ operatingAgentId: agentId });
        try {
            const result = await subagentsService.updateAgent({
                agentId,
                config,
                oldFilePath,
                provider: normalizeAgentProviderToZCodeAgent(provider),
            });
            await get().refresh(subagentsService, workspaceIdentityFromState);
            return result.agent;
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
        finally {
            set({ operatingAgentId: null });
        }
    },
    async deleteAgent(agentId, filePath, subagentsService, workspaceIdentity) {
        const workspacePath = get().workspacePath;
        if (!workspacePath) {
            return false;
        }
        const workspaceIdentityFromState = workspaceIdentity?.trim() || get().workspaceIdentity || undefined;
        set({ operatingAgentId: agentId });
        try {
            await subagentsService.deleteAgent({
                agentId,
                filePath,
            });
            await get().refresh(subagentsService, workspaceIdentityFromState);
            return true;
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : String(error),
            });
            return false;
        }
        finally {
            set({ operatingAgentId: null });
        }
    },
}));
if (shouldExposeE2EStoreBridge()) {
    // E2E 诊断入口必须由 WDIO 显式打开，不能复用 ZCODE_ENV=test，避免产品测试环境暴露可变全局 store。
    window.__subagentsStoreE2E = useSubagentsStore;
}
export async function refreshLoadedSubagentsStoreForWorkspace(params) {
    const workspacePath = params.workspacePath?.trim();
    if (!workspacePath) {
        return;
    }
    const workspaceIdentity = params.workspaceIdentity?.trim() || null;
    const state = useSubagentsStore.getState();
    const refreshes = [];
    if (state.workspacePath === workspacePath && state.workspaceIdentity === workspaceIdentity) {
        refreshes.push(state.refresh(params.subagentsService, workspaceIdentity ?? undefined));
    }
    const contextStore = useSubagentsContextStore.getState();
    const contextKey = getSubagentsContextKey(workspacePath, ZCODE_AGENT_PROVIDER, workspaceIdentity);
    if (contextStore.contexts[contextKey]) {
        // 分屏输入框按 workspaceKey 持有子智能体目录；设置页变更后只刷新对应桶，
        // 避免同路径的本地/远端 workspace 相互污染。
        refreshes.push(contextStore.refresh(workspacePath, ZCODE_AGENT_PROVIDER, params.subagentsService, workspaceIdentity ?? undefined));
    }
    await Promise.all(refreshes);
}
//# sourceMappingURL=subagentsStore.js.map