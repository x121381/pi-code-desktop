import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible.js";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { type ScrollMetrics } from "@/mentions/components/scrollMask.js";
interface ReasoningContextValue {
    isStreaming: boolean;
    isOpen: boolean;
    shouldRenderContent: boolean;
    setIsOpen: (open: boolean) => void;
    duration: number | undefined;
}
export declare const useReasoning: () => ReasoningContextValue;
export type ReasoningProps = ComponentProps<typeof Collapsible> & {
    isStreaming?: boolean;
    autoCollapseKey?: string | number | null;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    duration?: number;
};
export declare function shouldAutoCollapseReasoning({ autoCollapseKey, previousAutoCollapseKey, userInteracted, }: {
    autoCollapseKey: string | number | null | undefined;
    previousAutoCollapseKey: string | number | null | undefined;
    userInteracted: boolean;
}): boolean;
export declare function getReasoningBottomDistance({ clientHeight, scrollHeight, scrollTop, }: ScrollMetrics): number;
export declare function isReasoningScrollAtBottom(metrics: ScrollMetrics): boolean;
export declare const Reasoning: import("react").MemoExoticComponent<({ className, isStreaming, autoCollapseKey, open, defaultOpen, onOpenChange, duration: durationProp, children, ...props }: ReasoningProps) => import("react/jsx-runtime").JSX.Element>;
export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
    getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
    streamingText?: string;
};
export declare function scrollReasoningSummaryToEnd(viewport: Pick<HTMLElement, "scrollLeft" | "scrollWidth">): void;
export declare function isReasoningSummaryOverflowing({ clientWidth, scrollWidth, }: Pick<HTMLElement, "clientWidth" | "scrollWidth">): boolean;
export declare function resolveReasoningStreamingSummary(streamingText: string): {
    key: string;
    text: string;
} | null;
export declare function getReasoningSummaryMaskStyle(isOverflowing: boolean): CSSProperties | undefined;
export declare const ReasoningTrigger: import("react").MemoExoticComponent<({ className, children, getThinkingMessage, streamingText, ...props }: ReasoningTriggerProps) => import("react/jsx-runtime").JSX.Element>;
export type ReasoningContentProps = ComponentProps<typeof CollapsibleContent> & {
    children: string;
    variant?: "default" | "nested";
};
export declare const ReasoningContent: import("react").MemoExoticComponent<({ className, children, forceMount, variant, ...props }: ReasoningContentProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=reasoning.d.ts.map