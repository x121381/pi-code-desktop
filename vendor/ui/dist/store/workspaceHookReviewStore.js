import { create } from "zustand";
// review 单调性裁决单一来源；store 的应用策略是 cross_flow 接受新 Runtime 权威
// （renderer 服从 canonical snapshot 的最新投递）。
import { verdictWorkspaceHookReviewRequest } from "@zcode/shared/workspace-hook-review-monotonicity";
export const useWorkspaceHookReviewStore = create((set) => ({
    bindings: {},
    commandBindings: {},
    connect: (sessionId, binding) => set((state) => ({
        commandBindings: { ...state.commandBindings, [sessionId]: binding },
    })),
    disconnect: (sessionId, sendCommand) => set((state) => {
        const current = state.commandBindings[sessionId];
        if (!current || current.sendCommand !== sendCommand)
            return state;
        const commandBindings = { ...state.commandBindings };
        delete commandBindings[sessionId];
        const review = state.bindings[sessionId];
        if (!review || review.sendCommand !== sendCommand)
            return { commandBindings };
        // command channel 已断开后不能继续保留同一连接的 review binding；否则 Settings
        // 会拿到 disposed client。sendCommand identity guard 可避免旧连接 cleanup 清掉新连接。
        const bindings = { ...state.bindings };
        delete bindings[sessionId];
        return { bindings, commandBindings };
    }),
    upsert: (sessionId, binding) => set((state) => {
        const commandBinding = state.commandBindings[sessionId];
        if (commandBinding && commandBinding.sendCommand !== binding.sendCommand) {
            // renderer 重连时旧 effect 可能迟到；只有当前 session command channel 才能刷新
            // review binding，避免 equal-generation replay 把新 client 换回 disposed client。
            return state;
        }
        const current = state.bindings[sessionId];
        if (current) {
            const verdict = verdictWorkspaceHookReviewRequest(current.request, binding.request);
            // generation 只在一个 Runtime flow 内可比较。新 Runtime 会生成新
            // reviewFlowId 并从 1 重计；跨 flow（cross_flow）必须服从 canonical snapshot 的
            // 最新投递，否则旧 Runtime 的高 generation 会永久挡住新权威请求。同 flow 则严格
            // 要求 generation 单调，replay/conflict/stale 不得覆盖当前 binding。
            if (verdict === "same_flow_stale" || verdict === "same_flow_replay" ||
                verdict === "same_flow_conflict") {
                return state;
            }
        }
        return { bindings: { ...state.bindings, [sessionId]: binding } };
    }),
    clear: (sessionId, interactionId) => set((state) => {
        const current = state.bindings[sessionId];
        if (!current || (interactionId && current.request.interactionId !== interactionId)) {
            return state;
        }
        const bindings = { ...state.bindings };
        delete bindings[sessionId];
        return { bindings };
    }),
}));
export function findWorkspaceHookReviewBinding(bindings, workspacePath, workspaceIdentity) {
    return Object.values(bindings)
        .filter((binding) => matchesWorkspaceBinding({
        bindingWorkspaceIdentity: binding.request.workspaceIdentity,
        bindingWorkspacePath: binding.workspacePath,
        workspaceIdentity,
        workspacePath,
    }))
        .sort((left, right) => right.request.createdAt - left.request.createdAt)[0];
}
const TRUSTABLE_WORKSPACE_HOOK_STATES = new Set([
    "pending_trust",
    "revoked",
    "stale_digest",
]);
/**
 * 查找能授权指定静态 Settings 行的精确 immutable review binding。
 *
 * Settings 的 trustState 只负责展示，绝不能直接成为 mutation authority；真正提交前必须
 * 同时匹配 workspace、bundle 和 opaque reviewItemId，避免等待期间跨 generation/bundle
 * 误用另一条 request。
 */
export function findWorkspaceHookReviewBindingForItem(bindings, input) {
    return Object.values(bindings)
        .filter((binding) => matchesWorkspaceBinding({
        bindingWorkspaceIdentity: binding.request.workspaceIdentity,
        bindingWorkspacePath: binding.workspacePath,
        workspaceIdentity: input.workspaceIdentity,
        workspacePath: input.workspacePath,
    }) &&
        binding.request.bundleDigest === input.bundleDigest &&
        binding.request.items.some((item) => item.reviewItemId === input.reviewItemId &&
            TRUSTABLE_WORKSPACE_HOOK_STATES.has(item.trustState)))
        .sort((left, right) => right.request.createdAt - left.request.createdAt)[0];
}
export function waitForWorkspaceHookReviewBindingForItem(input, timeoutMs) {
    const current = findWorkspaceHookReviewBindingForItem(useWorkspaceHookReviewStore.getState().bindings, input);
    if (current)
        return Promise.resolve(current);
    return new Promise((resolve) => {
        let settled = false;
        let unsubscribe = () => undefined;
        const timer = globalThis.setTimeout(() => finish(undefined), timeoutMs);
        const finish = (binding) => {
            if (settled)
                return;
            settled = true;
            globalThis.clearTimeout(timer);
            unsubscribe();
            resolve(binding);
        };
        unsubscribe = useWorkspaceHookReviewStore.subscribe((state) => {
            const binding = findWorkspaceHookReviewBindingForItem(state.bindings, input);
            if (binding)
                finish(binding);
        });
        // subscribe 与首次读取之间仍可能发生一次同步 upsert；订阅完成后再检查一次收口竞态。
        const afterSubscribe = findWorkspaceHookReviewBindingForItem(useWorkspaceHookReviewStore.getState().bindings, input);
        if (afterSubscribe)
            finish(afterSubscribe);
    });
}
export function findWorkspaceHookCommandBinding(bindings, workspacePath, workspaceIdentity) {
    return Object.values(bindings).find((binding) => matchesWorkspaceBinding({
        bindingWorkspaceIdentity: binding.workspaceIdentity,
        bindingWorkspacePath: binding.workspacePath,
        workspaceIdentity,
        workspacePath,
    }));
}
function matchesWorkspaceBinding(input) {
    const workspaceKey = input.workspaceIdentity?.trim() || input.workspacePath;
    if (!workspaceKey)
        return false;
    const bindingWorkspaceIdentity = input.bindingWorkspaceIdentity?.trim();
    if (bindingWorkspaceIdentity) {
        // identity 命中或 path 命中的 OR 判定不够：同一路径的远程 tab 因 path
        // 相等会被本地 Settings 选成信任提交通道，形成跨 workspace 误授权。
        // 修法：binding 一旦带 identity 就只能严格匹配 workspaceKey；只有自身无
        // identity 的旧本地 binding 才允许按 path fallback。
        return bindingWorkspaceIdentity === workspaceKey;
    }
    // 当前查询本身携带 identity 时同样禁止降级到 path；否则未知远程 identity 会误选
    // 一个无 identity 的本地旧 binding。
    return !input.workspaceIdentity?.trim() && input.bindingWorkspacePath === input.workspacePath;
}
//# sourceMappingURL=workspaceHookReviewStore.js.map