import { type DatabaseMigrationFacts } from "@zcode/shared";
import type { DatabaseSync } from "node:sqlite";
export declare function runTasksDatabaseMigrations(db: DatabaseSync, options?: {
    transactionOpen?: boolean;
    migration?: DatabaseMigrationFacts;
    onProgress?: (phase: "migrating" | "committing", migration: DatabaseMigrationFacts) => void;
}): void;
/** 交接只复用已完成初始化；每个新连接仍按冻结账本确认，替换/清空文件不能假 ready。 */
export declare function areTasksDatabaseMigrationsApplied(db: DatabaseSync): boolean;
/** 只读账本的展示预检，不授权执行；迁移 runner 拿锁后仍复查每一项。 */
export declare function inspectTasksMigrationKind(db: DatabaseSync): DatabaseMigrationFacts["kind"];
//# sourceMappingURL=migrations.d.ts.map