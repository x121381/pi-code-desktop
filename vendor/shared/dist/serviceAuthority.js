export const SERVICE_AUTHORITY_MODE_ENV = "ZCODE_SERVICE_AUTHORITY_MODE";
export const serviceAuthorityModes = [
    "desktop-local",
    "desktop-attached-remote",
    "standalone-server",
];
export function isServiceAuthorityMode(value) {
    return typeof value === "string" && serviceAuthorityModes.includes(value);
}
export function parseServiceAuthorityMode(env) {
    const rawValue = env[SERVICE_AUTHORITY_MODE_ENV]?.trim();
    if (!rawValue) {
        return {
            mode: undefined,
            invalidRawValue: undefined,
        };
    }
    if (isServiceAuthorityMode(rawValue)) {
        return {
            mode: rawValue,
            invalidRawValue: undefined,
        };
    }
    return {
        mode: undefined,
        invalidRawValue: rawValue,
    };
}
export function shouldUseProviderRegistrySourceForAuthorityMode(mode) {
    return mode !== "desktop-attached-remote";
}
//# sourceMappingURL=serviceAuthority.js.map