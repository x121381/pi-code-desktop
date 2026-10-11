import { MCP_APPS_APP_TOOLS_MAX_PER_INSTANCE, MCP_APPS_APP_TOOLS_REFRESH_INTERVAL_MS, MCP_APPS_APP_TOOL_CALL_TIMEOUT_MS, MCP_APPS_APP_TOOL_ERROR_MESSAGE_MAX_CHARS, normalizeMcpAppsAppTools, } from "@zcode/shared/mcp-apps";
/** tools/list 翻页上限：够取满 50 个工具，防页面返回无穷游标。 */
const MAX_TOOL_LIST_PAGES = 10;
/**
 * 认领与回传按 callId 幂等：传输失败重试；`accepted: false` 是 agent 的明确裁决，不重试。
 * 总等待（0.5 s + 1 s）留在 5 s 认领期限内。
 */
export const PLUGIN_UI_APP_TOOL_RPC_ATTEMPTS = 3;
export const PLUGIN_UI_APP_TOOL_RPC_RETRY_DELAY_MS = 500;
/**
 * App-Provided Tools 的渲染端：发现页面工具并登记到 agent；模型发起的调用经实例信箱到达后
 * 认领 → 页面 tools/call → 回传。登记表与调用态都由 agent 持有，这里只记本实例已经开始处理的 callId。
 */
