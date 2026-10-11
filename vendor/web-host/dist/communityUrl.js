"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWebHelpConfig = resolveWebHelpConfig;
exports.resolveWebCommunityUrl = resolveWebCommunityUrl;
const shared_1 = require("@zcode/shared");
const defaultAppConfig_1 = __importDefault(require("./defaultAppConfig"));
const viteEnv = import.meta.env ?? {};
const readHelpConfig = (0, shared_1.createHelpAppConfigReader)({
    fetchImpl: (input, init) => fetch(input, init),
});
async function resolveWebHelpConfig(options = {}) {
    const env = viteEnv;
    const endpoint = options.endpointOrigin ??
        (env?.VITE_ZCODE_BASE_URL?.trim() ||
            env?.VITE_ZCODE_ENDPOINT_ORIGIN?.trim() ||
            shared_1.DEFAULT_ZCODE_ENDPOINT_ORIGIN);
    // 服务端拒绝 platform=web；浏览器省略可选平台参数，避免伪装桌面系统。
    const url = (0, shared_1.buildHelpAppConfigUrl)(endpoint, shared_1.ZCODE_VERSION);
    let remote;
    try {
        remote = await (options.fetchImpl
            ? (0, shared_1.createHelpAppConfigReader)({ fetchImpl: options.fetchImpl })
            : readHelpConfig)(url);
    }
    catch {
        // 远端不可用时保留内置入口，不使用旧 CDN 作为第二个远端配置源。
    }
    return (0, shared_1.resolveHelpAppConfig)(remote, options.localConfig ?? defaultAppConfig_1.default);
}
async function resolveWebCommunityUrl(locale, options = {}) {
    return (await resolveWebHelpConfig(options)).community_urls?.[locale];
}
//# sourceMappingURL=communityUrl.js.map