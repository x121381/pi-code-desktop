import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useZCodeIntl } from "@/i18n/index.js";
const PAGE_SIZE = 100;
/** 网络页只轮询有界投影；采集生命周期属于 Main 中的窗口。 */
export function NetworkSection({ bridge }) {
    const { intl, locale } = useZCodeIntl();
    const timeFormat = useMemo(() => new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }), [locale]);
    const [snapshot, setSnapshot] = useState(null);
    const [failed, setFailed] = useState(false);
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(0);
    const [clearing, setClearing] = useState(false);
    const [revision, setRevision] = useState(0);
    const generation = useRef(0);
    useEffect(() => {
        if (!bridge || clearing)
            return;
        let disposed = false;
        let timer;
        const refresh = async () => {
            const startedGeneration = generation.current;
            try {
                const next = await bridge.getSnapshot();
                if (!disposed && startedGeneration === generation.current) {
                    setSnapshot(next);
                    setFailed(false);
                }
            }
            catch {
                if (!disposed && startedGeneration === generation.current)
                    setFailed(true);
            }
            if (!disposed)
                timer = setTimeout(refresh, 500);
        };
        void refresh();
        return () => {
            disposed = true;
            clearTimeout(timer);
        };
    }, [bridge, clearing, revision]);
    const records = useMemo(() => {
        const query = filter.trim().toLowerCase();
        return (snapshot?.records ?? [])
            .filter((record) => !query ||
            `${record.processType} ${record.pid} ${record.method} ${record.url}`
                .toLowerCase()
                .includes(query))
            .toSorted((left, right) => right.timestamp - left.timestamp || right.id - left.id);
    }, [snapshot, filter]);
    const pageCount = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount - 1);
    const clear = async () => {
        if (!bridge)
            return;
        // 清空前已发出的快照不能在返回后把旧列表写回来。
        generation.current++;
        setClearing(true);
        try {
            await bridge.clear();
            setSnapshot(null);
            setPage(0);
            setFailed(false);
        }
        catch {
            setFailed(true);
        }
        finally {
            setClearing(false);
            setRevision((value) => value + 1);
        }
    };
    const label = (id) => intl.formatMessage({ id: `resourceManager.network.${id}` });
    return (_jsxs("section", { className: "space-y-3", "aria-label": intl.formatMessage({ id: "resourceManager.network" }), children: [_jsx("p", { className: "text-ui-sm text-muted-foreground", children: label("description") }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx(Input, { className: "min-w-40 flex-1", value: filter, onChange: (event) => {
                            setFilter(event.target.value);
                            setPage(0);
                        }, "aria-label": label("filter"), placeholder: label("filter") }), _jsx(Button, { variant: "outline", disabled: !bridge || clearing, onClick: () => void clear(), children: label("clear") })] }), !bridge || failed ? (_jsx("p", { role: "alert", className: "text-ui-sm text-destructive", children: label("unavailable") })) : null, _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 text-ui-sm text-muted-foreground", children: [_jsx("span", { children: intl.formatMessage({ id: "resourceManager.network.count" }, { count: records.length, dropped: snapshot?.dropped ?? 0 }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", disabled: currentPage === 0, onClick: () => setPage(currentPage - 1), children: label("previous") }), _jsxs("span", { children: [currentPage + 1, " / ", pageCount] }), _jsx(Button, { variant: "ghost", disabled: currentPage + 1 === pageCount, onClick: () => setPage(currentPage + 1), children: label("next") })] })] }), _jsxs("div", { "data-testid": "resource-network-list", className: "overflow-x-auto rounded-xl border border-border bg-background", children: [_jsxs("table", { className: "w-full table-fixed text-left text-ui-sm", children: [_jsx("thead", { className: "text-muted-foreground", children: _jsxs("tr", { className: "border-b border-border", children: [_jsx("th", { className: "w-24 px-3 py-2 font-medium", children: label("time") }), _jsx("th", { className: "w-28 px-3 py-2 font-medium", children: label("process") }), _jsx("th", { className: "w-20 px-3 py-2 font-medium", children: label("method") }), _jsx("th", { className: "px-3 py-2 font-medium", children: "URL" })] }) }), _jsx("tbody", { children: records.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map((record) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-hover", children: [_jsx("td", { className: "whitespace-nowrap px-3 py-2 tabular-nums", children: timeFormat.format(record.timestamp) }), _jsxs("td", { className: "px-3 py-2", children: [_jsx("div", { children: record.processType }), _jsx("div", { className: "text-muted-foreground tabular-nums", children: record.pid })] }), _jsx("td", { className: "px-3 py-2 font-mono", children: record.method }), _jsx("td", { className: "break-all px-3 py-2 select-text", title: record.url, children: record.url })] }, record.id))) })] }), records.length === 0 ? (_jsx("p", { className: "p-6 text-center text-ui-sm text-muted-foreground", children: label(filter ? "noMatches" : "empty") })) : null] })] }));
}
//# sourceMappingURL=NetworkSection.js.map