import type { PanelImperativeHandle } from "react-resizable-panels";
export declare function useAnimatedResizablePanel({ open, alwaysMounted, expandedSize, rememberExpandedSize, resizeOnInitialVisibleMount, }: {
    open: boolean;
    alwaysMounted?: boolean;
    expandedSize?: string;
    rememberExpandedSize?: boolean;
    resizeOnInitialVisibleMount?: boolean;
}): {
    panelRef: import("react").RefObject<PanelImperativeHandle | null>;
    panelElementRef: import("react").RefObject<HTMLDivElement | null>;
    isVisible: boolean;
};
//# sourceMappingURL=useAnimatedResizablePanel.d.ts.map