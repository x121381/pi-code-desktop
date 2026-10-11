import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppWindow } from "lucide-react";
import { useEffect, useState } from "react";
import { useOptionalPlatform } from "../../hooks/usePlatform.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { readToolResultDisplay } from "../../ToolCallBlocks/toolResultDisplay.js";
function asRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value)
        ? value
        : null;
}
function readText(record, key) {
    const value = record?.[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
}
function parseCuaResultList(value) {
    if (Array.isArray(value))
        return value;
    if (typeof value !== "string")
        return null;
    const candidate = value.split("\n\nStructured content:", 1)[0]?.trim();
    if (!candidate?.startsWith("["))
        return null;
    try {
        const parsed = JSON.parse(candidate);
        return Array.isArray(parsed) ? parsed : null;
    }
    catch {
        return null;
    }
}
function parseStructuredCuaResultList(value) {
    if (Array.isArray(value))
        return value;
    if (typeof value === "string") {
        try {
            return parseStructuredCuaResultList(JSON.parse(value));
        }
        catch {
            return null;
        }
    }
    const result = asRecord(value)?.result;
    return result === undefined ? null : parseStructuredCuaResultList(result);
}
function readCuaResultList(toolCall) {
    const display = readToolResultDisplay(toolCall.raw);
    // v4/replayable 的稳定事实源是 display；legacy 文本可能已被 head/tail 裁剪。
    const displayRows = display?.kind === "cua" ? parseStructuredCuaResultList(display.structuredContent) : null;
    return (displayRows ??
        parseCuaResultList(toolCall.output) ??
        parseCuaResultList(readText(asRecord(toolCall.raw), "rawOutput")) ??
        []);
}
export function buildCuaDetailList(toolName, toolCall) {
    const rows = readCuaResultList(toolCall);
    if (toolName === "list_apps") {
        const items = rows.flatMap((value) => {
            const record = asRecord(value);
            const name = readText(record, "name");
            if (!name)
                return [];
            return [
                {
                    name,
                    bundleId: readText(record, "bundle_id"),
                    active: record?.active === true,
                },
            ];
        });
        items.sort((left, right) => Number(right.active) - Number(left.active));
        return { kind: "apps", items };
    }
    if (toolName === "list_windows") {
        const items = rows.flatMap((value) => {
            const record = asRecord(value);
            if (!record)
                return [];
            const bounds = Array.isArray(record.bounds) ? record.bounds : [];
            return [
                {
                    title: readText(record, "title"),
                    width: typeof bounds[2] === "number" ? bounds[2] : null,
                    height: typeof bounds[3] === "number" ? bounds[3] : null,
                    main: record.main === true,
                    focused: record.focused === true,
                },
            ];
        });
        return { kind: "windows", items };
    }
    return undefined;
}
function CuaAppList({ items }) {
    const { intl } = useZCodeIntl();
    const platform = useOptionalPlatform();
    const [icons, setIcons] = useState({});
    useEffect(() => {
        let active = true;
        const bundleIds = [...new Set(items.flatMap((item) => (item.bundleId ? [item.bundleId] : [])))];
        if (!platform?.getApplicationIcon || bundleIds.length === 0)
            return () => undefined;
        void Promise.all(bundleIds.map(async (bundleId) => {
            const result = await platform.getApplicationIcon?.(bundleId);
            return [bundleId, result?.iconDataUrl ?? null];
        })).then((results) => {
            if (!active)
                return;
            setIcons(Object.fromEntries(results.filter((entry) => Boolean(entry[1]))));
        });
        return () => {
            active = false;
        };
    }, [items, platform]);
    return (_jsx("div", { className: "max-h-64 space-y-1 overflow-y-auto pr-1", children: items.map((item, index) => (_jsxs("div", { className: "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-hover", children: [item.bundleId && icons[item.bundleId] ? (_jsx("img", { src: icons[item.bundleId], alt: "", "aria-hidden": true, className: "size-4 shrink-0 object-contain" })) : (_jsx(AppWindow, { className: "size-4 shrink-0 text-foreground-subtle" })), _jsx("span", { className: "min-w-0 flex-1 truncate text-sm text-foreground", children: item.name }), item.active ? (_jsx("span", { className: "shrink-0 text-sm text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.cua.details.active" }) })) : null] }, `${item.bundleId ?? item.name}:${index}`))) }));
}
function CuaWindowList({ items }) {
    const { intl } = useZCodeIntl();
    return (_jsx("div", { className: "max-h-64 space-y-1 overflow-y-auto pr-1", children: items.map((item, index) => (_jsxs("div", { className: "flex min-w-0 items-center gap-3 rounded-md px-2 py-1.5 hover:bg-surface-hover", children: [_jsx(AppWindow, { className: "size-4 shrink-0 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "truncate text-sm text-foreground", children: item.title ?? intl.formatMessage({ id: "chat.toolCall.cua.details.untitledWindow" }) }), item.main || item.focused ? (_jsxs("div", { className: "flex flex-wrap gap-x-2 text-sm text-foreground-subtle", children: [item.main ? (_jsx("span", { children: intl.formatMessage({ id: "chat.toolCall.cua.details.mainWindow" }) })) : null, item.focused ? (_jsx("span", { children: intl.formatMessage({ id: "chat.toolCall.cua.details.focused" }) })) : null] })) : null] }), item.width !== null && item.height !== null ? (_jsxs("span", { className: "shrink-0 font-mono text-sm text-foreground-subtle", children: [item.width, " \u00D7 ", item.height] })) : null] }, `${item.title ?? "untitled"}:${index}`))) }));
}
export function CuaDetailListSection({ list }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("section", { className: "space-y-2 border-t border-border pt-3", children: [_jsx("h4", { className: "text-sm text-foreground-subtle", children: intl.formatMessage({
                    id: list.kind === "apps"
                        ? "chat.toolCall.cua.details.appList"
                        : "chat.toolCall.cua.details.windowList",
                }) }), list.kind === "apps" ? (_jsx(CuaAppList, { items: list.items })) : (_jsx(CuaWindowList, { items: list.items }))] }));
}
//# sourceMappingURL=cuaListDetails.js.map