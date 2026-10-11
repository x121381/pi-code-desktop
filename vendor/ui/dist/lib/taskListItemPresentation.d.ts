import type { ZCodeTaskMeta } from "@zcode/shared";
import type { TaskListRowActivity } from "@/v4/taskListRowActivity.js";
export declare function deriveTaskLeadingIndicator(task: ZCodeTaskMeta, activity: TaskListRowActivity | null): "error" | "unread" | "loading" | "none";
export declare function formatTaskRelativeTime(timestamp: number, intl: {
    formatMessage: (desc: {
        id: string;
    }, values?: Record<string, string>) => string;
}): string;
//# sourceMappingURL=taskListItemPresentation.d.ts.map