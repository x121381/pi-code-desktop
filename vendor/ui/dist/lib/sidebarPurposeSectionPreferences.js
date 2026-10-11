export const SIDEBAR_PURPOSE_SECTION_IDS = ["projects", "conversations"];
export const SIDEBAR_PURPOSE_SECTION_PREFERENCES_STORAGE_KEY = "zcode-sidebar-purpose-section-preferences";
const DEFAULT_SIDEBAR_PURPOSE_SECTION_PREFERENCES = {
    projectsExpanded: true,
    conversationsExpanded: true,
    sectionOrder: [...SIDEBAR_PURPOSE_SECTION_IDS],
};
function getBrowserStorage() {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        return window.localStorage;
    }
    catch {
        return null;
    }
}
function getDefaultPreferences() {
    return {
        ...DEFAULT_SIDEBAR_PURPOSE_SECTION_PREFERENCES,
        sectionOrder: [...DEFAULT_SIDEBAR_PURPOSE_SECTION_PREFERENCES.sectionOrder],
    };
}
function normalizeSectionOrder(value) {
    if (!Array.isArray(value) || value.length !== SIDEBAR_PURPOSE_SECTION_IDS.length) {
        return [...SIDEBAR_PURPOSE_SECTION_IDS];
    }
    const sectionIds = new Set(value);
    if (sectionIds.size !== SIDEBAR_PURPOSE_SECTION_IDS.length ||
        SIDEBAR_PURPOSE_SECTION_IDS.some((sectionId) => !sectionIds.has(sectionId))) {
        return [...SIDEBAR_PURPOSE_SECTION_IDS];
    }
    return value;
}
export function reorderSidebarPurposeSections(sectionOrder, activeSectionId, overSectionId) {
    const currentOrder = normalizeSectionOrder(sectionOrder);
    const activeIndex = currentOrder.indexOf(activeSectionId);
    const overIndex = currentOrder.indexOf(overSectionId);
    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return currentOrder;
    }
    const nextOrder = [...currentOrder];
    const activeSection = nextOrder[activeIndex];
    if (!activeSection) {
        return currentOrder;
    }
    nextOrder.splice(activeIndex, 1);
    nextOrder.splice(overIndex, 0, activeSection);
    return nextOrder;
}
export function readSidebarPurposeSectionPreferences(storage = getBrowserStorage()) {
    try {
        const rawValue = storage?.getItem(SIDEBAR_PURPOSE_SECTION_PREFERENCES_STORAGE_KEY);
        if (!rawValue) {
            return getDefaultPreferences();
        }
        const parsed = JSON.parse(rawValue);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return getDefaultPreferences();
        }
        const value = parsed;
        return {
            projectsExpanded: typeof value.projectsExpanded === "boolean"
                ? value.projectsExpanded
                : DEFAULT_SIDEBAR_PURPOSE_SECTION_PREFERENCES.projectsExpanded,
            conversationsExpanded: typeof value.conversationsExpanded === "boolean"
                ? value.conversationsExpanded
                : DEFAULT_SIDEBAR_PURPOSE_SECTION_PREFERENCES.conversationsExpanded,
            sectionOrder: normalizeSectionOrder(value.sectionOrder),
        };
    }
    catch {
        return getDefaultPreferences();
    }
}
export function persistSidebarPurposeSectionPreferences(preferences, storage = getBrowserStorage()) {
    try {
        storage?.setItem(SIDEBAR_PURPOSE_SECTION_PREFERENCES_STORAGE_KEY, JSON.stringify({
            projectsExpanded: preferences.projectsExpanded,
            conversationsExpanded: preferences.conversationsExpanded,
            sectionOrder: normalizeSectionOrder(preferences.sectionOrder),
        }));
    }
    catch {
        // 受限 WebView 或隐私模式可能禁止写 localStorage；偏好写入失败不能阻断侧栏交互。
    }
}
//# sourceMappingURL=sidebarPurposeSectionPreferences.js.map