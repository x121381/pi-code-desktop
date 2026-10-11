import { INVALID_PARAMS, ProtocolError } from "@modelcontextprotocol/client";
export function createPluginUiResourceSubscriptions(deps) {
    const subscribed = new Map();
    const inflight = new Map();
    const params = (uri, generation) => ({
        ...deps.pluginScope(),
        scopeId: deps.pluginScope().instance.token,
        generation,
        uri,
    });
    const unsubscribeQuietly = (uri, generation) => {
        void deps.bridge.unsubscribeResource(params(uri, generation)).catch(() => undefined);
    };
    const assertCurrent = () => {
        if (deps.isDisposed())
            throw new Error("MCP App instance was closed");
    };
    const subscribe = (uri) => {
        assertCurrent();
        const generation = deps.currentGeneration();
        if (generation === undefined) {
            throw new ProtocolError(INVALID_PARAMS, "sandbox is not attached");
        }
        if (subscribed.get(uri) === generation)
            return Promise.resolve();
        let run = inflight.get(uri);
        if (!run) {
            const bound = params(uri, generation);
            run = deps.bridge
                .subscribeResource(bound)
                .then(() => {
                if (deps.isDisposed() || deps.currentGeneration() !== generation) {
                    void deps.bridge.unsubscribeResource(bound).catch(() => undefined);
                    return;
                }
                subscribed.set(uri, generation);
            })
                .finally(() => {
                if (inflight.get(uri) === run)
                    inflight.delete(uri);
            });
            inflight.set(uri, run);
        }
        return run;
    };
    return {
        install(bridge) {
            bridge.onreadresource = async (request) => {
                assertCurrent();
                return (await deps.bridge.readResource({
                    ...deps.pluginScope(),
                    uri: request.uri,
                }));
            };
            bridge.onlistresources = async (request) => {
                assertCurrent();
                return (await deps.bridge.listResources({
                    ...deps.pluginScope(),
                    ...(request?.cursor ? { cursor: request.cursor } : {}),
                }));
            };
            bridge.onlistresourcetemplates = async (request) => {
                assertCurrent();
                return (await deps.bridge.listResourceTemplates({
                    ...deps.pluginScope(),
                    ...(request?.cursor ? { cursor: request.cursor } : {}),
                }));
            };
            // resources/subscribe 是 ZCode 扩展（宣告 experimental["zcode/resourceSubscribe"]），规范方法走二参形式。
            bridge.setRequestHandler("resources/subscribe", async (request) => {
                await subscribe(request.params.uri);
                return {};
            });
            bridge.setRequestHandler("resources/unsubscribe", async (request) => {
                const uri = request.params.uri;
                const generation = subscribed.get(uri);
                if (generation === undefined)
                    return {};
                subscribed.delete(uri);
                await deps.bridge.unsubscribeResource(params(uri, generation));
                return {};
            });
        },
        has: (uri) => subscribed.has(uri),
        unsubscribeAll() {
            for (const [uri, generation] of subscribed)
                unsubscribeQuietly(uri, generation);
            subscribed.clear();
        },
    };
}
//# sourceMappingURL=pluginUiResourceSubscriptions.js.map