/** `.mcp.json` 中 `auth.type` 的唯一合法值；区分大小写，不接受别名。 */
export declare const ZCODE_OFFICIAL_MCP_AUTH_TYPE: "zcode_official";
/** 第一阶段唯一合法的 provider。后续新增短期 Token 应新增 provider 值，不改变本值语义。 */
export declare const ZCODE_OFFICIAL_MCP_AUTH_PROVIDER_JWT_TOKEN: "jwt_token";
/**
 * 官方 MCP 使用用户身份和套餐身份两组独立凭据。
 * codingPlanAuthorization 必须携带 MaaS 登录 JWT；不能用 Coding Plan 业务 API key
 * 代替。服务端按 JWT 中的 customer_id 校验它与当前用户的关联。
 */
export declare const OFFICIAL_MCP_AUTH_HEADER_NAMES: {
    readonly authorization: "Authorization";
    readonly codingPlanAuthorization: "X-Bigmodel-Authorization";
    readonly targetType: "Bigmodel-Target-Type";
    readonly organization: "Bigmodel-Organization";
    readonly project: "Bigmodel-Project";
};
/**
 * stdio 官方 MCP 的身份头在所有出站请求与通知的 `params._meta` 上使用的键。
 *
 * 这是与插件进程之间的**跨语言协议常量**——Plugin 侧（如插件的 Python server）
 * 按同一字符串读取。改名即破坏所有已发布插件，等同于协议 breaking change。
 * 命名空间前缀沿用 `com.zcode/`，与既有的 `com.zcode/request-context` 一致。
 */
export declare const OFFICIAL_MCP_AUTH_META_KEY: "com.zcode/official-mcp-auth";
/**
 * 静态 Plugin `headers` 中禁止出现的保留头（小写，比较时大小写不敏感）。
 *
 * 身份头部分：避免 Plugin 静态配置伪造或覆盖凭证。
 * 协议头部分（mcp-session-id / mcp-protocol-version）：SDK 组装请求头时
 * `requestInit.headers` 优先级高于协议头，静态配置能覆盖 session id，故一并禁止。
 *
 * `x-coding-plan-api-key` 已不再由客户端发送（已切到 MaaS JWT 通道），但**必须继续留在
 * 黑名单里**：服务端那条通道仍然有效（`credential := cmp.Or(Authorization, APIKey)`），
 * 放开就等于允许 Plugin 用静态 header 自带一份 Coding Plan 凭证冒用官方端点。
 * 这里显式列出而不是从头名表推导，正是因为表里已经没有它了。
 */
export declare const OFFICIAL_MCP_RESERVED_HEADER_NAMES: readonly string[];
/** 大小写不敏感地判断是否为保留头。 */
export declare function isOfficialMcpReservedHeaderName(name: string): boolean;
/** 返回静态 header 记录中命中的保留头（小写，去重且稳定排序），无命中时为空数组。 */
export declare function findOfficialMcpReservedHeaders(headers: Record<string, string> | undefined): string[];
/** 服务端 `Bigmodel-Target-Type` 的取值（对齐 zcode-server 的 CodingPlanTargetType）。 */
export type OfficialMcpTargetType = "PERSONAL" | "TEAM";
/**
 * 端口/协议层的失败分类（"不发任何请求"的两类）。
 * 网络层失败（401/403/3xx）由 MCP adapter 在收到响应后自行分类，不经过该枚举。
 */
