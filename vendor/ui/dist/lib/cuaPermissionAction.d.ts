import type { CuaAccessibilitySettingsResult } from "@zcode/shared";
export declare function isZCodeCuaToolName(value: string | null | undefined): boolean;
export declare function didReturnFromCuaPermissionSettings(result: CuaAccessibilitySettingsResult | null | undefined): boolean;
export declare function shouldRestartHelperAfterCuaPermissionReturn(result: CuaAccessibilitySettingsResult | null | undefined): boolean;
export interface CuaPermissionReturnRecoveryState {
    /** 跨 open/workspace reset 单调唯一；局部 epoch 不能单独充当异步 operation 身份。 */
    generation: number;
    contextKey: string;
    epoch: number;
    pending: boolean;
    automaticAttempted: boolean;
}
export interface CuaPermissionReturnRecoveryClaim {
    readonly state: CuaPermissionReturnRecoveryState;
    readonly generation: number;
    readonly contextKey: string;
    readonly epoch: number;
}
export declare function createCuaPermissionReturnRecoveryState(contextKey?: string): CuaPermissionReturnRecoveryState;
export declare function markCuaPermissionOnboardingOpened(state: CuaPermissionReturnRecoveryState): CuaPermissionReturnRecoveryClaim;
export declare function claimCuaPermissionReturnRecovery(state: CuaPermissionReturnRecoveryState): CuaPermissionReturnRecoveryClaim | null;
export declare function captureCuaPermissionReturnRecovery(state: CuaPermissionReturnRecoveryState): CuaPermissionReturnRecoveryClaim | null;
export declare function isCuaPermissionReturnRecoveryCurrent(current: CuaPermissionReturnRecoveryState, claim: CuaPermissionReturnRecoveryClaim): boolean;
export declare function completeCuaPermissionReturnRecovery(claim: CuaPermissionReturnRecoveryClaim, restartSucceeded: boolean): void;
//# sourceMappingURL=cuaPermissionAction.d.ts.map