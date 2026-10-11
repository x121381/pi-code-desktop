import { Panel, type GroupProps, type PanelProps, type SeparatorProps } from "react-resizable-panels";
/**
 * 带 localStorage 持久化的 PanelGroup 封装。
 * 传入 layoutId 即可自动保存/恢复布局；不传则不持久化。
 * panelIds 用于支持条件渲染的面板（面板数量会变化时必须传）。
 */
declare function ResizablePanelGroup({ className, layoutId, panelIds, ...props }: Omit<GroupProps, "defaultLayout" | "onLayoutChange" | "onLayoutChanged"> & {
    /** 持久化 key，对应 useDefaultLayout 的 id */
    layoutId: string;
    /** 条件渲染面板时需要传当前可见面板的 id 列表 */
    panelIds?: string[];
}): import("react/jsx-runtime").JSX.Element;
declare const ResizablePanel: typeof Panel;
type ResizablePanelProps = PanelProps;
declare function ResizableHandle({ className, ...props }: SeparatorProps): import("react/jsx-runtime").JSX.Element;
export { ResizablePanelGroup, ResizablePanel, ResizableHandle, type ResizablePanelProps };
//# sourceMappingURL=resizable.d.ts.map