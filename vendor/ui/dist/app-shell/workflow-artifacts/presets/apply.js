/**
 * `applyArtifactItems` —— 把一串 `report(item, artifactId)` 条目折成预置看板的视图模型。
 *
 * 纯函数、不含 React：看板本身**不存数据**，它的每一个点 / 行 / 卡片都是一条 journal 上
 * `kind = "report"` 且 `artifact_id` 命中的条目。同一批条目重放两次必须得到同一张图，所以这里不许有任何
 * 时间、随机或外部状态；折叠规则全部由 spec 决定。
 *
 * 条目只会**追加**（journal 只追加），所以四种折叠都可以按到达顺序单遍完成。
 */
import { readWorkflowArtifactField } from "@zcode/shared/zcode-protocol-v4";
import { artifactFieldLabel, chartSeriesFields, } from "@/app-shell/workflow-artifacts/presets/spec.js";
/** 落到末尾「其他」列的列 id；spec 的 columns 里若真有同名列，会与它合并——可接受。 */
const BOARD_OTHER_COLUMN_ID = "__other__";
/**
 * 点路径读取："timing.after"、"rounds.0.ms"。规则是协议上的契约
 * （`readWorkflowArtifactField`）：CLI 只取字段时在 SQLite 里按同一套规则取值，两边必须逐字相同。
 */
export function readArtifactField(item, path) {
    return readWorkflowArtifactField(item, path);
}
/**
 * 从一条到达的条目里取字段：只取字段的条目查表（CLI 已按同一条规则取好，走不通的路径不在表里），
 * 整条 item 的条目（老 CLI）现场按路径读。四种折叠都只经这一个口子读条目。
 */
function readEntryField(entry, path) {
    if (entry.fields !== undefined) {
        return Object.hasOwn(entry.fields, path) ? entry.fields[path] : undefined;
    }
    return readArtifactField(entry.item, path);
}
/**
 * 「这条条目带这个字段吗」。`undefined` 与 `null` 都算不带：
 * metrics 的「最后一条带该字段的条目」若把显式 null 也算进去，一次清空就会把瓦片钉死在空值上。
 */
