"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWebRemoteControlRoutePath = resolveWebRemoteControlRoutePath;
const shared_1 = require("@zcode/shared");
/**
 * 页面路由与资源目录分离：OSS 多版本发布用 `/remote/v4/<version>/` 作为 Vite base，
 * 让每个子资源请求自带版本，但页面入口仍是 `/remote/v4`。构建时注入路由变量即可覆盖；
 * 未注入（Docker、v3、开发 `/remote`）时沿用 BASE_URL 推导，行为与历史一致。
 */
function resolveWebRemoteControlRoutePath(env) {
    const explicitRoutePath = env.VITE_WEB_REMOTE_CONTROL_ROUTE_PATH?.trim();
    return (0, shared_1.resolveWebRemoteControlRoutePathFromBaseUrl)(explicitRoutePath || env.BASE_URL);
}
//# sourceMappingURL=webRemoteControlRoute.js.map