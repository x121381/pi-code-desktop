import type { ArmsCustomEventPayload } from "@zcode/shared";
export declare const SESSION_OPEN_ARMS_GROUP = "ui_perf";
export declare const SESSION_OPEN_EVENT_START = "perf_ui_session_open_start";
export declare const SESSION_OPEN_EVENT_RESULT = "perf_ui_session_open_result";
export type SessionOpenKind = "cold" | "warm" | "keep_warm";
export type SessionOpenTrigger = "sidebar" | "search" | "deeplink" | "reload" | "subagent" | "selection" | "split" | "pane";
export type SessionOpenStatus = "success" | "failed" | "timeout";
export type SessionOpenProcessState = "spawned" | "reused";
export type SessionOpenRuntimeState = "cold" | "warm";
export interface SessionOpenArmsReporter {
    reportArmsCustomEvent(payload: ArmsCustomEventPayload): Promise<unknown>;
}
export interface SessionOpenIdentity {
    sessionOpenId: string;
    sessionId: string;
    openTrigger: SessionOpenTrigger;
    openKind: SessionOpenKind;
    clientMode: "desktop-continuous";
}
export interface SessionOpenTimingFields {
    rendererPrepareMs?: number;
    hostPrepareMs?: number;
    providerRegistrySyncMs?: number;
    taskMetaReadMs?: number;
    cliRequestMs?: number;
    cliBootstrapMs?: number;
    cliSessionRestoreMs?: number;
    initialFrameEncodeMs?: number;
    initialFrameTransportMs?: number;
    rendererSnapshotApplyMs?: number;
    reactRenderMs?: number;
    paintToInteractiveMs?: number;
}
export interface SessionOpenResultFields extends SessionOpenTimingFields {
    status: SessionOpenStatus;
    totalMs: number;
    errorPhase?: string;
    errorCode?: string;
    cliProcessState?: SessionOpenProcessState;
    sessionRuntimeState?: SessionOpenRuntimeState;
    attemptCount?: number;
    persistedMessageCount?: number;
    snapshotRowCount?: number;
    snapshotBytes?: number;
    pluginCount?: number;
    skillCount?: number;
    mcpServerCount?: number;
    mcpPendingAtInteractive?: boolean;
}
export declare function setSessionOpenArmsReporter(next: SessionOpenArmsReporter | null): void;
export declare function clearSessionOpenArmsReporterForTest(): void;
export declare function buildSessionOpenStartArmsPayload(identity: SessionOpenIdentity): ArmsCustomEventPayload;
export declare function buildSessionOpenResultArmsPayload(identity: SessionOpenIdentity & SessionOpenResultFields): ArmsCustomEventPayload;
export declare function reportSessionOpenStart(identity: SessionOpenIdentity, targetReporter?: SessionOpenArmsReporter | null): void;
export declare function reportSessionOpenResult(identity: SessionOpenIdentity & SessionOpenResultFields, targetReporter?: SessionOpenArmsReporter | null): void;
//# sourceMappingURL=sessionOpenArmsTelemetry.d.ts.map