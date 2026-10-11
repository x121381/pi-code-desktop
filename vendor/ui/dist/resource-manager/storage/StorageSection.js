import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 资源管理器「存储」tab。
 * 数据来自 useStorageUsage（main 进程 StorageService 经 preload 桥的投影）；本组件只持有 UI 选择态：
 * 选中的磁盘、打开的类别明细、待确认的清理目标。
 */
import { Loader2, RefreshCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { groupStorageRootsByVolume, TID_RESOURCE_MANAGER_STORAGE_RESCAN, TID_RESOURCE_MANAGER_STORAGE_SECTION, TID_RESOURCE_MANAGER_STORAGE_STATUS, TID_RESOURCE_MANAGER_STORAGE_TOTAL, } from "@zcode/shared";
import { Button } from "../../components/ui/button.js";
import { toast } from "../../components/ui/toast.js";
import { useStorageUsage } from "./useStorageUsage.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { logger } from "../../logger.js";
import { formatBytes } from "../../resource-manager/resourceUsageView.js";
import { formatDateTime } from "../../settings/automationFormat.js";
import { StorageCategoryDetail } from "./StorageCategoryDetail.js";
import { StorageCategoryList } from "./StorageCategoryList.js";
import { StorageCleanConfirmDialog, } from "./StorageCleanConfirmDialog.js";
import { StorageDiskCard } from "./StorageDiskCard.js";
import { buildStorageLegend, sumCategoriesAcrossRoots } from "./storageCategoryPresentation.js";
export function StorageSection({ bridge, active, }) {
    const { intl } = useZCodeIntl();
    const { snapshot, scanning, rescan, clean } = useStorageUsage({ bridge, enabled: active });
    const [selectedGroupKey, setSelectedGroupKey] = useState(null);
    const [detailCategory, setDetailCategory] = useState(null);
    const [confirmTarget, setConfirmTarget] = useState(null);
    const [cleaningCategory, setCleaningCategory] = useState(null);
    const groups = useMemo(() => groupStorageRootsByVolume(snapshot?.roots ?? []), [snapshot]);
    // 选中卷在渲染期派生：用户点过的 key 失效（重扫后卷变化）时自动回落到第一张卡片，不用 effect 回写 state。
    const selectedGroup = groups.find((group) => group.key === selectedGroupKey) ?? groups[0] ?? null;
    const categories = useMemo(() => (selectedGroup ? sumCategoriesAcrossRoots(selectedGroup.roots) : []), [selectedGroup]);
    const totalBytes = (snapshot?.roots ?? []).reduce((sum, root) => sum + root.bytes, 0);
    const status = scanning ? "scanning" : (snapshot?.status ?? "idle");
    const runClean = useCallback(async (categoryId) => {
        if (!selectedGroup)
            return;
        setCleaningCategory(categoryId);
        try {
            // 同一卷上可能有两个根（home 与自定义数据路径）：逐根清理同一类别。
            const rootIds = selectedGroup.roots.map((root) => root.id);
            let merged = {
                freedBytes: 0,
                deletedCount: 0,
                skippedCount: 0,
                failures: [],
            };
            for (const rootId of rootIds) {
                const result = await clean({ rootId, categoryId });
                merged = {
                    freedBytes: merged.freedBytes + result.freedBytes,
                    deletedCount: merged.deletedCount + result.deletedCount,
                    skippedCount: merged.skippedCount + result.skippedCount,
                    failures: [...merged.failures, ...result.failures],
                };
            }
            if (merged.deletedCount === 0 && merged.failures.length === 0) {
                toast(intl.formatMessage({ id: "resourceManager.storage.cleanNothing" }));
            }
            else if (merged.failures.length > 0) {
                toast(intl.formatMessage({ id: "resourceManager.storage.cleanPartial" }, { size: formatBytes(merged.freedBytes), count: merged.failures.length }));
            }
            else {
                toast(intl.formatMessage({ id: "resourceManager.storage.cleanSuccess" }, { size: formatBytes(merged.freedBytes) }));
            }
        }
        catch (error) {
            logger.error("[storage] clean failed", { categoryId, error });
            toast(intl.formatMessage({ id: "resourceManager.storage.cleanFailed" }));
        }
        finally {
            setCleaningCategory(null);
            setConfirmTarget(null);
        }
    }, [clean, intl, selectedGroup]);
    const requestClean = useCallback((categoryId) => {
        const category = categories.find((item) => item.id === categoryId);
        if (!category || category.cleanability === "none")
            return;
        if (category.cleanability === "confirm") {
            setConfirmTarget({ categoryId, bytes: category.bytes });
            return;
        }
        void runClean(categoryId);
    }, [categories, runClean]);
    const busy = cleaningCategory !== null;
    if (!bridge) {
        return (_jsx("div", { "data-testid": TID_RESOURCE_MANAGER_STORAGE_SECTION, className: "rounded-xl border border-destructive/30 bg-card px-4 py-3 text-ui-sm text-destructive", children: intl.formatMessage({ id: "resourceManager.unavailable" }) }));
    }
    return (_jsxs("div", { "data-testid": TID_RESOURCE_MANAGER_STORAGE_SECTION, className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-ui-caption text-foreground-subtle", children: intl.formatMessage({ id: "resourceManager.storage.summaryTotal" }) }), _jsx("div", { "data-testid": TID_RESOURCE_MANAGER_STORAGE_TOTAL, className: "text-ui-xl font-semibold tabular-nums text-foreground", children: formatBytes(totalBytes) })] }), _jsxs("div", { "data-testid": TID_RESOURCE_MANAGER_STORAGE_STATUS, "data-state": status, className: "flex items-center gap-1.5 text-ui-caption text-foreground-subtle", children: [scanning ? _jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }) : null, scanning
                                ? intl.formatMessage({ id: "resourceManager.storage.scanning" })
                                : snapshot?.finishedAt
                                    ? intl.formatMessage({ id: "resourceManager.storage.lastScanned" }, {
                                        time: formatDateTime(snapshot.finishedAt),
                                    })
                                    : snapshot?.status === "failed"
                                        ? intl.formatMessage({ id: "resourceManager.storage.failed" })
                                        : intl.formatMessage({ id: "resourceManager.storage.idle" })] }), _jsx("div", { className: "ml-auto", children: _jsxs(Button, { type: "button", variant: "outline", size: "sm", "data-testid": TID_RESOURCE_MANAGER_STORAGE_RESCAN, disabled: scanning || busy, onClick: () => void rescan(), children: [_jsx(RefreshCw, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "resourceManager.storage.rescan" })] }) })] }), snapshot && snapshot.errors.length > 0 ? (_jsx("div", { className: "text-ui-caption text-warning", children: intl.formatMessage({ id: "resourceManager.storage.errors" }, { count: snapshot.errors.length }) })) : null, _jsxs("div", { className: "grid gap-3 lg:grid-cols-[320px_minmax(0,1fr)]", children: [_jsxs("div", { className: "space-y-3", children: [groups.map((group, index) => (_jsx(StorageDiskCard, { group: group, index: index, legend: buildStorageLegend(sumCategoriesAcrossRoots(group.roots)), selected: group.key === selectedGroup?.key, selectable: groups.length > 1, onSelect: () => {
                                    setSelectedGroupKey(group.key);
                                    setDetailCategory(null);
                                } }, group.key))), _jsx("div", { className: "px-1 text-ui-caption text-foreground-subtlest", children: intl.formatMessage({ id: "resourceManager.storage.estimate" }) })] }), _jsx("div", { className: "min-w-0", children: selectedGroup && detailCategory ? (_jsx(StorageCategoryDetail, { categoryId: detailCategory, roots: selectedGroup.roots, cleaning: cleaningCategory === detailCategory, disabled: busy || scanning, onBack: () => setDetailCategory(null), onClean: () => requestClean(detailCategory), onReveal: (absolutePath) => bridge?.revealPath(absolutePath) ?? Promise.resolve() })) : (_jsx(StorageCategoryList, { categories: categories, cleaningCategory: cleaningCategory, disabled: busy || scanning, onOpen: setDetailCategory, onClean: requestClean })) })] }), _jsx(StorageCleanConfirmDialog, { target: confirmTarget, pending: busy, onCancel: () => setConfirmTarget(null), onConfirm: () => {
                    if (confirmTarget)
                        void runClean(confirmTarget.categoryId);
                } })] }));
}
//# sourceMappingURL=StorageSection.js.map