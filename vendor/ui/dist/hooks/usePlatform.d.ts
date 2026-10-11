/**
 * usePlatform —— 通过 React Context 提供 IPlatformService
 *
 * 平台操作（native dialog、窗口生命周期等）通过此 hook 访问，
 * 替代直接调用 window.zcode。
 */
import { type ReactNode } from "react";
import type { IPlatformService, RemoteTarget } from "@zcode/shared";
export declare function PlatformProvider({ platform, children, }: {
    platform: IPlatformService;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function usePlatform(): IPlatformService;
export declare function useOptionalPlatform(): IPlatformService | null;
/** 选择目录的便捷 hook */
export declare function useSelectDirectory(): () => Promise<string | null>;
/** 连接远程的便捷 hook */
export declare function useConnectRemote(): (options: RemoteTarget, requestId?: string) => Promise<void>;
//# sourceMappingURL=usePlatform.d.ts.map