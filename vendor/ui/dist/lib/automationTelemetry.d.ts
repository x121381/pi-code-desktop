import { type IPlatformService, type ModelSelection, type ZCodeAutomation } from "@zcode/shared";
import type { ProviderSettingsView } from "@zcode/services";
type TelemetryPlatform = Pick<IPlatformService, "reportTelemetryEvent">;
export declare function resolveAutomationModelTelemetry(modelValue: string | null | undefined, explicitProvider: string | null | undefined, providerSettingsView: ProviderSettingsView | null): Record<"model_name" | "model_provider" | "provider_name", string>;
export declare function resolveAutomationSelectionTelemetry(selection: ModelSelection | null | undefined, providerSettingsView: ProviderSettingsView | null): Record<"model_name" | "model_provider" | "provider_name", string>;
export declare function sanitizeAutomationTelemetryError(error: string | null | undefined): string;
export declare function reportAutomationCreateResult(platform: TelemetryPlatform, params: {
    automationId?: string;
    cronExpr: string;
    templateId?: string;
    error?: string | null;
    modelFields: Record<"model_name" | "model_provider" | "provider_name", string>;
}): Promise<void>;
export declare function reportAutomationActionClick(platform: TelemetryPlatform, params: {
    action: "run_now" | "delete";
    source: "list" | "editor";
    automation: ZCodeAutomation;
    providerSettingsView: ProviderSettingsView | null;
}): Promise<void>;
export {};
//# sourceMappingURL=automationTelemetry.d.ts.map