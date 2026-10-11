import { type NetworkCaptureBatch } from "@zcode/shared";
import type { ZCodeProtocolClient } from "#src/zcode-agent/zcodeProtocolClient.js";
/** 仅由本机子进程 spawn 点登记；remote RPC/手机 attachment 不登记也不透传启停。 */
export declare class LocalRuntimeNetworkCapture {
    private readonly clients;
    private captureId;
    private sink?;
    register(client: ZCodeProtocolClient, pid: number): () => void;
    setCaptureId(captureId: string | null, sink?: (batch: NetworkCaptureBatch) => void): void;
    private configure;
}
export declare const localRuntimeNetworkCapture: LocalRuntimeNetworkCapture;
//# sourceMappingURL=localRuntimeNetworkCapture.d.ts.map