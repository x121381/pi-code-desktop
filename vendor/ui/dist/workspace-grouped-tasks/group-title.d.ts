/** 系统分组标题按语言环境本地化展示，忽略 DB 里存的固定占位标题（'cron' / 'off-peak'）。 */
declare function getTaskGroupDisplayTitle(group: {
    id: string;
    title: string;
}, localizedSystemTitles: {
    cron: string;
    offPeak: string;
}): string;
export { getTaskGroupDisplayTitle };
//# sourceMappingURL=group-title.d.ts.map