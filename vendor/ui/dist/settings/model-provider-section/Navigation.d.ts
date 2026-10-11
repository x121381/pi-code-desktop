import type { ModelProviderNavGroup, ModelProviderNavItem } from "./constants.js";
export declare function getSortableProviderId(item: ModelProviderNavItem, reorderableProviderIds?: ReadonlySet<string>): string | null;
export declare function resolveReorderedProviderIdsForGroup(params: {
    activeProviderId: string;
    overProviderId: string;
    providerIds: readonly string[];
}): string[];
export declare function shouldShowModelProviderGroupLoadingIndicator(params: {
    groupId: ModelProviderNavGroup["id"];
    presetLoading: boolean;
    customLoading: boolean;
}): boolean;
export declare function resolveModelProviderSideNavLabel(item: ModelProviderNavItem): string;
export declare function ModelProviderSectionNavigation({ navigationGroups, selectedNodeKey, presetLoading, customLoading, onSelectNavItem, onReorderProviderIds, reorderableProviderIds, }: {
    navigationGroups: ModelProviderNavGroup[];
    selectedNodeKey: string | null;
    presetLoading: boolean;
    customLoading: boolean;
    onSelectNavItem: (item: ModelProviderNavItem) => void;
    onReorderProviderIds?: (providerIds: string[]) => Promise<void>;
    reorderableProviderIds?: ReadonlySet<string>;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Navigation.d.ts.map