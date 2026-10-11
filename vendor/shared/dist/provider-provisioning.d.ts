import { z } from "zod";
export declare const providerProvisioningTriggerSchema: z.ZodEnum<{
    "environment-online": "environment-online";
    "personal-config": "personal-config";
    "configured-default": "configured-default";
    "account-settings": "account-settings";
    credential: "credential";
}>;
export type ProviderProvisioningTrigger = z.infer<typeof providerProvisioningTriggerSchema>;
/** Provisioning 中允许跨 Environment 传输的凭据类别。 */
export declare const providerProvisioningCredentialScopeSchema: z.ZodEnum<{
    "oauth-session": "oauth-session";
    "account-provider": "account-provider";
}>;
export type ProviderProvisioningCredentialScope = z.infer<typeof providerProvisioningCredentialScopeSchema>;
/** 仅供校验 schema v1 旧信封；新 Source 不导出、新 Target 不应用这些历史 Key。 */
export declare function isProviderProvisioningAccountCredentialKey(key: string): boolean;
/** Personal Config 的 Envelope；具体字段由 @zcode/provider 在目标 Environment 再校验。 */
export declare const providerProvisioningPersonalConfigSchema: z.ZodObject<{
    providerConfigRules: z.ZodObject<{
        providerRules: z.ZodArray<z.ZodUnknown>;
    }, z.core.$strict>;
    modelConfigRules: z.ZodObject<{
        providerModelRules: z.ZodArray<z.ZodUnknown>;
        manualProviderModelRules: z.ZodArray<z.ZodUnknown>;
    }, z.core.$strict>;
    providerOrder: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultModelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ProviderProvisioningPersonalConfig = z.infer<typeof providerProvisioningPersonalConfigSchema>;
export declare const providerProvisioningAccountSettingsSchema: z.ZodObject<{
    providerFamilyDomain: z.ZodNullable<z.ZodEnum<{
        bigmodel: "bigmodel";
        zai: "zai";
    }>>;
    providerFamilyConnectionSelections: z.ZodObject<{
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
}, z.core.$strict>;
export type ProviderProvisioningAccountSettings = z.infer<typeof providerProvisioningAccountSettingsSchema>;
export declare const providerProvisioningCredentialEntrySchema: z.ZodObject<{
    scope: z.ZodEnum<{
        "oauth-session": "oauth-session";
        "account-provider": "account-provider";
    }>;
    key: z.ZodString;
    value: z.ZodString;
}, z.core.$strict>;
export type ProviderProvisioningCredentialEntry = z.infer<typeof providerProvisioningCredentialEntrySchema>;
export declare const providerProvisioningEnvelopeSchema: z.ZodObject<{
    schemaVersion: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>;
    syncId: z.ZodString;
    personalConfig: z.ZodObject<{
        providerConfigRules: z.ZodObject<{
            providerRules: z.ZodArray<z.ZodUnknown>;
        }, z.core.$strict>;
        modelConfigRules: z.ZodObject<{
            providerModelRules: z.ZodArray<z.ZodUnknown>;
            manualProviderModelRules: z.ZodArray<z.ZodUnknown>;
        }, z.core.$strict>;
        providerOrder: z.ZodOptional<z.ZodArray<z.ZodString>>;
        defaultModelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    accountSettings: z.ZodObject<{
        providerFamilyDomain: z.ZodNullable<z.ZodEnum<{
            bigmodel: "bigmodel";
            zai: "zai";
        }>>;
        providerFamilyConnectionSelections: z.ZodObject<{
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
    }, z.core.$strict>;
    credentials: z.ZodArray<z.ZodObject<{
        scope: z.ZodEnum<{
            "oauth-session": "oauth-session";
            "account-provider": "account-provider";
        }>;
        key: z.ZodString;
        value: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ProviderProvisioningEnvelope = z.infer<typeof providerProvisioningEnvelopeSchema>;
/** 跨进程只透传固定阶段码，不能把远端自由文本作为可公开诊断信息。 */
export declare const providerProvisioningErrorCodeSchema: z.ZodEnum<{
    "source-read-failed": "source-read-failed";
    "target-call-failed": "target-call-failed";
    "target-write-failed": "target-write-failed";
    "target-refresh-failed": "target-refresh-failed";
    "target-commit-failed": "target-commit-failed";
    "target-apply-failed": "target-apply-failed";
    "capability-unavailable": "capability-unavailable";
    "session-unavailable": "session-unavailable";
    "host-execution-failed": "host-execution-failed";
}>;
export type ProviderProvisioningErrorCode = z.infer<typeof providerProvisioningErrorCodeSchema>;
export declare const providerProvisioningResultSchema: z.ZodObject<{
    syncId: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        applied: "applied";
        unsupported: "unsupported";
        "already-applied": "already-applied";
        rollback_failed: "rollback_failed";
    }>;
    personalProviderCount: z.ZodNumber;
    credentialCount: z.ZodNumber;
    configRevision: z.ZodOptional<z.ZodString>;
    errorMessage: z.ZodOptional<z.ZodString>;
    errorCode: z.ZodOptional<z.ZodEnum<{
        "source-read-failed": "source-read-failed";
        "target-call-failed": "target-call-failed";
        "target-write-failed": "target-write-failed";
        "target-refresh-failed": "target-refresh-failed";
        "target-commit-failed": "target-commit-failed";
        "target-apply-failed": "target-apply-failed";
        "capability-unavailable": "capability-unavailable";
        "session-unavailable": "session-unavailable";
        "host-execution-failed": "host-execution-failed";
    }>>;
    rolledBack: z.ZodBoolean;
}, z.core.$strict>;
export type ProviderProvisioningResult = z.infer<typeof providerProvisioningResultSchema>;
//# sourceMappingURL=provider-provisioning.d.ts.map