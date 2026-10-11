import { z } from "zod";
/** 用户对后续模型执行的完整选择；不表达已经创建的 Active Model。 */
export declare const modelSelectionSchema: z.ZodObject<{
    providerId: z.ZodString;
    modelId: z.ZodString;
    options: z.ZodOptional<z.ZodObject<{
        reasoningLevel: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ModelSelection = z.infer<typeof modelSelectionSchema>;
/** 公共解析结果。页面可以展示不完整选择，执行入口必须同时检查 selectionIssue。 */
export interface EffectiveModelSelectionResult {
    readonly effectiveSelection: ModelSelection | null;
    readonly selectionIssue?: "selection-missing" | "account-connection-unavailable" | "provider-not-found" | "model-not-found" | "reasoning-level-missing" | "reasoning-level-not-supported";
}
export declare const ZCODE_MODEL_REASONING_SEPARATOR = "$";
/** UI Picker/legacy CLI 的展示值；不是可逆的 ModelSelection 序列化格式。 */
export declare function formatModelPickerValue(selection: ModelSelection | undefined): string;
/** 只解析 Picker/legacy 字符串边界；领域状态与协议必须直接保存 ModelSelection。 */
export declare function parseModelPickerValue(value: string): ModelSelection;
//# sourceMappingURL=model-selection.d.ts.map