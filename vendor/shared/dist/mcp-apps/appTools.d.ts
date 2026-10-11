import { z } from "zod";
/**
 * App-Provided Tools（MCP Apps 规范「App-Provided Tools」）：页面在 `ui/initialize` 声明 `tools` 能力后，
 * 宿主 `tools/list` 发现页面工具、登记到 agent 暴露给模型；模型调用经"实例信箱"（live-only 投影增量
 * `pluginUi.appToolCall`，按 scopeId + generation 投递）到达渲染端，页面 `tools/call` 执行后回传。
 * 这里只有限额、描述符归一化与模型侧命名；纯 domain，零 IO。
 */
/** 每个页面实例最多登记的工具数（规范推荐值）。 */
export declare const MCP_APPS_APP_TOOLS_MAX_PER_INSTANCE = 50;
export declare const MCP_APPS_APP_TOOL_NAME_MAX_CHARS = 128;
export declare const MCP_APPS_APP_TOOL_TITLE_MAX_CHARS = 256;
export declare const MCP_APPS_APP_TOOL_DESCRIPTION_MAX_CHARS = 4096;
/** inputSchema / outputSchema 序列化后的上限（UTF-8 字节）。 */
export declare const MCP_APPS_APP_TOOL_SCHEMA_MAX_BYTES: number;
/** 渲染端认领待执行调用的期限；超时视为页面未运行（信箱投递不重发）。 */
export declare const MCP_APPS_APP_TOOL_CLAIM_TIMEOUT_MS = 5000;
/** 认领后页面执行 tools/call 的期限（规范推荐值）。 */
export declare const MCP_APPS_APP_TOOL_CALL_TIMEOUT_MS = 30000;
/** 单次结果序列化上限（规范推荐值）。 */
export declare const MCP_APPS_APP_TOOL_RESULT_MAX_BYTES: number;
/** 模型调用参数进信箱前的上限；超限直接以错误结束，不下发。 */
export declare const MCP_APPS_APP_TOOL_ARGUMENTS_MAX_BYTES: number;
/** list_changed 触发的重新登记最小间隔。 */
export declare const MCP_APPS_APP_TOOLS_REFRESH_INTERVAL_MS = 1000;
export declare const MCP_APPS_APP_TOOL_ERROR_MESSAGE_MAX_CHARS = 4096;
export declare const MCP_APPS_APP_TOOL_CALL_ID_MAX_CHARS = 128;
/** 模型侧名字前缀：与 server 工具的 `mcp__` 天然不冲突。 */
export declare const MCP_APPS_APP_TOOL_MODEL_NAME_PREFIX = "app__";
/** 与 agent 的 MCP 工具名同一清洗规则：非 `[A-Za-z0-9_-]` 替换为 `_` 并合并连续下划线。 */
export declare function sanitizeMcpAppsModelNamePart(name: string): string;
/** 模型侧名字 `app__<server>__<tool>`。 */
export declare function buildMcpAppsAppToolModelName(serverName: string, toolName: string): string;
export declare const mcpAppsAppToolAnnotationsSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    readOnlyHint: z.ZodOptional<z.ZodBoolean>;
    destructiveHint: z.ZodOptional<z.ZodBoolean>;
    idempotentHint: z.ZodOptional<z.ZodBoolean>;
    openWorldHint: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type McpAppsAppToolAnnotations = z.infer<typeof mcpAppsAppToolAnnotationsSchema>;
export declare const mcpAppsAppToolDescriptorSchema: z.ZodObject<{
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    outputSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    annotations: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        readOnlyHint: z.ZodOptional<z.ZodBoolean>;
        destructiveHint: z.ZodOptional<z.ZodBoolean>;
        idempotentHint: z.ZodOptional<z.ZodBoolean>;
        openWorldHint: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type McpAppsAppToolDescriptor = z.infer<typeof mcpAppsAppToolDescriptorSchema>;
/**
 * 渲染端用：把页面 `tools/list` 的结果收窄成可登记的描述符。不合规的项跳过（不让整次登记失败），
 * 超过 50 个只取前 50 个；返回被跳过的名字与原因供日志。
 */
export declare function normalizeMcpAppsAppTools(tools: readonly unknown[]): {
    tools: McpAppsAppToolDescriptor[];
    skipped: Array<{
        name: string | null;
        reason: string;
    }>;
};
/** 页面 `tools/call` 的结果（MCP CallToolResult 形状，字段集宽松：content 项原样保留）。 */
export declare const mcpAppsAppToolCallResultSchema: z.ZodObject<{
    content: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    structuredContent: z.ZodOptional<z.ZodUnknown>;
    isError: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type McpAppsAppToolCallResult = z.infer<typeof mcpAppsAppToolCallResultSchema>;
/** 信箱里的一次待执行调用：按 (scopeId, generation) 投递给唯一实例。 */
export interface McpAppsAppToolCallRequest {
    activity?: boolean;
    cancelled?: boolean;
    callId: string;
    toolName: string;
    arguments: Record<string, unknown>;
}
//# sourceMappingURL=appTools.d.ts.map