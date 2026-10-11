export function isObjectRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function readTrimmedString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
}
//# sourceMappingURL=jsonLineRecord.js.map