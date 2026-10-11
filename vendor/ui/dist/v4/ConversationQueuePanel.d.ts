import type { QueueState } from "@zcode/shared/zcode-protocol-v4";
export interface ConversationQueuePanelProps {
    queue: QueueState;
    /** 删除队列项（deleteQueueItem command）。 */
    onDeleteItem?: (queueItemId: string) => void;
    /** 撤回队列项到发起端 composer；权威删除成功后才恢复草稿。 */
    onEditItem?: (queueItemId: string) => Promise<void> | void;
    /** 正在等待 delete ACK / composer restore 的目标项；仅锁该 row。 */
    pendingEditQueueItemId?: string | null;
    /** 立即发送队列项（sendQueuedNow command，stop 当前 + 消费该项）。 */
    onSendNow?: (queueItemId: string) => void;
    /** 拖拽排序项（reorderQueueItem，移动到锚点前；null=队尾）。 */
    onMoveItem?: (queueItemId: string, beforeQueueItemId: string | null) => void;
    /** 暂停队列恢复：CLI setAutoDrain(true)，idle 立即消费、busy 仅武装。 */
    onResume?: () => Promise<void> | void;
}
type QueueItem = QueueState["items"][number];
export interface V4QueueReorderAnchor {
    beforeQueueItemId: string | null;
    queueItemId: string;
}
export declare function resolveV4QueueReorderAnchor(items: readonly QueueItem[], activeQueueItemId: string, overQueueItemId: string): V4QueueReorderAnchor | null;
/**
 * 竖切 queue 面板：渲染 projection.queue.items + 单项删除入口。
 * queue 在运行中的 turn 期间存在（sendText 排队），是 CLI 投影权威态（非 renderer-local）。
 */
declare function ConversationQueuePanelImpl({ queue, onDeleteItem, onEditItem, pendingEditQueueItemId, onSendNow, onMoveItem, onResume, }: ConversationQueuePanelProps): import("react/jsx-runtime").JSX.Element | null;
export declare const ConversationQueuePanel: import("react").MemoExoticComponent<typeof ConversationQueuePanelImpl>;
export {};
//# sourceMappingURL=ConversationQueuePanel.d.ts.map