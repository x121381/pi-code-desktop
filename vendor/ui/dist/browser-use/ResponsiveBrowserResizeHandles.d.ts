import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
export declare const RESPONSIVE_BROWSER_VIEWPORT_LIMITS: {
    readonly minWidth: 320;
    readonly maxWidth: 3840;
    readonly minHeight: 320;
    readonly maxHeight: 2160;
};
export type ResizeDirection = -1 | 0 | 1;
export interface ResizeHandleDirections {
    heightDirection: ResizeDirection;
    widthDirection: ResizeDirection;
}
export declare function ResponsiveBrowserResizeHandles({ height, heightLabel, onBeginResize, onEndResize, onPointerMove, onResizeKeyDown, width, widthLabel, }: {
    height: number;
    heightLabel: string;
    onBeginResize: (directions: ResizeHandleDirections, event: ReactPointerEvent<HTMLDivElement>) => void;
    onEndResize: (event: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
    onResizeKeyDown: (directions: ResizeHandleDirections, event: ReactKeyboardEvent<HTMLDivElement>) => void;
    width: number;
    widthLabel: string;
}): React.JSX.Element;
//# sourceMappingURL=ResponsiveBrowserResizeHandles.d.ts.map