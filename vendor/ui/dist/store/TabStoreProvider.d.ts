/**
 * TabStoreProvider —— 初始化 Tab Zustand store 并通过 React Context 提供
 *
 * 每个窗口独立挂载，tab 状态不跨窗口广播。
 */
import { type ReactNode } from "react";
import { type TabStore, type TabStoreState } from "./tabStore.js";
declare global {
    interface Window {
        __zcodeTabStoreE2E?: TabStore;
    }
}
export declare function TabStoreProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 消费 Tab store 的 hook
 *
 * 用法：
 *   const tabs = useTabStore(s => s.tabs);
 *   const addTab = useTabStore(s => s.addTab);
 */
export declare function useTabStore<T>(selector: (state: TabStoreState) => T): T;
/** 供可独立渲染的展示组件读取；无 Root provider 时回退为空 tab 状态。 */
export declare function useOptionalTabStore<T>(selector: (state: TabStoreState) => T): T;
/**
 * 获取 tab store 的原始引用（用于非 React 上下文，如 useEffect 中的订阅）
 */
export declare function useTabStoreApi(): TabStore;
//# sourceMappingURL=TabStoreProvider.d.ts.map