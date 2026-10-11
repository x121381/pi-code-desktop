export interface GitEnvironmentProvider {
    resolveGitBinary(): Promise<string | null>;
    createCommandEnv(): NodeJS.ProcessEnv;
}
export declare function createGitEnvironmentProvider(): GitEnvironmentProvider;
//# sourceMappingURL=gitEnvironmentProvider.d.ts.map