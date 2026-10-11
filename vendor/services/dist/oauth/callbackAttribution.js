const ATTRIBUTION_PARAM_KEYS = ["channel_id", "utm_source", "utm_campaign"];
export function parseOAuthLoginAttribution(searchParams) {
    const attribution = {};
    for (const key of ATTRIBUTION_PARAM_KEYS) {
        const value = searchParams.get(key)?.trim();
        if (value) {
            attribution[key] = value;
        }
    }
    return Object.keys(attribution).length > 0 ? attribution : undefined;
}
export function hasOAuthAuthorizationCode(searchParams) {
    return Boolean(searchParams.get("code") || searchParams.get("authCode"));
}
//# sourceMappingURL=callbackAttribution.js.map