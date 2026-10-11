import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
/**
 * 返回与 next 深相等的值，尽量复用 prev 中相等的部分：整体相等返回 prev，部分相等时
 * 新建外壳挂回 prev 的子值（包括内容相同的旧字符串引用）。绝不修改 next——它可能与
 * apply 产出的其他快照共享结构。只递归 JSON 形态（plain object / 数组）。
 */
export declare function shareStructure<T>(prev: unknown, next: T): T;
/**
 * 跨 store 的行池：SessionDataLayer 持有，生命周期长于单个 store（keep-warm 过期冷打开
 * 会新建 store，但旧 snapshot 可能仍被留住，要让新行复用它们）。只持 WeakRef，不延长行寿命。
 */
export declare class ConversationRowPool {
    private readonly rows;
    private readonly registry;
    private key;
    /** 只登记不比较：流式 row.delta 的新字符串本来就是新的，逐帧深比较是纯开销。 */
    remember(topic: string, row: ConversationRow): void;
    shareRow(topic: string, row: ConversationRow): ConversationRow;
    /** 逐行共享；每行都与 prevWindow 同位行相同时复用 prevWindow 数组。 */
    shareWindow(topic: string, rows: ConversationRow[], prevWindow?: readonly ConversationRow[]): ConversationRow[];
}
//# sourceMappingURL=conversationRowSharing.d.ts.map