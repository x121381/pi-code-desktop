import type { ReactNode } from "react";
import type { ModelProviderNavGroup } from "@/settings/model-provider-section/constants.js";
interface ModelProviderSectionLayoutProps {
    description: string;
    refreshLabel: string;
    loadingLabel: string;
    presetLoading: boolean;
    customLoading: boolean;
    onRefresh: () => void;
    addProviderLabel: string;
    onAddProvider: () => void;
    navigationGroups: ModelProviderNavGroup[];
    selectedNodeKey: string | null;
    onSelectNavItem: (item: ModelProviderNavGroup["items"][number]) => void;
    onReorderProviderIds?: (providerIds: string[]) => Promise<void>;
    reorderableProviderIds?: ReadonlySet<string>;
    children: ReactNode;
}
export declare function shouldShowModelProviderRefreshLoading(params: {
    presetLoading: boolean;
    customLoading: boolean;
}): boolean;
export declare function ModelProviderSectionLayout({ description, refreshLabel, loadingLabel, presetLoading, customLoading, onRefresh, addProviderLabel, onAddProvider, navigationGroups, selectedNodeKey, onSelectNavItem, onReorderProviderIds, reorderableProviderIds, children, }: ModelProviderSectionLayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SectionLayout.d.ts.map