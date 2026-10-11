export interface ConfigValidationIssue {
    readonly code: "required-field-missing" | "duplicate-key" | "duplicate-model" | "invalid-option-spec" | "invalid-config" | "invalid-reasoning-mapping" | "invalid-pattern" | "invalid-url" | "missing-template";
    readonly path: readonly string[];
    readonly message: string;
}
/**
 * 稀疏配置层和覆盖完成后的配置使用同一类型。
 *
 * 子类显式列出字段；本基类只统一“缺省继承、Config 递归覆盖、其他值整体替换”的语义。
 */
export declare abstract class ConfigOverlay<TSelf extends ConfigOverlay<TSelf>> {
    abstract overlay(next: TSelf): TSelf;
    abstract validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    protected overlayValue<T>(base: T | undefined, next: T | undefined): T | undefined;
    protected overlayConfig<T extends ConfigOverlay<T>>(base: T | null | undefined, next: T | null | undefined): T | null | undefined;
}
export declare function requiredFieldIssue(path: readonly string[], field: string): ConfigValidationIssue;
//# sourceMappingURL=config-overlay.d.ts.map