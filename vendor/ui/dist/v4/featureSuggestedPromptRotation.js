import { getRecommendedPromptPool } from "@/v4/featureSuggestedPrompts.js";
const panes = new Map();
const listeners = new Set();
let revision = 0;
function notify() {
    revision += 1;
    for (const listener of listeners)
        listener();
}
export function subscribeRecommendedPrompts(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
export function getRecommendedPromptsRevision() {
    return revision;
}
export function registerRecommendedPromptPane(id, mode) {
    const existing = panes.get(id);
    if (existing?.mode === mode)
        return;
    const cursor = existing?.cursor ?? 0;
    const pane = { mode, cursor, items: [] };
    panes.set(id, pane);
    pane.items = selectForPane(getRecommendedPromptPool(mode === "office"), cursor, ...usedByOtherPanes(id, mode));
    notify();
}
export function unregisterRecommendedPromptPane(id) {
    if (panes.delete(id))
        notify();
}
export function advanceRecommendedPromptPane(id) {
    const pane = panes.get(id);
    if (!pane)
        return;
    // 每个候选都要有机会成为本批首项；固定跳三格会让避重时跳过的候选永远不可达。
    pane.cursor += 1;
    pane.items = selectForPane(getRecommendedPromptPool(pane.mode === "office"), pane.cursor, ...usedByOtherPanes(id, pane.mode), new Set(pane.items.map((item) => item.id)));
    notify();
}
function usedByOtherPanes(id, mode) {
    const ids = new Set();
    const plugins = new Set();
    const icons = new Set();
    for (const [paneId, pane] of panes) {
        if (paneId === id || pane.mode !== mode)
            continue;
        for (const item of pane.items) {
            ids.add(item.id);
            icons.add(iconKey(item));
            for (const pluginId of pluginIds(item))
                plugins.add(pluginId);
        }
    }
    return [ids, plugins, icons];
}
function pluginIds(item) {
    const ids = new Set();
    if (item.plugin)
        ids.add(item.plugin.stableId);
    for (const prompt of [item.prompt.cn, item.prompt.en]) {
        for (const match of prompt?.matchAll(/\(plugin:\/\/([\w.-]+@[\w.-]+)\)/g) ?? []) {
            if (match[1])
                ids.add(match[1]);
        }
    }
    return [...ids];
}
function iconKey(item) {
    return item.iconUrl ?? item.iconName ?? item.plugin?.stableId ?? item.id;
}
function selectForPane(pool, cursor, globalIds, globalPlugins, globalIcons, previousIds = new Set()) {
    if (pool.length === 0)
        return [];
    const selected = [];
    const localPlugins = new Set();
    const localIcons = new Set();
    const candidates = pool.map((_, index) => pool[(cursor + index) % pool.length]);
    // 换一批优先全部换新；候选不足时才复用旧条目，并继续尽量保证同屏图标不同。
    for (const avoidPrevious of [true, false]) {
        for (const avoidGlobal of [true, false]) {
            for (const item of candidates) {
                if (selected.length >= Math.min(3, pool.length))
                    break;
                if (selected.some((chosen) => chosen.id === item.id) ||
                    ((avoidGlobal || previousIds.size === 0) && globalIds.has(item.id)) ||
                    (avoidPrevious && previousIds.has(item.id)))
                    continue;
                const plugins = pluginIds(item);
                const icon = iconKey(item);
                if (localIcons.has(icon))
                    continue;
                if (plugins.some((id) => localPlugins.has(id)))
                    continue;
                if (avoidGlobal && (globalIcons.has(icon) || plugins.some((id) => globalPlugins.has(id))))
                    continue;
                selected.push(item);
                localIcons.add(icon);
                for (const id of plugins)
                    localPlugins.add(id);
            }
        }
    }
    for (const avoidPrevious of [true, false]) {
        for (const item of candidates) {
            if (selected.length >= Math.min(3, pool.length))
                break;
            if (avoidPrevious && previousIds.has(item.id))
                continue;
            if (!selected.some((chosen) => chosen.id === item.id))
                selected.push(item);
        }
    }
    for (const item of selected) {
        globalIds.add(item.id);
        globalIcons.add(iconKey(item));
        for (const id of pluginIds(item))
            globalPlugins.add(id);
    }
    return selected;
}
export function getRecommendedPromptsForPane(id, mode) {
    const pane = panes.get(id);
    if (pane?.mode === mode)
        return pane.items;
    return selectForPane(getRecommendedPromptPool(mode === "office"), 0, ...usedByOtherPanes(id, mode));
}
//# sourceMappingURL=featureSuggestedPromptRotation.js.map