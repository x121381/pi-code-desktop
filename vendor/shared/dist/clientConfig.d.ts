import { z } from "zod";
import { type PluginStoreOrder } from "./pluginStoreOrder.js";
/** 只允许显式接入的公开字段进入服务快照，不透传账户或 Provider 配置。 */
export interface ClientConfigSnapshot {
    pluginStoreOrder: PluginStoreOrder | null;
    zsrcUrl: string | null;
}
export declare const clientConfigReadOptionsSchema: z.ZodObject<{
    forceRefresh: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ClientConfigReadOptions = z.infer<typeof clientConfigReadOptionsSchema>;
export declare function parseClientConfigSnapshot(payload: unknown): ClientConfigSnapshot;
//# sourceMappingURL=clientConfig.d.ts.map