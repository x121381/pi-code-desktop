"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConversationShareCodeFromPath = resolveConversationShareCodeFromPath;
exports.isConversationSharePath = isConversationSharePath;
const conversationSharePreviewClient_js_1 = require("./conversationSharePreviewClient.js");
function resolveConversationShareCodeFromPath(pathname) {
    return (0, conversationSharePreviewClient_js_1.parseConversationShareRoute)(pathname);
}
/**
 * 中文站 /cn/share 与英文站 /share 都是分享路由。
 * 这里只判断「是否归分享页处理」，形状不合法的留给 code 解析报 invalid_contract。
 */
function isConversationSharePath(pathname) {
    return (pathname === "/cn/share" ||
        pathname.startsWith("/cn/share/") ||
        pathname === "/share" ||
        pathname.startsWith("/share/"));
}
//# sourceMappingURL=conversationShareRoute.js.map