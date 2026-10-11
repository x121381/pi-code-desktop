import { type ZCodePluginsReferenceCatalogParams } from "@zcode/shared";
import type { ZCodeProtocolClient } from "#src/zcode-agent/zcodeProtocolClient.js";
/** 旧协议严格校验响应；新展示字段走独立入口，只有 -32601 能证明旧 Agent 不支持。 */
export declare function requestPluginReferenceCatalog(client: Pick<ZCodeProtocolClient, "request">, params: ZCodePluginsReferenceCatalogParams): Promise<{
    authority: "session" | "workspace";
    plugins: {
        pluginId: string;
        name: string;
        marketplace: string;
        enabled: boolean;
        conflictingPluginIds: string[];
        skillQualifiedNames: string[];
        mcpServerNames: string[];
        subagentNames: string[];
        category?: string | undefined;
        icon?: string | undefined;
        displayName?: string | undefined;
        displayNameI18n?: Record<string, string> | undefined;
        description?: string | undefined;
        descriptionI18n?: Record<string, string> | undefined;
    }[];
}>;
//# sourceMappingURL=pluginReferenceCatalogRequest.d.ts.map