/** 一张已校验的图片块：base64 正文（无 data: 前缀）、mimeType 与解码后字节数。 */
export interface PluginUiImageBlock {
    mimeType: string;
    dataBase64: string;
    bytes: number;
}
export type PluginUiImageBlocksResult = {
    ok: true;
    images: PluginUiImageBlock[];
} | {
    ok: false;
    reason: "unsupported_mime" | "too_large" | "invalid_block";
    mimeType?: string;
    bytes?: number;
};
/**
 * 从 MCP 内容块里挑出 `{ type: "image", data, mimeType }`（text 等其它块忽略）。
 * 任一图片不在白名单或超限 → 整个请求失败，不做部分接受；页面据此改传更小的图。
 */
export declare function readPluginUiImageBlocks(content: readonly Record<string, unknown>[] | undefined): PluginUiImageBlocksResult;
/** 附件文件名：`plugin-<pluginId 安全段>-<序号>.<ext>`，模型与用户都能看出来源。 */
export declare function buildPluginUiImageFileName(pluginId: string, index: number, mimeType: string): string;
//# sourceMappingURL=pluginUiImageBlocks.d.ts.map