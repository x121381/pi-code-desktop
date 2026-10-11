import type { ZCodePluginMarketplaceSummary } from "@zcode/shared";
export declare function PluginStoreSourceRefreshFailure({ failure, }: {
    failure: NonNullable<ZCodePluginMarketplaceSummary["refreshFailure"]>;
}): import("react/jsx-runtime").JSX.Element;
/** 顶栏齿轮 → 市场源管理：列出已登记市场，支持刷新与移除（新增走 New 按钮）。 */
export declare function PluginStoreSourcesDialog({ open, onOpenChange, marketplaces, onUpdateMarketplace, onRemoveMarketplace, operationId, }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    marketplaces: ZCodePluginMarketplaceSummary[];
    onUpdateMarketplace: (marketplace: string) => void;
    onRemoveMarketplace: (marketplace: string) => void;
    operationId: string | null;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PluginStoreSourcesDialog.d.ts.map