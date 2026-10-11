import { ZCodeStorageStartupGate } from "#src/zcode-agent/zcodeStorageStartupGate.js";
import type { IDisposable } from "@zcode/rpc";
import type { ZCodeProtocolMethod, ZCodeProtocolRequestId, ZCodeProtocolTrace } from "@zcode/shared";
import type { V4Method } from "@zcode/shared/zcode-protocol-v4";
import type { z } from "zod";
import type { ZCodeProtocolTransport } from "./zcodeProtocolTransport.js";
/** 客户端可发的方法名：旧 zcodeProtocolMethods + v4/*（M3 起并存，M5 波次 2 收敛为 v4）。 */
export type ZCodeProtocolClientMethod = ZCodeProtocolMethod | V4Method;
interface ZCodeProtocolClientOptions {
    requireStorageStartup?: boolean;
    requestTimeoutMs?: number;
}
export interface ZCodeProtocolRequestTimeoutEvent {
    method: ZCodeProtocolClientMethod;
    requestId: ZCodeProtocolRequestId;
    timeoutMs: number;
}
interface ZCodeProtocolClientRequestOptions {
    /** 观测不得参与 runtime 健康判定或业务空闲续期；默认保持业务请求语义。 */
    lifecycle?: "operation" | "observation";
    signal?: AbortSignal;
    trace?: ZCodeProtocolTrace;
    timeoutMs?: number;
}
export declare const DEFAULT_ZCODE_PROTOCOL_REQUEST_TIMEOUT_MS: number;
export declare class ZCodeProtocolRequestTimeoutError extends Error {
    readonly method: ZCodeProtocolClientMethod;
    readonly requestId: ZCodeProtocolRequestId;
    readonly timeoutMs: number;
    constructor(method: ZCodeProtocolClientMethod, requestId: ZCodeProtocolRequestId, timeoutMs: number);
}
export declare class ZCodeProtocolClient implements IDisposable {
    private readonly transport;
    readonly storageStartup: ZCodeStorageStartupGate;
    private readonly pending;
    private readonly notificationEmitter;
    private readonly requestEmitter;
    private readonly requestTimeoutEmitter;
    private readonly pendingDrainedEmitter;
    private readonly closeEmitter;
    private readonly disposables;
    private nextRequestId;
    private disposed;
    private readonly requestTimeoutMs;
    /**
     * client 是否已 dispose（进程被回收/transport 关闭后为 true）。
     * 调用方（如 getClient 复用 active entry）必须在复用前检查此标记，
     * 避免对一个已被 processManager 回收但尚未触发 onClose 的 client 发请求，
     * 否则会立即抛 "ZCode Protocol client is disposed"。
     */
    get isDisposed(): boolean;
    readonly onNotification: import("@zcode/rpc").Event<{
        method: string;
        params?: unknown;
        trace?: {
            traceId?: string | undefined;
            parentId?: string | undefined;
            spanId?: string | undefined;
            traceparent?: string | undefined;
        } | undefined;
    }>;
    readonly onRequest: import("@zcode/rpc").Event<{
        id: string | number;
        method: string;
        params?: unknown;
        trace?: {
            traceId?: string | undefined;
            parentId?: string | undefined;
            spanId?: string | undefined;
            traceparent?: string | undefined;
        } | undefined;
    }>;
    readonly onRequestTimeout: import("@zcode/rpc").Event<ZCodeProtocolRequestTimeoutEvent>;
    readonly onPendingRequestsDrained: import("@zcode/rpc").Event<void>;
    readonly onClose: import("@zcode/rpc").Event<void>;
    /** 当前尚未收到响应的请求数。 */
    get pendingRequestCount(): number;
    get pendingOperationRequestCount(): number;
    constructor(transport: ZCodeProtocolTransport, options?: ZCodeProtocolClientOptions);
    get transportKind(): import("./zcodeProtocolTransport.js").ZCodeProtocolTransportKind;
    /**
     * 非 async 包装（CR 意见）：调用方持有的是本方法返回的 Promise，而 async 实现内部的
     * resultPromise 经 return 传播拒绝时，外层 Promise 独立参与 unhandledRejection 判定。
     * no-op catch 必须挂在最终返回对象创建点，才能覆盖 dispose/transport close 的批量拒绝
     * 与调用方挂靠 .catch() 之间的时序窗口。该 handler 只影响 unhandled 判定，不改变
     * rejection 向真实 awaiter 的传播；代价是调用方 fire-and-forget 忘挂 catch 时不再有
     * unhandled 噪声暴露，属可接受取舍（仓库内 void 调用点均自带 catch）。
     */
    request<T = unknown>(method: ZCodeProtocolClientMethod, params?: unknown, resultSchema?: z.ZodType<T>, options?: ZCodeProtocolClientRequestOptions): Promise<T>;
    private requestImpl;
    notify(method: ZCodeProtocolClientMethod, params?: unknown): Promise<void>;
    respond(id: ZCodeProtocolRequestId, result: unknown): Promise<void>;
    respondError(id: ZCodeProtocolRequestId, error: {
        code: number;
        message: string;
        data?: unknown;
    }): Promise<void>;
    dispose(): void;
    disposeAndWait(): Promise<void>;
    private handleMessage;
    private resolveResponse;
    private rejectResponse;
    private rejectAll;
    private deletePending;
    private disposeLocalResources;
    private assertNotDisposed;
}
export {};
//# sourceMappingURL=zcodeProtocolClient.d.ts.map