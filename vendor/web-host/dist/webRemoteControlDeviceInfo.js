function readFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function readNonEmptyString(value) {
    return typeof value === "string" && value.trim() ? value : undefined;
}
function readTimezone(dateTimeFormat) {
    try {
        return readNonEmptyString(dateTimeFormat?.().resolvedOptions().timeZone);
    }
    catch {
        return undefined;
    }
}
export function collectWebRemoteControlMobileDeviceInfo({ appVersion, now = () => Date.now(), navigatorLike = globalThis.navigator, windowLike = globalThis.window, dateTimeFormat = () => new Intl.DateTimeFormat(), } = {}) {
    const viewportWidth = readFiniteNumber(windowLike?.innerWidth);
    const viewportHeight = readFiniteNumber(windowLike?.innerHeight);
    const devicePixelRatio = readFiniteNumber(windowLike?.devicePixelRatio) ?? 1;
    const screenWidth = readFiniteNumber(windowLike?.screen?.width);
    const screenHeight = readFiniteNumber(windowLike?.screen?.height);
    const timezone = readTimezone(dateTimeFormat);
    return {
        platform: "web",
        version: readNonEmptyString(appVersion) ?? "web",
        name: "mobile-browser",
        ...(readNonEmptyString(navigatorLike?.userAgent)
            ? { userAgent: navigatorLike.userAgent }
            : {}),
        ...(readNonEmptyString(navigatorLike?.language)
            ? { language: navigatorLike.language }
            : {}),
        ...(navigatorLike?.languages?.length
            ? { languages: navigatorLike.languages.filter((language) => language.trim()) }
            : {}),
        ...(readNonEmptyString(navigatorLike?.platform)
            ? { browserPlatform: navigatorLike.platform }
            : {}),
        ...(viewportWidth !== undefined && viewportHeight !== undefined
            ? {
                viewport: {
                    width: viewportWidth,
                    height: viewportHeight,
                    devicePixelRatio,
                },
            }
            : {}),
        ...(screenWidth !== undefined && screenHeight !== undefined
            ? {
                screen: {
                    width: screenWidth,
                    height: screenHeight,
                },
            }
            : {}),
        ...(timezone ? { timezone } : {}),
        ...(typeof navigatorLike?.onLine === "boolean" ? { online: navigatorLike.onLine } : {}),
        updatedAt: now(),
    };
}
//# sourceMappingURL=webRemoteControlDeviceInfo.js.map