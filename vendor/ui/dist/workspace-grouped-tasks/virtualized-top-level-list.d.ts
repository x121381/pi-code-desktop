import type { ReactNode } from "react";
import type { ZCodeGroupedTaskViewNode } from "@zcode/services";
declare const GROUPED_TOP_LEVEL_VIRTUALIZATION_THRESHOLD = 80;
declare function shouldVirtualizeGroupedTopLevelNodes(nodeCount: number): boolean;
declare function VirtualizedGroupedTopLevelList({ nodes, isGroupCollapsed, renderNode, }: {
    nodes: ZCodeGroupedTaskViewNode[];
    isGroupCollapsed: (groupId: string) => boolean;
    renderNode: (node: ZCodeGroupedTaskViewNode, index: number) => ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { GROUPED_TOP_LEVEL_VIRTUALIZATION_THRESHOLD, VirtualizedGroupedTopLevelList, shouldVirtualizeGroupedTopLevelNodes, };
//# sourceMappingURL=virtualized-top-level-list.d.ts.map