import { type IPlatformService, type SessionCreateClientKind, type SessionCreateSource } from "@zcode/shared";
interface SessionCreateInput {
    sessionId: string;
    messageId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string | null;
    source: SessionCreateSource;
    clientKind: SessionCreateClientKind;
}
export declare function createSessionCreateReporter(): (platform: Pick<IPlatformService, "reportTelemetryEvent"> | null | undefined, input: SessionCreateInput) => Promise<void>;
export declare const reportSessionCreate: (platform: Pick<IPlatformService, "reportTelemetryEvent"> | null | undefined, input: SessionCreateInput) => Promise<void>;
export {};
//# sourceMappingURL=sessionCreateTelemetry.d.ts.map