export interface PendingTerminalInputFallback {
    handled: boolean;
    text: string;
}
export interface TerminalInputFallbackKeydownCandidate {
    kind: "text" | "imeCommit";
    text: string | null;
    eventTimeStamp: number;
    recordedAt: number;
}
export interface TerminalInputFallbackHandledData {
    consumed: boolean;
    data: string;
    keydownEventTimeStamp: number;
    kind: "text" | "imeCommit" | "recentData";
    recordedAt: number;
}
export declare function createPendingTerminalInputFallback(text: string): PendingTerminalInputFallback;
export declare function createTerminalInputFallbackKeydownCandidate(params: {
    eventTimeStamp: number;
    key: string;
    now: number;
}): TerminalInputFallbackKeydownCandidate | null;
export declare function markTerminalInputFallbackHandled(pending: readonly PendingTerminalInputFallback[], data: string): void;
export declare function recordTerminalInputFallbackHandledData(params: {
    candidate: TerminalInputFallbackKeydownCandidate | null;
    data: string;
    history: readonly TerminalInputFallbackHandledData[];
    maxAgeMs: number;
    now: number;
}): {
    history: TerminalInputFallbackHandledData[];
    usedCandidate: boolean;
};
export declare function recordTerminalInputFallbackRecentData(params: {
    data: string;
    history: readonly TerminalInputFallbackHandledData[];
    maxAgeMs: number;
    now: number;
}): TerminalInputFallbackHandledData[];
export declare function consumeTerminalInputFallbackHandledData(params: {
    history: readonly TerminalInputFallbackHandledData[];
    inputEventTimeStamp: number;
    maxAgeMs: number;
    maxInputDelayMs: number;
    now: number;
    pending: PendingTerminalInputFallback;
}): void;
export declare function resolveTerminalInputFallbackAction(params: {
    pending: PendingTerminalInputFallback;
    textareaValue: string;
}): {
    shouldClearTextarea: boolean;
    shouldWrite: boolean;
};
//# sourceMappingURL=terminalComposedInputFallback.d.ts.map