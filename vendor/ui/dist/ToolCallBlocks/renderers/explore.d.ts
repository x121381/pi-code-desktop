import type { ToolCallBlockRenderContext } from "../shared.js";
import { type ReactNode } from "react";
import type { TaskChatToolCallTreeNode } from "@/lib/toolCallTree.js";
type IntlLike = {
    formatMessage: (descriptor: {
        id: string;
    }, values?: Record<string, string>) => string;
};
export type ExploreChildSummary = {
    animationKey: string;
    primaryText: ReactNode;
    secondaryText?: ReactNode;
    title?: string;
};
export declare function getLatestExploreChildSummaryFromChildren(intl: IntlLike, childToolCalls: readonly TaskChatToolCallTreeNode[], context: ToolCallBlockRenderContext, options?: {
    includeChildActionKindLabel?: boolean;
}): ExploreChildSummary | null;
export declare function ExploreToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=explore.d.ts.map