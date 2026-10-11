/**
 * 站点权限设置标签页的能力目录（key = main 持久层的 permission 字符串，
 * 与 embeddedBrowserPermissionPolicy 的 PROMPT_PERMISSIONS 对齐）。
 * label 走 i18n；iconKey 复用 BrowserPermissionIcon 的能力字形。
 */
export interface BrowserPermissionCapability {
    key: string;
    labelId: string;
    iconKey: string;
}
export declare const BROWSER_PERMISSION_CAPABILITIES: readonly BrowserPermissionCapability[];
//# sourceMappingURL=browserPermissionCapabilities.d.ts.map