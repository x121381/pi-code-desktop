import type { ProviderFamilyDomain } from "@zcode/shared";
export interface LegacyTeamConnection {
    readonly family: ProviderFamilyDomain;
    readonly productId: string;
    readonly projectId: string;
}
/** 仅迁移器解释旧键；组织信息由 Host 的只读 OAuth 查询注入。退役旧版后删除。 */
export declare function readIncompleteLegacyTeamConnections(value: unknown): LegacyTeamConnection[];
export declare function readLegacyAccountConnectionSettingsFile(filePath: string): Promise<Record<string, unknown>>;
export declare function needsLegacyAccountConnectionMigration(value: unknown): boolean;
/** 仅在 settings 文件读取边界导入旧连接；运行时代码不能再解释旧导航 key。 */
export declare function migrateLegacyAccountConnectionSettings(value: unknown): unknown;
/** 旧字段仅供回滚保留，禁止暴露回 AppSettings 或参与当前运行判断；退役旧版后删除。 */
export declare function retainLegacyAccountConnectionFields(value: unknown): Record<string, unknown>;
//# sourceMappingURL=legacyAccountConnectionSettings.d.ts.map