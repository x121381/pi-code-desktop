"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthService = void 0;
exports.createWebAuthService = createWebAuthService;
const shared_1 = require("@zcode/shared");
const browserOAuthCredentialRepo_js_1 = require("./browserOAuthCredentialRepo.js");
const oauthStateCodec_js_1 = require("./oauthStateCodec.js");
const webZaiOAuthConfig_js_1 = require("./webZaiOAuthConfig.js");
const zaiWebOAuthProvider_js_1 = require("./zaiWebOAuthProvider.js");
function createBrowserNonce() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }
    if (!globalThis.crypto?.getRandomValues) {
        throw new Error("Secure random generator is unavailable");
    }
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function createDefaultRuntime() {
    return {
        assign: (url) => {
            window.location.assign(url);
        },
        createNonce: createBrowserNonce,
        getCurrentHref: () => window.location.href,
        getCurrentOrigin: () => window.location.origin,
        replace: (url) => {
            window.location.replace(url);
        },
    };
}
class WebAuthService {
    config;
    provider;
    repo;
    runtime;
    constructor(dependencies = {}) {
        this.config = dependencies.config ?? webZaiOAuthConfig_js_1.WEB_ZAI_OAUTH_CONFIG;
        this.provider = dependencies.provider ?? new zaiWebOAuthProvider_js_1.ZaiWebOAuthProvider(this.config);
        this.repo = dependencies.repo ?? new browserOAuthCredentialRepo_js_1.BrowserOAuthCredentialRepo();
        this.runtime = dependencies.runtime ?? createDefaultRuntime();
    }
    startLogin(options = {}) {
        const nonce = this.runtime.createNonce();
        const provider = options.provider ?? shared_1.ZAI_PROVIDER_ID;
        this.repo.savePendingNonce(nonce);
        this.repo.savePendingProvider(provider);
        const state = (0, oauthStateCodec_js_1.buildOAuthState)({
            nonce,
            app_return_to: options.appReturnTo ?? this.runtime.getCurrentHref(),
            ...(options.devReturnTo ? { return_to: options.devReturnTo } : {}),
        });
        this.runtime.assign(this.provider.buildAuthorizeUrl({
            state,
            provider,
            redirectUri: options.redirectUri ?? this.config.redirectUri,
        }));
    }
    async handleCallback(url) {
        const callback = this.provider.parseCallbackParams(url);
        const statePayload = (0, oauthStateCodec_js_1.parseOAuthState)(callback.state);
        if (!statePayload) {
            throw new Error("OAuth state is invalid");
        }
        const returnToUrl = (0, oauthStateCodec_js_1.parseOptionalUrl)(statePayload.return_to);
        if (returnToUrl && returnToUrl.origin !== this.runtime.getCurrentOrigin()) {
            if (this.config.allowDevReturnToRedirect && (0, oauthStateCodec_js_1.isTrustedDevReturnTo)(returnToUrl)) {
                const redirectUrl = (0, oauthStateCodec_js_1.buildReturnToCallbackUrl)(returnToUrl.toString(), {
                    ...(callback.code ? { code: callback.code } : {}),
                    ...(callback.error ? { error: callback.error } : {}),
                    state: callback.state,
                });
                if (redirectUrl) {
                    this.runtime.replace(redirectUrl);
                    return null;
                }
            }
        }
        if (callback.error) {
            throw new Error(`OAuth login failed: ${callback.error}`);
        }
        if (!callback.code) {
            throw new Error("OAuth callback missing code");
        }
        const pendingNonce = this.repo.loadPendingNonce();
        if (statePayload.nonce !== pendingNonce) {
            throw new Error("OAuth CSRF 检测失败");
        }
        // provider 必须取跳转前记下的那个：authorize 参数名和 token 响应里 access_token 的位置
        // 都是 provider 特定的。缺失时按 zai 兜底，保持旧回调链接可用。
        const provider = this.repo.loadPendingProvider() ?? shared_1.ZAI_PROVIDER_ID;
        this.repo.clearPendingNonce();
        this.repo.clearPendingProvider();
        const callbackRedirectUri = ["/cn/share/callback", "/share/callback"].includes(new URL(url).pathname)
            ? this.config.shareRedirectUri
            : this.config.redirectUri;
        const exchange = await this.provider.exchangeToken({
            code: callback.code,
            state: callback.state,
            provider,
            redirectUri: callbackRedirectUri,
        });
        this.repo.saveTokenSet(exchange.tokenSet, provider);
        this.repo.saveUserInfo(exchange.rawUserInfo, provider);
        this.repo.setActiveProvider(provider);
        return {
            userInfo: exchange.userInfo,
            appReturnTo: (0, oauthStateCodec_js_1.resolveSafeAppReturnTo)(statePayload.app_return_to, {
                currentOrigin: this.runtime.getCurrentOrigin(),
            }),
        };
    }
    async restoreCachedSession() {
        return this.repo.loadCachedSession();
    }
    restoreCachedSessionState() {
        return this.repo.loadCachedSessionState();
    }
    getZCodeJwtToken() {
        return this.repo.loadZCodeJwtToken();
    }
    async logout() {
        this.repo.clearAll();
    }
}
exports.WebAuthService = WebAuthService;
function createWebAuthService() {
    return new WebAuthService();
}
//# sourceMappingURL=webAuthService.js.map