import { z } from "zod";
export declare const providerFamilyConnectionSelectionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"start-plan">;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"individual-coding-plan">;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"team-coding-plan">;
    productId: z.ZodString;
    organizationId: z.ZodString;
    projectId: z.ZodString;
}, z.core.$strict>], "kind">;
export declare const providerFamilyConnectionSelectionSettingsSchema: z.ZodObject<{
    zai: z.ZodOptional<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"start-plan">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"individual-coding-plan">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"team-coding-plan">;
        productId: z.ZodString;
        organizationId: z.ZodString;
        projectId: z.ZodString;
    }, z.core.$strict>], "kind">>>;
    bigmodel: z.ZodOptional<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"start-plan">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"individual-coding-plan">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"team-coding-plan">;
        productId: z.ZodString;
        organizationId: z.ZodString;
        projectId: z.ZodString;
    }, z.core.$strict>], "kind">>>;
}, z.core.$strip>;
/** 用户对一个 Provider Family 的连接选择意图；不包含账号身份或动态凭据。 */
export type ProviderFamilyConnectionSelection = Readonly<z.infer<typeof providerFamilyConnectionSelectionSchema>>;
export type ProviderFamilyConnectionSelectionSettings = z.infer<typeof providerFamilyConnectionSelectionSettingsSchema>;
//# sourceMappingURL=provider-family-connection-selection.d.ts.map