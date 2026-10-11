import type { DatabaseMigrationFacts } from "@zcode/shared";
export type TasksStoragePhase = "checking" | "waiting_for_lock" | "migrating" | "maintaining" | "committing" | "ready";
/** 由 Host Worker 调用，SQL 和迁移后修复与旧 Repo 共用，只有获取写锁异步等待。 */
export declare function prepareTasksIndexStorage(path: string, onProgress: (phase: TasksStoragePhase, migration?: DatabaseMigrationFacts) => void): Promise<void>;
//# sourceMappingURL=startup.d.ts.map