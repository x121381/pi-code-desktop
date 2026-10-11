import { DEFAULT_ZCODE_ENDPOINT_ORIGIN } from "./zcodeEndpoint.js";
export const ZCODE_SOURCE_HEADERS = {
    "User-Agent": "ZCode/unknown",
    "HTTP-Referer": DEFAULT_ZCODE_ENDPOINT_ORIGIN,
    "X-Title": "Z Code@electron",
};
export function normalizeZCodeSourceHeaderValue(value) {
    const trimmed = value?.trim();
    if (!trimmed || !/^[\x20-\x7e]+$/.test(trimmed)) {
        return undefined;
    }
    return trimmed;
}
export function buildZCodeSourceHeadersFromContext(options = {}) {
    const appVersion = normalizeZCodeSourceHeaderValue(options.appVersion);
    const arch = normalizeZCodeSourceHeaderValue(options.arch);
    const clientLanguage = normalizeZCodeSourceHeaderValue(options.clientLanguage) ?? "unknown";
    const clientTimezone = normalizeZCodeSourceHeaderValue(options.clientTimezone) ?? "unknown";
    const deviceMid = normalizeZCodeSourceHeaderValue(options.deviceMid);
    const endpointOrigin = normalizeZCodeSourceHeaderValue(options.endpointOrigin) ?? DEFAULT_ZCODE_ENDPOINT_ORIGIN;
    const osVersion = normalizeZCodeSourceHeaderValue(options.osVersion);
    const platform = normalizeZCodeSourceHeaderValue(options.platform);
    const releaseChannel = normalizeZCodeSourceHeaderValue(options.releaseChannel);
    const sourceTitle = normalizeZCodeSourceHeaderValue(options.sourceTitle) ?? "electron";
    return {
        ...ZCODE_SOURCE_HEADERS,
        "HTTP-Referer": endpointOrigin,
        "User-Agent": `ZCode/${appVersion ?? "unknown"}`,
        ...(appVersion ? { "X-ZCode-App-Version": appVersion } : {}),
        "X-Title": `Z Code@${sourceTitle}`,
        ...(platform && arch ? { "X-Platform": `${platform}-${arch}` } : {}),
        ...(releaseChannel ? { "X-Release-Channel": releaseChannel } : {}),
        "X-Client-Language": clientLanguage,
        "X-Client-Timezone": clientTimezone,
        ...(platform ? { "X-Os-Category": normalizeOsCategory(platform) } : {}),
        ...(osVersion ? { "X-Os-Version": osVersion } : {}),
        ...(deviceMid ? { "X-Device-Mid": deviceMid } : {}),
    };
}
function normalizeOsCategory(platform) {
    switch (platform) {
        case "darwin":
            return "macos";
        case "win32":
            return "windows";
        default:
            return "linux";
    }
}
//# sourceMappingURL=zcode-source-headers.js.map