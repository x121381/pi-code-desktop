import type { ZCodeGroupedTaskViewNode, ZCodeTaskGroupColor } from "@zcode/services";
type StickyGroupNode = Extract<ZCodeGroupedTaskViewNode, {
    type: "group";
}>;
export declare function StickyGroupHeader({ node, collapsed, tooltipsDisabled, onCreateTask, onToggleCollapsed, onUpdateGroupColor, onUngroupGroup, }: {
    node: StickyGroupNode;
    collapsed: boolean;
    tooltipsDisabled?: boolean;
    onCreateTask: () => void;
    onToggleCollapsed: (groupId: string) => void;
    onUpdateGroupColor: (groupId: string, color: ZCodeTaskGroupColor) => void;
    onUngroupGroup: (groupId: string) => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=sticky-group-header.d.ts.map