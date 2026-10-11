export declare const ZCODE_E2E_FS_FAULTS_ENV = "ZCODE_E2E_FS_FAULTS";
export declare const ZCODE_E2E_FS_FAULTS_ALLOW_ENV = "ZCODE_E2E_FS_FAULTS_ALLOW";
export type FsFaultOperation = "any" | "appendFile" | "createWriteStream" | "mkdir" | "open" | "readFile" | "readdir" | "rename" | "rm" | "sqliteOpen" | "sqliteRun" | "stat" | "writeFile";
export interface FsFaultRuleConfig {
    id: string;
    code: string;
    operations?: readonly FsFaultOperation[];
    pathIncludes?: string;
    pathEndsWith?: string;
    pathRegex?: string;
    maxMatches?: number;
    message?: string;
}
export interface FsFaultCheckInput {
    operation: FsFaultOperation;
    path: string;
}
export interface FsFaultHit {
    id: string;
    code: string;
    operation: FsFaultOperation;
    path: string;
    matchIndex: number;
    matchedAt: string;
}
export interface InjectedFsFaultError extends NodeJS.ErrnoException {
    zcodeFsFaultId: string;
}
export interface FsFaultInjector {
    isEnabled(): boolean;
    maybeThrow(input: FsFaultCheckInput): void;
    getHits(): readonly FsFaultHit[];
    reset(): void;
}
export declare function createInjectedFsFaultError(input: {
    code: string;
    id: string;
    message?: string;
    operation: FsFaultOperation;
    path: string;
}): InjectedFsFaultError;
export declare function isInjectedFsFaultError(error: unknown): error is InjectedFsFaultError;
export declare function createFsFaultInjector(rules?: readonly FsFaultRuleConfig[]): FsFaultInjector;
export declare function parseFsFaultRulesFromEnvValue(rawValue: string): FsFaultRuleConfig[];
export declare function createFsFaultInjectorFromEnv(env?: Record<string, string | undefined>): FsFaultInjector;
export declare function getProcessFsFaultInjector(): FsFaultInjector;
export declare function maybeThrowInjectedFsFault(input: FsFaultCheckInput): void;
export declare function setFsFaultInjectorForTests(injector: FsFaultInjector | null): void;
export declare function resetProcessFsFaultInjectorForTests(): void;
//# sourceMappingURL=fsFaultInjection.d.ts.map