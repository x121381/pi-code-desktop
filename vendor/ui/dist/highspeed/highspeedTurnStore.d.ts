import type { HighspeedCardSnapshot, HighspeedMessageMeta } from "@zcode/shared";
export interface HighspeedTranscriptRow {
    sourceCommandId?: string;
    createdAt: number;
    highspeed?: HighspeedMessageMeta;
}
export interface HighspeedTurnMetrics {
    outputTokens: number;
    durationMs: number;
    modelDurationMs?: number;
    toolDurationMs?: number;
    otherDurationMs?: number;
    regularTps: number;
    highspeedTps?: number;
    savedDurationMs?: number;
}
export interface HighspeedShareMetrics extends HighspeedTurnMetrics {
    highspeedTps: number;
}
export interface HighspeedTurnRecord {
    sessionId: string;
    sourceCommandId: string;
    card: HighspeedCardSnapshot;
    createdAt: number;
    completedAt?: number;
    metrics?: HighspeedTurnMetrics;
    metricsPersistedAt?: number;
    autoShareAttemptedAt?: number;
    autoSharedAt?: number;
}
export interface HighspeedCardAutoShareCandidate {
    cardId: string;
    expiresAt: number;
    metrics: HighspeedShareMetrics;
}
export declare function recordHighspeedTurn(record: HighspeedTurnRecord): void;
/**
 * 冷启动恢复与跨端追平：到期时 renderer 可能不在场，内存 store 没有机会登记/收口这张卡；
 * 远控 Renderer 也可能先登记运行中 row、桌面端随后才把完成态持久化进 transcript。
 * 合并口径见 planHighspeedTranscriptHydration；这里只负责按序落库并发一次通知。
 * 返回产生变化的 row 数；无变化不发通知，重复水合不会造成渲染抖动。
 */
export declare function hydrateHighspeedTurnsFromTranscript(sessionId: string, rows: readonly HighspeedTranscriptRow[]): number;
export declare function discardHighspeedTurn(sourceCommandId: string): boolean;
export declare function completeHighspeedTurn(params: {
    sourceCommandId: string;
    outputTokens: number;
    durationMs: number;
    modelDurationMs?: number;
    toolDurationMs?: number;
    otherDurationMs?: number;
    completedAt?: number;
}): HighspeedTurnRecord | null;
export declare function setHighspeedCardTps(cardId: string, highspeedTps: number): void;
export declare function getHighspeedCardTps(cardId: string): number | undefined;
/**
 * 卡级 healthy 查询防重必须跨 SessionPane 生命周期存在；组件 ref 会在重挂载后清空，
 * 导致同一张已过期卡持续请求并放大服务端限流。每张卡最多允许到期查询一次，
 * 若当时仍有 Turn 运行，再允许最后一轮结束后补查一次。
 */
export declare function claimHighspeedHealthyAttempt(cardId: string, allTurnsCompleted: boolean): boolean;
export declare function markHighspeedTurnMetricsPersisted(sourceCommandId: string, savedDurationMs: number, persistedAt?: number): void;
export declare function markHighspeedCardAutoShared(cardId: string, autoSharedAt?: number): void;
export declare function claimHighspeedCardAutoShare(cardId: string, attemptedAt?: number): HighspeedTurnRecord[] | null;
export declare function getHighspeedTurnByCommandId(sourceCommandId: string | undefined): HighspeedTurnRecord | null;
export declare function listHighspeedTurnsByCard(cardId: string): HighspeedTurnRecord[];
export declare function listHighspeedTurnsBySession(sessionId: string): HighspeedTurnRecord[];
export declare function listPendingHighspeedTurns(sessionId: string): HighspeedTurnRecord[];
export declare function listExpiredHighspeedCardsAwaitingTps(sessionId: string, now: number): Array<{
    cardId: string;
    allTurnsCompleted: boolean;
}>;
export declare function listHighspeedTurnsAwaitingMetricsPersistence(sessionId: string): HighspeedTurnRecord[];
export declare function listHighspeedCardAutoShareCandidates(sessionId: string): HighspeedCardAutoShareCandidate[];
export declare function resolveNextHighspeedAutoShareAt(sessionId: string): number | null;
export declare function subscribeHighspeedTurns(listener: () => void): () => void;
export declare function getHighspeedTurnVersion(): number;
export declare function aggregateHighspeedCardMetrics(cardId: string): HighspeedShareMetrics;
//# sourceMappingURL=highspeedTurnStore.d.ts.map