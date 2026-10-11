import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TID_RESOURCE_MANAGER_TAB, testId, } from "@zcode/shared";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.js";
import { useZCodeIntl } from "@/i18n/index.js";
import { StorageSection } from "./storage/StorageSection.js";
import { NetworkSection } from "./NetworkSection.js";
import { UNSAMPLED_PLACEHOLDER, UsageGroup, UsageMeter } from "./resourceUsageParts.js";
import { clampPercent, formatBytes, formatPercent, groupResourceUsage, } from "./resourceUsageView.js";
const RESOURCE_MANAGER_TABS = ["cpu", "memory", "storage", "network"];
const TAB_LABEL_IDS = {
    cpu: "resourceManager.cpu",
    memory: "resourceManager.memory",
    storage: "resourceManager.storage",
    network: "resourceManager.network",
};
const DEFAULT_REFRESH_INTERVAL_MS = 1_000;
const CATEGORY_LABEL_IDS = {
    base: "resourceManager.category.base",
    "builtin-plugin": "resourceManager.category.builtinPlugin",
    "community-plugin": "resourceManager.category.communityPlugin",
};
/**
 * 资源管理器窗口 UI。
 * 组件放在 packages/ui 内是为了纳入 Tailwind 扫描；desktop 的独立 renderer 入口只负责挂载。
 */
