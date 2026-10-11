import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { ZCodeProtocolMessage } from "@zcode/shared";
import type { ZCodeProtocolTransport, ZCodeProtocolTransportClosedEvent } from "./zcodeProtocolTransport.js";
interface ZCodeStdioTransportOptions {
    onStderrLine?: (line: string) => void;
    ownedProcessGroupId?: number;
    ownedProcessStartedAtMs?: number;
}
export declare class ZCodeStdioTransport implements ZCodeProtocolTransport {
    private readonly child;
    private readonly options?;
    readonly kind: "stdio";
    private readonly messageEmitter;
    private readonly closeEmitter;
    private readonly stderrCollector;
    private readonly stdoutDecoder;
    private stdoutPendingChunks;
    private stdoutFlushed;
    private readersDisposed;
    private disposed;
    private closed;
    private disposeAndWaitPromise;
    private cleanupProcessTreeSnapshot;
    private cleanupAttemptCount;
    private childExitedAtMs;
    readonly onMessage: import("@zcode/rpc").Event<{
        id: string | number;
        method: string;
        params?: unknown;
        trace?: {
            traceId?: string | undefined;
            parentId?: string | undefined;
            spanId?: string | undefined;
            traceparent?: string | undefined;
        } | undefined;
    } | {
        method: string;
        params?: unknown;
        trace?: {
            traceId?: string | undefined;
            parentId?: string | undefined;
            spanId?: string | undefined;
            traceparent?: string | undefined;
        } | undefined;
    } | {
        id: string | number;
        result: unknown;
    } | {
        id: string | number;
        error: {
            code: number;
            message: string;
            data?: unknown;
        };
    }>;
    readonly onClose: import("@zcode/rpc").Event<ZCodeProtocolTransportClosedEvent>;
    constructor(child: ChildProcessWithoutNullStreams, options?: ZCodeStdioTransportOptions | undefined);
    send(message: ZCodeProtocolMessage): Promise<void>;
    dispose(): void;
    disposeAndWait(): Promise<void>;
    waitForStderrDrain(): Promise<void>;
    private disposeAndWaitOnce;
    private readonly handleStdoutData;
    private readonly handleStdoutEnd;
    private consumeStdoutText;
    private handleStdoutFrame;
    private handleStreamError;
    private fireClose;
    private disposeReaders;
    private disposeLocalResources;
    private requestStdioClose;
    private waitForChildExit;
    private hasChildExited;
    private captureCleanupSnapshot;
}
export {};
//# sourceMappingURL=zcodeStdioTransport.d.ts.map