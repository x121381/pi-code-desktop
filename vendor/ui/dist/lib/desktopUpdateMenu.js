import { ZCODE_PRODUCT_FLAVOR, } from "@zcode/shared";
// 更新入口跟随产品身份而不是后端环境：Preview 身份（含生产后端的 Preview）禁用更新器。
export function shouldShowDesktopUpdateEntry(flavor = ZCODE_PRODUCT_FLAVOR) {
    return flavor === "production";
}
export function getUpdateMenuLabelId(state) {
    switch (state?.kind) {
        case "checking":
            return "desktopMenu.help.checkingForUpdates";
        case "update-available":
            return "desktopMenu.help.updateAvailableVersion";
        case "download-progress":
            return "desktopMenu.help.downloadingUpdateProgress";
        case "update-downloaded":
            return "desktopMenu.help.restartToUpdate";
        case "idle":
        default:
            return "titleBar.menu.help.checkForUpdates";
    }
}
export function getUpdateMenuLabelValues(state) {
    switch (state?.kind) {
        case "update-available":
        case "update-downloaded":
            return { version: state.version };
        case "download-progress":
            return { progress: state.progress };
        default:
            return undefined;
    }
}
//# sourceMappingURL=desktopUpdateMenu.js.map