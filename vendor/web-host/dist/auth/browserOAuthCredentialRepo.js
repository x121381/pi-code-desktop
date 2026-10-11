import { BIGMODEL_PROVIDER_ID, ZAI_PROVIDER_ID, resolveJwtExpiration, } from "@zcode/shared";
import { toUserInfo } from "./zaiWebOAuthProvider.js";
const ACTIVE_PROVIDER_KEY = "oauth:active_provider";
const ZCODE_JWT_TOKEN_KEY = "zcodejwttoken";
const ZAI_ACCESS_TOKEN_KEY = "oauth:zai:access_token";
const ZAI_USER_INFO_KEY = "oauth:zai:user_info";
const BIGMODEL_ACCESS_TOKEN_KEY = "oauth:bigmodel:access_token";
const BIGMODEL_USER_INFO_KEY = "oauth:bigmodel:user_info";
const OAUTH_PENDING_NONCE_KEY = "oauth_pending_nonce";
const OAUTH_PENDING_PROVIDER_KEY = "oauth_pending_provider";
export function isWebOAuthProviderId(value) {
    return value === ZAI_PROVIDER_ID || value === BIGMODEL_PROVIDER_ID;
}
/**
 * 每个 provider 用独立的 key 段。
 *
 * 刻意不复用一套「中性」key：zai 的两个 key 已经在线上承载着 /remote 的登录态，换 key 会
 * 让所有已登录用户在发版当天掉线。加一段 bigmodel 前缀是零风险的做法，代价只是多一个映射。
 */
