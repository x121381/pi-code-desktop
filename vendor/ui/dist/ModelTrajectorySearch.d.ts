import type { ZCodeModelTrajectoryMessage, ZCodeModelTrajectoryRecord } from "@zcode/services";
export type TrajectorySearchField = "content" | "tool-name" | "tool-id";
export interface TrajectorySearchMatch {
    key: string;
    callKey: string;
    callIndex: number;
    expansionKey: string;
    field: TrajectorySearchField;
    fieldMatchIndex: number;
    sourceStart: number;
    sourceEnd: number;
    sourceText: string;
}
export interface TrajectorySearchIndex {
    query: string;
    matches: TrajectorySearchMatch[];
}
export interface TrajectorySearchTimelineItem {
    key: string;
    record: ZCodeModelTrajectoryRecord;
    inputMessages: ZCodeModelTrajectoryMessage[];
}
export declare const TrajectorySearchRevealContext: import("react").Context<string | null>;
export declare function buildTrajectorySearchIndex(items: readonly TrajectorySearchTimelineItem[], query: string): TrajectorySearchIndex;
export declare function findTrajectoryTextMatches(source: string, normalizedQuery: string): Array<{
    sourceStart: number;
    sourceEnd: number;
}>;
export declare function normalizeTrajectorySearchText(source: string): {
    text: string;
    starts: number[];
    ends: number[];
};
//# sourceMappingURL=ModelTrajectorySearch.d.ts.map