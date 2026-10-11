import type { WebRemoteControlMobileDeviceInfo } from "@zcode/shared";
interface NavigatorLike {
    userAgent?: string;
    language?: string;
    languages?: readonly string[];
    platform?: string;
    onLine?: boolean;
}
interface WindowLike {
    innerWidth?: number;
    innerHeight?: number;
    devicePixelRatio?: number;
    screen?: {
        width?: number;
        height?: number;
    };
}
interface DateTimeFormatLike {
    resolvedOptions(): {
        timeZone?: string;
    };
}
interface CollectWebRemoteControlMobileDeviceInfoOptions {
    appVersion?: string;
    now?: () => number;
    navigatorLike?: NavigatorLike;
    windowLike?: WindowLike;
    dateTimeFormat?: () => DateTimeFormatLike;
}
export declare function collectWebRemoteControlMobileDeviceInfo({ appVersion, now, navigatorLike, windowLike, dateTimeFormat, }?: CollectWebRemoteControlMobileDeviceInfoOptions): WebRemoteControlMobileDeviceInfo;
export {};
