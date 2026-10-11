import type { ServiceAuthorityMode } from "@zcode/shared";
export type ZCodeAgentPresentationSurface = "desktop";
export interface ZCodeAgentPresentationHostFacts {
    runtimeSurface?: "desktop_local_host" | "remote_workspace_host";
    serviceAuthorityMode?: ServiceAuthorityMode;
    /** Main 已完成服务端单功能灰度裁决；未提供时保持历史 Host 装配语义。 */
    desktopContextPromptEnabled?: boolean;
}
export declare function resolveZCodeAgentPresentationSurface(facts: ZCodeAgentPresentationHostFacts): ZCodeAgentPresentationSurface | undefined;
//# sourceMappingURL=zcodeAgentPresentationSurface.d.ts.map