import type { CommandAck, CommandType, SessionConfigState } from "@zcode/shared/zcode-protocol-v4";
type DispatchCommand = (type: CommandType, payload: Record<string, unknown>, targetSessionId: string | null) => Promise<CommandAck>;
export interface DraftPrewarmController {
    /** 首条 admission 命令已发出、ACK 未收口；dispose 不得删除结果未知的会话。 */
    markPromotionPending(): void;
    /** 首发成功后标记（dispose 不再删除已提升的会话）。 */
    markPromoted(): void;
    /** 会话失效（订阅错误/sendText 被拒）后标记（dispose 不发 deleteSession——会话多半已不存在）。 */
    markDiscarded(): void;
    /**
     * 生命周期终点（effect cleanup / 切 workspace / 绑定真实会话）：
     * 已建且未提升未失效 → deleteSession 清理；创建仍在飞 → ack 到达时就地删除。
     */
    dispose(): void;
}
/** 预热生命周期纯控制器：创建 → onReady 上抛 → dispose 决策清理。 */
export declare function startDraftSessionPrewarm(params: {
    workspaceKey: string;
    dispatchCommand: DispatchCommand;
    onReady: (sessionId: string) => void;
    /** single-flight owner 用于等待不可取消的 createSession 收口；无论成功失败都只调用一次。 */
    onSettled?: () => void;
    /** 预热会话初始 config（全局「上次选择」，同步解析）；让投影首帧即全局、不闪。 */
    resolveInitialConfig?: () => Partial<SessionConfigState> | undefined;
}): DraftPrewarmController;
export interface DraftSessionPrewarm {
    /** 当前 workspace/transport generation 已就绪的预热 binding。 */
    binding: DraftPrewarmBinding | null;
}
export interface DraftPrewarmBinding {
    workspaceKey: string;
    sessionId: string;
    /** 首条 admission 命令发出前同步占住生命周期；false 表示 binding 已不是当前 owner。 */
    beginPromotion(): boolean;
    /** 首发成功后标记（阻止清理路径 deleteSession 已提升的会话）。 */
    promote(): void;
    /** 订阅错误 / sendText 被拒后丢弃；只影响创建本 binding 的 controller。 */
    discard(): void;
}
export declare function useDraftSessionPrewarm(params: {
    /** pane 未绑定会话（sessionId===null）时启用。 */
    enabled: boolean;
    workspaceKey: string;
    /** 同一 workspace 内的逻辑 pane 身份；同步重挂必须保持稳定。 */
    paneId: string;
    /** 外部能力变化时递增；仅用于回收并重建尚未提升的草稿预热会话。 */
    invalidationVersion?: number;
    /** conversation provider 的 transport identity；同 workspace lease 变化时保持不变。 */
    transportIdentity: unknown;
    dispatchCommand: DispatchCommand;
    /** 预热会话初始 config（全局「上次选择」，同步解析）；让投影首帧即全局、不闪。 */
    resolveInitialConfig?: () => Partial<SessionConfigState> | undefined;
}): DraftSessionPrewarm;
export {};
//# sourceMappingURL=useDraftSessionPrewarm.d.ts.map