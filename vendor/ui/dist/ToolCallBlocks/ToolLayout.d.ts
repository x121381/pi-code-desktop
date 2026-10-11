import { type ReactNode } from "react";
import { type ToolSummaryAction } from "@/ToolCallBlocks/ToolSummaryRow.js";
interface ToolLayoutProps {
    toolId: string;
    persistOpenKey?: string;
    icon: ReactNode;
    showIcon?: boolean;
    canToggle?: boolean;
    forceOpen?: boolean;
    autoOpen?: boolean;
    autoCollapseOnComplete?: boolean;
    kindLabel: ReactNode;
    expandedKindLabel?: ReactNode;
    kindDetail?: ReactNode;
    expandedKindDetail?: ReactNode;
    sourceLabel?: ReactNode;
    primaryText: ReactNode;
    prioritizePrimaryText?: boolean;
    expandedPrimaryText?: ReactNode;
    secondaryText?: ReactNode;
    expandedSecondaryText?: ReactNode;
    summaryContentSeparator?: ReactNode;
    animateSummaryContent?: boolean;
    disableSummaryContentAnimation?: boolean;
    summaryContentKey?: string;
    summaryContentRefreshVersion?: string;
    hideSecondaryTextWhenOpen?: boolean;
    diffCount?: ReactNode;
    hideDiffCountWhenOpen?: boolean;
    statusLabel?: ReactNode;
    statusTooltip?: ReactNode;
    /**
     * 状态词之前的指示物（如编译反馈行的空环灯），与状态词同显同隐。放在提示触发区之外：
     * 虚线下划线与悬停提示只属于词，灯不该被划线，也不该成为另一个悬停目标。
     */
    statusIndicator?: ReactNode;
    showStatusLabel?: boolean;
    showFailureStatus?: boolean;
    isRunning?: boolean;
    title?: string;
    expandedTitle?: string;
    content?: ReactNode;
    renderContent?: () => ReactNode;
    summaryAction?: ToolSummaryAction;
}
declare function ToolLayoutComponent({ toolId, persistOpenKey, icon, showIcon, canToggle, forceOpen, autoOpen, autoCollapseOnComplete, kindLabel, expandedKindLabel, kindDetail, expandedKindDetail, sourceLabel, primaryText, prioritizePrimaryText, expandedPrimaryText, secondaryText, expandedSecondaryText, summaryContentSeparator, animateSummaryContent, disableSummaryContentAnimation, summaryContentKey, summaryContentRefreshVersion, hideSecondaryTextWhenOpen, diffCount, hideDiffCountWhenOpen, statusLabel, statusTooltip, statusIndicator, showStatusLabel, showFailureStatus, isRunning, title, expandedTitle, content, renderContent, summaryAction, }: ToolLayoutProps): import("react/jsx-runtime").JSX.Element;
export declare const ToolLayout: import("react").MemoExoticComponent<typeof ToolLayoutComponent>;
export {};
//# sourceMappingURL=ToolLayout.d.ts.map