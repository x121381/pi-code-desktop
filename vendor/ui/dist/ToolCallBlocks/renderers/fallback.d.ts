import { type ReactNode } from "react";
import type { ToolCallBlockRenderContext } from "../shared.js";
interface FallbackToolCallBlockProps extends ToolCallBlockRenderContext {
    iconOverride?: ReactNode;
    hideRawFallback?: boolean;
    summaryOnly?: boolean;
    summaryTextOverride?: ReactNode;
}
export declare function FallbackToolCallBlock(context: FallbackToolCallBlockProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=fallback.d.ts.map