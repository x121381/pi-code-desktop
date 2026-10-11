import type { z } from "zod";
/** 每个字段保持原 schema，只派生覆盖所需的缺省/null；嵌套结构由调用方显式派生。 */
export declare function sparseShape<T extends Record<string, z.ZodType>>(shape: T): { [K in keyof T]: z.ZodOptional<z.ZodNullable<T[K]>>; };
//# sourceMappingURL=config-schema.d.ts.map