export declare const OFFICIAL_MCP_AUTH_FAILURE_REASONS: readonly ["official_auth_unavailable", "official_auth_plan_required"];
export type OfficialMcpAuthFailureReason = (typeof OFFICIAL_MCP_AUTH_FAILURE_REASONS)[number];
export declare const OFFICIAL_MCP_AUTH_PORT_FAILURE_REASONS: readonly ["official_auth_unavailable", "official_auth_plan_required", "official_mcp_origin_untrusted"];
export type OfficialMcpAuthPortFailureReason = (typeof OFFICIAL_MCP_AUTH_PORT_FAILURE_REASONS)[number];
/** MCP adapter 侧的完整失败分类，包含网络层结果。仅用于 record status 与日志。 */
export type OfficialMcpAuthFailureKind = OfficialMcpAuthFailureReason | "official_mcp_origin_untrusted" | "official_auth_rejected" | "official_auth_forbidden" | "official_auth_redirect_blocked";
export declare const OFFICIAL_MCP_DEV_TRUSTED_ORIGINS_ENV = "ZCODE_OFFICIAL_MCP_DEV_TRUSTED_ORIGINS";
/** Host 在 spawn 时注入的真实 workspace identity；只用于隔离/审计，不用于文件执行。 */
export declare const ZCODE_WORKSPACE_IDENTITY_ENV = "ZCODE_WORKSPACE_IDENTITY";
/** 身份头的安全日志摘要：只含 header 名、Team 成对性与 TargetType，不含任何值。 */
export declare function summarizeOfficialMcpIdentityHeaders(headers: Record<string, string>): Record<string, unknown>;
export interface OfficialMcpTrustResult {
    trusted: boolean;
    /** 拒绝时的可读原因，仅用于日志，不用于流程分流。 */
    detail: "ok" | "invalid_input" | "origin_mismatch" | "zcode_origin_unresolved";
}
export interface IsOfficialMcpOriginTrustedInput {
    /** 本地自测开关的原始值（通常来自 env），只放开 http loopback。 */
    devTrustedOriginsRaw?: string | undefined;
    origin: string;
    /**
     * 声明该 MCP 的插件 id。**不参与信任判定**，仅用于日志与凭证解析的
     * 归属标识。保留在入参里是为了让日志能回答"是哪个插件在要凭证"。
     */
    pluginId: string;
    /** 当前 ZCode API origin，由调用方按各自口径解析后传入。 */
    zcodeApiOrigin: string | undefined;
}
/**
 * 校验官方 MCP 的凭据目标：要求 HTTPS origin 与运行时 ZCode API origin 相等，
 * 且 URL 不携带 username/password。开发配置只允许显式列出的 HTTP loopback origin。
 *
 * pluginId 用于归属和日志，不是授权过滤条件；任何已加载插件都可以请求官方鉴权。
 * 目的地校验不能替代逐接口的用户权限、套餐和配额校验，也不提供逐插件授权确认。
 * 使用 stdio 鉴权的插件会持有凭据，应按受信任的可执行代码管理。
 */
export declare function isOfficialMcpOriginTrusted(input: IsOfficialMcpOriginTrustedInput): OfficialMcpTrustResult;
/**
 * 信任判定器。保持 `isTrusted` 这一 DI 形状不变，便于 adapter 与 host 共用同一实现。
 * 异步是为了让 host 能按 settings 覆盖解析 origin（与闲时任务同口径），避免出现
 * "闲时任务能连、官方 MCP 连不上"的割裂。
 */
export interface OfficialMcpTrustedOriginRegistry {
    isTrusted(input: {
        mcpKey: string;
        origin: string;
        pluginId: string;
    }): Promise<OfficialMcpTrustResult>;
}
export interface CreateOfficialMcpTrustedOriginRegistryOptions {
    /** 本地自测开关原始值（逗号分隔的 loopback origin），通常来自 env。 */
    devTrustedOriginsRaw?: string | undefined;
    /** 当前 ZCode API origin 的解析器；两侧必须用等价口径，否则会一侧放行一侧拒绝。 */
    resolveZCodeApiOrigin: () => string | undefined | Promise<string | undefined>;
}
export declare function createOfficialMcpTrustedOriginRegistry(options: CreateOfficialMcpTrustedOriginRegistryOptions): OfficialMcpTrustedOriginRegistry;
//# sourceMappingURL=official-mcp-auth.d.ts.map