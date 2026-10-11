import type { ZCodeUiError } from "@/lib/zcodeUiError.js";
type TelemetryErrorSource = "provider" | "runtime" | "network" | "tool" | "";
interface TelemetryErrorAttribution {
    errorSource: TelemetryErrorSource;
    failureReason: string;
}
export declare function resolveTelemetryAttribution(params: {
    error: ZCodeUiError;
    displayMessage: string;
}): TelemetryErrorAttribution;
export {};
//# sourceMappingURL=chatErrorAttribution.d.ts.map