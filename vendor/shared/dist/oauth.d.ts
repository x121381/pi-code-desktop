/**
 * OAuth 领域类型定义
 *
 * 说明：敏感信息（如 appSecret）以及 provider 默认端点配置
 * 只允许放在 services 的 provider 模块中，不能放 shared 层。
 */
/** 内置 BigModel provider id */
export declare const BIGMODEL_PROVIDER_ID: "bigmodel";
/** 内置 ZAI provider id */
export declare const ZAI_PROVIDER_ID: "zai";
/** 凭据解密失败错误前缀 */
export declare const CREDENTIAL_DECRYPT_ERROR_PREFIX: "\u51ED\u636E\u89E3\u5BC6\u5931\u8D25\uFF1A";
/** 凭据解密失败稳定错误码 */
export declare const CREDENTIAL_DECRYPT_ERROR_CODE: "ZCODE_CREDENTIAL_DECRYPT_FAILED";
/** 判断错误是否来自本地凭据解密失败 */
export declare function isCredentialDecryptError(error: unknown): boolean;
/** OAuth provider 标识 */
export type OAuthProviderId = typeof BIGMODEL_PROVIDER_ID | typeof ZAI_PROVIDER_ID | (string & {
    readonly __oauthProviderBrand?: never;
});
/** Provider 展示元信息 */
export interface OAuthProviderMeta {
    id: OAuthProviderId;
    displayName: string;
    enabled: boolean;
    order: number;
}
/** 发起 OAuth 请求 */
export interface OAuthStartRequest {
    provider: OAuthProviderId;
}
/** 发起 OAuth 返回 */
export interface OAuthStartResponse {
    provider: OAuthProviderId;
    authorizeUrl: string;
    state: string;
}
/** 应用登录回调结果 */
export interface OAuthSessionCallbackResult {
    kind: "session";
    provider: OAuthProviderId;
    userInfo: {
        id: string;
        username: string;
        displayName: string;
        avatarUrl?: string;
    };
}
/** 只携带归因参数的 OAuth deep link 回调结果 */
export interface OAuthAttributionCallbackResult {
    kind: "attribution";
    provider: OAuthProviderId;
    attribution: OAuthLoginAttribution;
}
/** 同一登录已由 polling 完成后迟到的 deep link；调用方只需忽略。 */
export interface OAuthDuplicateCallbackResult {
    kind: "duplicate";
    provider: OAuthProviderId;
}
/** OAuth 回调归一化结果 */
export type OAuthCallbackResult = OAuthSessionCallbackResult | OAuthAttributionCallbackResult | OAuthDuplicateCallbackResult;
/** Main 进程路由 deep link 时使用的 state 上报结构 */
export interface OAuthStateRegistration {
    state: string;
    provider?: OAuthProviderId;
}
/** 归一化后的回调参数 */
export interface OAuthCallbackParams {
    state: string;
    code: string;
    attribution?: OAuthLoginAttribution;
}
/** OAuth 登录归因参数：来自官网中转页或投放链接 */
export interface OAuthLoginAttribution {
    channel_id?: string;
    utm_source?: string;
    utm_campaign?: string;
}
/** 归一化 token 结构 */
export interface OAuthTokenSet {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    zcodeJwtToken?: string;
}
export interface UserInfo {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
}
export type OAuthCachedSessionRestoreResult = {
    status: "authenticated";
    userInfo: UserInfo;
} | {
    status: "signed-out";
} | {
    status: "reauthentication-required";
    reason: "jwt-expired";
};
/** Host 在检测到 ZCode JWT 失效后通知 Renderer 展示确认并重启。 */
export declare const ZCODE_JWT_INVALID_BROADCAST_CHANNEL = "auth:zcode-jwt-invalid";
export type JwtExpirationResult = {
    kind: "valid";
    expiresAt: number;
} | {
    kind: "expired";
    expiresAt: number;
} | {
    kind: "unknown";
};
/**
 * 只解析 JWT 的 exp 来判断本地生命周期，不承担签名校验。
 * 无法证明已过期的历史或非标准 token 保持兼容，最终有效性仍由服务端决定。
 */
export declare function resolveJwtExpiration(token: string, now?: number, clockSkewMs?: number): JwtExpirationResult;
/** 归一化用户信息 */
export interface OAuthUserProfile {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    rawProfile?: unknown;
}
/** 登出范围 */
export type OAuthLogoutScope = "active" | "all";
//# sourceMappingURL=oauth.d.ts.map