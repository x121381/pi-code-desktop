import type { CommandAck, CommandEnvelope, CommandsQueryParams, CommandsQueryResult, ConversationSnapshot } from "@zcode/shared/zcode-protocol-v4";
import type { PendingCommandClientContext } from "@/v4/pendingCommandWorkspace.js";
import { type PendingCommandReplay } from "@/v4/pendingCommandReplay.js";
export type { PendingCommandReplay } from "@/v4/pendingCommandReplay.js";
export declare const PENDING_COMMAND_TTL_MS: number;
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
export type PendingCommandRecoveryReason = "discarded";
export interface PendingCommandEntry {
    commandId: string;
    clientId: string;
    sessionId: string | null;
    issuedAt: number;
    expiresAt: number;
    replay: PendingCommandReplay;
    clientContext?: PendingCommandClientContext;
    recovery?: PendingCommandRecoveryReason;
    recoveryDismissed?: boolean;
}
export interface PendingCommandReplayRequest {
    type: "sendText" | "sendGoalCommand" | "compact" | "createSession";
    payload: Record<string, unknown>;
    sessionId: string | null;
    baseRevision?: number;
    clientContext?: PendingCommandClientContext;
}
export interface PendingCommandRegistryOptions {
    storage?: StorageLike;
    now?: () => number;
}
type QueryCommands = (params: CommandsQueryParams) => Promise<CommandsQueryResult>;
/**
 * ACK、queue 与 transcript 曾分别维护临时状态；renderer 刷新或 ACK 丢失后，
 * UI 已清空但无法证明 CLI 是否 admission。这里把“待对账线索”先于上行持久化，并用
 * queue/guided/transcript sourceCommandId 或显式终态收口；registry 本身永远不产生权威事实。
 */
export declare class PendingCommandRegistry {
    private readonly storage;
    private readonly now;
    private readonly entries;
    private readonly listeners;
    private readonly reconcileInFlight;
    constructor(options?: PendingCommandRegistryOptions);
    subscribe(listener: () => void): () => void;
    record(envelope: CommandEnvelope, clientContext?: PendingCommandClientContext): PendingCommandEntry | null;
    list(sessionId: string | null): readonly PendingCommandEntry[];
    listRecoverable(sessionId: string | null): readonly PendingCommandEntry[];
    settle(sessionId: string | null, commandId: string): void;
    dismissRecovery(sessionId: string | null, commandId: string): void;
    applyAck(envelope: CommandEnvelope, ack: CommandAck): void;
    applyQuery(result: CommandsQueryResult): void;
    reconcileSnapshot(snapshot: ConversationSnapshot): void;
    reconcileSession(sessionId: string | null, query: QueryCommands): Promise<void>;
    consumeReplay(key: {
        sessionId: string | null;
        commandId: string;
    }): PendingCommandReplayRequest | null;
    private runReconcile;
    private markRecovery;
    private clearRecovery;
    private remapCreatedSession;
    private load;
    private pruneExpired;
    private commit;
}
export declare const pendingCommandRegistry: PendingCommandRegistry;
//# sourceMappingURL=pendingCommandRegistry.d.ts.map