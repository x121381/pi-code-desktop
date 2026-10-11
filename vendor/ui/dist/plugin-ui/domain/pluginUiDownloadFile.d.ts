import type { McpAppsDownloadFileItem } from "@zcode/shared/mcp-apps";
/**
 * ui/download-file 的纯规则——每项归一成 `{ name, mimeType, source }`，
 * 内容来源是内联 text / blob（base64）或需要宿主先 `resources/read` 的 uri。文件名优先取项上的 name，
 * 否则取 uri 最后一段；没有扩展名时按 mimeType 补一个常见扩展名，仍没有就 `download-<序号>`。
 */
export interface PluginUiDownloadPlan {
    name: string;
    mimeType: string | undefined;
    source: {
        kind: "text";
        text: string;
    } | {
        kind: "blob";
        blob: string;
    } | {
        kind: "uri";
        uri: string;
    };
}
/** 去掉路径分隔与控制字符，长度限制与桌面 saveFile 的 basename 截断一致（120）。 */
export declare function sanitizePluginUiDownloadFileName(name: string): string;
export declare function resolvePluginUiDownloadFileName(input: {
    name?: string;
    uri?: string;
    mimeType?: string;
}, index: number): string;
export declare function planPluginUiDownload(item: McpAppsDownloadFileItem, index: number): PluginUiDownloadPlan;
/** base64 解码后的字节数（忽略空白与 padding），不真正解码。 */
export declare function decodedBase64Length(value: string): number;
//# sourceMappingURL=pluginUiDownloadFile.d.ts.map