const STORAGE_KEY = "zcode-automations-page-tab";
function storage() {
    try {
        return typeof sessionStorage === "undefined" ? null : sessionStorage;
    }
    catch {
        return null;
    }
}
export function readAutomationsPageTab() {
    try {
        const value = storage()?.getItem(STORAGE_KEY);
        return value === "workflow" ? "workflow" : "automation";
    }
    catch {
        return "automation";
    }
}
export function writeAutomationsPageTab(tab) {
    try {
        storage()?.setItem(STORAGE_KEY, tab);
    }
    catch {
        // sessionStorage 不可用（隐私模式 / 配额）就不记；下次打开回到默认标签，不影响功能。
    }
}
//# sourceMappingURL=automationsPageTabMemory.js.map