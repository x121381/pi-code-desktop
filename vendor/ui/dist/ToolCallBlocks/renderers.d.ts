import type { EditKindSource, EditKindLabelId, EditOperationKind, RawToolCallFileSummary } from "@/ToolCallBlocks/fileSummaryTypes.js";
export declare function renderDiffCount(changeStat?: {
    added: number;
    removed: number;
}, options?: {
    animateInitial?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function renderFileChip({ summary, clickable, onClick, title, basePath, }: {
    summary: RawToolCallFileSummary;
    clickable?: boolean;
    onClick?: () => void;
    title?: string;
    basePath?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function renderFilePath(path: string | null | undefined, basePath?: string): import("react/jsx-runtime").JSX.Element | null;
export declare function getEditKindLabelMessageId(operationKinds: EditOperationKind[], actionLabels: Array<RawToolCallFileSummary["actionLabel"]>, isRunning: boolean, source?: EditKindSource): EditKindLabelId;
export declare function renderJoinedFileChips(summaries: RawToolCallFileSummary[], options?: {
    clickable?: boolean;
    onClick?: (summary: RawToolCallFileSummary) => void;
    basePath?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=renderers.d.ts.map