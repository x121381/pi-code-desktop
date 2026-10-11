import type { ZCodeProvider } from "@zcode/shared";
type SkillSourceType = "glm" | "unknown";
export declare function resolveSkillSourceType(skillPath: string): SkillSourceType;
export declare function filterSkillsForProvider<T extends {
    path: string;
    id?: string;
    scope?: string;
}>(skills: T[], _legacyProvider: ZCodeProvider): T[];
export {};
//# sourceMappingURL=skillSourceFilter.d.ts.map