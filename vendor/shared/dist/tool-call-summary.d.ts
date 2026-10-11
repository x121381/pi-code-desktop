export type CompactToolCallState = "input-available" | "input-streaming" | "output-available" | "output-denied" | "output-error";
export interface ToolCallSummarySource {
    title?: string;
    kind: string;
    input: unknown;
    output?: unknown;
    raw?: unknown;
}
export interface ToolCallChangeStat {
    added: number;
    removed: number;
}
export interface ToolCallSummary {
    primaryText: string;
    secondaryText?: string;
    changeStat?: ToolCallChangeStat;
}
export declare function isCompactToolCallRunningState(state: string): state is CompactToolCallState;
export declare function isCompactToolCallFinishedState(state: string): state is CompactToolCallState;
export declare function getCompactToolCallStatusMessageId(state: string, rawStatus?: string): string;
export declare function getCompactToolCallSummary({ title, kind, input, output, raw, }: ToolCallSummarySource): ToolCallSummary;
//# sourceMappingURL=tool-call-summary.d.ts.map