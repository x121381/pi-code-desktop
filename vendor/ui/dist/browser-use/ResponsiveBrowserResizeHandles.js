import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BROWSER_VIEWPORT_LIMITS, TID_BROWSER_RESPONSIVE_RESIZE_CORNER, TID_BROWSER_RESPONSIVE_RESIZE_CORNER_BOTTOM_LEFT, TID_BROWSER_RESPONSIVE_RESIZE_CORNER_TOP_LEFT, TID_BROWSER_RESPONSIVE_RESIZE_CORNER_TOP_RIGHT, TID_BROWSER_RESPONSIVE_RESIZE_HEIGHT, TID_BROWSER_RESPONSIVE_RESIZE_LEFT, TID_BROWSER_RESPONSIVE_RESIZE_TOP, TID_BROWSER_RESPONSIVE_RESIZE_WIDTH, } from "@zcode/shared";
import { GripHorizontalIcon, GripVerticalIcon } from "lucide-react";
import { cn } from "../components/lib/utils.js";
export const RESPONSIVE_BROWSER_VIEWPORT_LIMITS = BROWSER_VIEWPORT_LIMITS;
const EDGE_RESIZE_HANDLES = [
    {
        className: "top-0 -left-2 h-full w-4 cursor-ew-resize",
        dimension: "width",
        heightDirection: 0,
        key: "left",
        orientation: "vertical",
        testId: TID_BROWSER_RESPONSIVE_RESIZE_LEFT,
        widthDirection: -1,
    },
    {
        className: "top-0 -right-2 h-full w-4 cursor-ew-resize",
        dimension: "width",
        heightDirection: 0,
        key: "right",
        orientation: "vertical",
        testId: TID_BROWSER_RESPONSIVE_RESIZE_WIDTH,
        widthDirection: 1,
    },
    {
        className: "-top-2 left-0 h-4 w-full cursor-ns-resize",
        dimension: "height",
        heightDirection: -1,
        key: "top",
        orientation: "horizontal",
        testId: TID_BROWSER_RESPONSIVE_RESIZE_TOP,
        widthDirection: 0,
    },
    {
        className: "-bottom-2 left-0 h-4 w-full cursor-ns-resize",
        dimension: "height",
        heightDirection: 1,
        key: "bottom",
        orientation: "horizontal",
        testId: TID_BROWSER_RESPONSIVE_RESIZE_HEIGHT,
        widthDirection: 0,
    },
];
const CORNER_RESIZE_HANDLES = [
    {
        className: "-top-2 -left-2 cursor-nwse-resize",
        heightDirection: -1,
        key: "top-left",
        testId: TID_BROWSER_RESPONSIVE_RESIZE_CORNER_TOP_LEFT,
        widthDirection: -1,
    },
    {
        className: "-top-2 -right-2 cursor-nesw-resize",
        heightDirection: -1,
        key: "top-right",
        testId: TID_BROWSER_RESPONSIVE_RESIZE_CORNER_TOP_RIGHT,
        widthDirection: 1,
    },
    {
        className: "-bottom-2 -left-2 cursor-nesw-resize",
        heightDirection: 1,
        key: "bottom-left",
        testId: TID_BROWSER_RESPONSIVE_RESIZE_CORNER_BOTTOM_LEFT,
        widthDirection: -1,
    },
    {
        className: "-right-2 -bottom-2 cursor-nwse-resize",
        heightDirection: 1,
        key: "bottom-right",
        testId: TID_BROWSER_RESPONSIVE_RESIZE_CORNER,
        widthDirection: 1,
    },
];
const RESIZE_SEPARATOR_ICON_CLASS = "pointer-events-none absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-foreground-subtlest opacity-0 transition-[color,opacity] group-hover/resize-edge:text-foreground-subtle group-hover/resize-edge:opacity-100 group-focus-visible/resize-edge:text-foreground-subtle group-focus-visible/resize-edge:opacity-100";
export function ResponsiveBrowserResizeHandles({ height, heightLabel, onBeginResize, onEndResize, onPointerMove, onResizeKeyDown, width, widthLabel, }) {
    return (_jsxs(_Fragment, { children: [EDGE_RESIZE_HANDLES.map((handle) => {
                const isWidthHandle = handle.dimension === "width";
                const directions = {
                    heightDirection: handle.heightDirection,
                    widthDirection: handle.widthDirection,
                };
                return (_jsx("div", { "aria-label": isWidthHandle ? widthLabel : heightLabel, "aria-orientation": handle.orientation, "aria-valuemax": isWidthHandle
                        ? RESPONSIVE_BROWSER_VIEWPORT_LIMITS.maxWidth
                        : RESPONSIVE_BROWSER_VIEWPORT_LIMITS.maxHeight, "aria-valuemin": isWidthHandle
                        ? RESPONSIVE_BROWSER_VIEWPORT_LIMITS.minWidth
                        : RESPONSIVE_BROWSER_VIEWPORT_LIMITS.minHeight, "aria-valuenow": isWidthHandle ? width : height, className: cn("group/resize-edge absolute z-30 touch-none outline-none", handle.className), "data-resize-edge": handle.key, "data-testid": handle.testId, onKeyDown: (event) => onResizeKeyDown(directions, event), onLostPointerCapture: onEndResize, onPointerCancel: onEndResize, onPointerDown: (event) => onBeginResize(directions, event), onPointerMove: onPointerMove, onPointerUp: onEndResize, role: "separator", tabIndex: 0, children: handle.orientation === "vertical" ? (_jsx(GripVerticalIcon, { className: RESIZE_SEPARATOR_ICON_CLASS })) : (_jsx(GripHorizontalIcon, { className: RESIZE_SEPARATOR_ICON_CLASS })) }, handle.key));
            }), CORNER_RESIZE_HANDLES.map((handle) => {
                const directions = {
                    heightDirection: handle.heightDirection,
                    widthDirection: handle.widthDirection,
                };
                return (_jsx("div", { "aria-hidden": "true", className: cn("absolute z-40 size-5 touch-none", handle.className), "data-resize-corner": handle.key, "data-testid": handle.testId, onLostPointerCapture: onEndResize, onPointerCancel: onEndResize, onPointerDown: (event) => onBeginResize(directions, event), onPointerMove: onPointerMove, onPointerUp: onEndResize }, handle.key));
            })] }));
}
//# sourceMappingURL=ResponsiveBrowserResizeHandles.js.map