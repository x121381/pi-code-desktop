import type { PluginStoreOrder, ZCodePluginMarketplaceSummary } from "@zcode/shared";
import { type PluginStoreActions } from "@/settings/PluginStoreCard.js";
import { type StorePluginItem } from "@/settings/pluginStoreListing.js";
export type PluginStoreSegment = "public" | "personal";
export declare function PluginStoreListView({ items: allItems, order, marketplaces, actions, loading, query, onQueryChange, segment, onSegmentChange, onOpenManage, }: {
    items: StorePluginItem[];
    order?: PluginStoreOrder | null;
    marketplaces: ZCodePluginMarketplaceSummary[];
    actions: PluginStoreActions;
    loading: boolean;
    query: string;
    onQueryChange: (query: string) => void;
    segment: PluginStoreSegment;
    onSegmentChange: (segment: PluginStoreSegment) => void;
    onOpenManage: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function SegmentPill({ active, label, onClick, testId, }: {
    active: boolean;
    label: string;
    onClick: () => void;
    testId: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PluginStoreListView.d.ts.map