const UNIT_IDS = {
    day: "chat.history.duration.day",
    hour: "chat.history.duration.hour",
    minute: "chat.history.duration.minute",
    second: "chat.history.duration.second",
};
/** 拆成 `[{value, unit}]`，给要把数字与单位分开排的地方（完成卡的大数字）。 */
export function workDurationParts(durationMs, formatMessage) {
    const totalSeconds = Math.max(1, Math.round(durationMs / 1000));
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (days > 0)
        parts.push({ value: days, unit: formatMessage({ id: UNIT_IDS.day }) });
    if (hours > 0)
        parts.push({ value: hours, unit: formatMessage({ id: UNIT_IDS.hour }) });
    if (minutes > 0)
        parts.push({ value: minutes, unit: formatMessage({ id: UNIT_IDS.minute }) });
    if (seconds > 0 || parts.length === 0) {
        parts.push({ value: seconds, unit: formatMessage({ id: UNIT_IDS.second }) });
    }
    return parts.slice(0, 2);
}
/** 中文时长单位与数字之间留空格以保持可读；英文缩写单位紧贴数字。 */
export function workDurationUnitSeparator(locale) {
    return locale === "zh-CN" ? " " : "";
}
export function formatWorkDuration(durationMs, formatMessage, locale) {
    if (durationMs === undefined)
        return null;
    const separator = workDurationUnitSeparator(locale);
    return workDurationParts(durationMs, formatMessage)
        .map((part) => `${part.value}${separator}${part.unit}`)
        .join(" ");
}
//# sourceMappingURL=workDuration.js.map