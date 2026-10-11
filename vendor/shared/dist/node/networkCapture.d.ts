import { type NetworkCaptureBatch, type NetworkRequestRecord } from "../networkCapture.js";
/** MCP 的 HTTP/SSE/OAuth 共用此异步上下文，不影响原 fetch 的代理与证书策略。 */
export declare function withoutNetworkCapture<T>(operation: () => T): T;
/** 仅订阅请求创建事件；不开启时不持有监听器或定时器，不读取流。 */
export declare function createNodeNetworkCapture(processType: NetworkRequestRecord["processType"], onBatch: (batch: NetworkCaptureBatch) => void): {
    setCaptureId(captureId: string | null): void;
};
//# sourceMappingURL=networkCapture.d.ts.map