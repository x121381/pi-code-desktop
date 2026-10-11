import type { WebRemoteControlRpcTransportFault } from "@zcode/shared";
interface PendingDeadlineEntry {
    queuedAt: number;
    messageSeq: number;
}
export interface AcknowledgedRelayDeadlineState {
    oldestData: PendingDeadlineEntry | null;
    pendingAck: PendingDeadlineEntry | null;
}
export declare class AcknowledgedRelayDeadline {
    private readonly graceMs;
    private readonly now;
    private readonly readState;
    private readonly onExpired;
    private timer;
    private disposed;
    constructor(graceMs: number, now: () => number, readState: () => AcknowledgedRelayDeadlineState, onExpired: (fault: WebRemoteControlRpcTransportFault) => void);
    check(): boolean;
    refresh(): void;
    dispose(): void;
    private select;
    private clear;
}
export {};
//# sourceMappingURL=webRemoteControlAcknowledgedRelayDeadline.d.ts.map