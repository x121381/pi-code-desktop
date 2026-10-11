import { z } from "zod";
import { parsePluginStoreOrder } from "./pluginStoreOrder.js";
const zsrcSchema = z.object({
    url: z
        .string()
        .trim()
        .url()
        .refine((value) => /^https?:\/\//i.test(value)),
});
export const clientConfigReadOptionsSchema = z.object({
    forceRefresh: z.boolean().optional(),
});
const envelopeSchema = z.object({
    code: z.literal(0),
    data: z
        .object({
        configs: z
            .object({
            pluginStoreOrder: z.unknown().optional(),
            zsrc: z.unknown().optional(),
        })
            .nullish(),
    })
        .nullish(),
});
export function parseClientConfigSnapshot(payload) {
    const parsed = envelopeSchema.safeParse(payload);
    if (!parsed.success)
        throw new Error("Invalid public client config response");
    const configs = parsed.data.data?.configs;
    return {
        pluginStoreOrder: parsePluginStoreOrder(configs?.pluginStoreOrder),
        zsrcUrl: zsrcSchema.safeParse(configs?.zsrc).data?.url ?? null,
    };
}
//# sourceMappingURL=clientConfig.js.map