import type { DatabaseSync } from "node:sqlite";
export declare function markTasksStorageMigrated(path: string): void;
export declare function markTasksStoragePrepared(path: string): void;
export declare function isTasksStorageMigrated(path: string, db: DatabaseSync): boolean;
export declare function isTasksStoragePrepared(path: string, db: DatabaseSync): boolean;
//# sourceMappingURL=prepared.d.ts.map