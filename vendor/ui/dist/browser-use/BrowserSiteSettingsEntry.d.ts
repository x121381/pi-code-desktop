/**
 * 地址栏左侧的站点设置入口（spec：docs/browser-use/2026-10-08-embedded-browser-permission-governance-spec.md
 * 「站点权限设置标签页」）。恒为滑杆图标、不随权限请求变化；点击弹出站点信息气泡，
 * 唯一操作「权限设置」进入独立设置标签页。URL 聚焦编辑时由地址栏隐藏本入口，
 * 不结算任何待处理权限申请。
 */
export declare function BrowserSiteSettingsEntry({ origin, onOpenSettings, }: {
    origin: string;
    onOpenSettings?: (origin: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BrowserSiteSettingsEntry.d.ts.map