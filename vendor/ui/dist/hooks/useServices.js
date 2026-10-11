import { jsx as _jsx } from "react/jsx-runtime";
/**
 * useServices —— 通过 React Context 提供 IServiceAccessor
 *
 * 替代 props drilling，组件通过 useServices() 直接获取服务。
 */
import { createContext, useContext } from "react";
const ServiceContext = createContext(null);
export function ServiceProvider({ services, children, }) {
    return _jsx(ServiceContext.Provider, { value: services, children: children });
}
export function useServices() {
    const ctx = useContext(ServiceContext);
    if (!ctx) {
        throw new Error("useServices 必须在 ServiceProvider 内使用");
    }
    return ctx;
}
export function useOptionalServices() {
    return useContext(ServiceContext);
}
//# sourceMappingURL=useServices.js.map