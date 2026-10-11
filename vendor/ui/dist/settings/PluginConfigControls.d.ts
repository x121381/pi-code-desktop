import type { ZCodePluginInfo, ZCodePluginScope, ZCodePluginUserConfigOption } from "@zcode/shared";
interface PluginConfigControlsProps {
    getValue: (plugin: ZCodePluginInfo, key: string, option: ZCodePluginUserConfigOption) => string | number | boolean;
    isOptionClearPending?: (pluginId: string, key: string) => boolean;
    onClearOption?: (pluginId: string, key: string, clear: boolean) => void;
    onSave: (plugin: ZCodePluginInfo) => void;
    onSetDraft: (pluginId: string, key: string, value: string | number | boolean) => void;
    operationId: string | null;
    plugin: ZCodePluginInfo;
    scope: ZCodePluginScope;
}
export declare function PluginConfigControls({ getValue, isOptionClearPending, onClearOption, onSave, onSetDraft, operationId, plugin, scope, }: PluginConfigControlsProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=PluginConfigControls.d.ts.map