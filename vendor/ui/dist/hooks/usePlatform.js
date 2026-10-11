import { jsx as _jsx } from "react/jsx-runtime";
/**
 * usePlatform —— 通过 React Context 提供 IPlatformService
 *
 * 平台操作（native dialog、窗口生命周期等）通过此 hook 访问，
 * 替代直接调用 window.zcode。
 */
import { createContext, useContext, useCallback } from "react";
const PlatformContext = createContext(null);
export function PlatformProvider({ platform, children, }) {
    return _jsx(PlatformContext.Provider, { value: platform, children: children });
}
export function usePlatform() {
    const ctx = useOptionalPlatform();
    if (!ctx) {
        throw new Error("usePlatform 必须在 PlatformProvider 内使用");
    }
    return ctx;
}
export function useOptionalPlatform() {
    const ctx = useContext(PlatformContext);
    return ctx;
}
/** 选择目录的便捷 hook */
export function useSelectDirectory() {
    const platform = usePlatform();
    return useCallback(() => platform.selectDirectory(), [platform]);
}
/** 连接远程的便捷 hook */
export function useConnectRemote() {
    const platform = usePlatform();
    return useCallback(async (options, requestId) => {
        const result = await platform.connectRemote(options, requestId);
        if (!result.success) {
            throw new Error(result.error || "Connection failed");
        }
    }, [platform]);
}
//# sourceMappingURL=usePlatform.js.map