export function createPluginUiAppTools(deps) {
    const now = deps.now ?? Date.now;
    const pins = new Set();
    let registeredGeneration = null;
    let refreshing = false;
    let pendingRefresh = false;
    let lastRefreshAt = 0;
    let cancelRefreshTimer = null;
    let epoch = 0;
    const started = new Set();
    const calls = new Map();
    const instanceParams = (generation) => ({
        ...deps.pluginScope(),
        scopeId: deps.pluginScope().instance.token,
        generation,
    });
    const unregister = () => {
        const generation = registeredGeneration;
        registeredGeneration = null;
        if (generation === null)
            return;
        void deps.bridge.unregisterAppTools(instanceParams(generation)).catch(() => undefined);
    };
    const listTools = async (active) => {
        const tools = [];
        let cursor;
        for (let page = 0; page < MAX_TOOL_LIST_PAGES; page += 1) {
            const result = await active.listTools(cursor ? { cursor } : {});
            tools.push(...result.tools);
            if (tools.length >= MCP_APPS_APP_TOOLS_MAX_PER_INSTANCE || !result.nextCursor)
                break;
            if (result.nextCursor === cursor)
                break;
            cursor = result.nextCursor;
        }
        return tools;
    };
    const refresh = async (active, isCurrent) => {
        const generation = deps.currentGeneration();
        if (generation === undefined)
            return;
        const runEpoch = epoch;
        const bound = instanceParams(generation);
        refreshing = true;
        lastRefreshAt = now();
        try {
            const { tools, skipped } = normalizeMcpAppsAppTools(await listTools(active));
            if (skipped.length > 0)
                deps.log?.("[plugin-ui] app tools skipped", { skipped });
            if (!isCurrent() || runEpoch !== epoch)
                return;
            await deps.bridge.registerAppTools({ ...bound, tools });
            if (!isCurrent() || runEpoch !== epoch) {
                // 登记在途时实例已被替换 / 销毁：补一次注销，避免 agent 暴露已关闭页面的工具。
                void deps.bridge.unregisterAppTools(bound).catch(() => undefined);
                return;
            }
            registeredGeneration = generation;
        }
        catch (error) {
            deps.log?.("[plugin-ui] app tools registration failed", {
                error: error instanceof Error ? error.message : String(error),
            });
        }
        finally {
            refreshing = false;
        }
        if (pendingRefresh && isCurrent() && runEpoch === epoch) {
            pendingRefresh = false;
            schedule(active, isCurrent);
        }
    };
    // list_changed 节流：两次重新登记至少间隔 1 s，窗口内的多次通知合并为一次尾随刷新。
    const schedule = (active, isCurrent) => {
        if (refreshing) {
            pendingRefresh = true;
            return;
        }
        if (cancelRefreshTimer)
            return;
        const wait = Math.max(0, lastRefreshAt + MCP_APPS_APP_TOOLS_REFRESH_INTERVAL_MS - now());
        if (wait === 0) {
            void refresh(active, isCurrent);
            return;
        }
        cancelRefreshTimer = deps.setTimer(() => {
            cancelRefreshTimer = null;
            if (isCurrent())
                void refresh(active, isCurrent);
        }, wait);
    };
    const withRetry = async (run) => {
        for (let attempt = 1;; attempt += 1) {
            try {
                return await run();
            }
            catch (error) {
                if (attempt >= PLUGIN_UI_APP_TOOL_RPC_ATTEMPTS)
                    throw error;
                await new Promise((resolve) => {
                    deps.setTimer(resolve, PLUGIN_UI_APP_TOOL_RPC_RETRY_DELAY_MS * attempt);
                });
            }
        }
    };
    const run = async (active, call, cancel) => {
        const generation = deps.currentGeneration();
        if (generation === undefined)
            return;
        const scope = { ...instanceParams(generation), callId: call.callId };
        const { accepted } = await withRetry(() => deps.bridge.claimAppToolCall(scope));
        if (!accepted || cancel.signal.aborted)
            return;
        let outcome;
        try {
            const result = await active.callTool({ name: call.toolName, arguments: call.arguments }, { timeout: MCP_APPS_APP_TOOL_CALL_TIMEOUT_MS, signal: cancel.signal });
            outcome = { result: result };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            outcome = { error: { message: message.slice(0, MCP_APPS_APP_TOOL_ERROR_MESSAGE_MAX_CHARS) } };
        }
        await withRetry(() => deps.bridge.resolveAppToolCall({ ...scope, ...outcome }));
    };
    return {
        isBusy: () => calls.size > 0 || pins.size > 0,
        resetForAttach() {
            epoch += 1;
            for (const cancel of calls.values())
                cancel.abort();
            calls.clear();
            pins.clear();
            cancelRefreshTimer?.();
            cancelRefreshTimer = null;
            pendingRefresh = false;
            started.clear();
            unregister();
        },
        onInitialized(active, capabilities, isCurrent) {
            if (!capabilities?.tools)
                return;
            if (capabilities.tools.listChanged) {
                active.setNotificationHandler("notifications/tools/list_changed", () => {
                    if (isCurrent())
                        schedule(active, isCurrent);
                });
            }
            void refresh(active, isCurrent);
        },
        execute(active, call) {
            if (call.activity !== undefined) {
                if (call.activity)
                    pins.add(call.callId);
                else
                    pins.delete(call.callId);
                deps.onBusyChange?.();
                return;
            }
            if (call.cancelled) {
                calls.get(call.callId)?.abort();
                started.add(call.callId);
                return;
            }
            // 信箱按 callId 去重：投影重放 / 重复投递不会让页面执行两次。
            if (started.has(call.callId))
                return;
            started.add(call.callId);
            const cancel = new AbortController();
            calls.set(call.callId, cancel);
            deps.onBusyChange?.();
            void run(active, call, cancel)
                .catch((error) => {
                deps.log?.("[plugin-ui] app tool call relay failed", {
                    error: error instanceof Error ? error.message : String(error),
                });
            })
                .finally(() => {
                calls.delete(call.callId);
                deps.onBusyChange?.();
            });
        },
        dispose() {
            epoch += 1;
            for (const cancel of calls.values())
                cancel.abort();
            calls.clear();
            pins.clear();
            cancelRefreshTimer?.();
            cancelRefreshTimer = null;
            unregister();
        },
    };
}
//# sourceMappingURL=pluginUiAppTools.js.map