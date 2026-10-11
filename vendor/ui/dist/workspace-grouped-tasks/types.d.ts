import type { ZCodeTaskGroupColor } from "@zcode/services";
interface TaskGroupMenuItem {
    id: string;
    title: string;
    color: ZCodeTaskGroupColor;
}
declare const TASK_GROUP_COLORS: ("red" | "blue" | "green" | "yellow" | "purple" | "orange" | "gray")[];
declare const TASK_GROUP_COLOR_CLASS: Record<ZCodeTaskGroupColor, string>;
declare const TASK_GROUP_BORDER_COLOR_CLASS: Record<ZCodeTaskGroupColor, string>;
declare const TASK_GROUP_CONTAINER_CLASS = "relative pt-2.5 pb-0 transition-[width,max-width] duration-200 ease-out";
declare const TASK_GROUP_HEADER_CLASS = "mb-0.5 flex h-8 items-center gap-1 rounded-lg border border-transparent pl-1.5 pr-1 text-ui-base text-foreground transition-[background-color,border-color,box-shadow] hover:bg-surface-hover";
declare const TASK_GROUP_TITLE_CLASS = "min-w-0 max-w-full cursor-pointer truncate rounded-sm px-1 text-left text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-input-border-focused";
declare const TASK_GROUP_COUNT_BADGE_CLASS = "inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-tag/50 px-1.5 py-0.5 text-ui-sm font-medium leading-none text-foreground-subtle";
declare const TASK_GROUP_CONTENT_CLASS = "ml-4 border-l py-px pl-2";
declare const TASK_GROUP_ROW_CLASS = "flex min-h-7 w-full min-w-0 flex-col justify-center rounded-lg border border-transparent pl-2.5 pr-1 text-left text-ui-base transition-[background-color,border-color,color,opacity]";
declare const TASK_GROUP_ROW_LINE_CLASS = "flex h-7 w-full min-w-0 items-center gap-2";
export { TASK_GROUP_ROW_LINE_CLASS, TASK_GROUP_COLOR_CLASS, TASK_GROUP_BORDER_COLOR_CLASS, TASK_GROUP_COLORS, TASK_GROUP_CONTAINER_CLASS, TASK_GROUP_CONTENT_CLASS, TASK_GROUP_COUNT_BADGE_CLASS, TASK_GROUP_HEADER_CLASS, TASK_GROUP_ROW_CLASS, TASK_GROUP_TITLE_CLASS, };
export type { TaskGroupMenuItem };
//# sourceMappingURL=types.d.ts.map