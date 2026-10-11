import { type V4ConnectionFlowState } from "@zcode/shared/zcode-protocol-v4";
import type { IZCodeAgentService } from "./zcodeAgent.js";
export type ZCodeAgentV4ClientMode = "desktop-continuous" | "web-remote-replayable";
export interface ZCodeAgentV4ConnectionContext {
    connectionId: string;
    clientMode: ZCodeAgentV4ClientMode;
    role?: "terminal-client" | "trusted-host-relay";
    /**
     * 这条连接的 clientHello 声明了认得 `workflowRun.*` 键级增量。与 `clientMode` 同族：
     * 由本 facade 从握手事实写出，订阅入参里的同名字段一律被清掉——一个客户端认不认得增量
     * 是**连接**的事实，不是某一次订阅可以自选的口味。缺席 = 按旧消费者处理。
     */
    workflowRunDeltas?: boolean;
}
export interface TrustedZCodeAgentV4UnsubscribeRoute {
    topic: string;
    connectionId: string;
}
export declare function readTrustedZCodeAgentV4UnsubscribeRoute(value: unknown): TrustedZCodeAgentV4UnsubscribeRoute | null;
/**
 * 该字段只在 host facade → base/remote service proxy 之间传递；facade 会覆盖所有
 * UI 入参中的同名字段，因此 renderer/mobile 不能伪造可信连接模式。
 */
export declare function readTrustedZCodeAgentV4Connection(value: unknown): ZCodeAgentV4ConnectionContext | null;
export interface ZCodeAgentConnectionScope {
    readonly service: IZCodeAgentService;
    /** MessagePort/transport sideband only；不是 UI-facing RPC。 */
    setTransportFlowState(state: V4ConnectionFlowState): Promise<void>;
    dispose(): Promise<void>;
}
/** 为单个 host/server RPC attachment 建立可信 V4 facade。 */
export declare function createZCodeAgentConnectionScope(base: IZCodeAgentService, context: ZCodeAgentV4ConnectionContext): ZCodeAgentConnectionScope;
//# sourceMappingURL=zcodeAgentConnectionScope.d.ts.map