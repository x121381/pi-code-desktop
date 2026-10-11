function isRecord(value) {
    return typeof value === "object" && value != null;
}
function sanitizeUrl(value) {
    return typeof value === "string" && value.trim() !== "" ? value : undefined;
}
export function getFeedbackUrlFromConfig(config) {
    if (!isRecord(config)) {
        return undefined;
    }
    return sanitizeUrl(config.feedback_url);
}
export function getFeedbackApiBaseFromConfig(config) {
    if (!isRecord(config)) {
        return undefined;
    }
    return sanitizeUrl(config.feedback_api_base);
}
export function getFeedbackUseExternalFormFromConfig(config) {
    if (!isRecord(config)) {
        return false;
    }
    const value = config.feedback_use_external_form;
    return value === true || value === "true";
}
export function getCommunityUrlsFromConfig(config) {
    if (!isRecord(config)) {
        return {};
    }
    const rawCommunityUrls = config.community_urls;
    if (!isRecord(rawCommunityUrls)) {
        return {};
    }
    return {
        "zh-CN": sanitizeUrl(rawCommunityUrls["zh-CN"]),
        "en-US": sanitizeUrl(rawCommunityUrls["en-US"]),
    };
}
export function getCommunityUrlFromConfig(config, locale) {
    const communityUrls = getCommunityUrlsFromConfig(config);
    return communityUrls[locale];
}
export function getCommunityUrlFromConfigs(remoteConfig, localConfig, locale) {
    const remoteUrls = getCommunityUrlsFromConfig(remoteConfig);
    const localUrls = getCommunityUrlsFromConfig(localConfig);
    // 社群渠道具有语言边界。只允许远端覆盖同语言的内置入口，
    // 对应语言缺失时保持隐藏，避免中文和英文用户被导向错误渠道。
    return remoteUrls[locale] ?? localUrls[locale];
}
export function getForceUpdateMinimalVersionFromConfig(config) {
    if (!isRecord(config)) {
        return undefined;
    }
    const forceUpdate = config.forceUpdate;
    if (!isRecord(forceUpdate)) {
        return undefined;
    }
    const minimalVersion = forceUpdate.minimalVersion;
    return typeof minimalVersion === "string" && minimalVersion.trim() !== ""
        ? minimalVersion.trim()
        : undefined;
}
//# sourceMappingURL=remoteAppConfig.js.map