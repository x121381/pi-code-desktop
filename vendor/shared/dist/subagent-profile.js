import { z } from "zod";
import { modelSelectionSchema } from "./model-selection.js";
/** 完整运行时 profile 的跨进程边界，不使用 Settings 摘要代替。 */
export const agentProfileSchema = z
    .object({
    name: z.string().min(1),
    description: z.string(),
    source: z.enum(["built-in", "project", "user"]),
    systemPrompt: z.string(),
    path: z.string().optional(),
    modelSelection: modelSelectionSchema.optional(),
    background: z.boolean().optional(),
    injectAgentsMd: z.boolean().optional(),
    color: z
        .enum(["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"])
        .optional(),
    permissionMode: z
        .enum(["acceptEdits", "auto", "bypassPermissions", "default", "dontAsk", "plan"])
        .optional(),
    memory: z.enum(["user", "project", "local"]).optional(),
    maxTurns: z.number().int().positive().optional(),
    tools: z.array(z.string()).readonly().optional(),
    disallowedTools: z.array(z.string()).readonly().optional(),
    skills: z.array(z.string()).readonly().optional(),
    mcpServers: z.array(z.string()).readonly().optional(),
})
    .strict();
//# sourceMappingURL=subagent-profile.js.map