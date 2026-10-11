import type { SkillSummary } from "@zcode/shared";
import type { CreateTaskOptions } from "@/app-shell/types.js";
export declare const PLUGIN_CREATOR_SKILL = "plugin-creator";
export declare const PLUGIN_CREATOR_ID = "plugin-creator@zcode-plugins-official";
export declare function buildPluginCreatorPrefill(skills: readonly SkillSummary[]): CreateTaskOptions;
export declare function loadPluginCreatorPrefill(loadSkills: () => Promise<{
    skills: SkillSummary[];
}>, isCurrent: () => boolean): Promise<CreateTaskOptions | null>;
//# sourceMappingURL=pluginCreatorPrefill.d.ts.map