import { type ZCodeComputerUseOperationEvent } from "@zcode/shared";
import type { PipSessionEvent } from "@zcode/zcode-cua/pip-session";
export interface CuaOperationWorkspaceTarget {
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface CuaOperationState {
    active: boolean;
    sessionId: string;
    turnId: string;
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface CuaOperationStateReporter {
    onStateChanged(event: CuaOperationState): void;
}
export interface CuaOperationTurnTracker {
    accept(workspace: CuaOperationWorkspaceTarget, event: ZCodeComputerUseOperationEvent): void;
    /** 当前是否存在仍在执行 Computer Use 工具的 turn。 */
    hasActiveTurn(): boolean;
    clearWorkspaceKey(workspaceKey: string): void;
    clearAll(): void;
}
interface TrackerLogger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
}
export declare function createCuaOperationTurnTracker(options: {
    /** Windows 顶部提示条的桌面投影；非 win32 不注入。 */
    reporter?: CuaOperationStateReporter;
    /** Windows operation indicator 的聚合边界；PiP 不再消费该聚合状态。 */
    onTurnsActive?: () => void;
    onTurnsIdle?: () => void;
    /** macOS desktop-local PiP 只消费这些产品事实；panel policy 留在 producer。 */
    onPipSessionLifecycle?: (workspace: CuaOperationWorkspaceTarget, event: Exclude<PipSessionEvent, {
        kind: "focus-changed";
    }>) => void;
    logger?: TrackerLogger;
}): CuaOperationTurnTracker;
export {};
//# sourceMappingURL=cuaOperationTurnTracker.d.ts.map