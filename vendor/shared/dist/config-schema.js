/** 每个字段保持原 schema，只派生覆盖所需的缺省/null；嵌套结构由调用方显式派生。 */
export function sparseShape(shape) {
    return Object.fromEntries(Object.entries(shape).map(([key, schema]) => [key, schema.nullable().optional()]));
}
//# sourceMappingURL=config-schema.js.map