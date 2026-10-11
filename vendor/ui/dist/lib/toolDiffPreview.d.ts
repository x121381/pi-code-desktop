export declare function extractBeforeAfter(value: unknown): {
    before: string;
    after: string;
} | null;
export declare function extractStructuredDiff(value: unknown): {
    path?: string;
    oldText: string;
    newText: string;
} | null;
export declare function buildUnifiedDiff(before: string, after: string, fileLabel: string, options?: {
    contextLines?: number;
}): string | null;
//# sourceMappingURL=toolDiffPreview.d.ts.map