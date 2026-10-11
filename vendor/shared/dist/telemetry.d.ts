export interface TelemetryRendererContext {
    clientTimezone: string;
    clientLanguage: string;
    screenResolution: string;
}
export interface TelemetryEventPayload {
    elementName: string;
    eventRegion: string;
    eventType: string;
    eventText?: string;
    eventExtraDetail: Record<string, string>;
    userId?: string;
    talkId?: string;
    messageId?: string;
}
export interface RendererTelemetryEventPayload extends TelemetryEventPayload {
    context: TelemetryRendererContext;
}
export interface ArmsCustomEventPayload {
    name: string;
    group: string;
    value?: number;
    properties?: Record<string, string | number | boolean | undefined>;
}
/** desktop main 实际传给 armsRum.sendCustom 的最终参数。 */
export interface FinalArmsCustomEventPayload {
    name: string;
    type: "custom";
    group: string;
    value: number;
    properties: Record<string, string>;
}
/** 仅 E2E test bridge 可读取的 main-process 内存记录。 */
export interface FinalArmsCustomEventE2EEntry {
    sequence: number;
    recordedAt: number;
    payload: FinalArmsCustomEventPayload;
}
export interface ConfigureFinalArmsCustomEventE2ERequest {
    /** 命中后仍进入 ring，但不调用真实 armsRum.sendCustom。 */
    suppressedEventNames: string[];
}
/**
 * URL 配置进入业务埋点前只允许提取 hostname。
 * 无效值和非 HTTP(S) 协议返回空串，避免误把完整 URL、userinfo 或任意文本带入 payload。
 */
export declare function resolveSafeTelemetryHostname(value: string | null | undefined): string;
/** 错误原文可能带任意格式密钥；整体丢弃，不用正则猜测秘密边界。 */
export declare function sanitizeTelemetryErrorMessage(value: string | null | undefined): string;
/** 只清洗上报副本；业务错误、授权地址和调用方持有的 detail 不得被修改。 */
export declare function sanitizeTelemetryEventDetail(elementName: string, detail: Readonly<Record<string, string>>): Record<string, string>;
interface TelemetryScreenLike {
    width: number;
    height: number;
}
interface TelemetryWindowLike {
    intlLocale?: string;
    timeZone?: string;
    screen: TelemetryScreenLike;
}
export declare function collectTelemetryRendererContext(options?: TelemetryWindowLike): TelemetryRendererContext;
export {};
//# sourceMappingURL=telemetry.d.ts.map