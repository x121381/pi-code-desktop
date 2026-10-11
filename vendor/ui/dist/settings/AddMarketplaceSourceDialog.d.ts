/**
 * 顶栏 New 直接打开添加市场源对话框：收编原 AddMarketplacePopover 的
 * github/git/URL/本地路径（含拖放与目录选择）能力，零后端新增。
 */
export declare function AddMarketplaceSourceDialog({ open, onOpenChange, onAddMarketplace, operationId, error, }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddMarketplace: (source: string) => Promise<boolean>;
    operationId: string | null;
    error?: string | null;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AddMarketplaceSourceDialog.d.ts.map