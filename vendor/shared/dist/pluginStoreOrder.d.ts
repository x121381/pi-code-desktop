import { z } from "zod";
declare const modeOrderSchema: z.ZodObject<{
    categoryOrder: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
    pluginOrder: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>>;
}, z.core.$strip>;
declare const pluginStoreOrderSchema: z.ZodObject<{
    code: z.ZodCatch<z.ZodOptional<z.ZodObject<{
        categoryOrder: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
        pluginOrder: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>>;
    }, z.core.$strip>>>;
    work: z.ZodCatch<z.ZodOptional<z.ZodObject<{
        categoryOrder: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
        pluginOrder: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type PluginStoreModeOrder = z.infer<typeof modeOrderSchema>;
export type PluginStoreOrder = z.infer<typeof pluginStoreOrderSchema>;
/** 排序只是展示配置；错误模式独立回退，不能阻止目录浏览或污染另一种模式。 */
export declare function parsePluginStoreOrder(value: unknown): PluginStoreOrder | null;
export {};
//# sourceMappingURL=pluginStoreOrder.d.ts.map