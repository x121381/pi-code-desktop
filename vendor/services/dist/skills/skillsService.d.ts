import type { ZCodeProvider, SkillDiagnostic, SkillSummary } from "@zcode/shared";
import type { ISkillsService } from "./skills.js";
interface DiscoverResult {
    skills: SkillSummary[];
    diagnostics: SkillDiagnostic[];
}
interface ParsedFrontmatter {
    hasFrontmatter: boolean;
    name: string;
    description: string;
    body: string;
    /** frontmatter 中出现过的顶层 key，保留给后续能力判断，不再作为 warning 暴露。 */
    keys: string[];
    /** 严格 YAML 解析是否成功；失败时仍可能有 looseFields。 */
    parseOk: boolean;
}
interface SkillsServiceOptions {
    isDesktopRuntime?: boolean;
}
declare function readFrontmatter(content: string): ParsedFrontmatter;
declare function discoverSkills(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    includeUserSkills: boolean;
    provider: ZCodeProvider;
}): Promise<DiscoverResult>;
export declare function createSkillsService(options?: SkillsServiceOptions): ISkillsService;
export declare const __INTERNAL__: {
    discoverSkills: typeof discoverSkills;
    readFrontmatter: typeof readFrontmatter;
    MAX_DESCRIPTION_LENGTH: number;
};
export {};
//# sourceMappingURL=skillsService.d.ts.map