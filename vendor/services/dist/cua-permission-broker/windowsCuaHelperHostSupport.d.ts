import { type ForkOptions } from "node:child_process";
import { mintBrokerSocketPath, type HelperHealth } from "@zcode/zcode-cua/broker";
import type { ServiceLogger } from "#src/logger/serviceLogger.js";
import type { WindowsCuaRuntime } from "#src/cua-permission-broker/windowsCuaDevRuntime.js";
export declare const CONTROL_PROTOCOL: string;
export declare const ADDON_ENV: string;
export interface WindowsCuaChild {
    readonly pid?: number;
    send(message: unknown): boolean;
    kill(): boolean;
    on(event: "message" | "error" | "exit", listener: (...args: unknown[]) => void): this;
    off(event: "message" | "error" | "exit", listener: (...args: unknown[]) => void): this;
}
export interface WindowsCuaChildProcessAdapter {
    /** command 是运行时 Node/Electron，argv[0] 是 Helper entry。 */
    fork(command: string, argv: string[], options: ForkOptions): WindowsCuaChild;
}
export interface WindowsCuaHelperHostOptions {
    runtime: WindowsCuaRuntime;
    childProcess?: WindowsCuaChildProcessAdapter;
    mintSocketPath?: () => string;
    mintPluginAuthority?: () => string;
    healthProbe?: (socketPath: string, timeoutMs: number) => Promise<HelperHealth>;
    startupTimeoutMs?: number;
    shutdownTimeoutMs?: number;
    logger?: ServiceLogger;
    /** Ready Helper 意外退出后通知生命周期 owner，仅触发 Helper recovery。 */
    onUnexpectedExit?: (info: {
        generation: number;
        pid: number | undefined;
    }) => void;
}
export interface Generation {
    id: number;
    child: WindowsCuaChild;
    socketPath: string;
    stopped: boolean;
    exitObserved: boolean;
    abort?: (error: Error) => void;
    terminationPromise?: Promise<void>;
    removeMainListeners(): void;
}
export declare const defaultChildProcess: WindowsCuaChildProcessAdapter;
export declare const defaultSocketPathFactory: typeof mintBrokerSocketPath;
export declare const defaultHealthProbe: (socketPath: string, timeoutMs: number) => Promise<HelperHealth>;
export declare class WindowsCuaChildLifecycle {
    private readonly logger;
    constructor(logger: ServiceLogger);
    terminate(generation: Generation, context: string, timeoutMs: number): Promise<void>;
    sendShutdown(generation: Generation, context: string): void;
    kill(generation: Generation, context: string): void;
    on(child: WindowsCuaChild, event: "message" | "error" | "exit", listener: (...args: unknown[]) => void, generation: number, errorClass: string): boolean;
    off(child: WindowsCuaChild, event: "message" | "error" | "exit", listener: (...args: unknown[]) => void, generation: number, errorClass: string): void;
    logFailure(generation: number, pid: number | undefined, errorClass: string, error: unknown): void;
    private waitForExit;
}
export type WindowsDevHelperControlMessage = {
    protocol: typeof CONTROL_PROTOCOL;
    type: "transport_ready";
    socketPath: string;
    pid: number;
} | {
    protocol: typeof CONTROL_PROTOCOL;
    type: "ready";
    socketPath: string;
    pid: number;
} | {
    protocol: typeof CONTROL_PROTOCOL;
    type: "error";
    message: string;
};
/**
 * Parse a `zcode-cua-windows-dev/v1` control message from the helper child.
 *
 * "transport_ready" means the named pipe is bound and authenticated, while
 * "ready" remains the full health handshake. "error" is the helper's OWN startup-failure
 * report (windowsDevHelperMain.ts sends `{protocol, type:"error", message}`
 * before exiting 1/2) — previously this fell through to null and the host
 * misclassified it as "Invalid Windows Computer Use Helper control message"
 * (malformed-message), discarding the diagnostic string.
 * Any future additive message type parses as "ignore" (forward-compatible)
 * instead of failing the generation.
 */
export declare function parseReadyMessage(message: unknown): WindowsDevHelperControlMessage | "ignore" | null;
export declare function isExactHealthPid(health: HelperHealth, childPid: number | undefined): health is HelperHealth & {
    pid: number;
};
export declare function asError(error: unknown): Error;
//# sourceMappingURL=windowsCuaHelperHostSupport.d.ts.map