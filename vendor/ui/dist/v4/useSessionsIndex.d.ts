import type { SessionSummary } from "@zcode/shared/zcode-protocol-v4";
import { type SessionsIndexStoreStatus } from "@/v4/sessionsIndexStore.js";
export interface UseSessionsIndexResult {
    sessions: SessionSummary[];
    status: SessionsIndexStoreStatus;
}
/**
 * 订阅某 workspace 的 sessions-index，返回会话摘要列表（默认按 lastActivityAt 降序）。
 * 生命周期：workspace 变化时重建 store + 重连；卸载时 close（退订 + 解监听）。
 */
export declare function useSessionsIndex(workspacePath: string, workspaceIdentity?: string): UseSessionsIndexResult;
//# sourceMappingURL=useSessionsIndex.d.ts.map