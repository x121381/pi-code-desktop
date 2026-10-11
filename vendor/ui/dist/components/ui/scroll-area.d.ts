import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
declare function ScrollArea({ className, scrollbarClassName, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
    scrollbarClassName?: string;
}): import("react/jsx-runtime").JSX.Element;
declare function ScrollBar({ className, orientation, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>): import("react/jsx-runtime").JSX.Element;
export { ScrollArea, ScrollBar };
//# sourceMappingURL=scroll-area.d.ts.map