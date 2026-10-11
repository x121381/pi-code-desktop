import type { ReactNode } from "react";
import type { Hook, PluginHookDetail, PluginScope } from "@zcode/shared";
import type { StorePluginItem } from "@/settings/pluginStoreListing.js";
export type HookScope = "user" | "project";
export interface PluginHookRow {
    detail: PluginHookDetail;
    pluginEnabled: boolean;
    pluginId: string;
    pluginName: string;
    pluginScope?: PluginScope;
    pluginIconItem?: Pick<StorePluginItem, "name" | "listing">;
}
type HookSection = {
    kind: "installed";
    title: "Installed";
    count: number;
    hooks: Hook[];
} | {
    kind: "legacy";
    title: "Legacy";
    count: number;
    hooks: Hook[];
} | {
    kind: "plugin";
    title: string;
    pluginId: string;
    count: number;
    hooks: PluginHookRow[];
};
export declare function groupHookSections(editableHooks: Hook[], compatibilityHooks: Hook[], pluginHooks: PluginHookRow[]): HookSection[];
export declare function HooksList({ compatibilityHooks, editableHooks, operatingHookId, pluginHooks, trustActionAvailable, trustingHookId, onEdit, onImport, onTrust, onToggle, formatPluginName, installedAction, installedEmptyActions, installedEmptyDescription, installedEmptyTitle, showInstalledSection, }: {
    compatibilityHooks: Hook[];
    editableHooks: Hook[];
    operatingHookId: string | null;
    pluginHooks: PluginHookRow[];
    trustActionAvailable?: boolean;
    trustingHookId?: string | null;
    onEdit: (hook: Hook) => void;
    onImport: (hook: Hook) => Promise<void>;
    onTrust?: (hook: Hook) => Promise<void>;
    onToggle: (hook: Hook, enabled: boolean) => Promise<void>;
    formatPluginName?: (name: string, pluginId?: string) => string;
    installedAction?: ReactNode;
    installedEmptyActions?: ReactNode;
    installedEmptyDescription?: string;
    installedEmptyTitle?: string;
    showInstalledSection?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=HooksList.d.ts.map