export interface ProjectAccessTokenInput {
    readonly rejectedProjectTokenFingerprint?: string;
    readonly origin: string;
    readonly family: "bigmodel" | "zai";
    readonly loginToken: string;
    readonly accountId: string;
    /** 保留各调用端既有项目选择；CLI 默认项目不排除团队类型。 */
    readonly personalProjectSelection?: "non-team" | "default";
    readonly team?: {
        readonly organizationId: string;
        readonly projectId: string;
    };
}
export interface ProjectAccessTokenMaterial {
    readonly token: string;
    readonly apiKeyId: string;
    readonly organizationId: string;
    readonly projectId: string;
}
/** Host/CLI 各自持有实例；网络由已有 adapter 注入，凭据不进入配置或磁盘。 */
export declare class ProjectAccessTokenClient {
    #private;
    private readonly options;
    constructor(options: {
        request(url: string, init: RequestInit): Promise<unknown>;
        observe?(event: {
            family: string;
            stage: "resolve";
            code: string;
        }): void;
        locationStore?: {
            load(key: string): Promise<string | null>;
            save(key: string, value: string): Promise<void>;
            delete(key: string): Promise<void>;
        };
        now?: () => number;
        random?: () => number;
    });
    clear(): void;
    resolve(input: ProjectAccessTokenInput): Promise<ProjectAccessTokenMaterial>;
}
//# sourceMappingURL=project-access-token-client.d.ts.map