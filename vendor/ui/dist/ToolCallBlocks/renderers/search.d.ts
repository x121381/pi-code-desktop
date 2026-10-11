import type { ToolCallBlockRenderContext } from "../shared.js";
type IntlLike = {
    formatMessage: (descriptor: {
        id: string;
    }, values?: Record<string, string>) => string;
};
export declare function getSearchPrimaryText(intl: IntlLike, input: unknown): string;
export declare function SearchToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=search.d.ts.map