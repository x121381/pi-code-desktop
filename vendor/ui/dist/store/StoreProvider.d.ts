/**
 * StoreProvider —— 初始化 Zustand store 并通过 React Context 提供
 *
 * 在应用根部挂载，连接 broadcastService 实现跨窗口状态同步。
 */
import { type ReactNode } from "react";
import type { IBroadcastService } from "@zcode/services";
import { type ZCodeState } from "./index.js";
export declare const StoreContext: import("react").Context<import("zustand").UseBoundStore<import("zustand").StoreApi<ZCodeState>> | null>;
export declare function StoreProvider({ broadcastService, initialIsRestoringOAuthSession, children, }: {
    broadcastService: IBroadcastService;
    initialIsRestoringOAuthSession?: boolean;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 消费 Zustand store 的 hook
 *
 * 用法：
 *   const theme = useZCodeStore(s => s.theme);
 *   const setTheme = useZCodeStore(s => s.setTheme);
 */
export declare function useZCodeStore<T>(selector: (state: ZCodeState) => T): T;
/**
 * 带默认值的容错版 useZCodeStore（store 耦合剥离配套）。
 *
 * 使用场景：宿主组件（PermissionDialog / 各 markdown 弹窗等）负责从 store 取
 * theme / codePreviewSettings，再通过 props 注入纯展示组件。这些宿主在单测里常被
 * 无 Provider 直接 renderToStaticMarkup，此时返回 defaultValue 而不是抛错，
 * 与「展示组件不触 store」的约束保持一致；真实应用 Root 必挂 StoreProvider，走真实值。
 *
 * 注意：selector 返回值与 defaultValue 都必须引用稳定，否则会造成无限重渲染。
 */
export declare function useZCodeStoreWithDefault<T>(selector: (state: ZCodeState) => T, defaultValue: T): T;
//# sourceMappingURL=StoreProvider.d.ts.map