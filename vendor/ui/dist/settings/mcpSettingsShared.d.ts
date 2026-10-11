import type { McpServerConfig, ZCodeMcpServer } from "@zcode/shared";
export declare const MCP_SECTIONS: readonly ["zcodeagentmcp"];
export type ServerScope = (typeof MCP_SECTIONS)[number];
export declare const SOURCE_META: Record<ServerScope, {
    label: string;
    section: string;
    badgeClass: string;
}>;
export type ConfigStorageLevel = "user" | "workspace";
export type McpEditorMode = "form" | "json";
export interface FormState {
    name: string;
    scope: ServerScope;
    storageLevel: ConfigStorageLevel;
    type: "stdio" | "http" | "sse" | "streamableHttp";
    command: string;
    args: string;
    env: string;
    url: string;
    headers: string;
    timeoutMs: string;
    oauth?: string;
    protocolVersion: string;
}
export declare const EMPTY_FORM: FormState;
export declare function serverToForm(server: ZCodeMcpServer): FormState;
export declare function formToConfig(form: FormState): McpServerConfig;
export declare function formToJsonDraft(form: FormState): string;
export declare function jsonDraftToForm(jsonText: string, fallback: FormState): FormState;
//# sourceMappingURL=mcpSettingsShared.d.ts.map