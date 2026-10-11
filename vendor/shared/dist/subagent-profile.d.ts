import { z } from "zod";
import { type ModelSelection } from "./model-selection.js";
import type { AgentPermissionMode } from "./subagents-types.js";
export type AgentProfileSource = "built-in" | "project" | "user";
export type AgentMemoryScope = "user" | "project" | "local";
export interface AgentProfile {
    background?: boolean;
    color?: "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "pink" | "cyan";
    description: string;
    disallowedTools?: readonly string[];
    injectAgentsMd?: boolean;
    maxTurns?: number;
    mcpServers?: readonly string[];
    memory?: AgentMemoryScope;
    modelSelection?: ModelSelection;
    name: string;
    path?: string;
    permissionMode?: AgentPermissionMode;
    skills?: readonly string[];
    source: AgentProfileSource;
    systemPrompt: string;
    tools?: readonly string[];
}
export interface AgentProfileParseDiagnostic {
    code: string;
    message: string;
    path?: string;
}
export interface AgentProfileLoadResult {
    diagnostics: AgentProfileParseDiagnostic[];
    profiles: AgentProfile[];
}
/** 完整运行时 profile 的跨进程边界，不使用 Settings 摘要代替。 */
export declare const agentProfileSchema: z.ZodObject<{
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
}, z.core.$strict>;
//# sourceMappingURL=subagent-profile.d.ts.map