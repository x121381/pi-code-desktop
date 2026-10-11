import { type ZCodeProductFlavor, type UpdateStatePayload } from "@zcode/shared";
export declare function shouldShowDesktopUpdateEntry(flavor?: ZCodeProductFlavor): boolean;
export declare function getUpdateMenuLabelId(state: UpdateStatePayload | null): "desktopMenu.help.downloadingUpdateProgress" | "desktopMenu.help.checkingForUpdates" | "desktopMenu.help.updateAvailableVersion" | "desktopMenu.help.restartToUpdate" | "titleBar.menu.help.checkForUpdates";
export declare function getUpdateMenuLabelValues(state: UpdateStatePayload | null): Record<string, string> | undefined;
//# sourceMappingURL=desktopUpdateMenu.d.ts.map