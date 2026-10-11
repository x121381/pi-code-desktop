import { createContext } from "react";
export const TRAJECTORY_EXPANSION_KINDS = [
    "system",
    "user",
    "reasoning",
    "assistant",
    "tool-call",
    "tool-result",
];
export function createTrajectoryExpansionCommands() {
    return Object.fromEntries(TRAJECTORY_EXPANSION_KINDS.map((kind) => [kind, { expanded: true, version: 0 }]));
}
export const TrajectoryExpansionCommandContext = createContext(null);
export const TrajectoryExpansionRegistryContext = createContext(null);
//# sourceMappingURL=ModelTrajectoryExpansion.js.map