interface TextMatchRange {
    start: number;
    end: number;
}
export declare function findTextMatchRanges(text: string, query: string): TextMatchRange[];
export declare function HighlightedMatchText({ text, query }: {
    text: string;
    query: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=HighlightedMatchText.d.ts.map