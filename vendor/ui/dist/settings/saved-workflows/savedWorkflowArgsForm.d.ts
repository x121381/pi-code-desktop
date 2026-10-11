import type { ZCodeSavedWorkflowArgType, ZCodeSavedWorkflowArgsDeclaration } from "@zcode/shared";
export interface SavedWorkflowArgField {
    name: string;
    type: ZCodeSavedWorkflowArgType;
    description?: string;
    required: boolean;
    hasDefault: boolean;
    /** 编辑器里的文本；boolean 用 "true" / "false"。 */
    value: string;
}
export type SavedWorkflowArgFieldError = "required" | "invalid_number" | "invalid_json";
/** 把一个默认值 / 已有值按类型转成编辑器文本。 */
export declare function formatSavedWorkflowArgValue(type: ZCodeSavedWorkflowArgType, value: unknown): string;
/**
 * 声明 → 可编辑字段。`initialArgs` 在场时逐个字段**优先**用它的值（完成卡「再次运行」把这次
 * run 跑过的那一份实参预填进来，docs/dynamic-workflow/transcript-and-notifications.md「Run again」）：
 * 上一次跑成了什么，下一次多半还要跑什么。声明里没有的键不进表单——表单的形状由声明决定，
 * 一份旧实参不该凭空长出字段。
 */
export declare function buildSavedWorkflowArgFields(declaration: ZCodeSavedWorkflowArgsDeclaration | undefined, initialArgs?: Record<string, unknown>): SavedWorkflowArgField[];
type SavedWorkflowArgParse = {
    ok: true;
    omitted: true;
} | {
    ok: true;
    omitted: false;
    value: unknown;
} | {
    ok: false;
    error: SavedWorkflowArgFieldError;
};
/**
 * 单个字段 → 实参值。空文本对 string / number / json 意味着「不传」：有默认值的由服务端回填，
 * 无默认值又非必填的就是缺席；必填而空是唯一的 required 错误。boolean 永远有值。
 */
export declare function parseSavedWorkflowArgField(field: SavedWorkflowArgField): SavedWorkflowArgParse;
type SavedWorkflowArgsCollect = {
    ok: true;
    args: Record<string, unknown>;
} | {
    ok: false;
    errors: Record<string, SavedWorkflowArgFieldError>;
};
/** 整张表单 → 实参袋；一次收齐全部错误（照 validateWorkflowArgs 的「不逐个报」）。 */
export declare function collectSavedWorkflowArgs(fields: readonly SavedWorkflowArgField[]): SavedWorkflowArgsCollect;
export interface SavedWorkflowArgRow {
    /** 行的稳定身份（新增行也要有，名字可空）。 */
    key: string;
    name: string;
    type: ZCodeSavedWorkflowArgType;
    required: boolean;
    /** 默认值的编辑文本；空即无默认值（boolean 用 "" / "true" / "false"）。 */
    defaultText: string;
    description: string;
}
export type SavedWorkflowArgRowError = "empty_name" | "duplicate_name" | "invalid_default";
export declare function argsDeclarationToRows(declaration: ZCodeSavedWorkflowArgsDeclaration | undefined): SavedWorkflowArgRow[];
type SavedWorkflowArgRowsCollect = {
    ok: true;
    args: ZCodeSavedWorkflowArgsDeclaration | undefined;
} | {
    ok: false;
    errors: Record<string, SavedWorkflowArgRowError>;
};
/**
 * 实参表 → 声明。名字只要求非空且唯一（声明本就是 record，`args.x` 的读法不限定标识符）；
 * 空表回 undefined（frontmatter 里就没有 args 键，而不是 `args: {}`）。
 */
export declare function rowsToArgsDeclaration(rows: readonly SavedWorkflowArgRow[]): SavedWorkflowArgRowsCollect;
export {};
//# sourceMappingURL=savedWorkflowArgsForm.d.ts.map