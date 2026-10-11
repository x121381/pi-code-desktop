/* eslint-disable max-lines -- OAuth 凭据仓储集中维护 ZAI/BigModel 登录镜像 key 边界，拆分会让鉴权事实源更难追踪。 */
import { Buffer } from "node:buffer";
import { BIGMODEL_PROVIDER_ID, isCredentialDecryptError, ZAI_PROVIDER_ID } from "@zcode/shared";
import { createServiceLogger } from "../../logger/serviceLogger.js";
const ACTIVE_PROVIDER_KEY = "oauth:active_provider";
const LOGIN_ATTRIBUTION_KEY = "oauth:login_attribution";
const ZCODE_JWT_TOKEN_KEY = "zcodejwttoken";
const KNOWN_OAUTH_PROVIDER_IDS = [BIGMODEL_PROVIDER_ID, ZAI_PROVIDER_ID];
const log = createServiceLogger("oauthCredentialRepo");
function accessTokenKey(provider) {
    return `oauth:${provider}:access_token`;
}
function refreshTokenKey(provider) {
    return `oauth:${provider}:refresh_token`;
}
function userInfoKey(provider) {
    return `oauth:${provider}:user_info`;
}
function collectKnownOAuthProviderIds(providerIds = []) {
    const uniqueProviderIds = new Set(KNOWN_OAUTH_PROVIDER_IDS);
    for (const providerId of providerIds) {
        uniqueProviderIds.add(providerId);
    }
    return [...uniqueProviderIds];
}
function inferBase64ImageMimeType(decoded) {
    if (decoded.length >= 8 &&
        decoded[0] === 0x89 &&
        decoded[1] === 0x50 &&
        decoded[2] === 0x4e &&
        decoded[3] === 0x47) {
        return "image/png";
    }
    if (decoded.length >= 3 && decoded[0] === 0xff && decoded[1] === 0xd8 && decoded[2] === 0xff) {
        return "image/jpeg";
    }
    if (decoded.length >= 6 && decoded.toString("ascii", 0, 3) === "GIF") {
        return "image/gif";
    }
    if (decoded.length >= 12 &&
        decoded.toString("ascii", 0, 4) === "RIFF" &&
        decoded.toString("ascii", 8, 12) === "WEBP") {
        return "image/webp";
    }
    return "image/png";
}
function toBase64ImageDataUrl(raw) {
    const normalized = raw.replace(/\s/g, "");
    if (normalized.length < 16 || !/^[A-Za-z0-9+/]+={0,2}$/.test(normalized)) {
        return null;
    }
    const decoded = Buffer.from(normalized, "base64");
    if (decoded.length === 0) {
        return null;
    }
    const encoded = decoded.toString("base64").replace(/=+$/, "");
    if (encoded !== normalized.replace(/=+$/, "")) {
        return null;
    }
    return `data:${inferBase64ImageMimeType(decoded)};base64,${normalized}`;
}
function normalizeStoredZaiAvatarUrl(avatar) {
    const trimmed = avatar?.trim();
    if (!trimmed) {
        return undefined;
    }
    if (/^data:image\/[^;]+;base64,/i.test(trimmed) || /^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    const dataUrl = toBase64ImageDataUrl(trimmed);
    if (dataUrl) {
        return dataUrl;
    }
    return trimmed;
}
function toOAuthUserProfileFromRawZaiUser(raw) {
    const id = typeof raw.user_id === "string" ? raw.user_id : "unknown";
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const email = typeof raw.email === "string" ? raw.email : "";
    const username = name || email || id;
    const avatarUrl = normalizeStoredZaiAvatarUrl(typeof raw.avatar === "string" ? raw.avatar : undefined);
    if (!name && !email && id === "unknown") {
        return null;
    }
    return {
        id,
        username,
        displayName: username,
        ...(avatarUrl ? { avatarUrl } : {}),
        rawProfile: raw,
    };
}
/** OAuth 凭据仓储：统一 provider 命名空间 */
export class OAuthCredentialRepo {
    credentialService;
    knownProviderIds;
    constructor(credentialService, options = {}) {
        this.credentialService = credentialService;
        this.knownProviderIds = collectKnownOAuthProviderIds(options.providerIds);
        this.onCorruptOAuthSessionCleared = options.onCorruptOAuthSessionCleared;
    }
    onCorruptOAuthSessionCleared;
    async getActiveProvider() {
        return this.loadActiveProvider();
    }
    async setActiveProvider(provider) {
        await this.saveActiveProvider(provider);
    }
    async loadActiveProvider() {
        try {
            return await this.credentialService.load(ACTIVE_PROVIDER_KEY);
        }
        catch (error) {
            if (!isCredentialDecryptError(error)) {
                throw error;
            }
            await this.clearCorruptOAuthSession();
            return null;
        }
    }
    async saveActiveProvider(provider) {
        if (!provider) {
            await this.credentialService.delete(ACTIVE_PROVIDER_KEY);
            return;
        }
        // App 登录恢复为 oauth:* 镜像，active provider 是互斥 provider 域的唯一事实源。
        await this.credentialService.save(ACTIVE_PROVIDER_KEY, provider);
    }
    async loadActiveTokenSet() {
        const provider = await this.loadActiveProvider();
        if (!provider) {
            return null;
        }
        const tokenSet = await this.loadTokenSet(provider);
        if (tokenSet) {
            return tokenSet;
        }
        return null;
    }
    async saveActiveTokenSet(tokenSet) {
        const provider = await this.loadActiveProvider();
        if (!provider) {
            throw new Error("保存当前登录 token 前缺少 active provider");
        }
        await this.saveTokenSet(provider, tokenSet);
    }
    async loadActiveUserProfile() {
        const provider = await this.loadActiveProvider();
        if (!provider) {
            return null;
        }
        const profile = await this.loadUserProfile(provider);
        if (profile) {
            return profile;
        }
        return null;
    }
    async saveActiveUserProfile(profile) {
        const provider = await this.loadActiveProvider();
        if (!provider) {
            throw new Error("保存当前登录 user 前缺少 active provider");
        }
        await this.saveUserProfile(provider, profile);
    }
    async saveLoginAttribution(attribution) {
        const persistAttribution = Object.fromEntries(Object.entries(attribution).flatMap(([key, value]) => {
            const trimmed = typeof value === "string" ? value.trim() : "";
            return trimmed ? [[key, trimmed]] : [];
        }));
        if (Object.keys(persistAttribution).length === 0) {
            return;
        }
        await this.credentialService.save(LOGIN_ATTRIBUTION_KEY, JSON.stringify(persistAttribution));
    }
    async loadLoginAttribution() {
        let raw;
        try {
            raw = await this.credentialService.load(LOGIN_ATTRIBUTION_KEY);
        }
        catch (error) {
            if (!isCredentialDecryptError(error)) {
                throw error;
            }
            return null;
        }
        if (!raw) {
            return null;
        }
        try {
            const parsed = JSON.parse(raw);
            // 兼容本分支早期保存过的 { params, expiresAt } 结构；取消 TTL 后只读取 params。
            const storedParams = parsed.params && typeof parsed.params === "object"
                ? parsed.params
                : parsed;
            const params = Object.fromEntries(Object.entries(storedParams).flatMap(([key, value]) => (key === "channel_id" || key === "utm_source" || key === "utm_campaign") &&
                typeof value === "string" &&
                value.trim()
                ? [[key, value.trim()]]
                : []));
            if (Object.keys(params).length === 0) {
                await this.credentialService.delete(LOGIN_ATTRIBUTION_KEY);
                return null;
            }
            return params;
        }
        catch {
            await this.credentialService.delete(LOGIN_ATTRIBUTION_KEY);
            return null;
        }
    }
    async clearActiveSession() {
        const activeProvider = await this.loadActiveProvider();
        if (activeProvider) {
            await this.clearProvider(activeProvider);
        }
        await this.credentialService.delete(ACTIVE_PROVIDER_KEY);
    }
    async loadTokenSet(provider) {
        try {
            const accessToken = await this.credentialService.load(accessTokenKey(provider));
            if (!accessToken) {
                return null;
            }
            const refreshToken = await this.credentialService.load(refreshTokenKey(provider));
            const zcodeJwtToken = provider === ZAI_PROVIDER_ID || provider === BIGMODEL_PROVIDER_ID
                ? await this.credentialService.load(ZCODE_JWT_TOKEN_KEY)
                : null;
            return {
                accessToken,
                ...(refreshToken ? { refreshToken } : {}),
                ...(zcodeJwtToken ? { zcodeJwtToken } : {}),
            };
        }
        catch (error) {
            if (!isCredentialDecryptError(error)) {
                throw error;
            }
            await this.clearCorruptOAuthSession();
            return null;
        }
    }
    async saveTokenSet(provider, tokenSet) {
        await this.credentialService.save(accessTokenKey(provider), tokenSet.accessToken);
        if (tokenSet.refreshToken) {
            await this.credentialService.save(refreshTokenKey(provider), tokenSet.refreshToken);
        }
        else {
            await this.credentialService.delete(refreshTokenKey(provider));
        }
        if (provider === ZAI_PROVIDER_ID || provider === BIGMODEL_PROVIDER_ID) {
            if (tokenSet.zcodeJwtToken) {
                // BigModel Start Plan 与 Z.ai Start Plan 一样消费 zcode JWT。
                // JWT 必须在 OAuth callback 阶段随 tokenSet 落盘，后续 balance/runtime 只读取它，
                // 不能再拿 BigModel access token 拼另一个 /oauth/token body 临时兑换。
                await this.credentialService.save(ZCODE_JWT_TOKEN_KEY, tokenSet.zcodeJwtToken);
            }
            else {
                await this.credentialService.delete(ZCODE_JWT_TOKEN_KEY);
            }
        }
    }
    async loadUserProfile(provider) {
        return this.loadUserProfileFromKey(userInfoKey(provider), provider);
    }
    async loadUserProfileFromKey(key, provider) {
        let raw;
        try {
            raw = await this.credentialService.load(key);
        }
        catch (error) {
            if (!isCredentialDecryptError(error)) {
                throw error;
            }
            await this.clearCorruptOAuthSession();
            return null;
        }
        if (!raw) {
            return null;
        }
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed.id === "string" &&
                typeof parsed.username === "string" &&
                typeof parsed.displayName === "string") {
                const avatarUrl = typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : undefined;
                const rawProfile = typeof parsed.rawProfile === "object" && parsed.rawProfile !== null
                    ? parsed.rawProfile
                    : undefined;
                return {
                    id: parsed.id,
                    username: parsed.username,
                    displayName: parsed.displayName,
                    ...(avatarUrl ? { avatarUrl } : {}),
                    ...(rawProfile ? { rawProfile } : {}),
                };
            }
            if (provider === ZAI_PROVIDER_ID && typeof parsed === "object" && parsed !== null) {
                // ZAI user_info 现在按后端 data.user 原样持久化，
                // 启动恢复时需要从 user_id/name/avatar 重新映射展示字段。
                const zaiProfile = toOAuthUserProfileFromRawZaiUser(parsed);
                if (zaiProfile) {
                    return zaiProfile;
                }
            }
        }
        catch {
            // ignore parse error and fallback to null
        }
        return null;
    }
    async saveUserProfile(provider, profile) {
        // ZAI 后端返回的 data.user 是后续账号态排查与恢复的源数据，
        // 之前只保存归一化展示字段会丢失 email/name/avatar 原始结构。
        const persistProfile = provider === ZAI_PROVIDER_ID && profile.rawProfile ? profile.rawProfile : profile;
        await this.credentialService.save(userInfoKey(provider), JSON.stringify(persistProfile));
    }
    async clearUserProfile(provider) {
        await this.credentialService.delete(userInfoKey(provider));
    }
    async clearProvider(provider) {
        await this.credentialService.delete(accessTokenKey(provider));
        await this.credentialService.delete(refreshTokenKey(provider));
        await this.credentialService.delete(userInfoKey(provider));
        if (shouldClearZcodeJwtOnLogout(provider)) {
            await this.credentialService.delete(ZCODE_JWT_TOKEN_KEY);
        }
    }
    async clearAll(providers) {
        for (const provider of providers) {
            await this.clearProvider(provider);
        }
        await this.saveActiveProvider(null);
    }
    async clearCorruptOAuthSession() {
        // AES-GCM 解密失败说明当前运行时已经无法信任本地 OAuth 登录态。
        // 等价于强制登出已注册 OAuth provider：先清 provider 命名空间与共享 zcode JWT，
        // 再通知 service 层清理 Start/Coding Plan 这类派生模型凭据，同时避免误删 SSH 等其他独立凭据。
        for (const provider of this.knownProviderIds) {
            await this.clearProvider(provider);
        }
        await this.credentialService.delete(ACTIVE_PROVIDER_KEY);
        try {
            await this.onCorruptOAuthSessionCleared?.(this.knownProviderIds);
        }
        catch (error) {
            // 派生模型 provider 清理失败不能阻断 OAuth 损坏态恢复。
            // 主 OAuth 凭据已经删除，用户必须能回到可重新登录的未登录态。
            log.warn(undefined, "clear derived provider keys after corrupt OAuth session failed", error);
        }
    }
}
function shouldClearZcodeJwtOnLogout(provider) {
    return provider === ZAI_PROVIDER_ID || provider === BIGMODEL_PROVIDER_ID;
}
//# sourceMappingURL=oauthCredentialRepo.js.map