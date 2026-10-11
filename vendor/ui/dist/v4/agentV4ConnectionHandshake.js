import { V4_WIRE_PROTOCOL_VERSION, helloMessageSchema, hostSupportsWorkflowRunDeltas, } from "@zcode/shared/zcode-protocol-v4";
import { getV4ClientId } from "@/v4/commandFactory.js";
const handshakes = new WeakMap();
export function ensureAgentV4ConnectionHandshake(service) {
    const key = service;
    const existing = handshakes.get(key);
    if (existing)
        return existing;
    const handshake = (async () => {
        const hello = helloMessageSchema.parse(await service.helloConversationV4());
        // `workflowRunDeltas` 的声明是**单向**的：只有 Host 先在 hello 里宣告，客户端才能回声明。
        // clientHello 的 capabilities 是 `.strict()` 的，向老 Host 发一个它不认识的键会让整条
        // clientHello 解析失败、连接握不上手——这不是降级，是整个会话面板打不开。
        const capabilities = {
            workspaceHookReviewUi: true,
            ...(hostSupportsWorkflowRunDeltas(hello.capabilities) ? { workflowRunDeltas: true } : {}),
        };
        await service.initializeConversationV4({
            kind: "clientHello",
            protocolVersion: V4_WIRE_PROTOCOL_VERSION,
            // handshake 与 commandFactory 曾各生成一套页面 clientId，facade
            // 无法验证 command envelope 是否属于已绑定客户端。统一复用持久化 V4 clientId。
            clientId: getV4ClientId(),
            clientKind: hello.clientMode === "desktop-continuous" ? "desktop" : "web",
            appVersion: "unknown",
            capabilities,
        });
        return hello;
    })();
    handshakes.set(key, handshake);
    void handshake.catch(() => {
        if (handshakes.get(key) === handshake)
            handshakes.delete(key);
    });
    return handshake;
}
//# sourceMappingURL=agentV4ConnectionHandshake.js.map