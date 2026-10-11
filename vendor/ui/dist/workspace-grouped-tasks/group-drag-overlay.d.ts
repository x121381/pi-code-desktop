import type { CSSProperties } from "react";
import type { ZCodeGroupedTaskViewNode } from "@zcode/services";
type GroupNode = Extract<ZCodeGroupedTaskViewNode, {
    type: "group";
}>;
declare function GroupDragOverlay({ node, className, style, }: {
    node: GroupNode;
    className?: string;
    style?: CSSProperties;
}): import("react/jsx-runtime").JSX.Element;
export { GroupDragOverlay };
//# sourceMappingURL=group-drag-overlay.d.ts.map