export function ResourceManagerApp({ getSnapshot, setSamplingActive, storage, network, refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS, initialTab = "cpu", }) {
    const { intl } = useZCodeIntl();
    const [tab, setTab] = useState(initialTab);
    // CPU / 内存共用一份进程快照；存储 tab 激活时停止轮询，避免和扫盘争抢 IO。
    const pollingActive = tab === "cpu" || tab === "memory";
    const [snapshot, setSnapshot] = useState(null);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({
        base: true,
        "builtin-plugin": true,
        "community-plugin": true,
    });
    useEffect(() => {
        if (!getSnapshot) {
            setError(intl.formatMessage({ id: "resourceManager.unavailable" }));
            return;
        }
        if (!pollingActive)
            return;
        setSamplingActive?.(true);
        let disposed = false;
        let inFlight = false;
        async function refresh() {
            // 请求串行：上一轮未返回（Host 采样慢）时不叠加新请求。
            if (inFlight)
                return;
            inFlight = true;
            try {
                const next = await getSnapshot();
                if (disposed)
                    return;
                setSnapshot(next);
                setError(null);
            }
            catch (err) {
                if (disposed)
                    return;
                setError(err instanceof Error ? err.message : String(err));
            }
            finally {
                inFlight = false;
            }
        }
        void refresh();
        const interval = window.setInterval(() => void refresh(), refreshIntervalMs);
        return () => {
            disposed = true;
            window.clearInterval(interval);
            // 停止 renderer 定时器还不够，Host 在途采样也必须随页面生命周期取消。
            setSamplingActive?.(false);
        };
    }, [getSnapshot, intl, pollingActive, refreshIntervalMs, setSamplingActive]);
    const groups = useMemo(() => groupResourceUsage(snapshot?.processes ?? []), [snapshot]);
    const toggleGroup = useCallback((category) => {
        setExpanded((current) => ({ ...current, [category]: !current[category] }));
    }, []);
    return (_jsxs("main", { className: "flex h-dvh min-h-0 flex-col bg-background text-foreground", "data-testid": "resource-manager", children: [_jsxs("header", { className: "flex h-12 shrink-0 items-center justify-between gap-4 border-b border-border bg-header px-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "truncate text-ui-base font-medium", children: intl.formatMessage({ id: "resourceManager.title" }) }), pollingActive ? (_jsx("div", { className: "text-ui-xs text-foreground-subtle", children: snapshot
                                    ? intl.formatMessage({ id: "resourceManager.processCount" }, { count: snapshot.processes.length })
                                    : intl.formatMessage({ id: "resourceManager.loading" }) })) : null] }), _jsx(Tabs, { value: tab, onValueChange: (value) => setTab(value), children: _jsx(TabsList, { variant: "line", className: "h-8 gap-1 p-0", children: RESOURCE_MANAGER_TABS.map((item) => (_jsx(TabsTrigger, { value: item, "data-testid": testId(TID_RESOURCE_MANAGER_TAB, item), className: "h-8 flex-none rounded-full px-3 hover:bg-hover data-active:!bg-selected data-active:hover:!bg-hover after:hidden", children: intl.formatMessage({ id: TAB_LABEL_IDS[item] }) }, item))) }) })] }), _jsx("div", { className: "min-h-0 flex-1 overflow-auto bg-background-alt p-4", children: tab === "storage" ? (_jsx(StorageSection, { bridge: storage, active: tab === "storage" })) : tab === "network" ? (_jsx(NetworkSection, { bridge: network })) : (_jsx(UsageTabContent, { metric: tab, snapshot: snapshot, error: error, groups: groups, expanded: expanded, onToggleGroup: toggleGroup })) })] }));
}
/** CPU / 内存 tab 的正文：左侧对应指标卡，右侧分组列表只显示当前指标列。 */
function UsageTabContent({ metric, snapshot, error, groups, expanded, onToggleGroup, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(_Fragment, { children: [error ? (_jsx("div", { className: "rounded-xl border border-destructive/30 bg-card px-4 py-3 text-ui-sm text-destructive", "data-testid": "resource-manager-error", children: error })) : null, _jsxs("div", { className: "grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]", children: [_jsx("aside", { className: "flex min-w-0 flex-col gap-4", children: metric === "cpu" ? (_jsx(UsageMeter, { testId: "resource-manager-cpu", label: intl.formatMessage({ id: "resourceManager.cpu" }), appValue: snapshot ? formatPercent(snapshot.app.cpuPercent) : UNSAMPLED_PLACEHOLDER, systemValue: snapshot ? formatPercent(snapshot.system.cpuPercent) : UNSAMPLED_PLACEHOLDER, appPercent: snapshot ? clampPercent(snapshot.app.cpuPercent) : 0, systemPercent: snapshot ? clampPercent(snapshot.system.cpuPercent) : 0, appLabel: intl.formatMessage({ id: "resourceManager.appUsage" }), systemLabel: intl.formatMessage({ id: "resourceManager.systemUsage" }) })) : (_jsx(UsageMeter, { testId: "resource-manager-memory", label: intl.formatMessage({ id: "resourceManager.memory" }), appValue: snapshot ? formatBytes(snapshot.app.memoryBytes) : UNSAMPLED_PLACEHOLDER, systemValue: snapshot
                                ? `${formatBytes(snapshot.system.memoryUsedBytes)} / ${formatBytes(snapshot.system.memoryTotalBytes)}`
                                : UNSAMPLED_PLACEHOLDER, appPercent: snapshot && snapshot.system.memoryTotalBytes > 0
                                ? clampPercent((snapshot.app.memoryBytes / snapshot.system.memoryTotalBytes) * 100)
                                : 0, systemPercent: snapshot && snapshot.system.memoryTotalBytes > 0
                                ? clampPercent((snapshot.system.memoryUsedBytes / snapshot.system.memoryTotalBytes) * 100)
                                : 0, appLabel: intl.formatMessage({ id: "resourceManager.appUsage" }), systemLabel: intl.formatMessage({ id: "resourceManager.systemUsage" }) })) }), _jsx("section", { className: "flex min-w-0 flex-col gap-3", children: groups.map((group) => (_jsx(UsageGroup, { group: group, metric: metric, title: intl.formatMessage({ id: CATEGORY_LABEL_IDS[group.category] }), expanded: expanded[group.category], onToggle: () => onToggleGroup(group.category), emptyText: intl.formatMessage({ id: "resourceManager.empty" }), samplingText: intl.formatMessage({ id: "resourceManager.sampling" }), columns: {
                                process: intl.formatMessage({ id: "resourceManager.column.process" }),
                                pid: intl.formatMessage({ id: "resourceManager.column.pid" }),
                                cpu: intl.formatMessage({ id: "resourceManager.cpu" }),
                                memory: intl.formatMessage({ id: "resourceManager.memory" }),
                            } }, group.category))) })] })] }));
}
//# sourceMappingURL=ResourceManagerApp.js.map