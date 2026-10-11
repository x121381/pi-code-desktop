/** 技能定义文件名。 */
export declare const SKILL_FILE_NAME = "SKILL.md";
/**
 * 递归扫描技能目录时直接跳过的子目录名。
 *
 * 只跳过 `.` 开头目录是不够的：
 * `node_modules` 等内容目录会被整棵递归吃进去，在 Windows 上把单次
 * `skills.list` 放大到 69–256s。这些目录里不会存放用户技能，统一排除。
 */
export declare const SKILL_SCAN_EXCLUDED_DIRECTORY_NAMES: ReadonlySet<string>;
/**
 * 递归扫描的最大深度（相对扫描根，根自身为 0）。
 *
 * 真实技能布局很浅：`root/<name>/SKILL.md`，分组场景至多
 * `root/<group>/<name>/SKILL.md`。给到 8 层留足冗余，同时作为
 * symlink/junction 形成的超深目录链的兜底刹车。
 */
export declare const MAX_SKILL_SCAN_DEPTH = 8;
/** 判断递归扫描是否应进入某个子目录项。 */
export declare function shouldWalkSkillDirectoryEntry(entryName: string): boolean;
//# sourceMappingURL=skill-scan-policy.d.ts.map