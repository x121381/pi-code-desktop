import type { WebRemoteControlWindowBootstrapResult } from "@zcode/shared";
interface WebRemoteControlVersionGuardOptions {
    requestBootstrap(): Promise<WebRemoteControlWindowBootstrapResult>;
    getUrl(): string;
    isPageReady(): boolean;
    navigate(url: string): void;
    onMismatch(desktopVersion: string): void;
}
/** 只管理当前手机连接的版本校验；资源路由由服务端处理。 */
export declare function createWebRemoteControlVersionGuard(options: WebRemoteControlVersionGuardOptions): {
    isBlocked: () => boolean;
    confirm: () => void;
    invalidate: () => void;
    dispose(): void;
    check(): Promise<WebRemoteControlWindowBootstrapResult | undefined>;
};
export {};
