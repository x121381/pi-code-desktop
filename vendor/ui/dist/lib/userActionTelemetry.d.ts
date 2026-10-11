import type { RendererActionTraceAttributes, RendererActionTraceBatchV1, RendererActionTraceConfigV1, RendererActionTraceResourceV1 } from "@zcode/shared";
import { type UserActionFeatureId } from "@/lib/userActionTraceCatalog.js";
export interface UserActionTelemetryClock {
    now(): number;
    setNow?(value: number): void;
}
export type UserActionTrigger = RendererActionTraceAttributes["trigger"];
export type UserActionResultSource = NonNullable<RendererActionTraceAttributes["result_source"]>;
export interface StartUserActionInput {
    featureId: UserActionFeatureId;
    action: string;
    trigger: UserActionTrigger;
    surface?: string;
    timeoutMs?: number;
    workspaceKind?: RendererActionTraceAttributes["workspace_kind"];
    remoteKind?: RendererActionTraceAttributes["remote_kind"];
    automationKind?: RendererActionTraceAttributes["automation_kind"];
}
export interface UserActionResult {
    resultSource?: UserActionResultSource;
    failureStage?: string;
    stateAfter?: RendererActionTraceAttributes["state_after"];
    configured?: boolean;
    requiresRestart?: boolean;
    sectionId?: string;
    valueAfter?: string;
    admissionResult?: RendererActionTraceAttributes["admission_result"];
}
export interface UserActionFailure extends UserActionResult {
    failureStage: string;
}
export interface UserActionHandle {
    complete(result?: UserActionResult): void;
    fail(failure: UserActionFailure): void;
    reject(result?: UserActionResult): void;
    cancel(): void;
    noop(): void;
}
export interface UserActionTelemetry {
    start(input: StartUserActionInput): UserActionHandle;
}
interface RendererUserActionTelemetryOptions {
    config: RendererActionTraceConfigV1;
    resource: RendererActionTraceResourceV1;
    sendBatch: (batch: RendererActionTraceBatchV1) => Promise<unknown> | unknown;
    clock?: UserActionTelemetryClock;
    random?: () => number;
    randomHex?: (bytes: 8 | 16) => string;
}
export declare class RendererUserActionTelemetry implements UserActionTelemetry {
    private config;
    private readonly resource;
    private readonly sendBatch;
    private readonly clock;
    private readonly random;
    private readonly randomHex;
    private readonly completedQueue;
    private readonly activeActions;
    private flushTimer;
    private flushPromise;
    private droppedSinceLastFlush;
    private sequence;
    constructor(options: RendererUserActionTelemetryOptions);
    updateConfig(config: RendererActionTraceConfigV1): void;
    start(input: StartUserActionInput): UserActionHandle;
    flush(): Promise<void>;
    private flushImpl;
    shutdown(): Promise<void>;
    private finish;
    private takeNextBatch;
}
export declare function setUserActionTelemetry(telemetry: UserActionTelemetry | null): void;
export declare function startUserAction(input: StartUserActionInput): UserActionHandle;
export declare function runUserActionAsync<T>(options: {
    input: StartUserActionInput;
    operation: () => Promise<T>;
    completed?: UserActionResult | ((value: T) => UserActionResult);
    failureStage: string;
}): Promise<T>;
export declare function runUserAction<T>(options: {
    input: StartUserActionInput;
    operation: () => T;
    completed?: UserActionResult | ((value: T) => UserActionResult);
    failureStage: string;
}): T;
export {};
//# sourceMappingURL=userActionTelemetry.d.ts.map