function hasValue(value) {
    return value !== undefined && value !== null;
}
/** 数值化：真数字直接用；数字串也接（脚本从命令输出里抠出来的值常是字符串）。 */
function toFiniteNumber(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === "string" && value.trim().length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
}
/** 单元格 / 卡片明细的显示文本。对象走紧凑 JSON——比 "[object Object]" 有用得多。 */
export function formatArtifactValue(value) {
    if (value === undefined || value === null) {
        return "";
    }
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
        return String(value);
    }
    try {
        return JSON.stringify(value) ?? "";
    }
    catch {
        // 循环引用等：宁可显示一句占位，也不要让整张表抛异常。
        return String(value);
    }
}
function seriesKey(index) {
    return `y${index}`;
}
function applyChart(spec, items) {
    const fields = chartSeriesFields(spec);
    const series = fields.map((field, index) => ({
        key: seriesKey(index),
        field: field.field,
        label: artifactFieldLabel(field),
        ...(field.unit ? { unit: field.unit } : {}),
        colorIndex: index,
    }));
    const raws = [];
    let baseline;
    for (const entry of items) {
        const rawX = readEntryField(entry, spec.x.field);
        if (!hasValue(rawX)) {
            // x 都没有的条目在图上无处安放；静默跳过（它仍在 Results 区里可见）。
            continue;
        }
        const values = fields.map((field) => {
            const value = toFiniteNumber(readEntryField(entry, field.field));
            if (value === undefined) {
                return undefined;
            }
            // log 轴上非正数没有位置——丢该点的这一维，而不是丢整条序列或整张图。
            return spec.scale === "log" && value <= 0 ? undefined : value;
        });
        raws.push({ sequence: entry.sequence, x: rawX, values });
        if (spec.baseline && !baseline) {
            const raw = readEntryField(entry, spec.baseline.field);
            const value = toFiniteNumber(raw);
            if (value !== undefined && !(spec.scale === "log" && value <= 0)) {
                baseline = {
                    value,
                    label: artifactFieldLabel(spec.baseline),
                    ...(spec.baseline.unit ? { unit: spec.baseline.unit } : {}),
                };
            }
        }
    }
    // 数值 x 才排序。混了一个非数值就整轴退化成「到达顺序」——半排序的 x 轴比不排序更骗人。
    const numericX = raws.length > 0 && raws.every((raw) => toFiniteNumber(raw.x) !== undefined);
    const ordered = numericX
        ? [...raws].sort((left, right) => {
            const delta = toFiniteNumber(left.x) - toFiniteNumber(right.x);
            // 同 x 时按到达顺序，保证同一批条目每次折叠出同一个顺序。
            return delta !== 0 ? delta : left.sequence - right.sequence;
        })
        : raws;
    const points = ordered.map((raw, index) => {
        const x = numericX ? toFiniteNumber(raw.x) : index;
        const point = {
            sequence: raw.sequence,
            x,
            xLabel: formatArtifactValue(raw.x),
        };
        raw.values.forEach((value, seriesIndex) => {
            point[seriesKey(seriesIndex)] = value ?? null;
        });
        return point;
    });
    const yValues = ordered.flatMap((raw) => raw.values.filter((value) => value !== undefined));
    const domain = points.length > 0 && yValues.length > 0
        ? {
            xMin: Math.min(...points.map((point) => point.x)),
            xMax: Math.max(...points.map((point) => point.x)),
            yMin: Math.min(...yValues),
            yMax: Math.max(...yValues),
        }
        : undefined;
    return {
        kind: "chart",
        type: spec.type ?? "line",
        scale: spec.scale ?? "linear",
        series,
        points,
        x: {
            label: artifactFieldLabel(spec.x),
            ...(spec.x.unit ? { unit: spec.x.unit } : {}),
            numeric: numericX,
        },
        ...(baseline ? { baseline } : {}),
        ...(domain ? { domain } : {}),
    };
}
function applyTable(spec, items) {
    const columns = spec.columns.map((column) => ({
        field: column.field,
        label: artifactFieldLabel(column),
        ...(column.unit ? { unit: column.unit } : {}),
    }));
    // key 在场 = upsert：后到的条目替换整行，但**行保持首次出现的位置**——
    // 一张会跳动排序的表在运行期没法读。
    const byId = new Map();
    for (const entry of items) {
        const keyValue = spec.key ? readEntryField(entry, spec.key) : undefined;
        // key 缺席（或声明了 key 但这条没带）时用 journal 身份兜底：`siteId@ordinal` 逐条唯一，
        // 于是 upsert 自然退化成追加——不必为两种模式各写一条路径。
        const id = hasValue(keyValue)
            ? formatArtifactValue(keyValue)
            : `${entry.siteId}@${entry.ordinal}`;
        byId.set(id, {
            id,
            sequence: entry.sequence,
            cells: columns.map((column) => formatArtifactValue(readEntryField(entry, column.field))),
        });
    }
    return { kind: "table", columns, rows: [...byId.values()] };
}
function applyMetrics(spec, items) {
    const metrics = spec.metrics.map((metric) => ({
        field: metric.field,
        label: artifactFieldLabel(metric),
        ...(metric.unit ? { unit: metric.unit } : {}),
    }));
    // 每块瓦片各找各的「最后一条带该字段的条目」——不是「最后一条条目」。
    // 一个只报 stage 的心跳条目不该把上一轮的 p99 抹成空。
    for (const entry of items) {
        metrics.forEach((tile, index) => {
            const raw = readEntryField(entry, tile.field);
            if (!hasValue(raw)) {
                return;
            }
            metrics[index] = {
                ...tile,
                value: formatArtifactValue(raw),
                raw,
                sequence: entry.sequence,
            };
        });
    }
    return { kind: "metrics", metrics };
}
function applyBoard(spec, items) {
    const detail = spec.detail ?? [];
    // Map 的插入顺序 = 卡片首次出现的顺序；改状态的卡在新列里仍按这个顺序排。
    const byId = new Map();
    for (const entry of items) {
        const keyValue = readEntryField(entry, spec.key);
        if (!hasValue(keyValue)) {
            // 没有身份的条目在看板上无处安放（看板整个语义就是「按 key upsert」）。
            continue;
        }
        const id = formatArtifactValue(keyValue);
        const status = formatArtifactValue(readEntryField(entry, spec.status));
        const titleRaw = spec.cardTitle ? readEntryField(entry, spec.cardTitle) : undefined;
        byId.set(id, {
            id,
            sequence: entry.sequence,
            title: hasValue(titleRaw) ? formatArtifactValue(titleRaw) : id,
            status,
            details: detail.map((field) => ({
                label: artifactFieldLabel(field),
                value: formatArtifactValue(readEntryField(entry, field.field)),
                ...(field.unit ? { unit: field.unit } : {}),
            })),
        });
    }
    const columns = spec.columns.map((column) => ({
        id: column,
        other: false,
        cards: [],
    }));
    const listed = new Map(columns.map((column) => [column.id, column]));
    const other = { id: BOARD_OTHER_COLUMN_ID, other: true, cards: [] };
    for (const card of byId.values()) {
        (listed.get(card.status) ?? other).cards.push(card);
    }
    return {
        kind: "board",
        // 「其他」永远在末尾，且只在真有卡时出现——空列会让本来就窄的侧板更挤。
        columns: other.cards.length > 0 ? [...columns, other] : columns,
        cardCount: byId.size,
    };
}
export function applyArtifactItems(kind, spec, items) {
    switch (kind) {
        case "chart":
            return applyChart(spec, items);
        case "table":
            return applyTable(spec, items);
        case "metrics":
            return applyMetrics(spec, items);
        case "board":
            return applyBoard(spec, items);
    }
}
//# sourceMappingURL=apply.js.map