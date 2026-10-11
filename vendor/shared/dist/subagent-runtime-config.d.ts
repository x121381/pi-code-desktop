import { z } from "zod";
import { type AgentProfile } from "./subagent-profile.js";
export declare const subagentRuntimeStateSchema: z.ZodObject<{
    disabledAgentIds: z.ZodArray<z.ZodString>;
    builtInModelSelectionOverrides: z.ZodObject<{
        Explore: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        "general-purpose": z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    pluginAgentModelSelectionOverrides: z.ZodRecord<z.ZodString, z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type SubagentRuntimeState = z.infer<typeof subagentRuntimeStateSchema>;
/** snapshot 已经解析；读取失败的回退与 RPC 断连错误不能混为一谈。 */
export declare const subagentRuntimeConfigSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"ready">;
    profiles: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        source: z.ZodEnum<{
            user: "user";
            project: "project";
            "built-in": "built-in";
        }>;
        systemPrompt: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        background: z.ZodOptional<z.ZodBoolean>;
        injectAgentsMd: z.ZodOptional<z.ZodBoolean>;
        color: z.ZodOptional<z.ZodEnum<{
            red: "red";
            blue: "blue";
            green: "green";
            yellow: "yellow";
            purple: "purple";
            orange: "orange";
            pink: "pink";
            cyan: "cyan";
        }>>;
        permissionMode: z.ZodOptional<z.ZodEnum<{
            default: "default";
            plan: "plan";
            auto: "auto";
            acceptEdits: "acceptEdits";
            dontAsk: "dontAsk";
            bypassPermissions: "bypassPermissions";
        }>>;
        memory: z.ZodOptional<z.ZodEnum<{
            user: "user";
            local: "local";
            project: "project";
        }>>;
        maxTurns: z.ZodOptional<z.ZodNumber>;
        tools: z.ZodOptional<z.ZodReadonly<z.ZodArray<z.ZodString>>>;
        disallowedTools: z.ZodOptional<z.ZodReadonly<z.ZodArray<z.ZodString>>>;
        skills: z.ZodOptional<z.ZodReadonly<z.ZodArray<z.ZodString>>>;
        mcpServers: z.ZodOptional<z.ZodReadonly<z.ZodArray<z.ZodString>>>;
    }, z.core.$strict>>;
    builtInModelSelectionOverrides: z.ZodObject<{
        Explore: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        "general-purpose": z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    pluginAgentModelSelectionOverrides: z.ZodRecord<z.ZodString, z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"built-in-fallback">;
}, z.core.$strict>], "kind">;
export type SubagentRuntimeConfig = z.infer<typeof subagentRuntimeConfigSchema>;
/** 仅从解析缓存组合结果；启停变化不重新读取或解析 Markdown。 */
export declare function resolveSubagentRuntimeProfiles(profiles: readonly AgentProfile[], state: SubagentRuntimeState): {
    profiles: AgentProfile[];
    builtInModelSelectionOverrides: {
        Explore?: {
            providerId: string;
            modelId: string;
            options?: {
                reasoningLevel?: string | undefined;
            } | undefined;
        } | undefined;
        "general-purpose"?: {
            providerId: string;
            modelId: string;
            options?: {
                reasoningLevel?: string | undefined;
            } | undefined;
        } | undefined;
    };
    pluginAgentModelSelectionOverrides: Record<string, {
        providerId: string;
        modelId: string;
        options?: {
            reasoningLevel?: string | undefined;
        } | undefined;
    }>;
};
//# sourceMappingURL=subagent-runtime-config.d.ts.map