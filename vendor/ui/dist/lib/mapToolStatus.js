const statusMap = {
    pending: "input-streaming",
    in_progress: "input-available",
    completed: "output-available",
    failed: "output-error",
    stopped: "output-error",
    denied: "output-denied", // todo ZCode schema 定义里没这个字段
};
export function mapToolStatus(status) {
    return statusMap[status] ?? "input-streaming";
}
//# sourceMappingURL=mapToolStatus.js.map