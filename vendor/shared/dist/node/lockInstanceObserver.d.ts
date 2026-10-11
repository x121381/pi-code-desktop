import type { Stats } from "node:fs";
export type ObserveLockInstance = (lockPath: string, lockStat: Stats, observedAt: number) => number;
export declare function createLockInstanceObserver(): ObserveLockInstance;
//# sourceMappingURL=lockInstanceObserver.d.ts.map