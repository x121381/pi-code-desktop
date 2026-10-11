import type { HelperHealth } from "@zcode/zcode-cua/broker";
import type { CuaHelperHandle, CuaHelperTransportRestartResult, CuaProductHelperHost } from "@zcode/zcode-cua/broker/server";
import { type WindowsCuaHelperHostOptions } from "#src/cua-permission-broker/windowsCuaHelperHostSupport.js";
export type { WindowsCuaChild, WindowsCuaChildProcessAdapter, WindowsCuaHelperHostOptions, } from "#src/cua-permission-broker/windowsCuaHelperHostSupport.js";
type CuaHelperTransportHandle = Pick<CuaHelperHandle, "socketPath" | "pluginAuthority">;
export type ManagedCuaProductHelperHost = CuaProductHelperHost & {
    stop(): Promise<void>;
    checkHealth(timeoutMs?: number): Promise<unknown>;
    waitForTransport?(timeoutMs?: number): Promise<CuaHelperTransportHandle>;
};
/**
 * Host 的 lifecycle tail 是唯一线性化边界：任何 fresh fork 都必须排在上一代 exact child
 * exit 之后。kill 仅是请求，不能把未观察到 exit 的进程误判为已经终止。
 */
export declare class WindowsCuaHelperHost implements ManagedCuaProductHelperHost {
    private readonly options;
    private readonly childProcess;
    private readonly mintSocketPath;
    private readonly healthProbe;
    private readonly startupTimeoutMs;
    private readonly shutdownTimeoutMs;
    private readonly logger;
    private readonly childLifecycle;
    private readonly authority;
    private handle;
    private lastAgentVisibleTransport;
    private current;
    private lifecycleTail;
    private terminationBlocker;
    private startInFlight;
    private startInFlightEpoch;
    private restartInFlight;
    private restartAfterStartInFlight;
    private restartPreservingTransportInFlight;
    private transportReadyInFlight;
    private transportReadyResolve;
    private transportReadyReject;
    private nextGeneration;
    private externalStopEpoch;
    constructor(options: WindowsCuaHelperHostOptions);
    get running(): boolean;
    get socketPath(): string | null;
    get pluginAuthority(): string | null;
    waitForTransport(timeoutMs?: number): Promise<CuaHelperTransportHandle>;
    start(): Promise<CuaHelperHandle>;
    stop(): Promise<void>;
    restart(): Promise<CuaHelperHandle>;
    restartAfterCurrentStart(): Promise<CuaHelperHandle>;
    restartAfterCurrentStartPreservingTransport(options?: {
        beforeFreshStart?: () => void;
    }): Promise<CuaHelperTransportRestartResult>;
    checkHealth(timeoutMs?: number): Promise<HelperHealth>;
    private enqueue;
    private startNow;
    private createTransportReadyPromise;
    private resolveTransportReady;
    private rejectTransportReady;
    private invalidateTransportReady;
    private stopNow;
    private startGeneration;
    private terminateGeneration;
    private terminateGenerationOnce;
    private invalidateForExternalStop;
}
//# sourceMappingURL=windowsCuaDevHelperHost.d.ts.map