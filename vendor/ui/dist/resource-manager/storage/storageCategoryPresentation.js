import { Activity, Archive, Blocks, Bot, Database, FileOutput, FileText, Folder, KeyRound, PackageOpen, Route, } from "lucide-react";
import { APP_USAGE_MODEL_CHART_COLORS } from "../../settings/usage-stats/appUsageChartPalette.js";
export const STORAGE_CATEGORY_ICONS = {
    sessionStore: Database,
    subagentTranscripts: Bot,
    toolOutputs: FileOutput,
    modelTrajectory: Route,
    devTraces: Activity,
    logs: FileText,
    backups: Archive,
    exports: PackageOpen,
    runtimes: Blocks,
    config: KeyRound,
    other: Folder,
};
export const STORAGE_LEGEND_MAX_ITEMS = APP_USAGE_MODEL_CHART_COLORS.length;
export const STORAGE_LEGEND_REST_COLOR = "var(--color-foreground-subtlest)";
export function storageCategoryTitleId(id) {
    return `resourceManager.storage.category.${id}`;
}
export function storageCategoryDescriptionId(id) {
    return `resourceManager.storage.categoryDescription.${id}`;
}
/** 把多个根的同类别占用合并，按 bytes 降序（同为 0 时保持目录顺序）。 */
export function sumCategoriesAcrossRoots(roots) {
    const totals = new Map();
    for (const root of roots) {
        for (const category of root.categories) {
            const current = totals.get(category.id);
            if (current) {
                current.bytes += category.bytes;
                current.fileCount += category.fileCount;
            }
            else {
                totals.set(category.id, {
                    id: category.id,
                    bytes: category.bytes,
                    fileCount: category.fileCount,
                    cleanability: category.cleanability,
                });
            }
        }
    }
    return [...totals.values()].sort((a, b) => b.bytes - a.bytes);
}
/** 图例与进度条：最多 N 个彩色类别，其余非零类别折叠成一个灰色「其余」项。 */
export function buildStorageLegend(totals) {
    const nonZero = totals.filter((item) => item.bytes > 0);
    const head = nonZero.slice(0, STORAGE_LEGEND_MAX_ITEMS);
    const rest = nonZero.slice(STORAGE_LEGEND_MAX_ITEMS);
    const legend = head.map((item, index) => ({
        id: item.id,
        bytes: item.bytes,
        color: APP_USAGE_MODEL_CHART_COLORS[index] ?? STORAGE_LEGEND_REST_COLOR,
    }));
    if (rest.length > 0) {
        legend.push({
            id: "rest",
            bytes: rest.reduce((sum, item) => sum + item.bytes, 0),
            color: STORAGE_LEGEND_REST_COLOR,
            restCount: rest.length,
        });
    }
    return legend;
}
/** 明细里「在文件管理器中显示」需要绝对路径；根路径来自 host，按其分隔符拼接。 */
export function joinStoragePath(rootPath, relativePath) {
    const separator = rootPath.includes("\\") && !rootPath.includes("/") ? "\\" : "/";
    const normalizedRelative = separator === "\\" ? relativePath.replace(/\//g, "\\") : relativePath;
    return `${rootPath.replace(/[\\/]+$/, "")}${separator}${normalizedRelative}`;
}
//# sourceMappingURL=storageCategoryPresentation.js.map