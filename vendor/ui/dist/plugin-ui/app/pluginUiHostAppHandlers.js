import { INVALID_PARAMS, ProtocolError } from "@modelcontextprotocol/client";
import { resolveRequestedDisplayMode } from "../domain/buildPluginUiHostContext.js";
const OPEN_LINK_PROTOCOLS = new Set(["http:", "https:"]);
export function installPluginUiHostAppHandlers(bridge, deps) {
    bridge.onrequestdisplaymode = async (params) => {
        const context = deps.currentContext();
        const current = context.displayMode ?? "inline";
        const available = context.availableDisplayModes ?? [current];
        const mode = deps.onDisplayModeRequest(resolveRequestedDisplayMode(params.mode, current, available));
        if (mode !== context.displayMode)
            deps.applyDisplayMode(mode);
        return { mode };
    };
    bridge.oncalltool = async (params, ctx) => {
        const signal = ctx.mcpReq?.signal;
        signal?.throwIfAborted();
        const scope = deps.pluginScope();
        const callId = deps.createCallId();
        deps.activeCalls.add(callId);
        deps.onBusyChange?.();
        // 页面中止请求（SDK 的 cancelled 通知落到 ctx.mcpReq.signal）→ 取消到 agent 的 MCP client。
        const onAbort = () => {
            void deps.bridge.cancelToolCall({ ...scope, callId }).catch(() => undefined);
        };
        signal?.addEventListener("abort", onAbort, { once: true });
        try {
            const result = await deps.bridge.callTool({
                ...scope,
                toolName: params.name,
                ...(params.arguments ? { arguments: params.arguments } : {}),
                callId,
            });
            return result;
        }
        finally {
            signal?.removeEventListener("abort", onAbort);
            deps.activeCalls.delete(callId);
            deps.onBusyChange?.();
        }
    };
    bridge.onopenlink = async (params) => {
        let url;
        try {
            url = new URL(params.url);
        }
        catch {
            throw new ProtocolError(INVALID_PARAMS, `invalid link ${params.url}`);
        }
        // 只放行 http(s)：file: / 自定义 scheme 交给系统会打开本地程序。
        if (!OPEN_LINK_PROTOCOLS.has(url.protocol)) {
            throw new ProtocolError(INVALID_PARAMS, `only http(s) links can be opened (${url.protocol})`);
        }
        deps.onOpenExternal(url.toString());
        return {};
    };
}
export function installPluginUiHostNotificationHandlers(bridge, deps) {
    // 页面请求宿主拆掉自己：本宿主的实例生命周期跟随卡片 / 面板，只记录，不主动销毁。
    bridge.onrequestteardown = () => {
        deps.log?.("[plugin-ui] app requested teardown", { pluginId: deps.pluginId });
    };
    bridge.onsizechange = (params) => {
        if (typeof params.height === "number")
            deps.onHeight(params.height);
    };
    bridge.onloggingmessage = (params) => {
        deps.log?.(`[plugin-ui] app log (${params.level})`, {
            pluginId: deps.pluginId,
            data: params.data,
        });
    };
}
//# sourceMappingURL=pluginUiHostAppHandlers.js.map