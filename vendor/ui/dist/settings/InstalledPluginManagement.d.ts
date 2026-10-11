import type { ZCodePluginDiagnostic, ZCodePluginInfo, ZCodePluginScope, ZCodePluginUserConfigOption } from "@zcode/shared";
export type PluginOptionValueGetter = (plugin: ZCodePluginInfo, key: string, option: ZCodePluginUserConfigOption) => string | number | boolean;
export declare function InstalledPluginDetailDialog({ diagnostics, getPluginOptionValue, configScope, installedAt, latestVersion, onOpenChange, onRequestUninstall, onRequestUpdate, onSavePluginOptions, open, operationId, plugin, renderPluginSource, setPluginOptionDraft, uninstallable, updateStatus, }: {
    /** 插件管理 store 聚合的 list/overview 诊断；透传给面板展示当前插件自身的 warning。 */
    diagnostics?: ZCodePluginDiagnostic[];
    getPluginOptionValue: PluginOptionValueGetter;
    configScope: ZCodePluginScope;
    installedAt?: string;
    latestVersion?: string;
    onOpenChange: (open: boolean) => void;
    onRequestUninstall?: (pluginId: string) => void;
    onRequestUpdate?: (pluginId: string) => void;
    onSavePluginOptions: (plugin: ZCodePluginInfo) => void;
    open: boolean;
    operationId: string | null;
    plugin: ZCodePluginInfo | null;
    renderPluginSource: (plugin: ZCodePluginInfo) => string;
    setPluginOptionDraft: (pluginId: string, key: string, value: string | number | boolean) => void;
    uninstallable?: boolean;
    updateStatus?: "none" | "update-available" | "version-changed";
}): import("react/jsx-runtime").JSX.Element;
export declare function InstalledPluginDetailPanel({ diagnostics, getPluginOptionValue, configScope, installedAt, latestVersion, onRequestUninstall, onRequestUpdate, onSavePluginOptions, operationId, plugin, renderPluginSource, setPluginOptionDraft, uninstallable, updateStatus, }: {
    /** 插件管理 store 聚合的 list/overview 诊断；面板只展示当前插件自身的 warning。 */
    diagnostics?: ZCodePluginDiagnostic[];
    getPluginOptionValue: PluginOptionValueGetter;
    configScope: ZCodePluginScope;
    installedAt?: string;
    latestVersion?: string;
    onRequestUninstall?: (pluginId: string) => void;
    onRequestUpdate?: (pluginId: string) => void;
    onSavePluginOptions: (plugin: ZCodePluginInfo) => void;
    operationId: string | null;
    plugin: ZCodePluginInfo | null;
    renderPluginSource: (plugin: ZCodePluginInfo) => string;
    setPluginOptionDraft: (pluginId: string, key: string, value: string | number | boolean) => void;
    uninstallable?: boolean;
    updateStatus?: "none" | "update-available" | "version-changed";
}): import("react/jsx-runtime").JSX.Element;
/**
 * 插件 warning 诊断列表。CLI 对「声明的技能路径扫描为空」等异常
 * 只写 diagnostics 的话 UI 无渲染位置，用户无从排查。message 由 CLI 下发并包含
 * 具体路径（协议 wire 不携带 path 字段），因此正文直出 message 即可。
 */
export declare function PluginWarningList({ warnings }: {
    warnings: ZCodePluginDiagnostic[];
}): import("react/jsx-runtime").JSX.Element;
export declare function PluginHookDetails({ hooks, }: {
    hooks: NonNullable<ZCodePluginInfo["hookDetails"]>;
}): import("react/jsx-runtime").JSX.Element;
export declare function PluginDetailRow({ label, value }: {
    label: string;
    value: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=InstalledPluginManagement.d.ts.map