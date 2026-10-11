import { jsx as _jsx } from "react/jsx-runtime";
// import { GripHorizontal, GripVertical } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { Group, Panel, Separator, useDefaultLayout, } from "react-resizable-panels";
/* ------------------------------------------------------------------ */
/*  ResizablePanelGroup                                                */
/* ------------------------------------------------------------------ */
/**
 * 带 localStorage 持久化的 PanelGroup 封装。
 * 传入 layoutId 即可自动保存/恢复布局；不传则不持久化。
 * panelIds 用于支持条件渲染的面板（面板数量会变化时必须传）。
 */
function ResizablePanelGroup({ className, layoutId, panelIds, ...props }) {
    const { defaultLayout, onLayoutChange } = useDefaultLayout({
        id: layoutId,
        panelIds,
    });
    return (_jsx(Group, { className: cn("flex h-full w-full", className), defaultLayout: defaultLayout, 
        // onLayoutChanged 会在每次布局变化后立刻写 localStorage。
        // 窗口 resize 时 PanelGroup 会连续产生成百上千次 layout 更新，必须走库内置
        // debounce 的 onLayoutChange，避免同步持久化放大主线程压力。
        onLayoutChange: onLayoutChange, ...props }));
}
/* ------------------------------------------------------------------ */
/*  ResizablePanel                                                     */
/* ------------------------------------------------------------------ */
const ResizablePanel = Panel;
/* ------------------------------------------------------------------ */
/*  ResizableHandle                                                    */
/* ------------------------------------------------------------------ */
function ResizableHandle({ className, ...props }) {
    return (_jsx(Separator
    // react-resizable-panels 的 Separator 不会暴露 data-orientation，
    // 实际输出的是 aria-orientation，而且方向和 PanelGroup 相反。
    // 之前写的 data-[orientation=...] 一直没有命中，所以 w-px / h-px 看起来“没生效”。
    , { 
        // react-resizable-panels 的 Separator 不会暴露 data-orientation，
        // 实际输出的是 aria-orientation，而且方向和 PanelGroup 相反。
        // 之前写的 data-[orientation=...] 一直没有命中，所以 w-px / h-px 看起来“没生效”。
        className: cn("group/handle relative flex shrink-0 items-center justify-center bg-transparent outline-none transition-colors focus:outline-none focus-visible:outline-none focus-visible:bg-border-hover/60 focus-visible:ring-0", "hover:bg-border-hover/60 data-[separator=hover]:bg-border-hover/60 data-[separator=active]:bg-border-hover z-10", 
        // react-resizable-panels 会在 pointerdown 时主动 focus 当前 Separator，
        // 如果这里不接管 focus 样式，Chromium 会给可聚焦的 role=separator 画默认黄色高亮。
        // 终端/浏览器打开后颜色恢复，本质上只是焦点被转移了，不是布局自己修好了。
        "aria-[orientation=vertical]:translate-x-px", "aria-[orientation=vertical]:my-6", "aria-[orientation=vertical]:w-px", "aria-[orientation=vertical]:h-[calc(100%-48px)]", "aria-[orientation=vertical]:[mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_82%,transparent_100%)]", "aria-[orientation=vertical]:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_82%,transparent_100%)]", "aria-[orientation=horizontal]:translate-y-px", "aria-[orientation=horizontal]:mx-6", "aria-[orientation=horizontal]:h-px", "aria-[orientation=horizontal]:w-[calc(100%-48px)]", "aria-[orientation=horizontal]:[mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_82%,transparent_100%)]", "aria-[orientation=horizontal]:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_82%,transparent_100%)]", className), ...props }));
}
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
//# sourceMappingURL=resizable.js.map