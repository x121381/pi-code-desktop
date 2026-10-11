/** 把一个默认值 / 已有值按类型转成编辑器文本。 */
export function formatSavedWorkflowArgValue(type, value) {
    if (value === undefined)
        return type === "boolean" ? "false" : "";
    switch (type) {
        case "string":
            return typeof value === "string" ? value : JSON.stringify(value);
        case "number":
            return typeof value === "number" ? String(value) : String(value);
        case "boolean":
            return value === true ? "true" : "false";
        case "json":
            return typeof value === "string" ? JSON.stringify(value) : JSON.stringify(value, null, 2);
    }
}
/**
 * 声明 → 可编辑字段。`initialArgs` 在场时逐个字段**优先**用它的值（完成卡「再次运行」把这次
 * run 跑过的那一份实参预填进来，docs/dynamic-workflow/transcript-and-notifications.md「Run again」）：
 * 上一次跑成了什么，下一次多半还要跑什么。声明里没有的键不进表单——表单的形状由声明决定，
 * 一份旧实参不该凭空长出字段。
 */
export function buildSavedWorkflowArgFields(declaration, initialArgs) {
    if (!declaration)
        return [];
    return Object.entries(declaration).map(([name, spec]) => {
        const initial = initialArgs?.[name];
        return {
            name,
            type: spec.type,
            ...(spec.description === undefined ? {} : { description: spec.description }),
            required: spec.required === true,
            hasDefault: spec.default !== undefined,
            value: formatSavedWorkflowArgValue(spec.type, initial === undefined ? spec.default : initial),
        };
    });
}
/**
 * 单个字段 → 实参值。空文本对 string / number / json 意味着「不传」：有默认值的由服务端回填，
 * 无默认值又非必填的就是缺席；必填而空是唯一的 required 错误。boolean 永远有值。
 */
export function parseSavedWorkflowArgField(field) {
    const raw = field.value;
    if (field.type === "boolean") {
        return { ok: true, omitted: false, value: raw === "true" };
    }
    if (raw.trim().length === 0) {
        if (field.required && !field.hasDefault)
            return { ok: false, error: "required" };
        return { ok: true, omitted: true };
    }
    switch (field.type) {
        case "string":
            return { ok: true, omitted: false, value: raw };
        case "number": {
            const parsed = Number(raw.trim());
            // NaN / Infinity 过不了 JSON，也过不了 CLI 的 number 校验；在这里就拦下来。
            if (!Number.isFinite(parsed))
                return { ok: false, error: "invalid_number" };
            return { ok: true, omitted: false, value: parsed };
        }
        case "json": {
            try {
                return { ok: true, omitted: false, value: JSON.parse(raw) };
            }
            catch {
                return { ok: false, error: "invalid_json" };
            }
        }
    }
}
/** 整张表单 → 实参袋；一次收齐全部错误（照 validateWorkflowArgs 的「不逐个报」）。 */
export function collectSavedWorkflowArgs(fields) {
    const args = {};
    const errors = {};
    for (const field of fields) {
        const parsed = parseSavedWorkflowArgField(field);
        if (!parsed.ok) {
            errors[field.name] = parsed.error;
            continue;
        }
        if (!parsed.omitted)
            args[field.name] = parsed.value;
    }
    return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, args };
}
export function argsDeclarationToRows(declaration) {
    if (!declaration)
        return [];
    return Object.entries(declaration).map(([name, spec], index) => ({
        key: `${index}:${name}`,
        name,
        type: spec.type,
        required: spec.required === true,
        defaultText: spec.default === undefined
            ? ""
            : spec.type === "boolean"
                ? spec.default === true
                    ? "true"
                    : "false"
                : formatSavedWorkflowArgValue(spec.type, spec.default),
        description: spec.description ?? "",
    }));
}
function parseDefaultText(type, text) {
    if (text.trim().length === 0)
        return { ok: true };
    switch (type) {
        case "string":
            return { ok: true, value: text };
        case "number": {
            const parsed = Number(text.trim());
            return Number.isFinite(parsed) ? { ok: true, value: parsed } : { ok: false };
        }
        case "boolean":
            if (text === "true")
                return { ok: true, value: true };
            if (text === "false")
                return { ok: true, value: false };
            return { ok: false };
        case "json":
            try {
                return { ok: true, value: JSON.parse(text) };
            }
            catch {
                return { ok: false };
            }
    }
}
/**
 * 实参表 → 声明。名字只要求非空且唯一（声明本就是 record，`args.x` 的读法不限定标识符）；
 * 空表回 undefined（frontmatter 里就没有 args 键，而不是 `args: {}`）。
 */
export function rowsToArgsDeclaration(rows) {
    const errors = {};
    const seen = new Set();
    const args = {};
    for (const row of rows) {
        const name = row.name.trim();
        if (name.length === 0) {
            errors[row.key] = "empty_name";
            continue;
        }
        if (seen.has(name)) {
            errors[row.key] = "duplicate_name";
            continue;
        }
        seen.add(name);
        const parsedDefault = parseDefaultText(row.type, row.defaultText);
        if (!parsedDefault.ok) {
            errors[row.key] = "invalid_default";
            continue;
        }
        const description = row.description.trim();
        args[name] = {
            type: row.type,
            ...(description.length === 0 ? {} : { description }),
            ...(row.required ? { required: true } : {}),
            ...(parsedDefault.value === undefined ? {} : { default: parsedDefault.value }),
        };
    }
    if (Object.keys(errors).length > 0)
        return { ok: false, errors };
    return { ok: true, args: Object.keys(args).length === 0 ? undefined : args };
}
//# sourceMappingURL=savedWorkflowArgsForm.js.map