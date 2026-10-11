import type { ZCodeModelTrajectoryContentPart, ZCodeModelTrajectoryRecord, ZCodeModelTrajectoryUsage } from "@zcode/services";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
type IntlShape = ReturnType<typeof useZCodeIntl>["intl"];
export declare function ContentPartView({ part, intl, sectionLabel, showToolHeader, }: {
    part: ZCodeModelTrajectoryContentPart;
    intl: IntlShape;
    sectionLabel?: string;
    showToolHeader?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function UsageBadges({ usage, intl, }: {
    usage?: ZCodeModelTrajectoryUsage;
    intl: IntlShape;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function EmptyState({ text, detail, tone, }: {
    text: string;
    detail?: string;
    tone?: "error";
}): import("react/jsx-runtime").JSX.Element;
export declare function summarizeRecords(records: ZCodeModelTrajectoryRecord[]): {
    totalTokens: number;
    models: string[];
};
export {};
//# sourceMappingURL=ModelTrajectoryPaneDetails.d.ts.map