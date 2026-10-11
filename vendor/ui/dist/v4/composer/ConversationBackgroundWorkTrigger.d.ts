import type { BackgroundWorkSummary } from "@zcode/shared/zcode-protocol-v4";
export interface ComposerBackgroundWorkCounts {
    bashCount: number;
    workflowCount: number;
    subagentCount: number;
    totalCount: number;
}
export declare function getComposerBackgroundWorkCounts(backgroundWorks: readonly BackgroundWorkSummary[], runningSubagentCount?: number): ComposerBackgroundWorkCounts;
export interface ConversationBackgroundWorkTriggerProps {
    backgroundWorks: readonly BackgroundWorkSummary[];
    runningSubagentCount?: number;
    onOpen?: () => void;
    /**
     * onOpen 的落点：
     * `"workflow-run"` 时 tooltip 说的是「打开工作流详情」，否则沿用按类型的「打开运行中的…」。
     * 判定归宿主（要 toolCallId 与宿主回调，徽标看不到），这里只如实自述。
     */
    openTarget?: "panel" | "workflow-run";
}
declare function ConversationBackgroundWorkTriggerImpl({ backgroundWorks, runningSubagentCount, onOpen, openTarget, }: ConversationBackgroundWorkTriggerProps): import("react/jsx-runtime").JSX.Element | null;
export declare const ConversationBackgroundWorkTrigger: import("react").MemoExoticComponent<typeof ConversationBackgroundWorkTriggerImpl>;
export {};
//# sourceMappingURL=ConversationBackgroundWorkTrigger.d.ts.map