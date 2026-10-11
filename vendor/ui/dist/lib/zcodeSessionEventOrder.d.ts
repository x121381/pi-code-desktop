import type { ZCodeSessionEvent } from "@zcode/shared";
export interface ZCodeSessionEventGap {
    expectedSeq: number;
    receivedSeq: number;
}
export interface ZCodeSessionEventOrderResult {
    duplicate?: boolean;
    gap?: ZCodeSessionEventGap;
    readyEvents: ZCodeSessionEvent[];
}
export interface ZCodeSessionEventOrderGate {
    clearPendingAfterGap(): void;
    getGap(): ZCodeSessionEventGap | undefined;
    markSnapshotSeq(seq: number, options?: {
        preservePendingEvents?: boolean;
    }): ZCodeSessionEvent[];
    push(event: ZCodeSessionEvent): ZCodeSessionEventOrderResult;
    releasePendingAfterGap(options?: {
        preserve?: (event: ZCodeSessionEvent) => boolean;
    }): ZCodeSessionEvent[];
}
export declare function createZCodeSessionEventOrderGate(): ZCodeSessionEventOrderGate;
//# sourceMappingURL=zcodeSessionEventOrder.d.ts.map