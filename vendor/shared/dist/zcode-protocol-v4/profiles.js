export function filterConversationRowsForProfile(rows, _profile) {
    // HookInvocationRow 已收敛为 desktop/mobile 共用的 client-safe summary；当前没有
    // profile-specific 完整行，仍保留纯函数边界供未来受控 row 使用。
    return [...rows];
}
/**
 * 按 profile 的 streamPaths 开关过滤 delta 序列。
 * row.delta 按流式能力过滤；结构性完整行在两个 profile 中保持同一产品事实。
 * 纯函数，不修改入参；输出保持权威日志序。
 */
export function filterConversationDeltasForProfile(deltas, profile) {
    return deltas.filter((delta) => {
        if (delta.op === "row.delta")
            return profile.streamPaths[delta.path];
        return true;
    });
}
//# sourceMappingURL=profiles.js.map