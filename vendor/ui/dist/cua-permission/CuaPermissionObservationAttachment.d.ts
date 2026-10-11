import type { CuaAccessibilitySettingsResult, CuaPermissionKind } from "@zcode/shared";
import { type CuaPermissionRestartOptions, type CuaPermissionStatusResult, type ZCodeAgentCuaPermissionObservation } from "@zcode/services";
interface CuaPermissionPromptDependencies {
    getStatus(): Promise<CuaPermissionStatusResult>;
    confirm(required: CuaPermissionKind[]): Promise<boolean>;
    openOnboarding(required: CuaPermissionKind[]): Promise<CuaAccessibilitySettingsResult>;
    restartHelper(options: CuaPermissionRestartOptions): Promise<{
        ok: boolean;
        reason?: string;
    }>;
    refresh(): void;
    isDisposed?(): boolean;
}
export declare function cuaPermissionObservationKey(observation: ZCodeAgentCuaPermissionObservation): string;
export declare function runCuaPermissionPrompt(dependencies: CuaPermissionPromptDependencies): Promise<void>;
export declare function CuaPermissionObservationAttachment(): null;
export {};
//# sourceMappingURL=CuaPermissionObservationAttachment.d.ts.map