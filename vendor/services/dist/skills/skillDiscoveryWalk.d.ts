export { MAX_SKILL_SCAN_DEPTH, SKILL_FILE_NAME, SKILL_SCAN_EXCLUDED_DIRECTORY_NAMES, shouldWalkSkillDirectoryEntry, } from "@zcode/shared";
export interface WalkSkillMarkdownOptions {
    /** readdir / stat 失败时回调；不传则静默跳过该目录，调用方按需收集诊断。 */
    onError?: (path: string, error: unknown) => void;
}
/**
 * 自根目录起深度优先遍历，产出每个 SKILL.md 的绝对路径。
 *
 * 受 @zcode/shared 的扫描策略约束：
 * - 跳过 node_modules 等内容目录与（除 .system 外的）点目录；
 * - 限制最大深度（MAX_SKILL_SCAN_DEPTH），作为超深目录链的兜底刹车；
 * - 仅对软链接目录按 realpath 去重，避免 Windows junction / 环路造成重复或无限扫描，
 *   普通目录树不会成环，故热路径上不额外 realpath。
 *
 */
export declare function walkSkillMarkdownPaths(rootPath: string, options?: WalkSkillMarkdownOptions): AsyncGenerator<string>;
//# sourceMappingURL=skillDiscoveryWalk.d.ts.map