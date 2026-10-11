/**
 * OAuth 领域类型定义
 *
 * 说明：敏感信息（如 appSecret）以及 provider 默认端点配置
 * 只允许放在 services 的 provider 模块中，不能放 shared 层。
 */
/** 内置 BigModel provider id */
export const BIGMODEL_PROVIDER_ID = "bigmodel";
/** 内置 ZAI provider id */
export const ZAI_PROVIDER_ID = "zai";
/** 凭据解密失败错误前缀 */
export const CREDENTIAL_DECRYPT_ERROR_PREFIX = "凭据解密失败：";
/** 凭据解密失败稳定错误码 */
export const CREDENTIAL_DECRYPT_ERROR_CODE = "ZCODE_CREDENTIAL_DECRYPT_FAILED";
/** 判断错误是否来自本地凭据解密失败 */
export function isCredentialDecryptError(error) {
    const code = readCredentialErrorCode(error);
    if (code) {
        return code === CREDENTIAL_DECRYPT_ERROR_CODE;
    }
    // 兼容历史错误和跨边界丢失 code 的旧 payload；新错误应优先携带稳定 code。
    if (readCredentialErrorMessage(error).startsWith(CREDENTIAL_DECRYPT_ERROR_PREFIX)) {
        return true;
    }
    return false;
}
function readCredentialErrorCode(error) {
    if (typeof error === "object" && error !== null && "code" in error) {
        return String(error.code ?? "");
    }
    return "";
}
function readCredentialErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "object" && error !== null && "message" in error) {
        return String(error.message ?? "");
    }
    return "";
}
/** Host 在检测到 ZCode JWT 失效后通知 Renderer 展示确认并重启。 */
export const ZCODE_JWT_INVALID_BROADCAST_CHANNEL = "auth:zcode-jwt-invalid";
/**
 * 只解析 JWT 的 exp 来判断本地生命周期，不承担签名校验。
 * 无法证明已过期的历史或非标准 token 保持兼容，最终有效性仍由服务端决定。
 */
export function resolveJwtExpiration(token, now = Date.now(), clockSkewMs = 30_000) {
    try {
        const payloadSegment = token.split(".")[1];
        if (!payloadSegment) {
            return { kind: "unknown" };
        }
        const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
        const decoded = globalThis.atob(padded);
        const bytes = Uint8Array.from(decoded, (character) => character.charCodeAt(0));
        const payload = JSON.parse(new TextDecoder().decode(bytes));
        if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp <= 0) {
            return { kind: "unknown" };
        }
        const expiresAt = payload.exp * 1_000;
        return now + Math.max(0, clockSkewMs) >= expiresAt
            ? { kind: "expired", expiresAt }
            : { kind: "valid", expiresAt };
    }
    catch {
        return { kind: "unknown" };
    }
}
//# sourceMappingURL=oauth.js.map