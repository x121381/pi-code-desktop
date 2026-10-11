import { type LocalTtftContext, type LocalTtftCalibration, type LocalTtftFacts, type LocalTtftRecord, type LocalTtftOutputKind } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
export interface LocalTtftPending {
    context: LocalTtftContext;
    workspace: string;
    start: number;
    wallStart: number;
    clockInvalid?: boolean;
    closed?: boolean;
    outcome?: LocalTtftRecord["outcome"];
    textClosed?: boolean;
    firstAt?: number;
    checkpointRevision: number;
    checkpointSignature?: string;
    dispatch?: number;
    commandId?: string;
    sessionId?: string;
    facts?: LocalTtftFacts;
    first?: LocalTtftOutputKind;
    lastSeq: number;
    sendMode: "idle" | "queued" | "guided";
    visibility: "foreground" | "background" | "background_returned";
    visibilityChanges: {
        at: number;
        foreground: boolean;
    }[];
    confirmationStart?: number;
    confirmations: NonNullable<LocalTtftRecord["details"]>;
    rows: Map<number, {
        turnId: string;
        kind: ConversationRow["kind"];
    }>;
}
export declare function buildLocalTtftRecord(pending: LocalTtftPending, kind: LocalTtftRecord["kind"], outcome: LocalTtftRecord["outcome"], current: number, wall: number, calibration?: LocalTtftCalibration): LocalTtftRecord;
//# sourceMappingURL=localTtftRecord.d.ts.map