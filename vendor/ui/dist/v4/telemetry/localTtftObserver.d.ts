import { localTtftNow, type LocalTtftContext, type LocalTtftCalibration, type LocalTtftFacts, type LocalTtftRecord } from "@zcode/shared";
import type { ConversationTopicFrame, TopicFrameDeliveryKind } from "@zcode/shared/zcode-protocol-v4";
/** Renderer 独占点击总时钟；不使用 ACK 或旁路 telemetry 判定首输出。 */
export declare class LocalTtftObserver {
    private readonly onRecord;
    private readonly now;
    private readonly wallNow;
    private readonly readForeground?;
    enabled: boolean;
    private readonly pending;
    private isForeground;
    private lastClockSample?;
    private readonly clocks;
    constructor(onRecord: (record: LocalTtftRecord) => void, now?: typeof localTtftNow, wallNow?: () => number, readForeground?: (() => boolean) | undefined);
    private emit;
    start(workspace: string, busy: boolean, unsupported?: boolean): LocalTtftContext | undefined;
    dispatch(context: LocalTtftContext, workspace: string, commandId: string, sessionId?: string | null): LocalTtftContext | undefined;
    ack(context: LocalTtftContext, status: string, excluded?: "capacity"): void;
    calibrate(workspace: string, clock: LocalTtftCalibration): void;
    needsCalibration(workspace: string): boolean;
    checkpoint(workspace: string, incoming: LocalTtftFacts): void;
    private merge;
    receive(workspace: string, frame: ConversationTopicFrame, delivery: TopicFrameDeliveryKind): void;
    exclude(context: LocalTtftContext, outcome: LocalTtftRecord["outcome"]): void;
    confirmationRetry(context: LocalTtftContext): void;
    confirmation(context: LocalTtftContext, waiting: boolean): void;
    background(): void;
    foreground(): void;
    private visibility;
    sampleClock(): void;
    interrupt(workspace?: string): void;
    expire(): void;
    private record;
}
export declare function setLocalTtftObserver(value: LocalTtftObserver | undefined): void;
export declare function getLocalTtftObserver(): LocalTtftObserver | undefined;
//# sourceMappingURL=localTtftObserver.d.ts.map