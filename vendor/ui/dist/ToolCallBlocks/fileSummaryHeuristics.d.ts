import { type EditKindSource, type EditOperationKind, type RawToolCallFileSummary } from "@/ToolCallBlocks/fileSummaryTypes.js";
export type { EditKindSource } from "@/ToolCallBlocks/fileSummaryTypes.js";
export declare function hasWritableToolSemantic(source?: EditKindSource): boolean;
export declare function buildFallbackRawToolCallFileSummary(source?: EditKindSource): RawToolCallFileSummary[];
export declare function inferEditOperation(operationKinds: EditOperationKind[], actionLabels: Array<RawToolCallFileSummary["actionLabel"]>, source?: EditKindSource): EditOperationKind | null;
//# sourceMappingURL=fileSummaryHeuristics.d.ts.map