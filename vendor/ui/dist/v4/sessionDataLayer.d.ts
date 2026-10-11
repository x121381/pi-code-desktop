import { ConversationProjectionStore } from "@/v4/conversationProjectionStore.js";
import type { SessionOpenKind } from "@/lib/sessionOpenArmsTelemetry.js";
import { type ConversationTransport } from "@/v4/transport.js";
import type { CommandsQueryParams, CommandsQueryResult } from "@zcode/shared/zcode-protocol-v4";
/** pane 持有的租约；release 幂等。 */
export interface SessionLease {
    readonly sessionId: string;
    readonly store: ConversationProjectionStore;
    /** 由数据层按 projection 生命周期判定，避免 pane 首次 render 时 snapshot 仍为空。 */
    readonly openKind: SessionOpenKind;
    /** pane acquire 的 Renderer 单调时钟起点。 */
    readonly startedAt: number;
    release(): void;
}
export interface SessionDataLayerOptions {
    transport: ConversationTransport;
    /** 引用归零后延迟退订窗口（ms），默认 30s。 */
    keepWarmMs?: number;
}
export declare const SESSION_DATA_LAYER_KEEP_WARM_MS = 30000;
export declare const E2E_SESSION_DATA_LAYER_KEEP_WARM_MS = 1000;
export declare function resolveSessionDataLayerKeepWarmMs(e2eStoreBridgeEnabled?: boolean): number;
export declare class SessionDataLayer {
    private readonly transport;
    private readonly keepWarmMs;
    private readonly entries;
    private readonly rowPool;
    private readonly offFrame;
    private disposed;
    constructor(options: SessionDataLayerOptions);
    /**
     * 取得 session 的投影 store。首个引用触发 subscribe（新开 pane 就是一次
     * subscribe，与刷新、新设备同一路径）；重复 acquire 共享同一 store（readonly，
     * 同 session 多 pane = 多视图）。
     */
    acquire(sessionId: string): SessionLease;
    /** 当前活跃（含 keep-warm 中）的 session 数，测试与调试观测点。 */
    get size(): number;
    /** renderer pending-command registry 的只读对账入口；仍复用本 layer 的同一 host connection。 */
    queryCommands(params: CommandsQueryParams): Promise<CommandsQueryResult>;
    private releaseEntry;
    /** 连接销毁时清场（window/workspace 卸载）。 */
    dispose(): void;
}
//# sourceMappingURL=sessionDataLayer.d.ts.map