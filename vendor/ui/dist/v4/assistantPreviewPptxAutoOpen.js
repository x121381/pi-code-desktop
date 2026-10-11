export function createAssistantPreviewPptxAutoOpenGateState() {
    return { scopeKey: "", armed: false };
}
export function resolveLatestCompletedAssistantPreviewTurn(rows) {
    const latestHeader = [...rows]
        .reverse()
        .find((row) => row.kind === "turnHeader");
    if (!latestHeader || latestHeader.state !== "completedSuccess") {
        return null;
    }
    const latestAssistant = [...rows]
        .reverse()
        .find((row) => row.kind === "assistantText" && row.turnId === latestHeader.turnId);
    if (!latestAssistant || latestAssistant.state !== "complete")
        return null;
    return {
        turnId: latestAssistant.turnId,
        rowId: latestAssistant.rowId,
        ...(latestAssistant.entityId ? { entityId: latestAssistant.entityId } : {}),
    };
}
export function advanceAssistantPreviewPptxAutoOpenGate(previous, input) {
    const scopeChanged = previous.scopeKey !== input.scopeKey;
    const current = scopeChanged ? { scopeKey: input.scopeKey, armed: false } : previous;
    if (!input.enabled) {
        return {
            state: { scopeKey: input.scopeKey, armed: false },
            target: null,
        };
    }
    if (input.phase === "running") {
        return {
            state: { scopeKey: input.scopeKey, armed: true },
            target: null,
        };
    }
    if (input.phase !== "completedSuccess") {
        return {
            state: { scopeKey: input.scopeKey, armed: false },
            ...(scopeChanged || current.armed ? { target: null } : {}),
        };
    }
    // 冷恢复会直接落在 completedSuccess，但没有观察到本 renderer 的 running 边沿。
    // 只保留已武装但终态 assistant row 尚未到齐的状态，避免依赖 phase/row 到达顺序。
    if (!current.armed || !input.completedTurn) {
        return { state: current };
    }
    const target = {
        turnId: input.completedTurn.turnId,
        key: JSON.stringify([
            input.scopeKey,
            input.logEpoch ?? "",
            input.completedTurn.turnId,
            input.completedTurn.rowId,
            input.completedTurn.entityId ?? "",
        ]),
    };
    return {
        state: { scopeKey: input.scopeKey, armed: false },
        target,
    };
}
//# sourceMappingURL=assistantPreviewPptxAutoOpen.js.map