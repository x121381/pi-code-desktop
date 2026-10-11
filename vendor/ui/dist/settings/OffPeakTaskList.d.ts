import { type ZCodeOffPeakTask } from "@zcode/shared";
interface OffPeakTaskListProps {
    tasks: readonly ZCodeOffPeakTask[];
    busyOperationId: string | null;
    onOpen: (task: ZCodeOffPeakTask) => void;
    onPause: (task: ZCodeOffPeakTask) => void;
    onContinue: (task: ZCodeOffPeakTask) => void;
    onCancel: (task: ZCodeOffPeakTask) => void;
    onDelete: (task: ZCodeOffPeakTask) => void;
    onOpenSession: (task: ZCodeOffPeakTask) => void;
}
export declare function sortOffPeakTasksByCreatedAt(tasks: readonly ZCodeOffPeakTask[]): ZCodeOffPeakTask[];
/** 与 AutomationsSection 定时任务列表相同的滚动阈值（Figma 规范最多露出 8 张卡片）。 */
export declare const OFFPEAK_LIST_SCROLL_THRESHOLD = 8;
type OffPeakMenuHintSide = "right" | "top";
export declare function resolveOffPeakMenuHintSide(triggerRect: Pick<DOMRect, "right"> | null, viewportWidth: number): OffPeakMenuHintSide;
export declare function OffPeakTaskList({ tasks, busyOperationId, onOpen, onPause, onContinue, onCancel, onDelete, onOpenSession, }: OffPeakTaskListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=OffPeakTaskList.d.ts.map