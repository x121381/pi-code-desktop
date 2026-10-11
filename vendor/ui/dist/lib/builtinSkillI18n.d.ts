import type { Locale, SkillScope } from "@zcode/shared";
interface SkillDisplayCandidate {
    name: string;
    description: string;
    path: string;
    scope: SkillScope;
    pluginName?: string;
}
export declare function resolveSkillSourceLabel(scope: SkillScope, locale?: Locale): string;
export declare function resolveSkillDisplayDescription(skill: SkillDisplayCandidate, locale?: Locale): string;
export {};
//# sourceMappingURL=builtinSkillI18n.d.ts.map