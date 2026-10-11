import type { IntlShape } from "@/ModelTrajectoryPaneParts.js";
export declare function ModelTrajectorySearchBar({ query, activeIndex, matchCount, onQueryChange, onMove, onClose, intl, }: {
    query: string;
    activeIndex: number;
    matchCount: number;
    onQueryChange: (query: string) => void;
    onMove: (direction: "previous" | "next") => void;
    onClose: () => void;
    intl: IntlShape;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModelTrajectorySearchBar.d.ts.map