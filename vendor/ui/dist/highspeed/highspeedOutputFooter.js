import { calculateHighspeedSavedDurationMs } from "@/highspeed/highspeedSavedTime.js";
/**
 * 给同一张卡覆盖的最后一个渲染单元打上 footer 标记。
 *
 * Bug 根因：footer 过去在单个 turn 内按 accelerated 判定，一张卡覆盖多轮时会重复显示。
 * 必须在虚拟化前按持久化 cardId 和过期时间统一收口，组尾才能随新 turn 与倒计时稳定后移。
 */
export function markHighspeedOutputFooterUnits(units, nowMs) {
    const footerByUnitIndex = resolveHighspeedOutputFooters(units, nowMs);
    return units.map((unit, index) => {
        if (!footerByUnitIndex.has(index))
            return unit;
        const target = footerByUnitIndex.get(index);
        return {
            ...unit,
            showHighspeedOutputFooter: true,
            ...(target ? { highspeedOutputFooterTarget: target } : {}),
        };
    });
}
function resolveHighspeedOutputFooters(units, nowMs) {
    const cardsByUnit = units.map((unit) => unit.visibleUserInputs.flatMap((row) => (row.highspeed ? [row.highspeed] : [])));
    const cardStateById = new Map();
    cardsByUnit.forEach((cards, index) => {
        for (const card of cards) {
            const current = cardStateById.get(card.cardId);
            cardStateById.set(card.cardId, {
                lastUnitIndex: index,
                // Bug 原因：组尾异常/中断可能自身没有正文，但前序 accelerated turn 已有输出。
                // footer 属于整张卡，不能只看最后一轮；timeline 边界不是模型 output，不计入。
                hasOutput: (current?.hasOutput ?? false) ||
                    (card.outputTokens ?? 0) > 0 ||
                    units[index].assistantWorkRows.some((row) => row.kind !== "timelineMarker"),
                metas: [...(current?.metas ?? []), card],
            });
        }
    });
    const footerByUnitIndex = new Map();
    cardsByUnit.forEach((cards, index) => {
        const footerCard = cards.find((card) => {
            const state = cardStateById.get(card.cardId);
            return card.expiresAt <= nowMs && state?.lastUnitIndex === index && state.hasOutput;
        });
        if (!footerCard)
            return;
        const metrics = aggregatePersistedHighspeedMetrics(cardStateById.get(footerCard.cardId)?.metas ?? []);
        footerByUnitIndex.set(index, metrics ? { cardId: footerCard.cardId, metrics } : null);
    });
    return footerByUnitIndex;
}
function aggregatePersistedHighspeedMetrics(metas) {
    if (metas.length === 0 ||
        metas.some((meta) => meta.outputTokens === undefined ||
            meta.regularTps === undefined ||
            meta.regularTps <= 0 ||
            meta.highspeedTps === undefined ||
            meta.highspeedTps <= 0)) {
        return null;
    }
    const outputTokens = metas.reduce((total, meta) => total + (meta.outputTokens ?? 0), 0);
    if (outputTokens <= 0)
        return null;
    const regularDurationSeconds = metas.reduce((total, meta) => total + (meta.outputTokens ?? 0) / (meta.regularTps ?? 1), 0);
    const savedDurationMs = metas.reduce((total, meta) => total +
        (meta.savedDurationMs ??
            calculateHighspeedSavedDurationMs({
                outputTokens: meta.outputTokens ?? 0,
                regularTps: meta.regularTps ?? 0,
                highspeedTps: meta.highspeedTps ?? 0,
                durationMs: meta.durationMs ?? 0,
                modelDurationMs: meta.modelDurationMs,
                toolDurationMs: meta.toolDurationMs,
                otherDurationMs: meta.otherDurationMs,
            })), 0);
    return {
        outputTokens,
        durationMs: metas.reduce((total, meta) => total + (meta.durationMs ?? 0), 0),
        ...(metas.every((meta) => meta.modelDurationMs !== undefined && meta.toolDurationMs !== undefined)
            ? {
                modelDurationMs: metas.reduce((total, meta) => total + (meta.modelDurationMs ?? 0), 0),
                toolDurationMs: metas.reduce((total, meta) => total + (meta.toolDurationMs ?? 0), 0),
                otherDurationMs: metas.reduce((total, meta) => total +
                    (meta.otherDurationMs ??
                        Math.max(0, (meta.durationMs ?? 0) - (meta.modelDurationMs ?? 0) - (meta.toolDurationMs ?? 0))), 0),
            }
            : {}),
        savedDurationMs,
        regularTps: outputTokens / regularDurationSeconds,
        // healthy 返回卡级累计 TPS，同卡各 turn 持久化的是同一个权威值。
        highspeedTps: metas[0].highspeedTps,
    };
}
//# sourceMappingURL=highspeedOutputFooter.js.map