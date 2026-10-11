import type { ZCodeModelTrajectoryMessage } from "@zcode/services";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { type TrajectoryVisualRole } from "@/ModelTrajectoryRoleStyles.js";
type IntlShape = ReturnType<typeof useZCodeIntl>["intl"];
export declare function ExpandableTrajectoryMessage({ message, role, visualRole, roleLabel, callDurationLabel, callDatetimeLabel, callDatetimeTitle, isAlt, intl, expansionKey, }: {
    message: ZCodeModelTrajectoryMessage;
    role: "system" | "user" | "assistant" | "tool";
    visualRole?: TrajectoryVisualRole;
    roleLabel: string;
    callDurationLabel: string;
    callDatetimeLabel: string;
    callDatetimeTitle: string;
    isAlt?: boolean;
    intl: IntlShape;
    expansionKey?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ModelTrajectoryExpandableMessage.d.ts.map