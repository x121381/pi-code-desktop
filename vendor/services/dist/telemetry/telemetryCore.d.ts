import { type TelemetryRendererContext, type OAuthLoginAttribution } from "@zcode/shared";
interface TelemetryCoreDependencies {
    fetchImpl?: typeof fetch;
    loadUserId?: () => Promise<string>;
    loadAuthorization?: (userId: string) => Promise<string | null>;
    loadMarketingParams?: () => Promise<OAuthLoginAttribution | null>;
    randomUUID?: () => string;
    now?: () => number;
    appVersion?: string;
    platform?: NodeJS.Platform;
    arch?: string;
    releaseChannel?: string;
    osVersion?: string;
    homeDir?: string;
    resolveZCodeEndpointOrigin?: () => Promise<string> | string;
    requestTimeoutMs?: number;
    sleep?: (ms: number) => Promise<void>;
    warn?: (message: string) => void;
}
export interface EnsureTelemetryDeviceMidOptions {
    homeDir?: string;
    randomUUID?: () => string;
}
/**
 * 确保 telemetry-state.json 里存在 deviceMid 并返回它。
 *
 * Bug 根因：远端 zcode-server 所在主机没有 Desktop main 进程，过去没有任何进程会在那里写
 * telemetry-state.json；buildZCodeSourceHeaders() 又只读不生成，于是远端发往 ZCode endpoint 的
 * 请求永远缺 X-Device-Mid，billing/balance 被服务端拒绝为 parameter error，Start Plan 在远程
 * 工作区被判成未开通。这里把 telemetry 上报内部的 ensure 逻辑抽成独立入口，供远端 server 启动时
 * 调用：同一个文件、同一个字段、同一把 telemetry-state.lock，与同机 CLI 得到同一个设备身份。
 */
export declare function ensureTelemetryDeviceMid(options?: EnsureTelemetryDeviceMidOptions): Promise<string>;
export declare function createTelemetryCore(dependencies?: TelemetryCoreDependencies): {
    reportEvent(input: {
        context: TelemetryRendererContext;
        elementName: string;
        eventRegion: string;
        eventType: string;
        eventText?: string;
        eventExtraDetail: Record<string, string>;
        userId?: string;
        talkId?: string;
        messageId?: string;
    }): Promise<void>;
    reportAppLaunch(context: TelemetryRendererContext): Promise<void>;
    reportAppDailyActive(context: TelemetryRendererContext): Promise<void>;
    flushPendingReports: ({ timeoutMs }: {
        timeoutMs: number;
    }) => Promise<void>;
};
export {};
//# sourceMappingURL=telemetryCore.d.ts.map