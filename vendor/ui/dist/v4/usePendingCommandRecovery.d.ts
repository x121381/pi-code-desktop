import type { ConversationSnapshot } from "@zcode/shared/zcode-protocol-v4";
import { type PendingCommandEntry } from "@/v4/pendingCommandRegistry.js";
import type { SessionDataLayer } from "@/v4/sessionDataLayer.js";
export interface UsePendingCommandRecoveryOptions {
    layer: SessionDataLayer;
    sessionId: string | null;
    snapshot: ConversationSnapshot | null;
    status: "connecting" | "live" | "error" | "closed";
    subscriptionId: string | null;
    workspacePath: string;
    workspaceIdentity?: string;
}
/**
 * pending registry 的 React 接缝：projection 用 queue/guided/transcript anchor 收口；远端 query
 * 只在 subscription 代际进入 live 时执行，不跟随 streaming snapshot 高频重跑。
 */
export declare function usePendingCommandRecovery({ layer, sessionId, snapshot, status, subscriptionId, workspacePath, workspaceIdentity, }: UsePendingCommandRecoveryOptions): readonly PendingCommandEntry[];
//# sourceMappingURL=usePendingCommandRecovery.d.ts.map