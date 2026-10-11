import { type ZCodeOffPeakTask } from "@zcode/shared";
declare const STATUS_INDICATOR_CLASS: {
    readonly succeeded: {
        readonly dot: "bg-success";
        readonly text: "text-success";
    };
    readonly failed: {
        readonly dot: "bg-destructive";
        readonly text: "text-destructive";
    };
    readonly skipped: {
        readonly dot: "bg-foreground-subtlest";
        readonly text: "text-foreground-subtle";
    };
    readonly running: {
        readonly dot: "bg-brand";
        readonly text: "text-brand";
    };
};
export declare function resolveOffPeakHistoryStatus(task: Pick<ZCodeOffPeakTask, "status">): keyof typeof STATUS_INDICATOR_CLASS;
export declare function OffPeakHistoryTab({ task, onOpenSession, onDelete, }: {
    task: ZCodeOffPeakTask | null;
    onOpenSession?: (task: ZCodeOffPeakTask) => void;
    onDelete?: (task: ZCodeOffPeakTask) => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=OffPeakHistoryTab.d.ts.map