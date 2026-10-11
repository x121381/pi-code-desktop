const DAY_MS = 24 * 60 * 60 * 1000;
function startOfDay(timestamp) {
    const date = new Date(timestamp);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
function startOfMonth(timestamp) {
    const date = new Date(timestamp);
    return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
}
function startOfWeek(timestamp, locale) {
    const date = new Date(startOfDay(timestamp));
    const day = date.getDay();
    const weekStartsOn = locale === "en-US" ? 0 : 1;
    const offset = (day - weekStartsOn + 7) % 7;
    date.setDate(date.getDate() - offset);
    return date.getTime();
}
export function resolveTaskTimelineGroupKey(timestamp, now, locale) {
    const todayStart = startOfDay(now);
    const itemDayStart = startOfDay(timestamp);
    const dayDiff = Math.floor((todayStart - itemDayStart) / DAY_MS);
    if (dayDiff <= 0) {
        return { kind: "today" };
    }
    if (dayDiff === 1) {
        return { kind: "yesterday" };
    }
    if (dayDiff <= 3) {
        return { kind: "daysAgo", daysAgo: dayDiff };
    }
    const thisWeekStart = startOfWeek(now, locale);
    if (itemDayStart >= thisWeekStart) {
        return { kind: "thisWeek" };
    }
    const lastWeekStart = thisWeekStart - 7 * DAY_MS;
    if (itemDayStart >= lastWeekStart) {
        return { kind: "lastWeek" };
    }
    const thisMonthStart = startOfMonth(now);
    if (itemDayStart >= thisMonthStart) {
        return { kind: "thisMonth" };
    }
    const nowDate = new Date(now);
    const lastMonthStart = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 1).getTime();
    if (itemDayStart >= lastMonthStart) {
        return { kind: "lastMonth" };
    }
    return { kind: "older" };
}
export function getTaskTimelineGroupMessage(groupKey) {
    if (groupKey.kind === "daysAgo") {
        return {
            id: "taskTimeline.daysAgo",
            values: { days: String(groupKey.daysAgo ?? 0) },
        };
    }
    return { id: `taskTimeline.${groupKey.kind}` };
}
function serializeTaskTimelineGroupKey(groupKey) {
    return groupKey.kind === "daysAgo" ? `${groupKey.kind}:${groupKey.daysAgo ?? 0}` : groupKey.kind;
}
export function groupTaskTimelineItems(items, options) {
    const groups = [];
    const groupByKey = new Map();
    for (const item of items) {
        const timestamp = options.sortBy === "created" ? item.createdAt : item.updatedAt;
        const label = resolveTaskTimelineGroupKey(timestamp, options.now, options.locale);
        const key = serializeTaskTimelineGroupKey(label);
        const existingGroup = groupByKey.get(key);
        if (existingGroup) {
            existingGroup.items.push(item);
            continue;
        }
        const group = { key, label, items: [item] };
        groupByKey.set(key, group);
        groups.push(group);
    }
    return groups;
}
//# sourceMappingURL=taskTimelineGroups.js.map