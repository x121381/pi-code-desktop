import { type BuiltinModelProviderId, type IPlatformService } from "@zcode/shared";
export declare function resolveProviderTelemetryLabel(providerId: string): string;
export declare function resolvePresetModelProviderTelemetryLabel(presetId: BuiltinModelProviderId): string;
type ReportTelemetryPlatform = Pick<IPlatformService, "reportTelemetryEvent">;
export declare function reportAppTelemetryEvent(platform: ReportTelemetryPlatform, payload: {
    elementName: string;
    eventRegion: string;
    eventType: string;
    eventText?: string;
    eventExtraDetail: Record<string, string>;
    userId?: string;
    talkId?: string;
    messageId?: string;
}, scope: string): Promise<void>;
export {};
//# sourceMappingURL=appTelemetry.d.ts.map