import type { ForceUpdateConfig } from "./coding-plan-subscription.js";
export interface ForceUpdateRequirement {
    currentVersion: string;
    minimalVersion: string;
}
export declare function compareSemverVersions(leftVersion: string, rightVersion: string): number | null;
export declare function resolveForceUpdateRequirement(params: {
    currentVersion: string;
    forceUpdate?: ForceUpdateConfig | null;
}): ForceUpdateRequirement | null;
//# sourceMappingURL=forceUpdate.d.ts.map