import { createHash } from "node:crypto";
/** Host 的账号上下文来自凭据 owner；不接收页面传入的账号或访问令牌。 */
export function createPluginUiAccountBindings(deps) {
    let revision = 0;
    const active = new Map();
    const close = async (params) => {
        active.delete(params.instance.token);
        await deps.close(params);
    };
    return {
        async open(params) {
            const captured = revision;
            const accountContext = createHash("sha256")
                .update(JSON.stringify(await deps.readAccount()))
                .digest("hex");
            if (captured !== revision)
                throw new Error("MCP App account changed during initialization");
            const instance = await deps.open({ ...params, accountContext });
            const bound = { ...params, instance };
            if (captured !== revision) {
                await deps.close(bound);
                throw new Error("MCP App account changed during initialization");
            }
            active.set(instance.token, bound);
            return instance;
        },
        close,
        invalidate() {
            // 先使在途 open 失效；注销旧凭证只作用于它自己的 Agent 代际。
            revision++;
            for (const bound of active.values())
                void deps.close(bound).catch(() => undefined);
            active.clear();
        },
    };
}
//# sourceMappingURL=instanceAccounts.js.map