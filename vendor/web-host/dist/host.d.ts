import { type RendererTelemetryEventPayload } from "@zcode/shared";
import { Root } from "@zcode/ui";
import "@zcode/ui/styles.css";
import type { IPlatformService, WebRemoteControlPlatformMethod, WebRemoteControlPlatformMethodArgsMap, WebRemoteControlPlatformMethodResultMap } from "@zcode/shared";
type RootServices = Parameters<typeof Root>[0]["services"];
interface WebRemoteControlProxyOptions {
    token: string;
    relayOrigin: string;
    windowControlSessionId: string;
    mobileConnectionId: string;
}
interface WebRemoteControlPlatformProxy {
    reportTelemetryEvent?: (event: RendererTelemetryEventPayload) => void;
    requestPlatformMethod<K extends WebRemoteControlPlatformMethod>(method: K, args?: WebRemoteControlPlatformMethodArgsMap[K]): Promise<WebRemoteControlPlatformMethodResultMap[K]>;
}
export declare function createWebPlatform(options?: {
    webRemoteControlProxy?: WebRemoteControlProxyOptions;
    externalWebRemoteControlProxy?: WebRemoteControlPlatformProxy;
}): IPlatformService;
export declare function createHomeOnlyWebRemoteControlServices(): RootServices;
export {};
