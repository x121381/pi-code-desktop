import { z } from "zod";
export declare const providerApiTypeDataSchema: z.ZodEnum<{
    "anthropic-messages": "anthropic-messages";
    "openai-chat-completions": "openai-chat-completions";
    "openai-responses": "openai-responses";
}>;
export declare const providerGroupDataSchema: z.ZodEnum<{
    "standard-personal": "standard-personal";
    "zai-family": "zai-family";
    "bigmodel-family": "bigmodel-family";
}>;
export declare const zhipuAccountModeDataSchema: z.ZodEnum<{
    "start-plan": "start-plan";
    "individual-coding-plan": "individual-coding-plan";
    "team-coding-plan": "team-coding-plan";
    "off-peak": "off-peak";
    highspeed: "highspeed";
}>;
export declare const providerVisibilityDataSchema: z.ZodEnum<{
    visible: "visible";
    hidden: "hidden";
}>;
export declare const providerLogoDataSchema: z.ZodObject<{
    type: z.ZodLiteral<"builtin">;
    key: z.ZodString;
}, z.core.$strict>;
export declare const apiKeyAccessDataSchema: z.ZodObject<{
    type: z.ZodEnum<{
        "api-key": "api-key";
        "zhipu-coding-plan-api-key": "zhipu-coding-plan-api-key";
    }>;
    apiKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    apiKeyManagementUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const completeApiKeyAccessDataSchema: z.ZodObject<{
    type: z.ZodEnum<{
        "api-key": "api-key";
        "zhipu-coding-plan-api-key": "zhipu-coding-plan-api-key";
    }>;
    apiKeyManagementUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    apiKey: z.ZodString;
}, z.core.$strict>;
export declare const completeZhipuAccountAccessDataSchema: z.ZodObject<{
    type: z.ZodLiteral<"zhipu-account">;
    accountType: z.ZodEnum<{
        zai: "zai";
        bigmodel: "bigmodel";
    }>;
    mode: z.ZodEnum<{
        "start-plan": "start-plan";
        "individual-coding-plan": "individual-coding-plan";
        "team-coding-plan": "team-coding-plan";
        "off-peak": "off-peak";
        highspeed: "highspeed";
    }>;
    entitled: z.ZodBoolean;
}, z.core.$strict>;
export declare const zhipuAccountAccessDataSchema: z.ZodObject<{
    type: z.ZodLiteral<"zhipu-account">;
    accountType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        zai: "zai";
        bigmodel: "bigmodel";
    }>>>;
    mode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        "start-plan": "start-plan";
        "individual-coding-plan": "individual-coding-plan";
        "team-coding-plan": "team-coding-plan";
        "off-peak": "off-peak";
        highspeed: "highspeed";
    }>>>;
    entitled: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strict>;
export declare const providerAccessDataSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodEnum<{
        "api-key": "api-key";
        "zhipu-coding-plan-api-key": "zhipu-coding-plan-api-key";
    }>;
    apiKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    apiKeyManagementUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"zhipu-account">;
    accountType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        zai: "zai";
        bigmodel: "bigmodel";
    }>>>;
    mode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        "start-plan": "start-plan";
        "individual-coding-plan": "individual-coding-plan";
        "team-coding-plan": "team-coding-plan";
        "off-peak": "off-peak";
        highspeed: "highspeed";
    }>>>;
    entitled: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strict>], "type">;
