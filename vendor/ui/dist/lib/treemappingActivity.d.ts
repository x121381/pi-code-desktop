import type { TaskChatMessage } from "@/lib/taskChatMessageTypes.js";
export type TreemappingFileKind = "viewed" | "written" | "modified" | "deleted";
export type TreemappingEventAction = "view" | "write" | "modify" | "delete";
export interface TreemappingActivityEvent {
    toolCallId: string;
    toolName: string;
    action: TreemappingEventAction;
    path: string;
    target: "file" | "directory";
    added: number;
    removed: number;
    timestamp: number;
    pending: boolean;
}
export interface TreemappingFileActivity {
    path: string;
    kind: TreemappingFileKind;
    added: number;
    removed: number;
    views: number;
    pendingToolCallIds: string[];
    lastTouchedAt: number;
    events: TreemappingActivityEvent[];
}
export interface TreemappingDirectoryActivity {
    path: string;
    views: number;
    lastTouchedAt: number;
    events: TreemappingActivityEvent[];
}
export interface TreemappingActivityModel {
    files: TreemappingFileActivity[];
    directories: TreemappingDirectoryActivity[];
    runningWithoutPathCount: number;
}
export declare function buildTreemappingActivityModel(message: TaskChatMessage | null, workspacePath: string): TreemappingActivityModel;
//# sourceMappingURL=treemappingActivity.d.ts.map