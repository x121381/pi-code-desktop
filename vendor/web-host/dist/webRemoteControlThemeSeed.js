"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEB_REMOTE_CONTROL_DEFAULT_THEME = void 0;
exports.resolveWebRemoteControlInitialTheme = resolveWebRemoteControlInitialTheme;
exports.seedWebRemoteControlThemePreference = seedWebRemoteControlThemePreference;
const shared_1 = require("@zcode/shared");
exports.WEB_REMOTE_CONTROL_DEFAULT_THEME = "zai-dark";
function normalizeWebRemoteControlThemeSeed(theme) {
    if (theme === "dark")
        return "zai-dark";
    if (theme === "light")
        return "zai-light";
    return theme;
}
function resolveWebRemoteControlInitialTheme({ storedTheme, qrTheme, defaultTheme = exports.WEB_REMOTE_CONTROL_DEFAULT_THEME, }) {
    if ((0, shared_1.isWebRemoteControlThemeSeed)(storedTheme)) {
        return normalizeWebRemoteControlThemeSeed(storedTheme);
    }
    if ((0, shared_1.isWebRemoteControlThemeSeed)(qrTheme)) {
        return normalizeWebRemoteControlThemeSeed(qrTheme);
    }
    return normalizeWebRemoteControlThemeSeed(defaultTheme);
}
function seedWebRemoteControlThemePreference(qrTheme) {
    if (typeof localStorage === "undefined") {
        return;
    }
    const storedTheme = localStorage.getItem("zcode-theme");
    const resolvedTheme = resolveWebRemoteControlInitialTheme({ storedTheme, qrTheme });
    if (!storedTheme && (0, shared_1.isWebRemoteControlThemeSeed)(qrTheme)) {
        // Bugfix: 手机远控首次打开原来只用 Web 默认主题，无法继承扫码时桌面端主题。
        // 这里只在手机本地还没有主题偏好时写入一次，后续手机改主题不会反向影响桌面端。
        localStorage.setItem("zcode-theme", resolvedTheme);
    }
}
//# sourceMappingURL=webRemoteControlThemeSeed.js.map