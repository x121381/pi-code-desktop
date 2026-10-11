import { z } from "zod";
export interface ClaudeModelMapping {
    haiku: string;
    sonnet: string;
    opus: string;
    reasoning: string;
}
/**
 * 各 ZCode Agent Provider 的模型槽位映射（按 provider 区分）。
 * 目前只实现 claude，后续扩展其他 provider 时在此加字段。
 */
export interface ProviderModelMappings {
    [provider: string]: unknown;
    /** @deprecated Claude 槽位不再写入 v2 provider store，仅用于读取旧配置后迁移清理。 */
    claude?: ClaudeModelMapping;
}
export interface ModelProviderEndpoints {
    /** @deprecated 仅用于读取旧 provider 配置；新 store 使用 baseURL + paths。 */
    anthropic?: string;
    /** @deprecated 仅用于读取旧 provider 配置；新 store 使用 baseURL + paths。 */
    openai?: string;
    /** @deprecated Gemini custom provider 已统一走 endpoints.openai + compat，仅保留旧数据兼容读取。 */
    gemini?: string;
    /** v2 catalog endpoint base URL；旧字段保留给迁移期 UI/连通性代码读取。 */
    baseURL?: string;
    /** v2 catalog endpoint paths，key 使用公开 runtime kind。 */
    paths?: Partial<Record<ModelProviderKind, string>>;
}
export type RemoteProviderSchema = "anthropic" | "openai:chat" | "openai:messages" | "gemini";
export type ModelProviderSupportedFormat = "anthropic" | "openai" | "responses" | "gemini";
export type ModelProviderApiFormat = "anthropic-messages" | "openai-chat-completions" | "openai-responses";
export type ModelProviderCatalogSourceId = "china-llm-zcode-dev";
export type ModelProviderKind = "anthropic" | "openai" | "openai-compatible";
export type ModelProviderModality = "text" | "image" | "video" | "audio" | "pdf";
export interface ProviderOptionsPatch {
    set?: Array<{
        path: string[];
        value: unknown;
    }>;
    unset?: Array<{
        path: string[];
    }>;
}
export interface ModelProviderReasoningSpec {
    defaultLevel?: string;
    levels: Record<string, Partial<Record<ModelProviderKind, ProviderOptionsPatch>>>;
}
export declare function stripModelProviderReasoningPatches(reasoning: ModelProviderReasoningSpec): ModelProviderReasoningSpec;
export interface ModelProviderCatalogModel {
    id: string;
    name?: string;
    kinds: ModelProviderKind[];
    defaultKind?: ModelProviderKind;
    modelIdByKind?: Partial<Record<ModelProviderKind, string>>;
    modalities: {
        input: ModelProviderModality[];
        output: ModelProviderModality[];
    };
    contextWindow: number;
    maxOutputTokens?: number;
    reasoning?: ModelProviderReasoningSpec;
    priority?: number;
}
export interface ModelProviderCatalogProvider {
    id: string;
    name: string;
    endpoints: {
        baseURL: string;
        paths: Partial<Record<ModelProviderKind, string>>;
    };
    defaultKind?: ModelProviderKind;
    models: ModelProviderCatalogModel[];
}
export interface ModelProviderCatalogFile {
    schemaVersion: "zcode.model-providers.v1";
    providers: ModelProviderCatalogProvider[];
}
export interface ModelProviderModelConfig extends ModelProviderCatalogModel {
    disabledReason?: string;
    supportsTools?: boolean;
    supportsStructuredOutput?: boolean;
    modified?: boolean;
    deleted?: boolean;
}
export type ModelProviderModelEntry = string | ModelProviderModelConfig;
export type ModelProviderSource = "builtin" | "models-dev" | "custom" | "workspace";
export type ModelProviderSystemDisabledReason = "coding_plan_not_authenticated" | "coding_plan_not_connected" | "coding_plan_auth_failed" | "coding_plan_not_entitled" | "oauth_provider_inactive";
export interface ModelProviderConfig {
    id: string;
    name: string;
    /** 缺省等同启用；false 时仅从聊天框模型列表隐藏，不删除供应商配置。 */
    enabled?: boolean;
    /**
     * 系统自动关闭 provider 的原因。enabled=false 且该字段为空时表示用户手动关闭，
     * 后续权益校验成功也不能自动打开。
     */
    systemDisabledReason?: ModelProviderSystemDisabledReason;
    endpoints: ModelProviderEndpoints;
    apiFormat?: ModelProviderApiFormat;
    source?: ModelProviderSource;
    catalogSourceId?: ModelProviderCatalogSourceId;
    catalogProviderId?: string;
    modelsDevProviderId?: string;
    apiKeyRequired?: boolean;
    headers?: Record<string, string>;
    logoUrl?: string;
    apiKey: string;
    apiKeyUrl?: string;
    models: ModelProviderModelEntry[];
    defaultKind?: ModelProviderKind;
    /** @deprecated 旧模型显示名 map 只用于 v1 自动迁移。 */
    modelDisplayNames?: Record<string, string>;
    /** @deprecated 旧模型格式 map 只用于 v1 自动迁移。 */
    modelSupportedFormats?: Record<string, ModelProviderSupportedFormat[]>;
    providerMappings?: ProviderModelMappings;
    createdAt: number;
    updatedAt: number;
}
export interface ModelProviderStoreFile {
    schemaVersion: "zcode.model-providers.v2";
    providers: ModelProviderConfig[];
}
export declare const modelProviderApiFormatSchema: z.ZodEnum<{
    "anthropic-messages": "anthropic-messages";
    "openai-chat-completions": "openai-chat-completions";
    "openai-responses": "openai-responses";
}>;
export declare const modelProviderKindSchema: z.ZodEnum<{
    anthropic: "anthropic";
    openai: "openai";
    "openai-compatible": "openai-compatible";
}>;
export declare const modelProviderCatalogSourceIdSchema: z.ZodEnum<{
    "china-llm-zcode-dev": "china-llm-zcode-dev";
}>;
export declare const modelProviderModalitySchema: z.ZodEnum<{
    audio: "audio";
    video: "video";
    image: "image";
    text: "text";
    pdf: "pdf";
}>;
export declare const providerOptionsPatchSchema: z.ZodObject<{
    set: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodArray<z.ZodString>;
        value: z.ZodUnknown;
    }, z.core.$strip>>>;
    unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const modelProviderReasoningSpecSchema: z.ZodObject<{
    defaultLevel: z.ZodOptional<z.ZodString>;
    levels: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }> & z.core.$partial, z.ZodObject<{
        set: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodArray<z.ZodString>;
            value: z.ZodUnknown;
        }, z.core.$strip>>>;
        unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const modelProviderEndpointPathsSchema: z.ZodRecord<z.ZodEnum<{
    anthropic: "anthropic";
    openai: "openai";
    "openai-compatible": "openai-compatible";
}> & z.core.$partial, z.ZodString>;
export declare const modelProviderCatalogModelSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    kinds: z.ZodArray<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }>>;
    defaultKind: z.ZodOptional<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }>>;
    modelIdByKind: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }> & z.core.$partial, z.ZodString>>;
    modalities: z.ZodObject<{
        input: z.ZodArray<z.ZodEnum<{
            audio: "audio";
            video: "video";
            image: "image";
            text: "text";
            pdf: "pdf";
        }>>;
        output: z.ZodArray<z.ZodEnum<{
            audio: "audio";
            video: "video";
            image: "image";
            text: "text";
            pdf: "pdf";
        }>>;
    }, z.core.$strip>;
    contextWindow: z.ZodNumber;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    reasoning: z.ZodOptional<z.ZodObject<{
        defaultLevel: z.ZodOptional<z.ZodString>;
        levels: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }> & z.core.$partial, z.ZodObject<{
            set: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodArray<z.ZodString>;
                value: z.ZodUnknown;
            }, z.core.$strip>>>;
            unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodArray<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    priority: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const modelProviderCatalogProviderSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    endpoints: z.ZodObject<{
        baseURL: z.ZodString;
        paths: z.ZodRecord<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }> & z.core.$partial, z.ZodString>;
    }, z.core.$strip>;
    defaultKind: z.ZodOptional<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }>>;
    models: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        kinds: z.ZodArray<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }>>;
        defaultKind: z.ZodOptional<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }>>;
        modelIdByKind: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }> & z.core.$partial, z.ZodString>>;
        modalities: z.ZodObject<{
            input: z.ZodArray<z.ZodEnum<{
                audio: "audio";
                video: "video";
                image: "image";
                text: "text";
                pdf: "pdf";
            }>>;
            output: z.ZodArray<z.ZodEnum<{
                audio: "audio";
                video: "video";
                image: "image";
                text: "text";
                pdf: "pdf";
            }>>;
        }, z.core.$strip>;
        contextWindow: z.ZodNumber;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        reasoning: z.ZodOptional<z.ZodObject<{
            defaultLevel: z.ZodOptional<z.ZodString>;
            levels: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }> & z.core.$partial, z.ZodObject<{
                set: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodArray<z.ZodString>;
                    value: z.ZodUnknown;
                }, z.core.$strip>>>;
                unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodArray<z.ZodString>;
                }, z.core.$strip>>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        priority: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const modelProviderCatalogFileSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"zcode.model-providers.v1">;
    providers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        endpoints: z.ZodObject<{
            baseURL: z.ZodString;
            paths: z.ZodRecord<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }> & z.core.$partial, z.ZodString>;
        }, z.core.$strip>;
        defaultKind: z.ZodOptional<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }>>;
        models: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            kinds: z.ZodArray<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }>>;
            defaultKind: z.ZodOptional<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }>>;
            modelIdByKind: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }> & z.core.$partial, z.ZodString>>;
            modalities: z.ZodObject<{
                input: z.ZodArray<z.ZodEnum<{
                    audio: "audio";
                    video: "video";
                    image: "image";
                    text: "text";
                    pdf: "pdf";
                }>>;
                output: z.ZodArray<z.ZodEnum<{
                    audio: "audio";
                    video: "video";
                    image: "image";
                    text: "text";
                    pdf: "pdf";
                }>>;
            }, z.core.$strip>;
            contextWindow: z.ZodNumber;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            reasoning: z.ZodOptional<z.ZodObject<{
                defaultLevel: z.ZodOptional<z.ZodString>;
                levels: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{
                    anthropic: "anthropic";
                    openai: "openai";
                    "openai-compatible": "openai-compatible";
                }> & z.core.$partial, z.ZodObject<{
                    set: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        path: z.ZodArray<z.ZodString>;
                        value: z.ZodUnknown;
                    }, z.core.$strip>>>;
                    unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        path: z.ZodArray<z.ZodString>;
                    }, z.core.$strip>>>;
                }, z.core.$strip>>>;
            }, z.core.$strip>>;
            priority: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const modelProviderModelConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    kinds: z.ZodArray<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }>>;
    defaultKind: z.ZodOptional<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }>>;
    modelIdByKind: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }> & z.core.$partial, z.ZodString>>;
    modalities: z.ZodObject<{
        input: z.ZodArray<z.ZodEnum<{
            audio: "audio";
            video: "video";
            image: "image";
            text: "text";
            pdf: "pdf";
        }>>;
        output: z.ZodArray<z.ZodEnum<{
            audio: "audio";
            video: "video";
            image: "image";
            text: "text";
            pdf: "pdf";
        }>>;
    }, z.core.$strip>;
    contextWindow: z.ZodNumber;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    reasoning: z.ZodOptional<z.ZodObject<{
        defaultLevel: z.ZodOptional<z.ZodString>;
        levels: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }> & z.core.$partial, z.ZodObject<{
            set: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodArray<z.ZodString>;
                value: z.ZodUnknown;
            }, z.core.$strip>>>;
            unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodArray<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    priority: z.ZodOptional<z.ZodNumber>;
    disabledReason: z.ZodOptional<z.ZodString>;
    supportsTools: z.ZodOptional<z.ZodBoolean>;
    supportsStructuredOutput: z.ZodOptional<z.ZodBoolean>;
    modified: z.ZodOptional<z.ZodBoolean>;
    deleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const modelProviderSourceSchema: z.ZodEnum<{
    custom: "custom";
    workspace: "workspace";
    builtin: "builtin";
    "models-dev": "models-dev";
}>;
export declare const modelProviderSystemDisabledReasonSchema: z.ZodEnum<{
    coding_plan_not_authenticated: "coding_plan_not_authenticated";
    coding_plan_not_connected: "coding_plan_not_connected";
    coding_plan_auth_failed: "coding_plan_auth_failed";
    coding_plan_not_entitled: "coding_plan_not_entitled";
    oauth_provider_inactive: "oauth_provider_inactive";
}>;
export declare const modelProviderEndpointsSchema: z.ZodObject<{
    anthropic: z.ZodOptional<z.ZodString>;
    openai: z.ZodOptional<z.ZodString>;
    gemini: z.ZodOptional<z.ZodString>;
    baseURL: z.ZodOptional<z.ZodString>;
    paths: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }> & z.core.$partial, z.ZodString>>;
}, z.core.$strip>;
export declare const legacyModelProviderConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    enabled: z.ZodOptional<z.ZodBoolean>;
    systemDisabledReason: z.ZodOptional<z.ZodEnum<{
        coding_plan_not_authenticated: "coding_plan_not_authenticated";
        coding_plan_not_connected: "coding_plan_not_connected";
        coding_plan_auth_failed: "coding_plan_auth_failed";
        coding_plan_not_entitled: "coding_plan_not_entitled";
        oauth_provider_inactive: "oauth_provider_inactive";
    }>>;
    endpoints: z.ZodObject<{
        anthropic: z.ZodDefault<z.ZodString>;
        openai: z.ZodDefault<z.ZodString>;
        gemini: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
    apiFormat: z.ZodOptional<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "openai-chat-completions": "openai-chat-completions";
        "openai-responses": "openai-responses";
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        workspace: "workspace";
        builtin: "builtin";
        "models-dev": "models-dev";
    }>>;
    modelsDevProviderId: z.ZodOptional<z.ZodString>;
    apiKeyRequired: z.ZodOptional<z.ZodBoolean>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    logoUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodString;
    apiKeyUrl: z.ZodOptional<z.ZodString>;
    models: z.ZodDefault<z.ZodArray<z.ZodString>>;
    modelDisplayNames: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    modelSupportedFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
        gemini: "gemini";
        anthropic: "anthropic";
        openai: "openai";
        responses: "responses";
    }>>>>;
    providerMappings: z.ZodOptional<z.ZodObject<{
        claude: z.ZodOptional<z.ZodObject<{
            haiku: z.ZodString;
            sonnet: z.ZodString;
            opus: z.ZodString;
            reasoning: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$catchall<z.ZodUnknown>>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export declare const legacyModelProviderListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    enabled: z.ZodOptional<z.ZodBoolean>;
    systemDisabledReason: z.ZodOptional<z.ZodEnum<{
        coding_plan_not_authenticated: "coding_plan_not_authenticated";
        coding_plan_not_connected: "coding_plan_not_connected";
        coding_plan_auth_failed: "coding_plan_auth_failed";
        coding_plan_not_entitled: "coding_plan_not_entitled";
        oauth_provider_inactive: "oauth_provider_inactive";
    }>>;
    endpoints: z.ZodObject<{
        anthropic: z.ZodDefault<z.ZodString>;
        openai: z.ZodDefault<z.ZodString>;
        gemini: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
    apiFormat: z.ZodOptional<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "openai-chat-completions": "openai-chat-completions";
        "openai-responses": "openai-responses";
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        workspace: "workspace";
        builtin: "builtin";
        "models-dev": "models-dev";
    }>>;
    modelsDevProviderId: z.ZodOptional<z.ZodString>;
    apiKeyRequired: z.ZodOptional<z.ZodBoolean>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    logoUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodString;
    apiKeyUrl: z.ZodOptional<z.ZodString>;
    models: z.ZodDefault<z.ZodArray<z.ZodString>>;
    modelDisplayNames: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    modelSupportedFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
        gemini: "gemini";
        anthropic: "anthropic";
        openai: "openai";
        responses: "responses";
    }>>>>;
    providerMappings: z.ZodOptional<z.ZodObject<{
        claude: z.ZodOptional<z.ZodObject<{
            haiku: z.ZodString;
            sonnet: z.ZodString;
            opus: z.ZodString;
            reasoning: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$catchall<z.ZodUnknown>>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>>;
export declare const modelProviderConfigSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    enabled: z.ZodOptional<z.ZodBoolean>;
    systemDisabledReason: z.ZodOptional<z.ZodEnum<{
        coding_plan_not_authenticated: "coding_plan_not_authenticated";
        coding_plan_not_connected: "coding_plan_not_connected";
        coding_plan_auth_failed: "coding_plan_auth_failed";
        coding_plan_not_entitled: "coding_plan_not_entitled";
        oauth_provider_inactive: "oauth_provider_inactive";
    }>>;
    endpoints: z.ZodObject<{
        anthropic: z.ZodOptional<z.ZodString>;
        openai: z.ZodOptional<z.ZodString>;
        gemini: z.ZodOptional<z.ZodString>;
        baseURL: z.ZodOptional<z.ZodString>;
        paths: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }> & z.core.$partial, z.ZodString>>;
    }, z.core.$strip>;
    apiFormat: z.ZodOptional<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "openai-chat-completions": "openai-chat-completions";
        "openai-responses": "openai-responses";
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        workspace: "workspace";
        builtin: "builtin";
        "models-dev": "models-dev";
    }>>;
    catalogSourceId: z.ZodOptional<z.ZodEnum<{
        "china-llm-zcode-dev": "china-llm-zcode-dev";
    }>>;
    catalogProviderId: z.ZodOptional<z.ZodString>;
    modelsDevProviderId: z.ZodOptional<z.ZodString>;
    apiKeyRequired: z.ZodOptional<z.ZodBoolean>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    logoUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodString;
    apiKeyUrl: z.ZodOptional<z.ZodString>;
    defaultKind: z.ZodOptional<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }>>;
    models: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        kinds: z.ZodArray<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }>>;
        defaultKind: z.ZodOptional<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }>>;
        modelIdByKind: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }> & z.core.$partial, z.ZodString>>;
        modalities: z.ZodObject<{
            input: z.ZodArray<z.ZodEnum<{
                audio: "audio";
                video: "video";
                image: "image";
                text: "text";
                pdf: "pdf";
            }>>;
            output: z.ZodArray<z.ZodEnum<{
                audio: "audio";
                video: "video";
                image: "image";
                text: "text";
                pdf: "pdf";
            }>>;
        }, z.core.$strip>;
        contextWindow: z.ZodNumber;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        reasoning: z.ZodOptional<z.ZodObject<{
            defaultLevel: z.ZodOptional<z.ZodString>;
            levels: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }> & z.core.$partial, z.ZodObject<{
                set: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodArray<z.ZodString>;
                    value: z.ZodUnknown;
                }, z.core.$strip>>>;
                unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodArray<z.ZodString>;
                }, z.core.$strip>>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        priority: z.ZodOptional<z.ZodNumber>;
        disabledReason: z.ZodOptional<z.ZodString>;
        supportsTools: z.ZodOptional<z.ZodBoolean>;
        supportsStructuredOutput: z.ZodOptional<z.ZodBoolean>;
        modified: z.ZodOptional<z.ZodBoolean>;
        deleted: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    modelDisplayNames: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    modelSupportedFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
        gemini: "gemini";
        anthropic: "anthropic";
        openai: "openai";
        responses: "responses";
    }>>>>;
    providerMappings: z.ZodOptional<z.ZodObject<{
        claude: z.ZodOptional<z.ZodObject<{
            haiku: z.ZodString;
            sonnet: z.ZodString;
            opus: z.ZodString;
            reasoning: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$catchall<z.ZodUnknown>>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export declare const modelProviderListSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    enabled: z.ZodOptional<z.ZodBoolean>;
    systemDisabledReason: z.ZodOptional<z.ZodEnum<{
        coding_plan_not_authenticated: "coding_plan_not_authenticated";
        coding_plan_not_connected: "coding_plan_not_connected";
        coding_plan_auth_failed: "coding_plan_auth_failed";
        coding_plan_not_entitled: "coding_plan_not_entitled";
        oauth_provider_inactive: "oauth_provider_inactive";
    }>>;
    endpoints: z.ZodObject<{
        anthropic: z.ZodOptional<z.ZodString>;
        openai: z.ZodOptional<z.ZodString>;
        gemini: z.ZodOptional<z.ZodString>;
        baseURL: z.ZodOptional<z.ZodString>;
        paths: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }> & z.core.$partial, z.ZodString>>;
    }, z.core.$strip>;
    apiFormat: z.ZodOptional<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "openai-chat-completions": "openai-chat-completions";
        "openai-responses": "openai-responses";
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        workspace: "workspace";
        builtin: "builtin";
        "models-dev": "models-dev";
    }>>;
    catalogSourceId: z.ZodOptional<z.ZodEnum<{
        "china-llm-zcode-dev": "china-llm-zcode-dev";
    }>>;
    catalogProviderId: z.ZodOptional<z.ZodString>;
    modelsDevProviderId: z.ZodOptional<z.ZodString>;
    apiKeyRequired: z.ZodOptional<z.ZodBoolean>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    logoUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodString;
    apiKeyUrl: z.ZodOptional<z.ZodString>;
    defaultKind: z.ZodOptional<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        "openai-compatible": "openai-compatible";
    }>>;
    models: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        kinds: z.ZodArray<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }>>;
        defaultKind: z.ZodOptional<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }>>;
        modelIdByKind: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }> & z.core.$partial, z.ZodString>>;
        modalities: z.ZodObject<{
            input: z.ZodArray<z.ZodEnum<{
                audio: "audio";
                video: "video";
                image: "image";
                text: "text";
                pdf: "pdf";
            }>>;
            output: z.ZodArray<z.ZodEnum<{
                audio: "audio";
                video: "video";
                image: "image";
                text: "text";
                pdf: "pdf";
            }>>;
        }, z.core.$strip>;
        contextWindow: z.ZodNumber;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        reasoning: z.ZodOptional<z.ZodObject<{
            defaultLevel: z.ZodOptional<z.ZodString>;
            levels: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }> & z.core.$partial, z.ZodObject<{
                set: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodArray<z.ZodString>;
                    value: z.ZodUnknown;
                }, z.core.$strip>>>;
                unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodArray<z.ZodString>;
                }, z.core.$strip>>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        priority: z.ZodOptional<z.ZodNumber>;
        disabledReason: z.ZodOptional<z.ZodString>;
        supportsTools: z.ZodOptional<z.ZodBoolean>;
        supportsStructuredOutput: z.ZodOptional<z.ZodBoolean>;
        modified: z.ZodOptional<z.ZodBoolean>;
        deleted: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    modelDisplayNames: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    modelSupportedFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
        gemini: "gemini";
        anthropic: "anthropic";
        openai: "openai";
        responses: "responses";
    }>>>>;
    providerMappings: z.ZodOptional<z.ZodObject<{
        claude: z.ZodOptional<z.ZodObject<{
            haiku: z.ZodString;
            sonnet: z.ZodString;
            opus: z.ZodString;
            reasoning: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$catchall<z.ZodUnknown>>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>>;
export declare const modelProviderStoreFileSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"zcode.model-providers.v2">;
    providers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        enabled: z.ZodOptional<z.ZodBoolean>;
        systemDisabledReason: z.ZodOptional<z.ZodEnum<{
            coding_plan_not_authenticated: "coding_plan_not_authenticated";
            coding_plan_not_connected: "coding_plan_not_connected";
            coding_plan_auth_failed: "coding_plan_auth_failed";
            coding_plan_not_entitled: "coding_plan_not_entitled";
            oauth_provider_inactive: "oauth_provider_inactive";
        }>>;
        endpoints: z.ZodObject<{
            anthropic: z.ZodOptional<z.ZodString>;
            openai: z.ZodOptional<z.ZodString>;
            gemini: z.ZodOptional<z.ZodString>;
            baseURL: z.ZodOptional<z.ZodString>;
            paths: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }> & z.core.$partial, z.ZodString>>;
        }, z.core.$strip>;
        apiFormat: z.ZodOptional<z.ZodEnum<{
            "anthropic-messages": "anthropic-messages";
            "openai-chat-completions": "openai-chat-completions";
            "openai-responses": "openai-responses";
        }>>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            workspace: "workspace";
            builtin: "builtin";
            "models-dev": "models-dev";
        }>>;
        catalogSourceId: z.ZodOptional<z.ZodEnum<{
            "china-llm-zcode-dev": "china-llm-zcode-dev";
        }>>;
        catalogProviderId: z.ZodOptional<z.ZodString>;
        modelsDevProviderId: z.ZodOptional<z.ZodString>;
        apiKeyRequired: z.ZodOptional<z.ZodBoolean>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        logoUrl: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodString;
        apiKeyUrl: z.ZodOptional<z.ZodString>;
        defaultKind: z.ZodOptional<z.ZodEnum<{
            anthropic: "anthropic";
            openai: "openai";
            "openai-compatible": "openai-compatible";
        }>>;
        models: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            kinds: z.ZodArray<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }>>;
            defaultKind: z.ZodOptional<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }>>;
            modelIdByKind: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
                anthropic: "anthropic";
                openai: "openai";
                "openai-compatible": "openai-compatible";
            }> & z.core.$partial, z.ZodString>>;
            modalities: z.ZodObject<{
                input: z.ZodArray<z.ZodEnum<{
                    audio: "audio";
                    video: "video";
                    image: "image";
                    text: "text";
                    pdf: "pdf";
                }>>;
                output: z.ZodArray<z.ZodEnum<{
                    audio: "audio";
                    video: "video";
                    image: "image";
                    text: "text";
                    pdf: "pdf";
                }>>;
            }, z.core.$strip>;
            contextWindow: z.ZodNumber;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            reasoning: z.ZodOptional<z.ZodObject<{
                defaultLevel: z.ZodOptional<z.ZodString>;
                levels: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodEnum<{
                    anthropic: "anthropic";
                    openai: "openai";
                    "openai-compatible": "openai-compatible";
                }> & z.core.$partial, z.ZodObject<{
                    set: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        path: z.ZodArray<z.ZodString>;
                        value: z.ZodUnknown;
                    }, z.core.$strip>>>;
                    unset: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        path: z.ZodArray<z.ZodString>;
                    }, z.core.$strip>>>;
                }, z.core.$strip>>>;
            }, z.core.$strip>>;
            priority: z.ZodOptional<z.ZodNumber>;
            disabledReason: z.ZodOptional<z.ZodString>;
            supportsTools: z.ZodOptional<z.ZodBoolean>;
            supportsStructuredOutput: z.ZodOptional<z.ZodBoolean>;
            modified: z.ZodOptional<z.ZodBoolean>;
            deleted: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        modelDisplayNames: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        modelSupportedFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
            gemini: "gemini";
            anthropic: "anthropic";
            openai: "openai";
            responses: "responses";
        }>>>>;
        providerMappings: z.ZodOptional<z.ZodObject<{
            claude: z.ZodOptional<z.ZodObject<{
                haiku: z.ZodString;
                sonnet: z.ZodString;
                opus: z.ZodString;
                reasoning: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$catchall<z.ZodUnknown>>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const modelProviderDisplayOrderStateSchema: z.ZodObject<{
    providerIds: z.ZodArray<z.ZodString>;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export declare function stripLegacyClaudeProviderMappings(providerMappings: ProviderModelMappings | undefined): ProviderModelMappings | undefined;
export declare const MODEL_PROVIDER_NEW_MODEL_CONTEXT_WINDOW = 200000;
export declare const MODEL_ONE_MILLION_CONTEXT_WINDOW = 1000000;
export declare function resolveModelProviderContextWindow(contextWindow: number | undefined): number;
export declare function isModelProviderModelConfig(model: ModelProviderModelEntry): model is ModelProviderModelConfig;
export declare function getModelProviderModelIds(provider: Pick<ModelProviderConfig, "models"> | null | undefined): string[];
export declare function mapModelProviderSupportedFormatToKind(format: ModelProviderSupportedFormat): ModelProviderKind | null;
export declare function createModelProviderModelConfig(params: {
    id: string;
    name?: string;
    kinds?: readonly ModelProviderKind[];
    defaultKind?: ModelProviderKind;
    contextWindow?: number;
    maxOutputTokens?: number;
    modalities?: {
        input?: readonly ModelProviderModality[];
        output?: readonly ModelProviderModality[];
    };
    reasoning?: ModelProviderReasoningSpec;
    priority?: number;
    disabledReason?: string;
    supportsTools?: boolean;
    supportsStructuredOutput?: boolean;
    modified?: boolean;
    deleted?: boolean;
}): ModelProviderModelConfig;
export declare function resolveModelProviderDefaultKind(provider: Pick<ModelProviderConfig, "apiFormat" | "defaultKind" | "endpoints">): ModelProviderKind;
export declare function resolveModelProviderKindApiFormat(kind: ModelProviderKind): ModelProviderApiFormat;
export declare function mapModelProviderApiFormatToKind(apiFormat: ModelProviderApiFormat): ModelProviderKind;
export declare function getDefaultModelProviderEndpointPathForKind(kind: ModelProviderKind): string;
export declare function normalizeModelProviderBaseUrlForKind(baseURL: string, kind: ModelProviderKind): string;
export declare function normalizeModelProviderConfiguredBaseUrl(baseURL: string): string;
export declare function resolveModelProviderRuntimeBaseUrl(provider: Pick<ModelProviderConfig, "apiFormat" | "defaultKind" | "endpoints">, kind?: ModelProviderKind): string;
export declare function getModelProviderEndpointKinds(endpoints: ModelProviderEndpoints): ModelProviderKind[];
export declare function migrateLegacyModelProviderConfig(provider: z.infer<typeof legacyModelProviderConfigSchema>): ModelProviderConfig;
export declare function migrateLegacyModelProviderListToStoreFile(raw: unknown): ModelProviderStoreFile;
export declare function getDefaultModelSupportedFormatsFromEndpoints(endpoints: Partial<Pick<ModelProviderEndpoints, "anthropic" | "openai" | "gemini" | "baseURL" | "paths">>): ModelProviderSupportedFormat[];
export declare function getDefaultModelSupportedFormatsFromApiFormat(apiFormat: ModelProviderApiFormat): ModelProviderSupportedFormat[];
export declare function resolveModelProviderApiFormat(provider: Pick<ModelProviderConfig, "apiFormat" | "endpoints"> & Partial<Pick<ModelProviderConfig, "defaultKind">>): ModelProviderApiFormat;
export declare function resolveModelProviderBaseUrl(provider: Pick<ModelProviderConfig, "apiFormat" | "endpoints"> & Partial<Pick<ModelProviderConfig, "defaultKind">>): string;
/** 连通性测试错误分类 */
//# sourceMappingURL=legacyModelProviderSerialized.d.ts.map