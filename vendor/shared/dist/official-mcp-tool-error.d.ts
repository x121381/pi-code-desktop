/**
 * 客户端会据此改变界面行为的 code。
 *
 * 服务端还有 `internal_error`，**故意不在这里**：它是"其它一切失败"的兜底掩码
 * （详情只留在服务端日志），用户无法自助解决，不该弹提示。
 */
export declare const OFFICIAL_MCP_TOOL_ERROR_CODES: readonly ["quota_exceeded", "coding_plan_required"];
export type OfficialMcpToolErrorCode = (typeof OFFICIAL_MCP_TOOL_ERROR_CODES)[number];
export interface OfficialMcpToolError {
    code: OfficialMcpToolErrorCode;
    /** 服务端给的英文可读文案；仅用于日志与排障，界面文案走 i18n。 */
    message?: string;
    /** 服务端 request id，便于与后端日志对账。 */
    requestId?: string;
}
/**
 * 从 tool error 文本里解析结构化标识。
 *
 * 严格解析：必须是 JSON 对象且 `error_code` 命中已知 code，否则返回 undefined。
 * 不做文案匹配兜底——那会让服务端改一句话就静默失效。
 */
export declare function parseOfficialMcpToolError(text: string): OfficialMcpToolError | undefined;
//# sourceMappingURL=official-mcp-tool-error.d.ts.map