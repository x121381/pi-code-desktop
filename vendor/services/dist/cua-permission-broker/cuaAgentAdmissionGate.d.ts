export interface CuaAgentSpawnAdmissionContext {
    workspaceKey: string;
    workspacePath?: string;
    workspaceIdentity?: string;
    signal?: AbortSignal;
}
/**
 * @deprecated 默认 CUA 装配已不再注入该准入屏障，仅为旧调用方保留兼容导出。
 * 当前 Helper recovery 只影响后续 Agent admission，不会阻塞或回收已有 Agent。
 *
 * 仅保留 API 兼容性：默认生命周期已不再使用该机制隔离 Helper recovery 与 command/env
 * resolve 的并发。这里不持有 workspace/session 状态。
 */
export declare class CuaAgentAdmissionGate {
    private nextEpoch;
    private activeEpoch;
    private readonly waiters;
    beginRecovery(): number;
    isRecovering(): boolean;
    waitForSpawnAdmission(context: CuaAgentSpawnAdmissionContext): Promise<void>;
    commitRecovery(epoch: number): boolean;
    failRecovery(epoch: number, error: unknown): boolean;
    private releaseWaiters;
}
//# sourceMappingURL=cuaAgentAdmissionGate.d.ts.map