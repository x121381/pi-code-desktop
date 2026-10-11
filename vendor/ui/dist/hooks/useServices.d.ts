/**
 * useServices —— 通过 React Context 提供 IServiceAccessor
 *
 * 替代 props drilling，组件通过 useServices() 直接获取服务。
 */
import { type ReactNode } from "react";
import type { IServiceAccessor } from "@zcode/services";
export declare function ServiceProvider({ services, children, }: {
    services: IServiceAccessor;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useServices(): IServiceAccessor;
export declare function useOptionalServices(): IServiceAccessor | null;
//# sourceMappingURL=useServices.d.ts.map