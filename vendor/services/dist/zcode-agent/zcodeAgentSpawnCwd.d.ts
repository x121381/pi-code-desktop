/** 只选择执行目录，不捕获数据库错误；无可用备用目录时保留原路径供正常启动报错。 */
export declare function resolveZCodeAgentSpawnCwd(options: {
    requestedCwd: string;
    workspacePath: string;
    spawnFallbackCwd?: string;
}, probe?: (path: string) => Promise<{
    isDirectory(): boolean;
}>): Promise<{
    cwd: string;
    usedFallback: boolean;
    cwdExists: boolean;
}>;
//# sourceMappingURL=zcodeAgentSpawnCwd.d.ts.map