import { z } from "zod";
export declare const MCP_APPS_SAMPLING_TIMEOUT_MS = 60000;
export declare const MCP_APPS_SAMPLING_TRANSPORT_TIMEOUT_MS = 65000;
export declare const MCP_APPS_SAMPLING_MAX_BYTES: number;
export declare const MCP_APPS_SAMPLING_MAX_BLOCKS = 64;
export declare const MCP_APPS_SAMPLING_MAX_PER_SESSION = 4;
export declare const MCP_APPS_SAMPLING_MAX_PER_AGENT = 8;
export declare const MCP_APPS_SAMPLING_MAX_OPERATIONS = 4096;
/** 只开放宿主确实实现的官方子集；不静默剥除 tools/audio/模型配置等字段。 */
export declare const mcpAppsSamplingParamsSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
            annotations: z.ZodOptional<z.ZodObject<{
                audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    user: "user";
                    assistant: "assistant";
                }>>>;
                priority: z.ZodOptional<z.ZodNumber>;
                lastModified: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            mimeType: z.ZodEnum<{
                "image/png": "image/png";
                "image/jpeg": "image/jpeg";
                "image/webp": "image/webp";
            }>;
            data: z.ZodString;
            annotations: z.ZodOptional<z.ZodObject<{
                audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    user: "user";
                    assistant: "assistant";
                }>>>;
                priority: z.ZodOptional<z.ZodNumber>;
                lastModified: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
            annotations: z.ZodOptional<z.ZodObject<{
                audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    user: "user";
                    assistant: "assistant";
                }>>>;
                priority: z.ZodOptional<z.ZodNumber>;
                lastModified: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            mimeType: z.ZodEnum<{
                "image/png": "image/png";
                "image/jpeg": "image/jpeg";
                "image/webp": "image/webp";
            }>;
            data: z.ZodString;
            annotations: z.ZodOptional<z.ZodObject<{
                audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    user: "user";
                    assistant: "assistant";
                }>>>;
                priority: z.ZodOptional<z.ZodNumber>;
                lastModified: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>], "type">>]>;
    }, z.core.$strict>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    maxTokens: z.ZodNumber;
    includeContext: z.ZodOptional<z.ZodLiteral<"none">>;
    modelPreferences: z.ZodOptional<z.ZodObject<{
        hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        costPriority: z.ZodOptional<z.ZodNumber>;
        speedPriority: z.ZodOptional<z.ZodNumber>;
        intelligencePriority: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export declare const mcpAppsSamplingResultSchema: z.ZodObject<{
    role: z.ZodLiteral<"assistant">;
    model: z.ZodString;
    content: z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.core.$strict>;
    stopReason: z.ZodString;
}, z.core.$strict>;
export type McpAppsSamplingParams = z.infer<typeof mcpAppsSamplingParamsSchema>;
export type McpAppsSamplingResult = z.infer<typeof mcpAppsSamplingResultSchema>;
//# sourceMappingURL=sampling.d.ts.map