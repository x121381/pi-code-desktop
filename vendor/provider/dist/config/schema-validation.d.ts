import type { z } from "zod";
import type { ConfigValidationIssue } from "../config-overlay.js";
/** 翻译已有问题协议，不维护另一份字段或内容校验清单。 */
export declare function validateConfigSchema(schema: z.ZodType, value: unknown, path: readonly string[], optionSpec?: boolean): readonly ConfigValidationIssue[];
//# sourceMappingURL=schema-validation.d.ts.map