export declare const completeProviderAccessDataSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodEnum<{
        "api-key": "api-key";
        "zhipu-coding-plan-api-key": "zhipu-coding-plan-api-key";
    }>;
    apiKeyManagementUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    apiKey: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"zhipu-account">;
    accountType: z.ZodEnum<{
        zai: "zai";
        bigmodel: "bigmodel";
    }>;
    mode: z.ZodEnum<{
        "start-plan": "start-plan";
        "individual-coding-plan": "individual-coding-plan";
        "team-coding-plan": "team-coding-plan";
        "off-peak": "off-peak";
        highspeed: "highspeed";
    }>;
    entitled: z.ZodBoolean;
}, z.core.$strict>], "type">;
export declare const completeProviderApiDataSchema: z.ZodObject<{
    type: z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "openai-chat-completions": "openai-chat-completions";
        "openai-responses": "openai-responses";
    }>;
    baseUrl: z.ZodPipe<z.ZodString, z.ZodString>;
    headers: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>>;
}, z.core.$strict>;
export declare const providerApiDataSchema: z.ZodObject<{
    baseUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "openai-chat-completions": "openai-chat-completions";
        "openai-responses": "openai-responses";
    }>>>;
    headers: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>>>>;
}, z.core.$strict>;
export declare const personalProviderApiDataSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "openai-chat-completions": "openai-chat-completions";
        "openai-responses": "openai-responses";
    }>>>;
    headers: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>>>>;
    baseUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const providerConfigDataSchema: z.ZodObject<{
    group: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        "standard-personal": "standard-personal";
        "zai-family": "zai-family";
        "bigmodel-family": "bigmodel-family";
    }>>>;
    logo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        type: z.ZodLiteral<"builtin">;
        key: z.ZodString;
    }, z.core.$strict>>>;
    access: z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodEnum<{
            "api-key": "api-key";
            "zhipu-coding-plan-api-key": "zhipu-coding-plan-api-key";
        }>;
        apiKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        apiKeyManagementUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"zhipu-account">;
        accountType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            zai: "zai";
            bigmodel: "bigmodel";
        }>>>;
        mode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            "start-plan": "start-plan";
            "individual-coding-plan": "individual-coding-plan";
            "team-coding-plan": "team-coding-plan";
            "off-peak": "off-peak";
            highspeed: "highspeed";
        }>>>;
        entitled: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strict>], "type">>>;
    api: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        baseUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            "anthropic-messages": "anthropic-messages";
            "openai-chat-completions": "openai-chat-completions";
            "openai-responses": "openai-responses";
        }>>>;
        headers: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>>>>;
    }, z.core.$strict>>>;
    builtinModelIds: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
    personalModelIds: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
    modelOrder: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
    visibility: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        visible: "visible";
        hidden: "hidden";
    }>>>;
}, z.core.$strict>;
export declare const completeProviderConfigDataSchema: z.ZodObject<{
    logo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        type: z.ZodLiteral<"builtin">;
        key: z.ZodString;
    }, z.core.$strict>>>;
    builtinModelIds: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
    personalModelIds: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
    modelOrder: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
    visibility: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        visible: "visible";
        hidden: "hidden";
    }>>>;
    group: z.ZodEnum<{
        "standard-personal": "standard-personal";
        "zai-family": "zai-family";
        "bigmodel-family": "bigmodel-family";
    }>;
    access: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodEnum<{
            "api-key": "api-key";
            "zhipu-coding-plan-api-key": "zhipu-coding-plan-api-key";
        }>;
        apiKeyManagementUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        apiKey: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"zhipu-account">;
        accountType: z.ZodEnum<{
            zai: "zai";
            bigmodel: "bigmodel";
        }>;
        mode: z.ZodEnum<{
            "start-plan": "start-plan";
            "individual-coding-plan": "individual-coding-plan";
            "team-coding-plan": "team-coding-plan";
            "off-peak": "off-peak";
            highspeed: "highspeed";
        }>;
        entitled: z.ZodBoolean;
    }, z.core.$strict>], "type">;
    api: z.ZodObject<{
        type: z.ZodEnum<{
            "anthropic-messages": "anthropic-messages";
            "openai-chat-completions": "openai-chat-completions";
            "openai-responses": "openai-responses";
        }>;
        baseUrl: z.ZodPipe<z.ZodString, z.ZodString>;
        headers: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const providerTemplateNameMapDataSchema: z.ZodObject<{
    "zh-CN": z.ZodOptional<z.ZodString>;
    "en-US": z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const providerTemplateDataSchema: z.ZodObject<{
    templateId: z.ZodString;
    templateNameMap: z.ZodObject<{
        "zh-CN": z.ZodOptional<z.ZodString>;
        "en-US": z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    config: z.ZodObject<{
        group: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            "standard-personal": "standard-personal";
            "zai-family": "zai-family";
            "bigmodel-family": "bigmodel-family";
        }>>>;
        logo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            type: z.ZodLiteral<"builtin">;
            key: z.ZodString;
        }, z.core.$strict>>>;
        access: z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodEnum<{
                "api-key": "api-key";
                "zhipu-coding-plan-api-key": "zhipu-coding-plan-api-key";
            }>;
            apiKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            apiKeyManagementUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"zhipu-account">;
            accountType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                zai: "zai";
                bigmodel: "bigmodel";
            }>>>;
            mode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                "start-plan": "start-plan";
                "individual-coding-plan": "individual-coding-plan";
                "team-coding-plan": "team-coding-plan";
                "off-peak": "off-peak";
                highspeed: "highspeed";
            }>>>;
            entitled: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        }, z.core.$strict>], "type">>>;
        api: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            baseUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            type: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                "anthropic-messages": "anthropic-messages";
                "openai-chat-completions": "openai-chat-completions";
                "openai-responses": "openai-responses";
            }>>>;
            headers: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>>>>;
        }, z.core.$strict>>>;
        builtinModelIds: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
        personalModelIds: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
        modelOrder: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
        visibility: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
        }>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
//# sourceMappingURL=provider-data-schema.d.ts.map