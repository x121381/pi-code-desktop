import type { Locale, ZCodeTaskMeta } from "@zcode/shared";
type TaskTimelineGroupKind = "today" | "yesterday" | "daysAgo" | "thisWeek" | "lastWeek" | "thisMonth" | "lastMonth" | "older";
interface TaskTimelineGroupKey {
    kind: TaskTimelineGroupKind;
    daysAgo?: number;
}
interface TaskTimelineGroup<TTask> {
    key: string;
    label: TaskTimelineGroupKey;
    items: TTask[];
}
export declare function resolveTaskTimelineGroupKey(timestamp: number, now: number, locale: Locale): TaskTimelineGroupKey;
export declare function getTaskTimelineGroupMessage(groupKey: TaskTimelineGroupKey): {
    id: string;
    values?: Record<string, string>;
};
export declare function groupTaskTimelineItems<TTask extends Pick<ZCodeTaskMeta, "createdAt" | "updatedAt">>(items: TTask[], options: {
    sortBy: "created" | "updated";
    now: number;
    locale: Locale;
}): TaskTimelineGroup<TTask>[];
export {};
//# sourceMappingURL=taskTimelineGroups.d.ts.map