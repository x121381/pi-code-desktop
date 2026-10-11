export function formatGroupedTaskHoverChangeParts(summary) {
    if (!summary) {
        return [];
    }
    const parts = [];
    if (summary.added > 0) {
        parts.push(`+${summary.added}`);
    }
    if (summary.removed > 0) {
        parts.push(`-${summary.removed}`);
    }
    return parts;
}
//# sourceMappingURL=task-row-tooltip.js.map