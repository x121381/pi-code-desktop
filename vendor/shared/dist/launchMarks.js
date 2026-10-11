/** 主窗口 loadURL query string 中携带 launch marks 的参数名 */
export const LAUNCH_MARKS_QUERY_KEY = "zcodeLaunchMarks";
export function serializeLaunchMarks(marks) {
    return JSON.stringify(marks);
}
export function parseLaunchMarks(raw) {
    if (raw == null || raw === "") {
        return null;
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        return null;
    }
    if (parsed == null || typeof parsed !== "object") {
        return null;
    }
    const record = parsed;
    const keys = ["createdAt", "mainStart", "appReady", "loadUrl"];
    const result = {};
    for (const key of keys) {
        const value = record[key];
        if (typeof value !== "number" || !Number.isFinite(value)) {
            return null;
        }
        result[key] = value;
    }
    return result;
}
//# sourceMappingURL=launchMarks.js.map