import { type IPlatformService, type OffPeakTaskCreateResult, type TelemetryEventPayload } from "@zcode/shared";
export type OffPeakCreateEventRegion = "app.session" | "app.automations";
export interface OffPeakCreateTelemetrySource {
    eventRegion: OffPeakCreateEventRegion;
    templateId: string;
}
export interface OffPeakCreateTelemetrySnapshot extends OffPeakCreateTelemetrySource {
    modelName: string;
    modelProvider: string;
}
type TelemetryPlatform = Pick<IPlatformService, "reportTelemetryEvent">;
/** submit 同步阶段冻结来源/模板/模型，后续导航或表单变化不得改写本次 attempt。 */
export declare function freezeOffPeakCreateTelemetrySnapshot(params: {
    source?: OffPeakCreateTelemetrySource;
    model?: string | null;
    providerId?: string | null;
}): OffPeakCreateTelemetrySnapshot;
export declare function buildOffPeakCreateResultTelemetryPayload(snapshot: OffPeakCreateTelemetrySnapshot, result: OffPeakTaskCreateResult): TelemetryEventPayload;
export declare function reportOffPeakCreateResult(platform: TelemetryPlatform, snapshot: OffPeakCreateTelemetrySnapshot, result: OffPeakTaskCreateResult): Promise<void>;
/** 单次 submit 的业务结果与 exactly-once report 调度边界。 */
export declare function createAndReportOffPeakTask(platform: TelemetryPlatform, snapshot: OffPeakCreateTelemetrySnapshot, create: () => Promise<OffPeakTaskCreateResult>): Promise<OffPeakTaskCreateResult>;
export {};
//# sourceMappingURL=offPeakTelemetry.d.ts.map