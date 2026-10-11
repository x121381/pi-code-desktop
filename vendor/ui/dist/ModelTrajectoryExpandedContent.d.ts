import type { ZCodeModelTrajectoryMessage } from "@zcode/services";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
type IntlShape = ReturnType<typeof useZCodeIntl>["intl"];
export declare function TrajectoryExpandedContent({ message, role, open, searchRevealed, intl, }: {
    message: ZCodeModelTrajectoryMessage;
    role: "system" | "user" | "assistant" | "tool";
    open: boolean;
    searchRevealed: boolean;
    intl: IntlShape;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ModelTrajectoryExpandedContent.d.ts.map