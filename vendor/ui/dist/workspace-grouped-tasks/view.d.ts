import type { ZCodeGroupedTaskView } from "@zcode/services";
import type { ZCodeTaskMeta } from "@zcode/shared";
import type { GroupedDraftTaskPlacement } from "@/store/zcodeSessionStoreTypes.js";
declare function cloneView(view: ZCodeGroupedTaskView): ZCodeGroupedTaskView;
declare function removeTaskFromGroupedView(view: ZCodeGroupedTaskView, targetTaskKey: string): ZCodeGroupedTaskView;
declare function filterGroupedViewByTaskKeys(view: ZCodeGroupedTaskView, hiddenTaskKeys: ReadonlySet<string>): ZCodeGroupedTaskView;
declare function findTaskInGroupedView(view: ZCodeGroupedTaskView, targetTaskKey: string): ZCodeTaskMeta | null;
declare function replaceTaskInGroupedView(view: ZCodeGroupedTaskView, nextTask: ZCodeTaskMeta): ZCodeGroupedTaskView;
declare function getGroupedTaskGroupIds(view: ZCodeGroupedTaskView): string[];
declare function areAllGroupedTaskGroupsExpanded(groupIds: readonly string[], collapsedGroupIds: ReadonlySet<string>): boolean;
declare function pruneCollapsedGroupedTaskGroupIds(collapsedGroupIds: ReadonlySet<string>, groupIds: readonly string[]): Set<string>;
type GroupedTaskInsertPosition = "before" | "after";
declare function resolveGroupedDraftTaskPlacementForTask(view: ZCodeGroupedTaskView, targetTaskKey: string | null | undefined): GroupedDraftTaskPlacement;
declare function moveTaskOverTask(view: ZCodeGroupedTaskView, params: {
    activeTaskKey: string;
    overTaskKey: string;
    position: GroupedTaskInsertPosition;
}): ZCodeGroupedTaskView;
declare function moveTaskToRootAroundGroup(view: ZCodeGroupedTaskView, params: {
    activeTaskKey: string;
    groupId: string;
    position: GroupedTaskInsertPosition;
}): ZCodeGroupedTaskView;
declare function moveTaskToGroupStart(view: ZCodeGroupedTaskView, params: {
    activeTaskKey: string;
    groupId: string;
}): ZCodeGroupedTaskView;
declare function moveTaskToGroupEnd(view: ZCodeGroupedTaskView, params: {
    activeTaskKey: string;
    groupId: string;
}): ZCodeGroupedTaskView;
declare function moveGroupAroundTopLevelNode(view: ZCodeGroupedTaskView, params: {
    activeGroupId: string;
    over: {
        type: "group";
        groupId: string;
    } | {
        type: "task";
        taskKey: string;
    };
    position: GroupedTaskInsertPosition;
}): ZCodeGroupedTaskView;
declare function moveTaskByMenu(view: ZCodeGroupedTaskView, targetTask: ZCodeTaskMeta, targetGroupId: string | null): ZCodeGroupedTaskView;
declare function moveTaskToTopByMenu(view: ZCodeGroupedTaskView, targetTask: ZCodeTaskMeta): ZCodeGroupedTaskView;
export { areAllGroupedTaskGroupsExpanded, cloneView, filterGroupedViewByTaskKeys, findTaskInGroupedView, getGroupedTaskGroupIds, moveTaskByMenu, moveGroupAroundTopLevelNode, moveTaskToTopByMenu, moveTaskToGroupEnd, moveTaskToGroupStart, moveTaskToRootAroundGroup, moveTaskOverTask, pruneCollapsedGroupedTaskGroupIds, removeTaskFromGroupedView, replaceTaskInGroupedView, resolveGroupedDraftTaskPlacementForTask, };
export type { GroupedTaskInsertPosition };
//# sourceMappingURL=view.d.ts.map