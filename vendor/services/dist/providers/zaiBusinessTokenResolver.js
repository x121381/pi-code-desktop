import { readApiJson } from "./api/apiJson.js";
const ZAI_BUSINESS_TOKEN_REFRESH_SKEW_MS = 5 * 60 * 1000;
export class ZaiBusinessTokenResolver {
    apiClient;
    loginUrl;
    timeoutMs;
    now;
    cachedToken = null;
    constructor(options) {
        this.apiClient = options.apiClient;
        this.loginUrl = options.loginUrl;
        this.timeoutMs = options.timeoutMs;
        this.now = options.now ?? Date.now;
    }
    async resolve(oauthAccessToken) {
        const normalizedToken = oauthAccessToken.trim();
        if (!normalizedToken) {
            throw new Error("zai_oauth_required");
        }
        const cachedToken = this.cachedToken;
        if (this.isCachedTokenValid(cachedToken, normalizedToken)) {
            return cachedToken.accessToken;
        }
        this.cachedToken = null;
        return this.exchangeBusinessToken(normalizedToken);
    }
    isCachedTokenValid(cachedToken, oauthAccessToken) {
        return Boolean(cachedToken &&
            cachedToken.oauthAccessToken === oauthAccessToken &&
            cachedToken.expiresAt - ZAI_BUSINESS_TOKEN_REFRESH_SKEW_MS > this.now());
    }
    async exchangeBusinessToken(oauthAccessToken) {
        let payload;
        try {
            payload = await readApiJson(this.apiClient, this.loginUrl, {
                method: "POST",
                timeoutMs: this.timeoutMs,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: oauthAccessToken }),
            });
        }
        catch {
            throw new Error("zai_oauth_required");
        }
        if (!isSuccessfulZaiBusinessCode(payload.code) || payload.success === false) {
            throw new Error("zai_oauth_required");
        }
        const accessToken = payload.data?.access_token?.trim() ?? payload.data?.accessToken?.trim() ?? "";
        if (!accessToken) {
            throw new Error("zai_oauth_required");
        }
        const expiresIn = payload.data?.expires_in;
        if (expiresIn && Number.isFinite(expiresIn)) {
            this.cachedToken = {
                oauthAccessToken,
                accessToken,
                expiresAt: this.now() + expiresIn * 1000,
            };
        }
        return accessToken;
    }
}
function isSuccessfulZaiBusinessCode(code) {
    if (code === null || code === undefined) {
        return true;
    }
    if (typeof code === "number") {
        return code === 0 || code === 200;
    }
    if (typeof code === "string") {
        return code === "0" || code === "200";
    }
    return false;
}
//# sourceMappingURL=zaiBusinessTokenResolver.js.map