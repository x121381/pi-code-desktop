import { type RefObject } from "react";
import type { ZCodeModelTrajectoryRecord } from "@zcode/services";
import { type TrajectorySearchMatch, type TrajectorySearchTimelineItem } from "@/ModelTrajectorySearch.js";
import { type IntlShape } from "@/ModelTrajectoryPaneParts.js";
export declare function ModelTrajectoryTimeline({ items, searchQuery, searchMatches, activeSearchMatch, intl, scrollContainerRef, }: {
    items: TrajectorySearchTimelineItem[];
    searchQuery: string;
    searchMatches: TrajectorySearchMatch[];
    activeSearchMatch: TrajectorySearchMatch | null;
    intl: IntlShape;
    scrollContainerRef: RefObject<HTMLDivElement | null>;
}): import("react/jsx-runtime").JSX.Element;
export declare function resolveTrajectoryTimelineItems(records: ZCodeModelTrajectoryRecord[]): {
    key: string;
    record: ZCodeModelTrajectoryRecord;
    inputMessages: import("@zcode/services").ZCodeModelTrajectoryMessage[];
}[];
export declare function resolveTrajectoryInputMessages({ record, index, previousConversationMessageCount, }: {
    record: ZCodeModelTrajectoryRecord;
    index: number;
    previousConversationMessageCount: number;
}): {
    inputMessages: ZCodeModelTrajectoryRecord["request"]["messages"];
    nextConversationMessageCount: number;
};
//# sourceMappingURL=ModelTrajectoryTimeline.d.ts.map