import type { ZCodeModelTrajectoryMessage, ZCodeModelTrajectoryRecord } from "@zcode/services";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
export { EmptyState, summarizeRecords } from "@/ModelTrajectoryPaneDetails.js";
export type IntlShape = ReturnType<typeof useZCodeIntl>["intl"];
export declare function CallCard({ record, index, inputMessages, expansionKeyPrefix, intl, }: {
    record: ZCodeModelTrajectoryRecord;
    index: number;
    inputMessages: ZCodeModelTrajectoryMessage[];
    expansionKeyPrefix?: string;
    intl: IntlShape;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModelTrajectoryPaneParts.d.ts.map