import { type TrajectorySearchMatch } from "@/ModelTrajectorySearch.js";
export declare function applyTrajectorySearchHighlights({ root, query, matches, activeMatch, }: {
    root: HTMLElement;
    query: string;
    matches: readonly TrajectorySearchMatch[];
    activeMatch: TrajectorySearchMatch | null;
}): Range | null;
export declare function clearTrajectorySearchHighlights(): void;
export declare function isTrajectorySearchTargetMounted(root: HTMLElement, expansionKey: string): boolean;
export declare function scrollTrajectorySearchRangeIntoView(range: Range, scrollContainer: HTMLElement): boolean;
//# sourceMappingURL=ModelTrajectorySearchHighlight.d.ts.map