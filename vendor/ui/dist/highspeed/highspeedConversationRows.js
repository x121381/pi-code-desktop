export function resolveNextHighspeedExpiryMs(rows, nowMs) {
    let nextExpiryMs;
    for (const row of rows) {
        if (row.kind !== "userInput" || !row.highspeed || row.highspeed.expiresAt <= nowMs)
            continue;
        if (nextExpiryMs === undefined || row.highspeed.expiresAt < nextExpiryMs) {
            nextExpiryMs = row.highspeed.expiresAt;
        }
    }
    return nextExpiryMs;
}
//# sourceMappingURL=highspeedConversationRows.js.map