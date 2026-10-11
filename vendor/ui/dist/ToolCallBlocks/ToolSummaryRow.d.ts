import type { KeyboardEvent, ReactNode } from "react";
export interface ToolSummaryAction {
    ariaLabel: string;
    onActivate: () => void;
    testId?: string;
}
export declare function handleToolSummaryActionKeyDown(event: Pick<KeyboardEvent<HTMLDivElement>, "key" | "preventDefault">, onActivate: () => void): boolean;
interface ToolSummaryRowProps {
    action?: ToolSummaryAction;
    animateContent: boolean;
    canToggle: boolean;
    contentKey: string;
    contentRefreshVersion?: string;
    diffCount?: ReactNode;
    disableContentAnimation: boolean;
    forceOpen: boolean;
    icon: ReactNode;
    isExpanded: boolean;
    kindDetail?: ReactNode;
    kindLabel: ReactNode;
    kindLabelClassName: string;
    primaryText: ReactNode;
    prioritizePrimaryText?: boolean;
    secondaryText?: ReactNode;
    separator?: ReactNode;
    showIcon: boolean;
    sourceLabel?: ReactNode;
    statusNode?: ReactNode;
    title?: string;
    toggleAriaLabel: string;
    toolId: string;
}
export declare function ToolSummaryRow(props: ToolSummaryRowProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ToolSummaryRow.d.ts.map