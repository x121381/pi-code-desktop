import { type ResourceUsageSnapshot, type StorageManagementBridge, type NetworkCaptureBridge } from "@zcode/shared";
export interface ResourceManagerAppProps {
    /** 缺省表示桥接不可用（例如非桌面环境） */
    getSnapshot?: () => Promise<ResourceUsageSnapshot>;
    setSamplingActive?: (active: boolean) => void;
    /** 存储管理桥（window.resourceManager.storage）；缺省时「存储」tab 显示接口不可用 */
    storage?: StorageManagementBridge;
    network?: NetworkCaptureBridge;
    refreshIntervalMs?: number;
    /** 初始 tab，默认 CPU */
    initialTab?: ResourceManagerTab;
}
export type ResourceManagerTab = "cpu" | "memory" | "storage" | "network";
/**
 * 资源管理器窗口 UI。
 * 组件放在 packages/ui 内是为了纳入 Tailwind 扫描；desktop 的独立 renderer 入口只负责挂载。
 */
export declare function ResourceManagerApp({ getSnapshot, setSamplingActive, storage, network, refreshIntervalMs, initialTab, }: ResourceManagerAppProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ResourceManagerApp.d.ts.map