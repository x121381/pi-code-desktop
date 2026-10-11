import { areTasksDatabaseMigrationsApplied } from "#src/session/tasksDatabase/migrations.js";
// 仅当前进程的启动交接凭据；不落盘、不代替 SQLite 账本，不影响不同路径的新库。
const migrated = new Set();
const prepared = new Set();
export function markTasksStorageMigrated(path) {
    migrated.add(path);
}
export function markTasksStoragePrepared(path) {
    migrated.add(path);
    prepared.add(path);
}
export function isTasksStorageMigrated(path, db) {
    return migrated.has(path) && areTasksDatabaseMigrationsApplied(db);
}
export function isTasksStoragePrepared(path, db) {
    return prepared.has(path) && areTasksDatabaseMigrationsApplied(db);
}
//# sourceMappingURL=prepared.js.map