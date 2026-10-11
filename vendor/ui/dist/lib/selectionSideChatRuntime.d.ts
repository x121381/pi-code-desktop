import type { ConversationSelectionReference } from "@/lib/conversationSelectionReference.js";
type SelectionSideChatOpener = (reference?: ConversationSelectionReference) => Promise<void>;
export declare function buildSelectionSideChatKey(workspaceKey: string, parentSessionId: string): string;
/**
 * 同一个用户手势在 command pending 期间只创建一次；完成后立即释放 parent scope，
 * 让固定入口的下一次点击可以创建新的 child，而不是退化回旧的单例绑定。
 */
export declare function createSelectionSideChat(key: string, create: () => Promise<string>): Promise<string>;
export declare function clearSelectionSideChat(childSessionId: string): void;
export declare function setSelectionSideChatBlocked(childSessionId: string, blocked: boolean): void;
export declare function isSelectionSideChatBlocked(childSessionId: string): boolean;
export declare function subscribeSelectionSideChatRuntime(listener: () => void): () => void;
/**
 * Side Pane 的固定入口位于会话 Provider 外，不能自己拼协议命令。
 * 由已挂载的主 SessionPane 注册创建能力，launcher 只按 workspace + parent 路由；
 * 同一父会话被多个分屏展示时优先交给 focused pane，保持命令 owner 与当前输入焦点一致。
 */
export declare function registerSelectionSideChatOpener(key: string, opener: SelectionSideChatOpener, focused: boolean, referenceBlocked?: boolean): () => void;
export declare function getSelectionSideChatOpenState(key: string): "ready" | "blocked" | "unavailable";
export declare function requestSelectionSideChatOpen(key: string, reference?: ConversationSelectionReference): boolean;
export {};
//# sourceMappingURL=selectionSideChatRuntime.d.ts.map