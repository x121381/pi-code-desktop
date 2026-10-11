import type { TrajectoryVisualRole } from "@/ModelTrajectoryRoleStyles.js";
export interface TrajectoryExpansionCommand {
    expanded: boolean;
    version: number;
}
export type TrajectoryExpansionCommands = Record<TrajectoryVisualRole, TrajectoryExpansionCommand>;
export declare const TRAJECTORY_EXPANSION_KINDS: readonly TrajectoryVisualRole[];
export declare function createTrajectoryExpansionCommands(): TrajectoryExpansionCommands;
export declare const TrajectoryExpansionCommandContext: import("react").Context<TrajectoryExpansionCommands | null>;
export interface TrajectoryExpansionOverride {
    open: boolean;
    commandVersion: number;
}
export interface TrajectoryExpansionRegistry {
    overrides: ReadonlyMap<string, TrajectoryExpansionOverride>;
    setOverride: (key: string, override: TrajectoryExpansionOverride) => void;
}
export declare const TrajectoryExpansionRegistryContext: import("react").Context<TrajectoryExpansionRegistry | null>;
//# sourceMappingURL=ModelTrajectoryExpansion.d.ts.map