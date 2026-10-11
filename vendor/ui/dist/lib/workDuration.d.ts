/**
 * 「工作了 1 分 42 秒」的时长写法（`chat.history.workedFor`），从 `ConversationTurnGroup` 抽出，
 * 好让工作流完成卡的「时间」格与轮头的折叠标签
 * 一字不差：同一段时间在两处必须写成同一个样子。
 *
 * 规则：秒向最近取整、至少 1 秒；天 / 时 / 分 / 秒里只写非零的，**最多两段**（`1h 3m`，
 * 不写秒）；英文单位紧贴数字，中文单位前留一个空格。
 */
type FormatMessage = (descriptor: {
    id: string;
}) => string;
interface WorkDurationPart {
    value: number;
    /** 本地化后的单位词（`m` / `分`）。 */
    unit: string;
}
/** 拆成 `[{value, unit}]`，给要把数字与单位分开排的地方（完成卡的大数字）。 */
export declare function workDurationParts(durationMs: number, formatMessage: FormatMessage): WorkDurationPart[];
/** 中文时长单位与数字之间留空格以保持可读；英文缩写单位紧贴数字。 */
export declare function workDurationUnitSeparator(locale: string): string;
export declare function formatWorkDuration(durationMs: number | undefined, formatMessage: FormatMessage, locale: string): string | null;
export {};
//# sourceMappingURL=workDuration.d.ts.map