function providerKeys(provider) {
    return provider === BIGMODEL_PROVIDER_ID
        ? { accessToken: BIGMODEL_ACCESS_TOKEN_KEY, userInfo: BIGMODEL_USER_INFO_KEY }
        : { accessToken: ZAI_ACCESS_TOKEN_KEY, userInfo: ZAI_USER_INFO_KEY };
}
function getBrowserStorage() {
    return {
        localStorage: window.localStorage,
        sessionStorage: window.sessionStorage,
    };
}
function hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
}
/** 浏览器 OAuth 凭据仓储：统一收敛 localStorage/sessionStorage 读写，避免业务层散落认证状态判断。 */
export class BrowserOAuthCredentialRepo {
    localStorage;
    sessionStorage;
    now;
    constructor(storage = getBrowserStorage(), options = {}) {
        this.localStorage = storage.localStorage;
        this.sessionStorage = storage.sessionStorage;
        this.now = options.now ?? Date.now;
    }
    saveTokenSet(tokenSet, provider) {
        const accessToken = "zaiAccessToken" in tokenSet ? tokenSet.zaiAccessToken : tokenSet.accessToken;
        const zcodeJwtToken = tokenSet.zcodeJwtToken;
        this.localStorage.setItem(providerKeys(provider).accessToken, accessToken);
        if (zcodeJwtToken) {
            this.localStorage.setItem(ZCODE_JWT_TOKEN_KEY, zcodeJwtToken);
        }
        else {
            this.localStorage.removeItem(ZCODE_JWT_TOKEN_KEY);
        }
    }
    saveUserInfo(user, provider) {
        const rawUserInfo = JSON.stringify(user);
        this.localStorage.setItem(providerKeys(provider).userInfo, rawUserInfo);
    }
    setActiveProvider(provider) {
        if (!provider) {
            this.localStorage.removeItem(ACTIVE_PROVIDER_KEY);
            return;
        }
        this.localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
    }
    getActiveProvider() {
        return this.localStorage.getItem(ACTIVE_PROVIDER_KEY);
    }
    loadCachedSession() {
        const result = this.loadCachedSessionState();
        return result.status === "authenticated" ? result.userInfo : null;
    }
    loadCachedSessionState() {
        const activeProvider = this.localStorage.getItem(ACTIVE_PROVIDER_KEY);
        const zcodeJwtToken = this.localStorage.getItem(ZCODE_JWT_TOKEN_KEY);
        // 一次只有一个 activeProvider（切换 provider = 重新登录并覆盖），所以按它选 key 段读。
        const keys = isWebOAuthProviderId(activeProvider) ? providerKeys(activeProvider) : null;
        const accessToken = keys ? this.localStorage.getItem(keys.accessToken) : null;
        const rawUserInfo = keys ? this.localStorage.getItem(keys.userInfo) : null;
        if (!keys || !hasText(zcodeJwtToken) || !hasText(accessToken) || !hasText(rawUserInfo)) {
            if (this.hasAnyStoredCredential()) {
                this.clearAll();
            }
            return { status: "signed-out" };
        }
        if (resolveJwtExpiration(zcodeJwtToken, this.now()).kind === "expired") {
            // Web localStorage 之前只检查 JWT 是否存在，过期后仍会恢复伪登录态。
            this.clearAll();
            return { status: "reauthentication-required", reason: "jwt-expired" };
        }
        try {
            const userInfo = toUserInfo(JSON.parse(rawUserInfo));
            if (userInfo) {
                return { status: "authenticated", userInfo };
            }
        }
        catch {
            // localStorage 可能留下旧版或手工写入的损坏 JSON。
            // 这里按未登录处理并清理残缺态，避免 Web 远控入口误判成已登录后继续连接。
        }
        this.clearAll();
        return { status: "signed-out" };
    }
    loadZCodeJwtToken() {
        const session = this.loadCachedSessionState();
        if (session.status !== "authenticated")
            return null;
        return this.localStorage.getItem(ZCODE_JWT_TOKEN_KEY)?.trim() || null;
    }
    hasAnyStoredCredential() {
        return Boolean(this.localStorage.getItem(ACTIVE_PROVIDER_KEY) ||
            this.localStorage.getItem(ZCODE_JWT_TOKEN_KEY) ||
            this.localStorage.getItem(ZAI_ACCESS_TOKEN_KEY) ||
            this.localStorage.getItem(ZAI_USER_INFO_KEY) ||
            this.localStorage.getItem(BIGMODEL_ACCESS_TOKEN_KEY) ||
            this.localStorage.getItem(BIGMODEL_USER_INFO_KEY));
    }
    clearAll() {
        this.localStorage.removeItem(ACTIVE_PROVIDER_KEY);
        this.localStorage.removeItem(ZCODE_JWT_TOKEN_KEY);
        // 两个 provider 的 key 段一起清：切换 provider 时不能留下上一个身份的残片，
        // 否则 loadCachedSessionState 可能读到半套凭据。
        this.localStorage.removeItem(ZAI_ACCESS_TOKEN_KEY);
        this.localStorage.removeItem(ZAI_USER_INFO_KEY);
        this.localStorage.removeItem(BIGMODEL_ACCESS_TOKEN_KEY);
        this.localStorage.removeItem(BIGMODEL_USER_INFO_KEY);
    }
    savePendingNonce(nonce) {
        this.sessionStorage.setItem(OAUTH_PENDING_NONCE_KEY, nonce);
    }
    loadPendingNonce() {
        return this.sessionStorage.getItem(OAUTH_PENDING_NONCE_KEY);
    }
    clearPendingNonce() {
        this.sessionStorage.removeItem(OAUTH_PENDING_NONCE_KEY);
    }
    /**
     * 记住这次跳出去登录用的是哪个 provider。
     *
     * 回调页必须知道用哪个 provider 换 token（authorize 参数名、token 响应里 access_token
     * 的位置都不同）。跟 nonce 放同一个 sessionStorage：两者本来就要一起校验、一起清。
     */
    savePendingProvider(provider) {
        this.sessionStorage.setItem(OAUTH_PENDING_PROVIDER_KEY, provider);
    }
    loadPendingProvider() {
        const stored = this.sessionStorage.getItem(OAUTH_PENDING_PROVIDER_KEY);
        return isWebOAuthProviderId(stored) ? stored : null;
    }
    clearPendingProvider() {
        this.sessionStorage.removeItem(OAUTH_PENDING_PROVIDER_KEY);
    }
}
//# sourceMappingURL=browserOAuthCredentialRepo.js.map