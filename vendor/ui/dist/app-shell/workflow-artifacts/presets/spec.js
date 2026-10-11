/**
 * 预置产物（chart / table / metrics / board）的 spec 类型镜像 + 宽松解析。
 *
 * 这里的 `artifact` 是**用户面**的那一个：
 * 脚本经 `artifact.chart(id, spec)` 声明、由 `report(item, id)` 流喂养的看板；不是引擎内部
 * `RunSettlement.artifact` 那个「顶层返回值」。
 *
 * **为什么要在 UI 侧再解析一遍。** spec 的权威校验在引擎（zod，非法形状直接 failRun），
 * 落到 journal 的是 canonical JSON，再经 v4 投影到达 renderer 时类型已经退化成 `unknown`。
 * renderer 拿到的可能是：新 CLI 写的合法 spec、老 CLI 写的少字段 spec、或者一条被截断/篡改的行。
 * 渲染器不该对这些情况抛异常把整个侧板炸掉——所以这一层只做**结构性**判断，
 * 能渲染就返回归一化后的 spec，不能渲染就返回 `undefined`（调用方降级成一张「无法渲染」的卡）。
 *
 * 宽松 = 多余的键原样忽略、坏掉的可选字段丢掉、必填字段缺失才判不可渲染。
 */
const CHART_TYPES = ["line", "bar", "scatter"];
const CHART_SCALES = ["linear", "log"];
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** 非空字符串；spec 里所有的字段路径 / 列名都必须是它。 */
function readNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
/**
 * 一个 `ArtifactField`。可以只是一个字符串（"latencyMs"）——脚本作者会这么写，
 * facade 类型不允许但 journal 里可能存着旧形状，这里顺手接住。
 */
function parseField(value) {
    const shorthand = readNonEmptyString(value);
    if (shorthand) {
        return { field: shorthand };
    }
    if (!isRecord(value)) {
        return undefined;
    }
    const field = readNonEmptyString(value.field);
    if (!field) {
        return undefined;
    }
    const label = readNonEmptyString(value.label);
    const unit = readNonEmptyString(value.unit);
    return { field, ...(label ? { label } : {}), ...(unit ? { unit } : {}) };
}
/** 一组字段。坏条目单独丢弃（宽松），全空才算不可渲染。 */
function parseFieldList(value) {
    if (!Array.isArray(value)) {
        return undefined;
    }
    const fields = value
        .map(parseField)
        .filter((field) => field !== undefined);
    return fields.length > 0 ? fields : undefined;
}
function parseOptions(spec) {
    const title = readNonEmptyString(spec.title);
    const description = readNonEmptyString(spec.description);
    return { ...(title ? { title } : {}), ...(description ? { description } : {}) };
}
function parseChartSpec(spec) {
    const x = parseField(spec.x);
    if (!x) {
        return undefined;
    }
    // y 单个也好、数组也好，都归一化成数组：下游（apply / 渲染器）只认一种形状，
    // 少一处 `Array.isArray` 分叉就少一处「单序列图漏渲染」的机会。
    const single = Array.isArray(spec.y) ? undefined : parseField(spec.y);
    const y = Array.isArray(spec.y) ? parseFieldList(spec.y) : single ? [single] : undefined;
    if (!y) {
        return undefined;
    }
    const type = CHART_TYPES.find((candidate) => candidate === spec.type) ?? "line";
    const scale = CHART_SCALES.find((candidate) => candidate === spec.scale) ?? "linear";
    const baseline = parseField(spec.baseline);
    return {
        ...parseOptions(spec),
        type,
        x,
        y,
        scale,
        ...(baseline ? { baseline } : {}),
    };
}
function parseTableSpec(spec) {
    const columns = parseFieldList(spec.columns);
    if (!columns) {
        return undefined;
    }
    const key = readNonEmptyString(spec.key);
    return { ...parseOptions(spec), columns, ...(key ? { key } : {}) };
}
function parseMetricsSpec(spec) {
    const metrics = parseFieldList(spec.metrics);
    if (!metrics) {
        return undefined;
    }
    return { ...parseOptions(spec), metrics };
}
function parseBoardSpec(spec) {
    const key = readNonEmptyString(spec.key);
    const status = readNonEmptyString(spec.status);
    if (!key || !status) {
        return undefined;
    }
    if (!Array.isArray(spec.columns)) {
        return undefined;
    }
    const columns = spec.columns
        .map(readNonEmptyString)
        .filter((column) => column !== undefined);
    if (columns.length === 0) {
        return undefined;
    }
    const cardTitle = readNonEmptyString(spec.cardTitle);
    const detail = parseFieldList(spec.detail);
    return {
        ...parseOptions(spec),
        key,
        status,
        columns,
        ...(cardTitle ? { cardTitle } : {}),
        ...(detail ? { detail } : {}),
    };
}
/**
 * 把 wire 上的 `unknown` spec 解析成可渲染的形状；`undefined` = 渲染不了。
 *
 * 归一化的部分（下游因此不必再兜底）：`chart.y` 一律是数组、`chart.type` / `chart.scale`
 * 一律有值、空字符串 / 空白串一律当缺席。
 */
export function parseArtifactPresetSpec(kind, spec) {
    if (!isRecord(spec)) {
        return undefined;
    }
    switch (kind) {
        case "chart":
            return parseChartSpec(spec);
        case "table":
            return parseTableSpec(spec);
        case "metrics":
            return parseMetricsSpec(spec);
        case "board":
            return parseBoardSpec(spec);
        default:
            return undefined;
    }
}
/** `chart.y` 归一化后的读法；解析过的 spec 一定是数组，这里只做类型收窄。 */
export function chartSeriesFields(spec) {
    return Array.isArray(spec.y) ? spec.y : [spec.y];
}
/** 字段在界面上的名字：显式 `label` 优先，否则用点路径本身。 */
export function artifactFieldLabel(field) {
    return field.label ?? field.field;
}
/**
 * 一张看板会读到的全部字段路径（去重、按 spec 里出现的顺序）：看板取数只让 CLI 取这些字段，
 * 而不是整条 item（docs/execution-engine.md「Reading the journal」）。`applyArtifactItems` 读的
 * 每一个路径都必须在这里——漏一个，那一列 / 那条序列就永远是空的。spec 画不了时回 `undefined`
 * （调用方退回取整条 item，渲染层自会显示「无法渲染」）。
 */
export function artifactPresetFieldPaths(kind, rawSpec) {
    const spec = parseArtifactPresetSpec(kind, rawSpec);
    if (spec === undefined)
        return undefined;
    const paths = [];
    const add = (path) => {
        if (path !== undefined && !paths.includes(path))
            paths.push(path);
    };
    switch (kind) {
        case "chart": {
            const chart = spec;
            add(chart.x.field);
            for (const field of chartSeriesFields(chart))
                add(field.field);
            add(chart.baseline?.field);
            break;
        }
        case "table": {
            const table = spec;
            add(table.key);
            for (const column of table.columns)
                add(column.field);
            break;
        }
        case "metrics":
            for (const metric of spec.metrics)
                add(metric.field);
            break;
        case "board": {
            const board = spec;
            add(board.key);
            add(board.status);
            add(board.cardTitle);
            for (const field of board.detail ?? [])
                add(field.field);
            break;
        }
    }
    return paths;
}
//# sourceMappingURL=spec.js.map